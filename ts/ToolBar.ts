// import {Base} from './Base';
// import {DisplayCell, I} from './DisplayCell';
// import {DisplayGroup, v, h} from './DisplayGroup';
// import {Coord} from './Coord';
// import {Handler} from './Handler';
// import {Overlay} from './Overlay';
// import {css, Css} from './Css';
// import {Modal} from './Modal';
// import {events, Events} from './Events';
// import {Pages, P} from './Pages';

// import { LabeledStatement } from "../node_modules/typescript/lib/typescript";

class Dockable extends Base {
    static labelNo = 0;
    static instances:Dockable[] = [];
    static activeInstances:Dockable[] = [];
    static defaults = { type:"All", }
    static argMap = {
        string : ["label", "type"],
        DisplayCell: ["rootDisplayCell"],
    }
    // retArgs:ArgsObj;   // <- this will appear

    static open:number; //number of dropZone Active
    static activeToolbar:ToolBar;
    static DockableOwner:string;
    dummy:DisplayCell;
    label: string;
    type: string;
    rootDisplayCell: DisplayCell;
    displaygroup: DisplayGroup;
    dropZones: Coord[];
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        if (this.rootDisplayCell) this.displaygroup = this.rootDisplayCell.displaygroup;
        Dockable.makeLabel(this);
        this.dummy = I(`${this.label}_DockableDummy`);
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        // console.log("Moving?", ToolBar.isMoving)
        let ishor = this.displaygroup.ishor;
        if (ToolBar.isMoving && !ToolBar.activeInstace.isDocked ){
            let toolbar = Dockable.activeToolbar = ToolBar.activeInstace;
            let cellArray = this.displaygroup.cellArray;
            if (!this.dropZones) {
                this.dropZones = [];
                for (let index = 0; index < cellArray.length; index++) {
                    let displaycell1  = cellArray[index];
                    let newCoord = new Coord();
                    newCoord.copy( displaycell1.coord );
                    newCoord.assign(undefined, undefined,
                                (ishor) ? toolbar.ifHorWidth : undefined,
                                (ishor) ? undefined : toolbar.ifVerHeight);
                    this.dropZones.push(newCoord);
                }
                let displaycell1 = cellArray[cellArray.length-1];
                let newCoord = new Coord();
                newCoord.copy( displaycell1.coord );
                // console.log(ishor) ///////////////////////////////////////////
                newCoord.assign((ishor) ? displaycell1.coord.width - toolbar.ifHorWidth : undefined,
                                (ishor) ? undefined : displaycell1.coord.height - toolbar.ifVerHeight,
                                (ishor) ? toolbar.ifHorWidth : undefined,
                                (ishor) ? undefined : toolbar.ifVerHeight );
                this.dropZones.push(newCoord);
            }
            for (let index = 0; index < this.dropZones.length; index++) {
                let dropCoord = this.dropZones[index];
                if (!toolbar.rootDisplayCell.coord.isCoordCompletelyOutside(dropCoord)) {
                    if (Dockable.open == undefined){
                        Dockable.DockableOwner = this.label;
                        Dockable.open = index;
                        this.dummy.dim = `${(ishor) ? toolbar.ifHorWidth : toolbar.ifVerHeight}px`;
                        cellArray.splice(index, 0, this.dummy);
                    }
                } else {
                    if (index == Dockable.open && Dockable.DockableOwner == this.label) {
                        Dockable.open = undefined;
                        cellArray.splice(index, 1);
                    }
                }
            }
        } else {
            if (this.dropZones) {
                if (Dockable.open != undefined && Dockable.DockableOwner == this.label) {
                    let toolbar = Dockable.activeToolbar;
                    this.displaygroup.cellArray[Dockable.open] = toolbar.rootDisplayCell;
                    Dockable.open = undefined;
                    toolbar.isDocked = true;
                    toolbar.modal.hide();
                }
                this.dropZones = undefined;
                Handler.update();
            }
        }
    }
}
function dockable(...Arguments:any) {
    let overlay=new Overlay("Dockable", ...Arguments);
    let newDockable = <Dockable>overlay.returnObj;
    let parentDisplaycell = newDockable.rootDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Dockable"] = Dockable;

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
    static defaults = { sizePx: 25, isDocked: true, isHor:true, type:"All"}
    static argMap = {
        string : ["label", "type"],
        // DisplayCell : see constructor,
        number: ["ifHorWidth", "ifVerHeight"],
    }
    static triggerUndockDistance:number =  15;
    static isMoving:boolean =  false;
    static activeInstace: ToolBar;
    static checkerSize:number = 10;

    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    type:string;

    sizePx: number;
    ifVerHeight: number;
    ifHorWidth: number;

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
    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        this.spacer = I(`${this.label}_toolbar_spacer`);
        if ("DisplayCell" in this.retArgs) {
            this.displaycells = this.retArgs["DisplayCell"];
            for (let index = 0; index < this.displaycells.length; index++) {
                let displaycell = this.displaycells[index];
                if (!displaycell.dim) displaycell.dim = `${this.ifHorWidth}px`;
            }
        }
        if (!this.rootDisplayCell) this.build();
        this.makeModal();
    }
    static startMoveToolbar(THIS: ToolBar, handler:Handler){
        Modal.movingInstace = THIS.modal;
    }
    static moveToolbar(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
        THIS.rootDisplayCell.coord.setOffset(offset.x, offset.y);
        if ( Math.abs(offset["x"]) > ToolBar.triggerUndockDistance ||  Math.abs(offset["y"]) > ToolBar.triggerUndockDistance){
            THIS.rootDisplayCell.coord.setOffset();
            ToolBar.undock(THIS, handler, offset);
        }
        Handler.update();
    }
    static undock(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
        let index = THIS.parentDisplayGroup.cellArray.indexOf(THIS.rootDisplayCell);
        if (index > -1) THIS.parentDisplayGroup.cellArray.splice(index, 1);  // pop from previous DisplayGroup
        THIS.isDocked = false;                                                // Mark as unDocked

        Modal.x = THIS.rootDisplayCell.coord.x;
        Modal.y = THIS.rootDisplayCell.coord.y;
        let [width, height] = THIS.setModalSize();
        let x = THIS.rootDisplayCell.coord.x + offset.x;
        let y = THIS.rootDisplayCell.coord.y + offset.y;
        THIS.modal.setSize(x, y, width, height);
        THIS.modal.show();
    }
    build(){
        let THIS = this;
        let checker = I(`${this.label}_checker`, ToolBar.llm_checker, `${ToolBar.checkerSize}px`,
                        events({ondrag: {
            onDown : function(){
                // console.log("onDown");
                ToolBar.isMoving = true; ToolBar.activeInstace = THIS;
                return (THIS.isDocked) ? ToolBar.startMoveToolbar(THIS, THIS.modal.handler) : Modal.startMoveModal(THIS.modal.handler);
            },
            onMove : function(offset:{x:number, y:number}) {
                return (THIS.isDocked) ? ToolBar.moveToolbar(THIS, THIS.modal.handler, offset) : Modal.moveModal(THIS.modal.handler, offset)
            },
            onUp : function(offset:{x:number, y:number}) {
                // console.log("onUp");
                ToolBar.isMoving = false; ToolBar.activeInstace = undefined; Modal.movingInstace = undefined;
                if (THIS.isDocked) {
                    THIS.rootDisplayCell.coord.setOffset();
                }
                Handler.update();
            }
                                  }}),);
        this.hBar = h(`${this.label}_hBar`, `${this.ifVerHeight}px`); // within a vertical container
        this.vBar = v(`${this.label}_hBar`, `${this.ifHorWidth}px`);  // witin a horizontal container
        this.displaycells.unshift(checker);
        this.hBar.displaygroup.cellArray = this.vBar.displaygroup.cellArray =  this.displaycells;
        // console.log(this.ifHorWidth, this.ifVerHeight)
        this.rootDisplayCell =
        P(`${this.label}`, // `${this.ifVerHeight}px`, // px should not be set here!!!!!
            this.hBar,
            this.vBar,
            this.sizeFunction,
        );
    }
    makeModal(){
        this.modal =
        new Modal(`${this.label}_modal`,
            {fullCell:this.rootDisplayCell},
            ...(this.setModalSize()),
        );
    }
    setModalSize():  [number, number] {
        let width = (this.isHor) ? this.ifHorWidth : this.displaycells.length * this.ifHorWidth + ToolBar.checkerSize;
        let height = (this.isHor) ? this.displaycells.length * this.ifVerHeight+ ToolBar.checkerSize : this.ifVerHeight;
        // console.log(this.rootDisplayCell, this)
        // console.log("Set Modal Size", this.isHor, width, height)
        console.log("Setting Modal Size", width, height)
        return [width, height];
    }
    sizeFunction(thisPages:Pages):number {
        let toolbar = <ToolBar>ToolBar.byLabel(thisPages.label);
        let returnValue = (toolbar.isHor) ? 1 : 0;
        // if (thisPages.currentPage != returnValue){
        //     for (let index = 0; index < thisPages.displaycells.length; index++) {
        //         let displaycell = thisPages.displaycells[index];
        //         displaycell.dim = (returnValue) ? `${this.ifHorWidth}px` : `${this.ifVerHeight}px`;
        //     }
        // }
        // console.log("returnValue", toolbar.isHor, returnValue)
        return returnValue;
      }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (this.parentDisplayGroup == undefined) {
            if (parentDisplaygroup != undefined) {
                this.parentDisplayGroup = parentDisplaygroup;
                if (!parentDisplaygroup.label.endsWith("NoSwitch"))
                    this.isHor = parentDisplaygroup.ishor;
                // console.log(parentDisplaygroup.label.endsWith("NoSwitch"), parentDisplaygroup.label)
            }
        } else {
            if (this.parentDisplayGroup != parentDisplaygroup) {
                this.parentDisplayGroup = parentDisplaygroup;
                if (!parentDisplaygroup.label.endsWith("NoSwitch"))
                    this.isHor = parentDisplaygroup.ishor;
                // console.log(parentDisplaygroup.label.endsWith("NoSwitch"), parentDisplaygroup.label)
            }
        }

        // if (this.parentDisplayGroup != parentDisplaygroup) {
        //     this.parentDisplayGroup = parentDisplaygroup;
        //     if (parentDisplaygroup) this.isHor = parentDisplaygroup.ishor;
        // }
        // console.log(parentDisplaygroup.label)
    }
}
function tool_bar(...Arguments:any) {
    let overlay=new Overlay("ToolBar", ...Arguments);
    let newToolBar = <ToolBar>overlay.returnObj;
    let parentDisplaycell = newToolBar.rootDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["ToolBar"] = ToolBar;
// export {tool_bar, ToolBar, Dockable, dockable}