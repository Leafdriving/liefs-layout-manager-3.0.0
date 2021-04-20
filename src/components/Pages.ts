class Pages extends Base {
    static labelNo = 0;
    static instances:{[key: string]: Pages;} = {};
    static activeInstances:{[key: string]: Pages;} = {};
    static defaults:{[key: string]: any;} = {
        currentPage_ : 0, prevPage: 0,
        evalFunction : function (thisPages:Pages):number {return thisPages.currentPage}
    }
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        function: ["evalFunction"],
        dim:["dim_"],
        // Selected: ["selected"],
    }
    label:string;
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[];

    evalFunction:(thisPages:Pages)=>number;
    cellArray:DisplayCell[];
    dim_:string;
    get dim() {return this.dim_}
    set dim(value:string) {this.dim_ = value}

    prevPage:number;
    currentPage_:number;
    set currentPage(value:number) {
        this.currentPage_ = value;
        Render.scheduleUpdate();
    }
    get currentPage(){return this.currentPage_}
    
    // retArgs:objectAny;   // <- this will appear
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Pages.makeLabel(this); Pages.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs) this.cellArray = this.retArgs["DisplayCell"];

        Pages.instances[this.label] = this;
    }
    onConnect():void{
        let THIS = this;
        this.parentDisplayCell.getdim = function(){return THIS.dim}
        this.parentDisplayCell.setdim = function(value:string){THIS.dim = value}
    };
    preRender(derender:boolean, node:node_):void{
        return undefined
    };
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        let newPage = this.evalFunction(this);
        if (newPage != this.prevPage) {
            Render.update(this.cellArray[this.prevPage], true);
            this.currentPage = newPage;
            this.prevPage = newPage;
        }
        this.cellArray[this.currentPage].coord.copy( this.parentDisplayCell.coord )
        return [ this.cellArray[this.currentPage] ]
    };
    delete(){}
}
Render.register("Pages", Pages);
function P(...Arguments:any) {
    return new DisplayCell( new Pages(...Arguments) );
}

class Selected extends Base {
    static labelNo = 0;
    static instances:{[key: string]: Selected;} = {};
    static activeInstances:{[key: string]: Selected;} = {};
    static defaults = {indexer:[],}
    static argMap = {
        string : ["label"],
        function: ["onselect", "onunselect"],
        Array : ["indexer"],
        number :["startValue"],
        Pages: ["pages"],
    }
    label:string;
    indexer:(DisplayCell|DisplayCell[])[];
    onselect:(index:number, displaycell:DisplayCell)=>void
    onunselect:(index:number, displaycell:DisplayCell)=>void;

    startValue:number;
    currentButtonIndex:number;
    pages:Pages;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Selected.makeLabel(this);
        this.build()
        if (this.startValue != undefined) this.select(this.startValue);
        Selected.instances[this.label] = this;
    }
    build(){
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {
            let displayCells:DisplayCell[];
            let type = Arguments_.typeof( this.indexer[index] );
            if ( type == "DisplayCell" ) displayCells = this.indexer[index] = [ <DisplayCell>(this.indexer[index]) ];
            else if ( type == "Array" ) displayCells = <DisplayCell[]>( this.indexer[index] );
            for (let index = 0; index < displayCells.length; index++) 
                (<Element_>displayCells[index].getComponent("Element_"))
                    .addEvents( {onclick:function(e:PointerEvent){ THIS.select(displayCells[index]) }} )      
        }
    }
    select(displaycellOrNumber:DisplayCell|number) {
        let newIndex:number;
        let type = Arguments_.typeof(displaycellOrNumber);
        if (type == "number") newIndex = <number>displaycellOrNumber;
        else if (type == "DisplayCell") newIndex = this.indexOf(<DisplayCell>displaycellOrNumber);
        if (newIndex != undefined) {
            if (this.currentButtonIndex != newIndex){
                if (this.currentButtonIndex != undefined) this.onUnselect( this.currentButtonIndex );
                this.currentButtonIndex = newIndex;
                this.onSelect( this.currentButtonIndex );
            }
        }
    }
    clear(){this.onUnselect( this.currentButtonIndex );this.currentButtonIndex = undefined}
    indexOf(displaycell:DisplayCell): number {
        for (let index = 0; index < this.indexer.length; index++) 
            if ((<DisplayCell[]>this.indexer[index]).indexOf(displaycell) > -1) return index;
        return undefined;
    }
    onSelect(index:number){
        let selectArray = (<DisplayCell[]>(this.indexer[index]));
        for (let i = 0; i < selectArray.length; i++) {
            const displaycell = selectArray[i];
            let element = <Element_>displaycell.getComponent("Element_");
            if (element && !element.attributes.class.endsWith("Selected")) {
                element.attributes.class += "Selected";
                if (element.el) Element_.setAttrib(element.el, "class", element.attributes.class);
            }
            if (this.onselect) this.onselect(index, displaycell);
        }
        if (this.pages) this.pages.currentPage = index;
    }
    onUnselect(index:number){
        let unSelectArray = (<DisplayCell[]>(this.indexer[index]));
        for (let i = 0; i < unSelectArray.length; i++) {
            const displaycell = unSelectArray[i];
            let element = <Element_>displaycell.getComponent("Element_");
            if (element && element.attributes.class.endsWith("Selected")) {
                element.attributes.class = element.attributes.class.slice(0, -8);
                if (element.el) Element_.setAttrib(element.el, "class", element.attributes.class);
            }
            if (this.onunselect) this.onunselect(index, displaycell);
        }
    }
}

