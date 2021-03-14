class ToolBar extends Base {
    static labelNo = 0;
    static instances:ToolBar[] = [];
    static activeInstances:ToolBar[] = [];
    static defaults = { sizePx: 25, isDocked: false,}
    static argMap = {
        string : ["label"],
        // DisplayCell : see constructor,
        number: ["sizePx"],
    }
    static llm_checker = css("llm_checker",`cursor:pointer;`,`
    --checkerSize: 2px; /* edit me */
    
    background-image:
      linear-gradient(45deg, lightgrey 25%, transparent 25%), 
      linear-gradient(135deg, lightgrey 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, lightgrey 75%),
      linear-gradient(135deg, transparent 75%, lightgrey 75%);
    
    background-size: 
      calc(2 * var(--checkerSize)) 
      calc(2 * var(--checkerSize));
    
    background-position: 
      0 0, 
      var(--checkerSize) 0, 
      var(--checkerSize) calc(-1 * var(--checkerSize)), 
      0px var(--checkerSize);
    
    /* for fun */
    transition-property: background-position, background-size;
    transition-duration: 1s;`)
    // retArgs:ArgsObj;   // <- this will appear
    label:string;

    sizePx: number;

    parentDisplayGroup: DisplayGroup;

    rootDisplayCell: DisplayCell;
    displaycells: DisplayCell[];
    spacer:DisplayCell;

    hBar:DisplayCell;
    vBar:DisplayCell;

    modal: Modal;
    isDocked: boolean;
    
    // page: Pages;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        this.spacer = I(`${this.label}_toolbar_spacer`);
        if ("DisplayCell" in this.retArgs) {
            this.displaycells = this.retArgs["DisplayCell"];
            for (let index = 0; index < this.displaycells.length; index++) {
                let displaycell = this.displaycells[index];
                if (!displaycell.dim) displaycell.dim = `${this.sizePx}px`;
            }
        }
        if (!this.rootDisplayCell) this.build();
    }
    build(){

        let checker = I(`${this.label}_checker`, ToolBar.llm_checker, "10px");
        this.hBar = h(`${this.label}_hBar`, `${this.sizePx}px`);
        this.vBar = v(`${this.label}_hBar`, `${this.sizePx}px`);
        this.displaycells.unshift(checker);
        this.hBar.displaygroup.cellArray = this.vBar.displaygroup.cellArray =  this.displaycells;
        this.rootDisplayCell =
        P(`${this.label}_toolbar_Pages`, `${this.sizePx}px`,
            this.hBar,
            this.vBar,
            this.sizeFunction,
        );
    }
    sizeFunction(thisPages:Pages):number {
        return 0;
      }
      render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
            if (!this.parentDisplayGroup) this.parentDisplayGroup = parentDisplaygroup
      }
}
function tool_bar(...Arguments:any) {
    // console.log("start");
    let overlay=new Overlay("ToolBar", ...Arguments);
    let newToolBar = <ToolBar>overlay.returnObj;
    let parentDisplaycell = newToolBar.rootDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    // console.log("parentDisplayCell",parentDisplaycell);
    return parentDisplaycell;
}
Overlay.classes["ToolBar"] = ToolBar;