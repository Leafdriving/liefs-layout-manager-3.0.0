// import {Base} from './Base';
// import {Coord} from './Coord';
// import {DisplayCell} from './DisplayCell';
// import {Css} from './Css';
// import {DisplayGroup} from './DisplayGroup';
// import {HtmlBlock} from './htmlBlock';
// import {Observe} from './Observe'
// import {Overlay} from './Overlay';
// import {Pages} from './Pages';
// import {mf, pf} from './PureFunctions';
// import {ScrollBar} from './ScrollBar';

class Handler extends Base {
    static handlerMarginDefault=0;
    static firstRun = true;
    static instances:Handler[] = [];
    static activeInstances:Handler[] = [];
    static defaults = {
        cssString : " ",
        addThisHandlerToStack: true,
        controlledBySomething: false,
        activeOffset: false,
    }
    static argMap = {
        string : ["label"],
        number : ["handlerMargin"],
        Coord: ["coord"],
        function: ["preRenderCallback", "postRenderCallback"],
        boolean: ["addThisHandlerToStack"]
    }
    static screenSizeCoord: Coord = new Coord();
    static renderNullObjects:boolean = false;
    static argCustomTypes:Function[] = [];
    static handlerZindexStart:number = 1;
    static zindexIncrement:number = 1;
    static handlerZindexIncrement:number = 100;
    static currentZindex:number;
    static renderAgain:boolean;
    static activeOffset: boolean;
    static preRenderCallback: Function;
    static postRenderCallback: Function

    label:string;
    rootCell:DisplayCell = undefined;
    coord:Coord; // =  new Coord();
    cssString: string;
    handlerMargin: number;
    addThisHandlerToStack: boolean;
    preRenderCallback: Function;
    postRenderCallback: Function;


    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        Handler.updateScreenSize();

        if ("DisplayCell" in this.retArgs) this.rootCell = this.retArgs["DisplayCell"][0];
        else pf.errorHandling(`Handler "${this.label}" requires a DisplayCell`);
        if (this.handlerMargin == undefined) this.handlerMargin = Handler.handlerMarginDefault;

