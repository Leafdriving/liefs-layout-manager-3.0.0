/**
 * Display group
 */
class DisplayGroup extends Component {
    static labelNo = 0;
    static instances:{[key: string]: DisplayGroup;} = {};
    static activeInstances:{[key: string]: DisplayGroup;} = {};
    static defaults:{[key: string]: any;} = {isHor:true,margin:0, offset:0}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        number : ["margin"],
        dim : ["dim_"],
        boolean: ["isHor"],
    }
    allowScrollBar:boolean;
    label:string;
    dim_:string;
    get dim(){return this.dim_};
    set dim(value) {this.dim_ = value;}
    get coord(){return (this.parentDisplayCell) ? this.parentDisplayCell.coord : undefined}
    margin:number;
    node:node_;
    parentDisplayCell:DisplayCell;
    children: DisplayCell[] = [];
    isHor: boolean;
    scrollbar: ScrollBar;
    offset:number;
    
    /**
     * Creates an instance of display group.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        DisplayGroup.makeLabel(this); DisplayGroup.instances[this.label] = this;
        DisplayGroup.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs) this.children = this.retArgs["DisplayCell"];
    }
    /**
     * Determines whether connect on
     */
    onConnect():void{
        let THIS = this;
        this.parentDisplayCell.getdim = function(){return THIS.dim}
        this.parentDisplayCell.setdim = function(value:string){THIS.dim = value}
        if (this.retArgs["number"] && this.retArgs["number"].length > 1) 
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"].slice(1));
    };
    /**
     * Renders display group
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):DisplayCell[]{
        // console.log("Render")
        let TotalPixels = ((this.isHor) ? this.coord.width : this.coord.height)-(this.children.length-1)*((this.margin) ? this.margin : 0)
        let answersArray:{px:number, percent:number, min:number}[] = [];
        let totalPxUsed = 0;
        let percentUsed = 0;
        let emptyDim = 0;
        
        // first pass fills in stuff
        for (let index = 0; index < this.children.length; index++) {
            let child = this.children[index];
            let dim = child.dim;
            let min = (child.min) ? child.min : 0;
            if (dim) {
                if (dim.endsWith("px")) {
                    let px = pf.pxAsNumber(dim);
                    if (px < min) px = min;
                    answersArray.push({px, percent:0, min});
                    totalPxUsed += px;
                } else {
                    let percent = pf.percentAsNumber(dim);
                    answersArray.push({px:undefined, percent, min});
                    percentUsed += percent;
                }
            } else {
                answersArray.push({px:undefined, percent:undefined, min});
                ++emptyDim;
            }
        }
        // second pass fills in empty
        if (emptyDim) {
            for (let index = 0; index < answersArray.length; index++)
                if (answersArray[index].percent == undefined) answersArray[index].percent = pf.decimalPlaces( (100-percentUsed)/emptyDim, 2 );
        }
        // third pass evaluates percents
        let pixelsLeft = TotalPixels - totalPxUsed;
        for (let index = 0; index < answersArray.length; index++) {
            let aA = answersArray[index];
            if (aA.percent) aA.px = pf.decimalPlaces( (aA.percent/100)*pixelsLeft , 1);
        }
        let morePixels = DisplayGroup.forceMin(answersArray);

        
        let pixelsAvailable = (this.isHor) ? this.coord.width : this.coord.height;
        let margin = ((this.margin == undefined) ? 0 : this.margin );
        let pixelsUsed = 0;
        for (let index = 0; index < answersArray.length; index++) {
            let px = answersArray[index].px;
            pixelsUsed += px + ((index == 0) ? 0 : margin);
        }

        if (("ScrollBar" in Render.classes) && this.allowScrollBar) {
            if (pixelsUsed > pixelsAvailable +1) {
                if (!this.scrollbar) {
                    this.scrollbar = scrollbar(this.label+"_ScrollBar", this.isHor);
                    this.parentDisplayCell.addComponent(this.scrollbar);
                }
                this.offset = this.scrollbar.update(pixelsUsed, pixelsAvailable);
            } else {
                if (this.scrollbar) {
                    this.scrollbar.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar");
                    this.scrollbar = undefined;
                }
            }
        }
        let x = this.coord.x - ((this.isHor) ? this.offset : 0)
        let y = this.coord.y - ((this.isHor) ? 0 : this.offset);
        let width:number;
        let height:number;
        
        for (let index = 0; index < answersArray.length; index++) {
            let px = answersArray[index].px;
            width = (this.isHor) ? px : this.coord.width;
            height = (this.isHor) ? this.coord.height : px;
            this.children[index].coord.copy(this.coord, x, y, width, height, zindex);
            x += (this.isHor) ? width + margin : 0;
            y += (this.isHor) ? 0 : height + margin;
        }
        return this.children;
    }    
    /**
     * Forces min
     * @param answersArray 
     * @returns  
     */
    static forceMin(answersArray:{px:number, percent:number, min:number}[]) {
        let morePixels=0;
        let totalPercent = 0
        for (let index = 0; index < answersArray.length; index++){
            let aA = answersArray[index];
            if (aA.px < aA.min) {
                morePixels += aA.min - aA.px;
                aA.px = aA.min;
                if (aA.percent) {
                    aA.percent = undefined;
                }
            }
            if (aA.percent) totalPercent += aA.percent;
        }
        if (totalPercent < 99 && totalPercent > 0) {
            let scaleFactor = 100/totalPercent;
            for (let index = 0; index < answersArray.length; index++){
                let aA = answersArray[index];
                if (aA.percent) aA.percent = pf.decimalPlaces( aA.percent*scaleFactor, 2);
            }
        }
        return morePixels;
    }
}
function h(...Arguments:any) {return new DisplayCell( new DisplayGroup(...Arguments) );}
function v(...Arguments:any) {return h(false, ...Arguments)}