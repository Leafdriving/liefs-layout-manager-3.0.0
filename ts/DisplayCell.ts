// import {Base} from './Base';
// import {Coord} from './Coord';
// import {HtmlBlock} from './htmlBlock';
// import {DisplayGroup} from './DisplayGroup';
// import {events, Events} from './Events';
// import {Overlay} from './Overlay';
// import {Pages} from './Pages';
// import {vMenuBar, hMenuBar, context, Context} from './Context';


class DisplayCell extends Base {
    static instances:DisplayCell[] = [];
    static activeInstances:DisplayCell[] = [];
    static minDisplayGroupSize = 1; // copied from htmlblock
    static defaults = {dim : "", children:[]}
    static argMap = {
        string : ["label"],
        HtmlBlock : ["htmlBlock"],
        DisplayGroup: ["displaygroup"],
        dim : ["dim"],
        Pages : ["pages"],
        function: ["preRenderCallback", "postRenderCallback"],
    }

    label:string;
    coord: Coord;
    // children:object[];

    #htmlBlock_ : HtmlBlock = undefined;
    get htmlBlock(): HtmlBlock {return this.#htmlBlock_;}
    set htmlBlock(htmlblock) {
        this.#htmlBlock_ = htmlblock;
        if (this.#htmlBlock_.dim) this.dim = this.#htmlBlock_.dim;
        if (this.#htmlBlock_.minDisplayGroupSize) this.minDisplayGroupSize = this.#htmlBlock_.minDisplayGroupSize;
    }
    #displaygroup_: DisplayGroup = undefined;
    get displaygroup(): DisplayGroup {return this.#displaygroup_}
    set displaygroup(displaygroup) {
        this.#displaygroup_ = displaygroup;
        if (this.#displaygroup_.dim) this.dim = this.#displaygroup_.dim;
    }

    overlays: Overlay[] = [];
    dim: string;
    isRendered: boolean = false;
    pages : Pages;
    preRenderCallback: Function;
    postRenderCallback: Function;
    minDisplayGroupSize_: number;
    get minDisplayGroupSize(): number {return (this.minDisplayGroupSize_) ? this.minDisplayGroupSize_ : DisplayCell.minDisplayGroupSize;}
    set minDisplayGroupSize(size) {this.minDisplayGroupSize_ = size}


    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        if (this.displaygroup && this.displaygroup.htmlBlock) {
            this.htmlBlock = this.displaygroup.htmlBlock;
        }

        if (this.htmlBlock) this.label = `${this.htmlBlock.label}`;
        if (!this.label)
            this.label = (this.htmlBlock) ? this.htmlBlock.label + "_DisplayCell"
                            : (this.displaygroup) ? this.displaygroup.label + "_DisplayCell"
                                : (this.pages) ? this.pages.label + "_DisplayCell" : undefined
        if (this.htmlBlock && this.htmlBlock.hideWidth)
            this.coord = new Coord(this.label, true);
        else
            this.coord = new Coord(this.label);
        DisplayCell.makeLabel(this);
    }
    addOverlay(overlay:Overlay){this.overlays.push(overlay)}
    getOverlay(label:string){
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                return this.overlays[index];
        return undefined;    
    }
    getOverlays(label:string){
        let returnList:Overlay[] = []
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                returnList.push(this.overlays[index])
        return returnList;    
    }
    popOverlay(label:string) {
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                this.overlays.splice(index, 1)
    }
    hMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:hMenuBar(menuObj)})            //////////////// COME BACK HERE!!!!
    }
    vMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:vMenuBar(menuObj)})            //////////////// COME BACK HERE!!!!
    }
    static concatArray(main:DisplayCell[], added:DisplayCell[]){for (let displaycell of added) main.push(displaycell)}
    static Render(displaycell:DisplayCell, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        let renderChildren = new RenderChildren;
        displaycell.renderNode = node;

        if (displaycell.coord.offset) Handler.activeOffset = true;
        if (displaycell.preRenderCallback) displaycell.preRenderCallback(displaycell, derender);
        //if (derender) Observe.derender(displaycell);
        let pages = displaycell.pages;
        if (pages){
            if (!derender) Pages.activePages.push(pages);
            let evalCurrentPage:number = pages.eval();
            if (evalCurrentPage != pages.previousPage){ // derender old page here
                if (pages.displaycells[pages.previousPage]) {
                    pages.displaycells[pages.previousPage].coord.copy( displaycell.coord );

                    renderChildren.RenderSibling(pages.displaycells[pages.previousPage], true)
                    //Handler.renderDisplayCell(pages.displaycells[pages.previousPage], parentDisplaygroup, index, true);
                }
                pages.currentPage = pages.previousPage = evalCurrentPage;
                Pages.pushHistory();
            }
            pages.displaycells[evalCurrentPage].coord.copy( displaycell.coord );

            renderChildren.RenderSibling(pages.displaycells[evalCurrentPage], derender);
            //Handler.renderDisplayCell(pages.displaycells[evalCurrentPage], parentDisplaygroup, index, derender);

            pages.currentPage = evalCurrentPage;
            pages.addSelected();
        }
        else {
            let htmlBlock = displaycell.htmlBlock;
            let displaygroup = displaycell.displaygroup;
            if (htmlBlock) {
                renderChildren.RenderSibling(displaycell.htmlBlock, derender)
                //Handler.renderHtmlBlock(displaycell, derender, parentDisplaygroup)
            }
            if (displaygroup) {
                displaygroup.coord.copy(displaycell.coord);
                if (displaygroup && htmlBlock) {
                    Handler.currentZindex += Handler.zindexIncrement;
                }
                renderChildren.RenderSibling(displaygroup, derender)
                //Handler.renderDisplayGroup(displaycell, derender);
            }
        }
        // if (displaycell.overlays.length) {
        //     for (let ovlay of displaycell.overlays) {
        //         ovlay.renderOverlay(displaycell, parentDisplaygroup, index, derender);
        //     }
        // }
        if (displaycell.overlays.length) 
            for (let index = 0; index < displaycell.overlays.length; index++) 
                renderChildren.RenderSibling(displaycell.overlays[index].returnObj, derender);

        if (displaycell.postRenderCallback) displaycell.postRenderCallback(displaycell, derender);
        if (displaycell.coord.offset) Handler.activeOffset = false;

        return {zindex,
            siblings: renderChildren.siblings};
    }
}
Render.register("DisplayCell", DisplayCell);
function I(...Arguments:any) : DisplayCell {
    return new DisplayCell( new HtmlBlock(...Arguments) )
    // let newblock = new HtmlBlock(...Arguments);
    // return (newblock.dim) ? new DisplayCell(newblock, newblock.dim) : new DisplayCell(newblock);
}
// export {I, DisplayCell}