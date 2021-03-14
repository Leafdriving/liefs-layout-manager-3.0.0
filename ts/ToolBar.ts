class ToolBar extends Base {
    static labelNo = 0;
    static instances:ToolBar[] = [];
    static activeInstances:ToolBar[] = [];
    static llm_checker = css("llm_checker",`cursor:pointer;
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
    transition-duration: 2s;`)
    static defaults = { sizePx: 25, isDocked: true, isHor:true}
    static argMap = {
        string : ["label", "type"],
        // DisplayCell : see constructor,
        number: ["sizePx"],
    }
    static triggerUndockDistance:number =  10;

    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    type:string;

    sizePx: number;

    parentDisplayGroup: DisplayGroup;

    rootDisplayCell: DisplayCell;
    displaycells: DisplayCell[];
    spacer:DisplayCell;

    hBar:DisplayCell;
    vBar:DisplayCell;

    modal: Modal;
    isDocked: boolean;
    isHor: boolean;
    coord: Coord;
    
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
        this.makeModal();
    }
    static startMoveToolbar(THIS: ToolBar, handler:Handler){
        console.log("Start move Toolbar");
    }
    static moveToolbar(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
        // console.log(offset);
        if ( Math.abs(offset["x"]) > ToolBar.triggerUndockDistance ||  Math.abs(offset["y"]) > ToolBar.triggerUndockDistance){
            ToolBar.undock(THIS, handler, offset);
        }
    }
    static undock(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
        //console.log("Undock!");
        // console.log(THIS.parentDisplayGroup)
        // console.log( THIS.parentDisplayGroup.cellArray.indexOf(THIS.rootDisplayCell) )
        let index = THIS.parentDisplayGroup.cellArray.indexOf(THIS.rootDisplayCell);
        if (index > -1) THIS.parentDisplayGroup.cellArray.splice(index, 1);  // pop from previous DisplayGroup
        THIS.isDocked = false;                                                // Mark as unDocked

        Modal.x = THIS.rootDisplayCell.coord.x;
        Modal.y = THIS.rootDisplayCell.coord.y;
        let [width, height] = THIS.setModalSize();
        let x = THIS.rootDisplayCell.coord.x + offset.x;
        let y = THIS.rootDisplayCell.coord.y + offset.y;
        console.log(x, y, width, height)
        THIS.modal.setSize(x, y, width, height);
        // Handler.update(); // maybe remove!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        THIS.modal.show();
        
        

        // THIS.modal.handler.coord.copy(THIS.rootDisplayCell.coord);            // copy Postion from Drag
        // let [width, height] =  THIS.setModalSize();
        // let hCoord = THIS.modal.handler.coord;
        // hCoord.assign(hCoord.x + offset.x, hCoord.y + offset.y, width, height);
        // THIS.modal.show();






//////////////////// here!






    }
    build(){
        let THIS = this;
        let checker = I(`${this.label}_checker`, ToolBar.llm_checker, "10px",
                        events({ondrag: {
            onDown : function(){
                return (THIS.isDocked) ? ToolBar.startMoveToolbar(THIS, THIS.modal.handler) : Modal.startMoveModal(THIS.modal.handler);
            },
            onMove : function(offset:{x:number, y:number}) {
                return (THIS.isDocked) ? ToolBar.moveToolbar(THIS, THIS.modal.handler, offset) : Modal.moveModal(THIS.modal.handler, offset)
            },                          }}),);
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
    makeModal(){
        // this.modal = new Modal("hi","inner","title","footer");
        this.modal =
        new Modal(`${this.label}_modal`,
            {fullCell:this.rootDisplayCell},
            ...(this.setModalSize()),
        );
        // setTimeout(() => {
        //     this.modal.show();    
        // }, 0);
        
    }
    setModalSize():  [number, number] {
        let width = (this.isHor) ? this.displaycells.length * this.sizePx: this.sizePx;
        let height = (this.isHor) ? this.sizePx : this.displaycells.length * this.sizePx;
        return [width, height];
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