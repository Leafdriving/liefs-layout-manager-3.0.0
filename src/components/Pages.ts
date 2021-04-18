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