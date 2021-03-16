// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Coord} from './Coord';
// import {HtmlBlock} from './htmlBlock';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';


class DisplayGroup extends Base {
    static defaultMargins=0;
    static instances:DisplayGroup[] = [];
    static activeInstances:DisplayGroup[] = [];
    static defaults = {
        ishor: true,
        marginHor : DisplayGroup.defaultMargins,
        marginVer : DisplayGroup.defaultMargins,
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
        super();this.buildBase(...Arguments);

        if ("DisplayCell" in this.retArgs) this.cellArray = this.retArgs["DisplayCell"];
        if ("HtmlBlock" in this.retArgs) {
            this.htmlBlock = this.retArgs["HtmlBlock"][0];
        }
        if ("Array" in this.retArgs) this.cellArray = this.retArgs["Array"][0];

        if (("number" in this.retArgs) && this.retArgs["number"].length == 1) 
            this.marginVer = this.marginHor = this.retArgs["number"][0];

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
        DisplayGroup.makeLabel(this);
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
    totalPx(addMin = false):number {
        let cellArray = this.cellArray;
        let totalFixedpx = 0
        for (let displaycell of cellArray) {
            if (displaycell.pages && (!displaycell.dim)){
                displaycell.dim = displaycell.pages.evalCell().dim; // only covers one loop!
            }
            if ( pf.isTypePx(displaycell.dim) ) 
                totalFixedpx += pf.pxAsNumber(displaycell.dim);
            else if (addMin)
                totalFixedpx += displaycell.minDisplayGroupSize;
        }
        return totalFixedpx;
    }
}
function h(...Arguments: any){
    return new DisplayCell( new DisplayGroup(...Arguments) )
    // let displaycell = new DisplayCell(new DisplayGroup(...Arguments) );
    // if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    // return displaycell;
}
function v(...Arguments: any){
    return new DisplayCell( new DisplayGroup(false, ...Arguments) );
    // let displaycell = new DisplayCell(new DisplayGroup(false, ...Arguments) );
    // if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    // return displaycell;
}
// export {v, h, DisplayGroup}