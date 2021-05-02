/**
 * Pages
 */
class Pages extends Component {
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
        Tree_:["tree"],
    }
    label:string;
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[];

    tree:Tree_ // if pages by a tree

    evalFunction:(thisPages:Pages)=>number;
    cellArray:DisplayCell[];
    dim_:string;
    get dim() {return this.dim_}
    set dim(value:string) {this.dim_ = value}

    prevPage:number;
    currentPage_:number;
    set currentPage(value:number) {
        if (value < 0) value = 0;
        if (value >= this.cellArray.length ) value = this.cellArray.length-1;
        if (value != this.currentPage_) {
            this.currentPage_ = value;
            Render.scheduleUpdate();
            setTimeout(() => {Render.scheduleUpdate();}, 10);
        }
    }
    get currentPage(){return this.currentPage_}
    
    // retArgs:objectAny;   // <- this will appear
    /**
     * Creates an instance of pages.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        let THIS = this;
        Pages.makeLabel(this); Pages.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs) this.cellArray = this.retArgs["DisplayCell"];
        let index=-1;
        if (this.tree) {
            this.cellArray = [];
            node_.traverse(this.tree.parentTreeNode, function(node:node_){
                let label = node.Arguments[0];
                let displaycell = DisplayCell.instances[label];
                if (!displaycell) displaycell = I(label);
                let element_ = <Element_>(<DisplayCell>(node["displaycell"])).getComponent("Element_");
                let i = index;
                element_.addEvents({onclick:function(){THIS.currentPage = i}})
                
                THIS.cellArray.push( displaycell );
                index++;
            });
            this.cellArray.shift();
        }

        Pages.instances[this.label] = this;
    }
    /**
     * Determines whether connect on
     */
    onConnect():void{
        let THIS = this;
        this.parentDisplayCell.getdim = function(){return THIS.dim}
        this.parentDisplayCell.setdim = function(value:string){THIS.dim = value}
    };
    /**
     * Renders pages
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        let newPage = this.evalFunction(this);
        if (newPage != this.prevPage) Render.update(this.cellArray[this.prevPage], true);
        this.currentPage_ = this.prevPage = newPage;
        //console.log("parentDisplayCell", this.parentDisplayCell.label)
        //this.parentDisplayCell.coord.log()
        this.cellArray[this.currentPage].coord.copy( this.parentDisplayCell.coord )
        return [ this.cellArray[this.currentPage] ]
    };
}
Render.register("Pages", Pages);
function P(...Arguments:any) {
    return new DisplayCell( new Pages(...Arguments) );
}


