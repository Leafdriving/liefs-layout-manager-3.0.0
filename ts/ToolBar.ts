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
    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    sizePx: number;
    rootDisplayCell: DisplayCell;
    displaycells: DisplayCell[];
    spacer:DisplayCell;
    modal: Modal;
    isDocked: boolean;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        this.spacer = I(`${this.label}_toolbar_spacer`);
        if ("DisplayCell" in this.retArgs)
            this.displaycells = this.retArgs["DisplayCell"];
        if (!this.rootDisplayCell) this.build();
    }
    build(){
        
        this.rootDisplayCell =
        P(`${this.label}_toolbar_Pages`,
            this.sizeFunction,
        )
        // h(`${this.label}_toolbar_h`, `${this.sizePx}px`,
        //     spacer
        // );
    }
    sizeFunction(thisPages:Pages):number {
        // let [x, y] = pf.viewport();
        // if (x > 920) slideMenu.pop();
        // // if (returnValue != thisPages.currentPage) {}
        // return (x > 920) ? 0 : 1;
        return 0;
      }
}