        if (Handler.firstRun) {
            setTimeout(Handler.update);
            // setTimeout(Handler.update,200);
            Handler.firstRun = false;
            for (let element of document.querySelectorAll(Css.deleteOnFirstRunClassname)) element.remove();
            
            window.onresize = function() {Handler.update()};
            window.onwheel = function(event:WheelEvent){ScrollBar.onWheel(event);};
            window.addEventListener("popstate", function(event){Pages.popstate(event)})
            Pages.parseURL();
        }
        if (this.addThisHandlerToStack) {
            Handler.activeInstances.push(this);
        }
        Handler.makeLabel(this);
        Handler.update(/* [this] */);
        Css.update();
    }
    pop():Handler {return Handler.pop(this);}
    toTop(){ // doesn't work!
        let index = Handler.activeInstances.indexOf(this);
        if (index > -1 && index != Handler.activeInstances.length-1){
            Handler.activeInstances.splice(index, 1);
            Handler.activeInstances.push(this);
            Handler.update();
        }
    }
    static pop(handlerInstance = Handler.activeInstances[ Handler.activeInstances.length-1 ]): Handler {
        let index = Handler.activeInstances.indexOf(handlerInstance);
        let poppedInstance:Handler = undefined;
        if (index != -1) {
            poppedInstance = Handler.activeInstances[index];
            Handler.update([handlerInstance], index, true);
            Handler.activeInstances.splice(index, 1);
        }
        return poppedInstance;
    }
    static screensizeToCoord(dislaycell:DisplayCell, handlerMargin: number){
        let viewport = pf.viewport();
        dislaycell.coord.assign(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2,
                                handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2,Handler.currentZindex);
        //dislaycell.coord.copy(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2, Handler.currentZindex);
    }
    static updateScreenSize() {
        let [width, height] = pf.viewport();
        Handler.screenSizeCoord.assign(0,0,width,height,0,0,width,height,0)
    }

    static update(ArrayofHandlerInstances:Handler[] = Handler.activeInstances, instanceNo:number = 0, derender:boolean = false){
        // console.log("Update Fired");
        if (Handler.preRenderCallback) Handler.preRenderCallback();
        Handler.updateScreenSize();
        Handler.renderAgain = false;
        Pages.activePages = [];
        Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement)*instanceNo;
        for (let index = 0; index < ArrayofHandlerInstances.length; index++) {
            let handlerInstance = ArrayofHandlerInstances[index];
            if (handlerInstance.preRenderCallback) handlerInstance.preRenderCallback(handlerInstance);
            if (handlerInstance.coord) {
                handlerInstance.rootCell.coord.copy(handlerInstance.coord);
                handlerInstance.rootCell.coord.assign( undefined,undefined,undefined,undefined, undefined,undefined,undefined,undefined, Handler.currentZindex)

            }
            else {
                Handler.screensizeToCoord(handlerInstance.rootCell, handlerInstance.handlerMargin);  
            }
            Handler.renderDisplayCell(handlerInstance.rootCell, undefined, undefined, derender);
            instanceNo += 1;
            Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement)*instanceNo;
            if (handlerInstance.postRenderCallback) handlerInstance.postRenderCallback(handlerInstance);
          }
        if (Pages.activePages.length) Pages.applyOnclick();
        Observe.update();
        if (Handler.renderAgain) console.log("REDNDER AGAIN!");
        if (Handler.postRenderCallback) Handler.postRenderCallback();
    }

    static renderDisplayCell(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
        if (displaycell.coord.offset) Handler.activeOffset = true;
        if (displaycell.preRenderCallback) displaycell.preRenderCallback(displaycell, parentDisplaygroup, index, derender);
        if (derender) Observe.derender(displaycell);
        let pages = displaycell.pages;
        if (pages){
            if (!derender) Pages.activePages.push(pages);
            let evalCurrentPage:number = pages.eval();
            if (evalCurrentPage != pages.previousPage){ // derender old page here
                // console.log("pages.previousPage", pages.previousPage)
                // console.log(pages.displaycells[pages.previousPage])
                pages.displaycells[pages.previousPage].coord.copy( displaycell.coord );
                Handler.renderDisplayCell(pages.displaycells[pages.previousPage], parentDisplaygroup, index, true);
                pages.currentPage = pages.previousPage = evalCurrentPage;
                Pages.pushHistory();
            }
            // console.log("evalCurrentPage",evalCurrentPage);
            pages.displaycells[evalCurrentPage].coord.copy( displaycell.coord );
            /// new trial
            // pages.dim = pages.displaycells[evalCurrentPage].dim
            // new trial
            Handler.renderDisplayCell(pages.displaycells[evalCurrentPage], parentDisplaygroup, index, derender);
            pages.currentPage = evalCurrentPage;
            pages.addSelected();
        }
        else {
            let htmlBlock = displaycell.htmlBlock;
            let displaygroup = displaycell.displaygroup;
            // let overlays = displaycell.overlays;
            if (htmlBlock) {
                Handler.renderHtmlBlock(displaycell, derender, parentDisplaygroup)
            }
            if (displaygroup) {
                displaygroup.coord.copy(displaycell.coord);
                if (displaygroup && htmlBlock) {
                    Handler.currentZindex += Handler.zindexIncrement;
                    // displaycell.coord.applyMargins( pf.uis0(htmlBlock.marginLeft),
                    //                                 pf.uis0(htmlBlock.marginTop),
                    //                                 pf.uis0(htmlBlock.marginRight),
                    //                                 pf.uis0(htmlBlock.marginBottom));
                }
                Handler.renderDisplayGroup(displaycell, derender);
            }
        }
        if (displaycell.overlays.length) {
            for (let ovlay of displaycell.overlays) {
                // console.log("rendering",displaycell.label)
                ovlay.renderOverlay(displaycell, parentDisplaygroup, index, derender);
            }
        }
        // if (derender) displaycell.coord.within.reset();
        if (displaycell.postRenderCallback) displaycell.postRenderCallback(displaycell, parentDisplaygroup, index, derender);
        if (displaycell.coord.offset) Handler.activeOffset = false;
    }
    static renderDisplayGroup(parentDisplaycell: DisplayCell, derender:boolean) {
        let displaygroup: DisplayGroup = parentDisplaycell.displaygroup;
        let ishor:boolean = displaygroup.ishor;
        let coord:Coord = displaygroup.coord;
        let cellArraylength = displaygroup.cellArray.length;
        // let overlay = displaygroup.overlay;

        let marginpx = (ishor) ? displaygroup.marginHor*(cellArraylength-1): displaygroup.marginVer*(cellArraylength-1);
        let maxpx:number = (ishor) ? coord.width - marginpx : coord.height - marginpx;
        let totalFixedpx = displaygroup.totalPx();
        let pxForPercent:number = maxpx - totalFixedpx;

        let dimArray:{dim:string, min:number, px:number}[] = [];

        // create dim array - Initialize.
        for (let index = 0; index < cellArraylength; index++) {
            let displaycell:DisplayCell = displaygroup.cellArray[index];
            let dim = displaycell.dim;
            let min = ((pf.isTypePx(displaycell.dim)) ? pf.pxAsNumber(displaycell.dim) : displaycell.minDisplayGroupSize)
            let px = (pf.isTypePx(displaycell.dim) ? pf.pxAsNumber(displaycell.dim) : pf.percentAsNumber(displaycell.dim) * pxForPercent / 100);
            // dimArrayTotal += px;            
            dimArray.push({dim,min,px});   
        }
            // loop until all % are worked out
        let percentReballancingRequired:boolean;
        let dimArrayTotal: number;
        do {
            // If % less than min... assign it min
            percentReballancingRequired = false;
            let fixedPixels = 0;
            dimArrayTotal = 0;
            for (let index=0 ; index < dimArray.length; index++) {  
                let dimObj = dimArray[index];
                if (dimObj.px < dimObj.min) {
                    dimObj.px = dimObj.min;
                    dimObj.dim = `${dimObj.px}px`;
                    percentReballancingRequired = true;
                }
                fixedPixels += ( pf.isTypePx(dimObj.dim) ? dimObj.px : 0 );
                dimArrayTotal += dimObj.px;
            }
            let px4Percent:number = maxpx - fixedPixels;  // key
            //console.log(`maxpx: ${maxpx} fixedPixels: ${fixedPixels} px4Percent:${px4Percent}`)
            // console.log(maxpx, fixedPixels, px4Percent)
            // if min was assigned - rebalance
            if (percentReballancingRequired) {
                let currentPercent = 0;
                // calculate total percent (so less than 100)
                for (let index = 0; index < dimArray.length; index++) {
                    let dimObj = dimArray[index];
                    if (pf.isTypePercent(dimObj.dim)) {
                        currentPercent += pf.percentAsNumber(dimObj.dim);
                    }
                }
                let mult = 100/currentPercent;
                // and apply the difference over this code.
                dimArrayTotal = 0;
                for (let index = 0; index < dimArray.length; index++) {
                    let dimObj = dimArray[index];
                    if (pf.isTypePercent(dimObj.dim)) {
                        dimObj.dim = `${pf.percentAsNumber(dimObj.dim) * mult}%`;
                        dimObj.px = pf.percentAsNumber(dimObj.dim)* px4Percent / 100;
                        //console.log(`percent ${pf.percentAsNumber(dimObj.dim)} * ${px4Percent}/100 = ${dimObj.px}`)
                    }
                    dimArrayTotal += dimObj.px;
                }
            }
        } while (percentReballancingRequired);
        displaygroup.dimArrayTotal = dimArrayTotal;
        
        // console.log(`Final dimarrayTotal ${dimArrayTotal} of ${maxpx}`, JSON.stringify(dimArray, null, 3));


        let scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
        if (dimArrayTotal > maxpx + 2) { 
            if (!scrollbarOverlay) {
                scrollbar(parentDisplaycell, displaygroup.ishor);
                scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
            }
            /* this.offset = */ 
            displaygroup.offset = (<ScrollBar>(scrollbarOverlay.returnObj)).update(dimArrayTotal); ////
            /* this.offset = */ 
        } else {
            if (scrollbarOverlay)
                (<ScrollBar>(scrollbarOverlay.returnObj)).delete();
                parentDisplaycell.popOverlay("ScrollBar");
                displaygroup.offset = 0;
        }


        let x:number = displaygroup.coord.x - ((ishor) ? displaygroup.offset : 0);
        let y:number = displaygroup.coord.y- ((ishor) ? 0 : displaygroup.offset);
        let width:number;
        let height:number;

        for (let index=0 ; index < cellArraylength; index++) {
            let displaycell:DisplayCell = displaygroup.cellArray[index];

            let cellsizepx = dimArray[index].px
            width = (ishor) ? cellsizepx : coord.width;
            height = (ishor) ? coord.height : cellsizepx;

            displaycell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex);
            displaycell.coord.cropWithin( displaygroup.coord.within );

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
// export {H, Handler}