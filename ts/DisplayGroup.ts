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
        //Overlay: ["overlay"]
    }
    static argCustomTypes:Function[] = [];

    renderNode:node_; // render node

    label:string;
    ishor:boolean;
    cellArray: DisplayCell[] = [];
    coord: Coord;
    htmlBlock: HtmlBlock = undefined;
    marginHor:number;
    marginVer:number;
    dim:string;
    //overlays: Overlay[] = [];
    offset:number; //used by overlay
    dimArrayTotal:number // used during Handler Update 
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
    //addOverlay(overlay:Overlay){this.overlays.push(overlay)}
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
    static allPx(displaygroup:DisplayGroup): number{
        let returnValue = 0;
        if (displaygroup && displaygroup.cellArray)
            for (let index = 0; index < displaygroup.cellArray.length; index++) {
                let displaycell = displaygroup.cellArray[index];
                if (displaycell.dim && pf.isTypePx(displaycell.dim)) returnValue += pf.pxAsNumber(displaycell.dim);
                else return undefined;
            }
        return returnValue
    }
    static Render(displaygroup:DisplayGroup, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        let parentDisplaycell = <DisplayCell>node.ParentNode.Arguments[1];

        if (BaseF.typeof(parentDisplaycell) != "DisplayCell") console.log(`DisplayGroup: ${displaygroup.label}  parent WASNT a displaycell????`);

        let ishor:boolean = displaygroup.ishor;
        let coord:Coord = displaygroup.coord;
        let cellArraylength = displaygroup.cellArray.length;

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


        // let scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
        // if (dimArrayTotal > maxpx + 2) { 
        //     if (!scrollbarOverlay) {
        //         scrollbar(parentDisplaycell, displaygroup.ishor);
        //         scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
        //     }
        //     /* this.offset = */ 
        //     displaygroup.offset = (<ScrollBar>(scrollbarOverlay.returnObj)).update(dimArrayTotal); ////
        //     /* this.offset = */ 
        // } else {
        //     if (scrollbarOverlay)
        //         (<ScrollBar>(scrollbarOverlay.returnObj)).delete();
        //         parentDisplaycell.popOverlay("ScrollBar");
        //         displaygroup.offset = 0;
        // }
        displaygroup.offset = 0;

        let x:number = displaygroup.coord.x - ((ishor) ? displaygroup.offset : 0);
        let y:number = displaygroup.coord.y- ((ishor) ? 0 : displaygroup.offset);
        let width:number;
        let height:number;

        let renderChildren = new RenderChildren;
        for (let index=0 ; index < cellArraylength; index++) {
            let displaycell:DisplayCell = displaygroup.cellArray[index];

            let cellsizepx = dimArray[index].px
            width = (ishor) ? cellsizepx : coord.width;
            height = (ishor) ? coord.height : cellsizepx;

            displaycell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex);
            displaycell.coord.cropWithin( displaygroup.coord.within ); /// is it within? or coord?

            renderChildren.RenderSibling(displaycell, derender);
            //Handler.renderDisplayCell(displaycell, displaygroup, index, derender);
            
            x += (ishor) ? width+displaygroup.marginHor : 0;
            y += (ishor) ? 0 : height+displaygroup.marginVer;
        }
   
        return {zindex,
            siblings: renderChildren.siblings};
    }
}
Render.register("DisplayGroup", DisplayGroup);
function h(...Arguments: any){
    return new DisplayCell( new DisplayGroup(...Arguments) )
}
function v(...Arguments: any){
    return new DisplayCell( new DisplayGroup(false, ...Arguments) );
}
// export {v, h, DisplayGroup}