class DisplayCell {
    static instances:DisplayCell[] = [];
    static byLabel(label:string):DisplayCell{
        for (let key in DisplayCell.instances)
            if (DisplayCell.instances[key].label == label)
                return DisplayCell.instances[key];
        return undefined;
    }
    static defaults = {
        // label : function(){return `DisplayCell_${pf.pad_with_zeroes(DisplayCell.instances.length)}`},
        dim : ""
    }
    static argMap = {
        string : ["label"],
        HtmlBlock : ["htmlBlock"],
        DisplayGroup: ["displaygroup"],
        dim : ["dim"],
        // number : ["marginLeft", "marginRight", "marginTop", "marginBottom"],
        Pages : ["pages"],
        // DragBar : ["dragbar"]
    }

    label:string;
    coord: Coord;
    htmlBlock: HtmlBlock = undefined;
    displaygroup: DisplayGroup = undefined;
    // overlay: Overlay = undefined;
    overlays: Overlay[] = [];
    dim: string;
    isRendered: boolean = false;
    pages : Pages;

    constructor(...Arguments: any) {
        DisplayCell.instances.push(this);
        mf.applyArguments("DisplayCell", Arguments, DisplayCell.defaults, DisplayCell.argMap, this);

        if (this.displaygroup && this.displaygroup.htmlBlock) {
            this.htmlBlock = this.displaygroup.htmlBlock;
        }

        if (this.htmlBlock) this.label = `${this.htmlBlock.label}`;
        if (!this.label)
            this.label = (this.htmlBlock) ? this.htmlBlock.label + "_DisplayCell"
                            : (this.displaygroup) ? this.displaygroup.label + "_DisplayCell"
                                : `DisplayCell_${pf.pad_with_zeroes(DisplayCell.instances.length)}`
        this.coord = new Coord(this.label);
    }
    addOverlay(overlay:Overlay){this.overlays.push(overlay)}
    hMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:hMenuBar(menuObj)})
    }
    vMenuBar(menuObj:object){
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({onmouseover:vMenuBar(menuObj)})
    }
}
function I(...Arguments:any) : DisplayCell {
    let newblock = new HtmlBlock(...Arguments);
    return (newblock.dim) ? new DisplayCell(newblock, newblock.dim) : new DisplayCell(newblock);
}