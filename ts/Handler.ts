class Handler {
    static handlerMarginDefault=0;
    static firstRun = true;
    static instances:Handler[] = [];
    static activeHandlers:Handler[] = [];
    static byLabel(label:string):Handler{
        for (let key in Handler.instances)
            if (Handler.instances[key].label == label)
                return Handler.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `handler_${pf.pad_with_zeroes(Handler.activeHandlers.length)}`},
        cssString : " ",
        addThisHandlerToStack: true
    }
    static argMap = {
        string : ["label"],
        number : ["handlerMargin"],
        Coord: ["coord"],
        function: ["preRenderCallback", "postRenderCallback"],
        boolean: ["addThisHandlerToStack"]
    }
    static renderNullObjects:boolean = false;
    static argCustomTypes:Function[] = [];
    static handlerZindexStart:number = 1;
    static zindexIncrement:number = 1;
    static handlerZindexIncrement:number = 100;
    static currentZindex:number;
    static renderAgain:boolean;

    label:string;
    rootCell:DisplayCell = undefined;
    coord:Coord; // =  new Coord();
    cssString: string;
    handlerMargin: number;
    addThisHandlerToStack: boolean;
    preRenderCallback: Function;
    postRenderCallback: Function;


    constructor(...Arguments: any) {
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Handler");
        mf.applyArguments("Handler", Arguments, Handler.defaults, Handler.argMap, this);

        if ("DisplayCell" in retArgs) this.rootCell = retArgs["DisplayCell"][0];
        else pf.errorHandling(`Handler "${this.label}" requires a DisplayCell`);
        if (this.handlerMargin == undefined) this.handlerMargin = Handler.handlerMarginDefault;

        if (Handler.firstRun) {
            setTimeout(Handler.update);
            Handler.firstRun = false;
            for (let element of document.querySelectorAll(Css.deleteOnFirstRunClassname)) element.remove();
            
            window.onresize = function() {Handler.update()};
            window.onwheel = function(event:WheelEvent){ScrollBar.onWheel(event);Observe.onWheel(event);};
            window.addEventListener("popstate", function(event){Pages.popstate(event)})
            Pages.parseURL();
        }
        if (this.addThisHandlerToStack) Handler.activeHandlers.push(this);
        Handler.instances.push(this);
        Handler.update(/* [this] */);
        Css.update();
    }
    pop():Handler {return Handler.pop(this);}
    toTop(){ // doesn't work!
        let index = Handler.activeHandlers.indexOf(this);
        Handler.activeHandlers.splice(index, 1);
        Handler.activeHandlers.push(this);
        Handler.update();
    }
    static pop(handlerInstance = Handler.activeHandlers[ Handler.activeHandlers.length-1 ]): Handler {
        let index = Handler.activeHandlers.indexOf(handlerInstance);
        let poppedInstance:Handler = undefined;
        if (index != -1) {
            poppedInstance = Handler.activeHandlers[index];
            Handler.update([handlerInstance], index, true);
            Handler.activeHandlers.splice(index, 1);
        }
        return poppedInstance;
    }
    static screensizeToCoord(dislaycell:DisplayCell, handlerMargin: number){
        let viewport = pf.viewport();
        dislaycell.coord.copy(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2, Handler.currentZindex);
    }

    static update(ArrayofHandlerInstances:Handler[] = Handler.activeHandlers, instanceNo:number = 0, derender:boolean = false){
        // console.log("Update Fired");
        Handler.renderAgain = false;
        Pages.activePages = [];
        Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement)*instanceNo;
        for (let handlerInstance of ArrayofHandlerInstances) {
            if (handlerInstance.preRenderCallback) handlerInstance.preRenderCallback(handlerInstance);
            if (handlerInstance.coord) {
                handlerInstance.rootCell.coord.copy(handlerInstance.coord);
            }
            else {
                Handler.screensizeToCoord(handlerInstance.rootCell, handlerInstance.handlerMargin);  
            }
            handlerInstance.rootCell.coord.copyWithin(true);
            Handler.renderDisplayCell(handlerInstance.rootCell, undefined, undefined, derender);
            instanceNo += 1;
            Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement)*instanceNo;
            if (handlerInstance.postRenderCallback) handlerInstance.postRenderCallback(handlerInstance);
          }
        if (Pages.activePages.length) Pages.applyOnclick();
        Observe.update();
        if (Handler.renderAgain) console.log("REDNDER AGAIN!");
    }

    static renderDisplayCell(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
        if (displaycell.preRenderCallback) displaycell.preRenderCallback(displaycell, parentDisplaygroup, index, derender);
        let pages = displaycell.pages;
        if (pages){
            Pages.activePages.push(pages);  // this cant be good
            let evalCurrentPage:number = pages.eval();
            if (evalCurrentPage != pages.previousPage){ // derender old page here
                pages.displaycells[pages.previousPage].coord.copy( displaycell.coord );
                Handler.renderDisplayCell(pages.displaycells[pages.previousPage], parentDisplaygroup, index, true);
                pages.currentPage = pages.previousPage = evalCurrentPage;
                Pages.pushHistory();
            }
            pages.displaycells[evalCurrentPage].coord.copy( displaycell.coord );
            Handler.renderDisplayCell(pages.displaycells[evalCurrentPage], parentDisplaygroup, index, false);
            pages.currentPage = evalCurrentPage;
            pages.addSelected();
        }
        else {
            let htmlBlock = displaycell.htmlBlock;
            let displaygroup = displaycell.displaygroup;
            let overlays = displaycell.overlays;
            if (htmlBlock) {
                Handler.renderHtmlBlock(displaycell, derender, parentDisplaygroup)
            }
            if (displaygroup) {
                displaygroup.coord.copy(displaycell.coord);
                if (displaygroup && htmlBlock) {
                    Handler.currentZindex += Handler.zindexIncrement;
                    displaygroup.coord.copy(displaycell.coord, pf.uis0(htmlBlock.marginLeft),
                                                            pf.uis0(htmlBlock.marginTop),
                                                            pf.uis0(htmlBlock.marginRight),
                                                            pf.uis0(htmlBlock.marginBottom))
                }
                Handler.renderDisplayGroup(displaycell, derender);
            }
            if (overlays.length) {
                for (let ovlay of overlays) {
                    ovlay.renderOverlay(displaycell, parentDisplaygroup, index, derender);
                }
            }
        }
        if (displaycell.postRenderCallback) displaycell.postRenderCallback(displaycell, parentDisplaygroup, index, derender);
    }

    static renderDisplayGroup(parentDisplaycell: DisplayCell, derender:boolean) {
        let displaygroup: DisplayGroup = parentDisplaycell.displaygroup;

        let ishor:boolean = displaygroup.ishor;
        let coord:Coord = displaygroup.coord;
        let cellArraylength = displaygroup.cellArray.length;
        let marginpx = (ishor) ? displaygroup.marginHor*(cellArraylength-1): displaygroup.marginVer*(cellArraylength-1);
        let maxpx:number = (ishor) ? coord.width - marginpx : coord.height - marginpx;

        let cellsizepx:number;

        let totalFixedpx = displaygroup.totalPx();
        let pxForPercent:number = maxpx - totalFixedpx;
        let totalPercent:number = 0;
        let DisplayCellPercent:number = 0;
        let displayCellPx:number;
        let pxForPercentLeft:number = pxForPercent;
        let overlay = displaygroup.overlay;

        // this part opens and/or closes the scrollbar overlay
        if (pxForPercent < 0) {
            if (!overlay) {
                displaygroup.overlay=new Overlay("ScrollBar",
                                                `${displaygroup.label}_ScrollBar`,
                                                displaygroup,
                                                totalFixedpx, maxpx,
                                                );
            }
            displaygroup.overlay.renderOverlay(parentDisplaycell, displaygroup, 0, false);
            let dgCoord = displaygroup.coord;
            let scrollbar = <ScrollBar>displaygroup.overlay.returnObj;
            let scrollWidth = scrollbar.scrollWidth;

            dgCoord.width -= (ishor) ? 0 : scrollWidth;
            dgCoord.within.width -= (ishor) ? 0 : scrollWidth;
            dgCoord.height -= (ishor) ? scrollWidth : 0;
            dgCoord.within.height -= (ishor) ? scrollWidth : 0;
        }
        else {
            if (overlay) {
                if (overlay.currentlyRendered)
                    displaygroup.overlay.renderOverlay(parentDisplaycell, displaygroup, 0, true);
            }
        }
        let x:number = displaygroup.coord.x;
        let y:number = displaygroup.coord.y;
        let width:number;
        let height:number;

        // apply scrollbar offset
        
        if (displaygroup.overlay) {
            displaygroup.offset = displaygroup.overlay.returnObj["offset"];
            x -= (ishor) ? displaygroup.offset : 0;
            y -= (ishor) ? 0 : displaygroup.offset;
        }

        // this part loops the displaycells in cellarray

        for (let index=0 ; index < cellArraylength; index++) {
            let displaycell:DisplayCell = displaygroup.cellArray[index];

            if (pf.isTypePercent(displaycell.dim)) {
                DisplayCellPercent = pf.percentAsNumber(displaycell.dim);
                totalPercent += DisplayCellPercent;
                if (totalPercent <= 100) {
                    displayCellPx = Math.round(pxForPercent*DisplayCellPercent/100.0);
                    pxForPercentLeft -= displayCellPx;
                } else {
                    displayCellPx = pxForPercentLeft;
                }             
            }
            cellsizepx = (pf.isTypePx(displaycell.dim)) ? (pf.pxAsNumber(displaycell.dim)) : displayCellPx;
            width = (ishor) ? cellsizepx : coord.width;
            height = (ishor) ? coord.height : cellsizepx;
            displaycell.coord.replace(x, y, width, height, Handler.currentZindex);
            displaycell.coord.copyWithin( displaygroup.coord );

            Handler.renderDisplayCell(displaycell, displaygroup, index, derender);
            
            x += (ishor) ? width+displaygroup.marginHor : 0;
            y += (ishor) ? 0 : height+displaygroup.marginVer;
        }
    }
    static renderHtmlBlock(displaycell:DisplayCell, derender=false, parentDisplaygroup:DisplayGroup){
        let htmlBlock = displaycell.htmlBlock;
        let el:HTMLElement = pf.elExists(displaycell.label);
        let alreadyexists:boolean = (el) ? true : false;

        derender = displaycell.coord.derender( derender );

        let isNulDiv = (htmlBlock.css.trim() == "" &&
                        htmlBlock.innerHTML.trim() == "" &&
                        Object.keys( htmlBlock.attributes ).length == 0 &&
                        !Handler.renderNullObjects)

        if (derender || isNulDiv) {
            if (alreadyexists) el.remove();
            htmlBlock.el = undefined;
        } else {
            if (!alreadyexists) el = document.createElement(htmlBlock.tag);
            pf.setAttrib(el, "id", displaycell.label);
            if (htmlBlock.css.trim()) pf.setAttrib(el, "class", htmlBlock.css);
            Handler.renderHtmlAttributes(el, htmlBlock, displaycell.label);
            if (el.innerHTML != htmlBlock.innerHTML) el.innerHTML = htmlBlock.innerHTML;
            if (!alreadyexists) {
                document.body.appendChild(el);
                htmlBlock.el = el;
                if (htmlBlock.events) htmlBlock.events.applyToHtmlBlock(htmlBlock);
            }
            let attrstring = displaycell.coord.newAsAttributeString() // + clipString;
            if (el.style.cssText != attrstring) el.style.cssText = attrstring;
        }
    }
    static renderHtmlAttributes(el:HTMLElement, htmlblock: HtmlBlock, id:string){
        for (let key in htmlblock.attributes) {
            let value = htmlblock.attributes[key];
            if (key == "class") value += " " +htmlblock.css;
            if (key == "id") value = id;
            pf.setAttrib(el, key, value);
        }
        pf.setAttrib(el, "llm", "");
    }
}
function H(...Arguments: any): Handler {
    return new Handler(...Arguments)
}