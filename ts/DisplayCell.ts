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
    static minDisplayGroupSize = 200; // copied from htmlblock
    static defaults = {
        dim : ""
    }
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
    set minDisplayGroupSize(size) {this.minDisplayGroupSize = size}


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
    hMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:hMenuBar(menuObj)})            //////////////// COME BACK HERE!!!!
    }
    vMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:vMenuBar(menuObj)})            //////////////// COME BACK HERE!!!!
    }
    static concatArray(main:DisplayCell[], added:DisplayCell[]){for (let displaycell of added) main.push(displaycell)}
}
function I(...Arguments:any) : DisplayCell {
    return new DisplayCell( new HtmlBlock(...Arguments) )
    // let newblock = new HtmlBlock(...Arguments);
    // return (newblock.dim) ? new DisplayCell(newblock, newblock.dim) : new DisplayCell(newblock);
}
// export {I, DisplayCell}