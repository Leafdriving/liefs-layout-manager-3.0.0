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

    static activeDropZoneIndex:number;
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
    render(unuseddisplaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        // console.log("Moving?", ToolBar.isMoving)
        let ishor = this.displaygroup.ishor;
        if (ToolBar.isMoving && !ToolBar.activeInstace.isDocked ){
            let toolbar = Dockable.activeToolbar = ToolBar.activeInstace;
            let cellArray = this.displaygroup.cellArray;
            if (!this.dropZones) {                                       // define DropZones
                this.dropZones = [];
                console.log("--");
                for (let index = 0; index < cellArray.length; index++) {
                    let displaycell  = cellArray[index];  // note scope is lost each loop
                    let newCoord = new Coord();
                    newCoord.copy( displaycell.coord );
                    newCoord.assign(undefined, undefined,
                                (ishor) ? toolbar.width : undefined,
                                (ishor) ? undefined : toolbar.height);
                    console.log(`DisplayCell: x:${displaycell.coord.x} y:${displaycell.coord.y} width:${displaycell.coord.width} height:${displaycell.coord.height}`);
                    console.log(`DropZone: x:${newCoord.x} y:${newCoord.y} width:${newCoord.width} height:${newCoord.height}`);
                    this.dropZones.push(newCoord);
                }
                let displaycell = cellArray[cellArray.length-1];
                let newCoord = new Coord();
                newCoord.copy( displaycell.coord );
                // console.log(ishor) ///////////////////////////////////////////
                newCoord.assign((ishor) ? displaycell.coord.width - toolbar.width : undefined,
                                (ishor) ? undefined : displaycell.coord.height - toolbar.height,
                                (ishor) ? toolbar.width : undefined,
                                (ishor) ? undefined : toolbar.height );
                this.dropZones.push(newCoord);
                //console.log("DropZones", this.dropZones)
            }                                                                       // ok Zones Assigned! loop them!
            for (let index = 0; index < this.dropZones.length; index++) {
                let dropCoord = this.dropZones[index];
                if (!toolbar.modal.coord.isCoordCompletelyOutside(dropCoord)) { // if hit zone, make zone
                    if (Dockable.activeDropZoneIndex == undefined){
                        Dockable.DockableOwner = this.label;
                        Dockable.activeDropZoneIndex = index;
                        this.dummy.dim = `${(ishor) ? toolbar.width : toolbar.height}px`;
                        cellArray.splice(index, 0, this.dummy);
                    }
                } else {                                                                  // When inactive, pop zone
                    if (index == Dockable.activeDropZoneIndex && Dockable.DockableOwner == this.label) {
                        Dockable.activeDropZoneIndex = undefined;
                        cellArray.splice(index, 1);
                    }
                }
            }
        } else {
            if (this.dropZones) {
                if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
                    let toolbar = Dockable.activeToolbar;
                    toolbar.modal.hide();
                    let oldState = toolbar.state;
                    toolbar.state = (ishor) ? ToolBarState.dockedInHorizontal :ToolBarState.dockedInVertical;
                    toolbar.alignToolbarToDiplayGroup(oldState);
                    this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = toolbar.rootDisplayCell;
                    Dockable.activeDropZoneIndex = undefined;
                    toolbar.isDocked = true;
                    console.log("newHome", this.displaygroup)
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

enum ToolBarState {
    dockedInVertical = "dockedInVertical",
    dockedInHorizontal = "dockedInHorizontal",
    modalWasDockedInHor = "modalWasDockedInHor",
    modalWasDockedInVer = "modalWasDockedInVer"
  }

class ToolBar extends Base {
    static labelNo = 0;
    static instances:ToolBar[] = [];
    static activeInstances:ToolBar[] = [];

    static defaults = { sizePx: 25, isDocked: false, isHor:true, type:"All", state:ToolBarState.modalWasDockedInVer}
    static argMap = {
        string : ["label", "type"],              // DisplayCell : see constructor,
        number: ["width", "height"],
    }
    static triggerUndockDistance:number =  15;
    static isMoving:boolean =  false;
    static activeInstace: ToolBar;
    static checkerSize:number = 10;

    // retArgs:ArgsObj;   // <- this will appear
    state: ToolBarState;

    label:string;
    type:string;

    height: number;
    width: number;

    parentDisplayGroup: DisplayGroup;

    rootDisplayCell: DisplayCell;
    displaycells: DisplayCell[];
    spacer:DisplayCell;

    modal: Modal;
    isDocked: boolean;
    // isHor: boolean;
    coord: Coord;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        this.spacer = I(`${this.label}_toolbar_spacer`);

        if ("DisplayCell" in this.retArgs) {
            this.displaycells = this.retArgs["DisplayCell"];
            for (let index = 0; index < this.displaycells.length; index++) {
                let displaycell = this.displaycells[index];
                if (!displaycell.dim) displaycell.dim = `${this.width}px`;
            }
        }

        if (!this.rootDisplayCell) this.build();
        this.makeModal();
    }
    static startMoveToolbar(THIS: ToolBar, handler:Handler){
        console.log("startMoveToolbar")
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
        console.log("UnDocked!");
        let index = THIS.parentDisplayGroup.cellArray.indexOf(THIS.rootDisplayCell);
        if (index > -1) THIS.parentDisplayGroup.cellArray.splice(index, 1);  // pop from previous DisplayGroup
        THIS.isDocked = false;                                                // Mark as unDocked
        THIS.state = (THIS.parentDisplayGroup.ishor) ? ToolBarState.modalWasDockedInHor : ToolBarState.modalWasDockedInVer;
        console.log("State is now: " + THIS.state);
        Modal.x = THIS.rootDisplayCell.coord.x;
        Modal.y = THIS.rootDisplayCell.coord.y
        let [width, height] = THIS.setModalSize();
        let x = Modal.x + offset.x;
        let y = Modal.y + offset.y;
        THIS.modal.setSize(x, y, width, height);
        THIS.modal.show();
    }
    show(){if (!this.isDocked) this.modal.show()}
    hide(){if (!this.isDocked) this.modal.hide()}
    setArrayPx(value:number) {
        for (let index = 1; index < this.displaycells.length; index++)
            this.displaycells[index].dim = `${value}px`;
    }
    build(){
        let THIS = this;
        let checker = I(`${this.label}_checker`, DefaultTheme.llm_checker, `${ToolBar.checkerSize}px`,
                        events({ondrag: {
            onDown : function(){
                console.log("onDown - THIS.isDocked ->", THIS.isDocked);
                ToolBar.isMoving = true; ToolBar.activeInstace = THIS;
                if (THIS.isDocked)
                    ToolBar.startMoveToolbar(THIS, THIS.modal.handler)
                else
                    Modal.startMoveModal(THIS.modal.handler);
            },
            onMove : function(offset:{x:number, y:number}) {
                if (THIS.isDocked)
                    ToolBar.moveToolbar(THIS, THIS.modal.handler, offset);
                else
                    Modal.moveModal(THIS.modal.handler, offset);
            },
            onUp : function(offset:{x:number, y:number}) {
                console.log("Mouse Up");
                ToolBar.isMoving = false; ToolBar.activeInstace = undefined; Modal.movingInstace = undefined;
                if (THIS.isDocked) {
                    THIS.rootDisplayCell.coord.setOffset();
                }
                Handler.update();
            }
                                  }}),);
        this.rootDisplayCell = h(`${this.label}_hBar`, `${this.height}px`);
        this.rootDisplayCell.displaygroup.cellArray = this.displaycells;
        this.rootDisplayCell.displaygroup.cellArray.unshift(checker);
        this.setArrayPx(this.width);
    }
    makeModal(){
        this.modal = new Modal(`${this.label}_modal`,
                        {fullCell:this.rootDisplayCell},
                        ...(this.setModalSize()),
        );
    }
    setModalSize():  [number, number] {
        let width = (this.state == ToolBarState.modalWasDockedInHor) ? this.width 
                                                                    : this.displaycells.length * this.width + ToolBar.checkerSize;
        let height = (this.state == ToolBarState.modalWasDockedInHor) ? this.displaycells.length * this.height+ ToolBar.checkerSize
                                                                    : this.height;
        return [width, height];
    }
    alignToolbarToDiplayGroup(oldState:ToolBarState) {
        if (oldState == ToolBarState.modalWasDockedInHor && this.state == ToolBarState.dockedInVertical) {
            this.setArrayPx(this.width);
            this.rootDisplayCell.displaygroup.ishor = true;
            this.rootDisplayCell.dim = `${this.height}px`;
            console.log("height set to ", this.height)
        }
        if (oldState == ToolBarState.modalWasDockedInVer && this.state == ToolBarState.dockedInHorizontal) {
            this.setArrayPx(this.height);
            this.rootDisplayCell.displaygroup.ishor = false;
            this.rootDisplayCell.dim = `${this.width}px`;
            console.log("Width set to ", this.width)
        }
    }
    evalState(){
        let newState: ToolBarState;
        if (this.parentDisplayGroup) {
            let isModal = this.parentDisplayGroup.label.endsWith("_MODAL");
            if (isModal) {
                if (this.state == ToolBarState.dockedInHorizontal) newState = ToolBarState.modalWasDockedInHor;
                else if (this.state == ToolBarState.dockedInVertical) newState = ToolBarState.modalWasDockedInVer;
                else newState = this.state;
            } else {
                newState = (this.parentDisplayGroup.ishor) ? ToolBarState.dockedInHorizontal : ToolBarState.dockedInVertical
            }
        }
        return newState;
    }
    render(displaycell:DisplayCell, parentDisplayGroup: DisplayGroup, index:number, derender:boolean){
        if (parentDisplayGroup) {
            if (this.parentDisplayGroup != parentDisplayGroup) {
                console.log("New Parent Found: " + parentDisplayGroup.label);
                this.parentDisplayGroup = parentDisplayGroup;
            }
            let wasState = this.state;
            let newState =  this.evalState();
            // console.log(wasState, newState)

            if (newState && wasState != newState) {  // respond to state change
                this.state = newState;
                let wasDocked = this.isDocked;
                this.isDocked = (this.state == ToolBarState.dockedInHorizontal || this.state == ToolBarState.dockedInVertical);
                let wasHor = (wasState == ToolBarState.dockedInVertical || wasState == ToolBarState.modalWasDockedInVer);
                let isHor = (this.state == ToolBarState.dockedInVertical || this.state == ToolBarState.modalWasDockedInVer);
                console.log(`State Change(${this.label}): Was ${wasState}, now ${this.state}`)
                if (wasHor != isHor) {
                    console.log(`Direction Change Detected - Setting isHor to ${isHor}`);
                    this.setArrayPx( (isHor) ? this.width : this.height );
                    this.rootDisplayCell.displaygroup.ishor = isHor;
                }
                if (wasDocked != this.isDocked) {
                    console.log(`Toolbar ${this.label} has been switched to ${(this.isDocked) ? "" : "un"}docked`);
                }
            }
        } else console.log("No Parent Display Group");
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