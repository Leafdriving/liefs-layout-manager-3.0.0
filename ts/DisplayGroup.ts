class DisplayGroup {
    static defaultMargins=0;
    static instances:DisplayGroup[] = [];
    static byLabel(label:string):DisplayGroup{
        for (let key in DisplayGroup.instances)
            if (DisplayGroup.instances[key].label == label)
                return DisplayGroup.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `DisplayGroup_${pf.pad_with_zeroes(DisplayGroup.instances.length)}`},
        ishor: true,
        marginHor : DisplayGroup.defaultMargins,
        marginVer : DisplayGroup.defaultMargins,
        // minimumCellSize : 300,
    }
    static argMap = {
        string : ["label"],
        boolean : ["ishor"],
        number: ["marginHor", "marginVer"],
        dim : ["dim"],
        Overlay: ["overlay"]
    }
    static argCustomTypes:Function[] = [];

    label:string;
    ishor:boolean;
    cellArray: DisplayCell[] = [];
    coord: Coord;
    htmlBlock: HtmlBlock = undefined;
    marginHor:number;
    marginVer:number;
    dim:string;
    overlay: Overlay = undefined;
    offset:number; //used by overlay
    // minimumCellSize:number;

    // renderStartIndex:number;
    // renderEndIndex:number;

    constructor(...Arguments: any) {
        DisplayGroup.instances.push(this);

        let retArgs : ArgsObj = pf.sortArgs(Arguments, "DisplayGroup");
        mf.applyArguments("DisplayGroup", Arguments, DisplayGroup.defaults, DisplayGroup.argMap, this);
        if ("DisplayCell" in retArgs) this.cellArray = retArgs["DisplayCell"];
        if ("HtmlBlock" in retArgs) {
            this.htmlBlock = retArgs["HtmlBlock"][0];
        }
        if ("Array" in retArgs) this.cellArray = retArgs["Array"][0];

        if (("number" in retArgs) && retArgs["number"].length == 1) 
            this.marginVer = this.marginHor = retArgs["number"][0];

        this.coord = new Coord(this.label);
        // Fill In Dim Values

        let percentsum:number = 0;
        let numOfEmptydims:number = 0;
        for (let displaycell of this.cellArray) {
            let dim = displaycell.dim;
            if (dim == "") numOfEmptydims++;            
            else if (pf.isTypePercent(dim)) percentsum += pf.percentAsNumber(dim);
        }
        let percentRamaining = 100-percentsum;
        if (numOfEmptydims) {
            let newDimValue = String( percentRamaining/numOfEmptydims )+"%";
            for (let displaycell of this.cellArray)
                if (displaycell.dim == "") displaycell.dim = newDimValue;
        }
    }
    percentToPx(displaycell:DisplayCell /* child in cellarray */) : void {
        let percentAsNumber:number = pf.percentAsNumber(displaycell.dim);
        let percentLeft = 100 - percentAsNumber;
        displaycell.dim = `${(this.ishor) ? displaycell.coord.width : displaycell.coord.height}px`;
        // loop cellarray to add percent where you can
        for (let index = 0; index < this.cellArray.length; index++) {
            let cellOfArray = this.cellArray[index];
            if(pf.isTypePercent(cellOfArray.dim)) {
                let thisPercent = pf.percentAsNumber(cellOfArray.dim);
                thisPercent += (thisPercent/percentLeft)*percentAsNumber;
                cellOfArray.dim = `${thisPercent}%`;
            }
        }
        
    }
    totalPx():number {
        let cellArray = this.cellArray;
        let totalFixedpx = 0
        for (let displaycell of cellArray) {
            if (displaycell.pages && (!displaycell.dim)){
                displaycell.dim = displaycell.pages.evalCell().dim; // only covers one loop!
            }
            if ( pf.isTypePx(displaycell.dim) ) 
                totalFixedpx += pf.pxAsNumber(displaycell.dim);
        }
        return totalFixedpx;
    }
}
function h(...Arguments: any){
    let displaycell = new DisplayCell(new DisplayGroup(...Arguments) );
    if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    return displaycell;
}
function v(...Arguments: any){
    let displaycell = new DisplayCell(new DisplayGroup(false, ...Arguments) );
    if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    return displaycell;
}