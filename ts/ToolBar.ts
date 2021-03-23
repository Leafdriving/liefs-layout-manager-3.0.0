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

    static activeDropZoneIndex:number;
    static DockableOwner:string;

    static labelNo = 0;
    static instances:Dockable[] = [];
    static activeInstances:Dockable[] = [];
    static defaults = {acceptsTypes: ["ALL"]}
    static argMap = {
        string : ["label"],
        DisplayCell : ["displaycell"],
    }
    retArgs:ArgsObj;   // <- this will appear

    label:string;
    displaycell: DisplayCell;
    displaygroup: DisplayGroup;
    acceptsTypes:string[];
    dropZones: Coord[];
    dummy: DisplayCell;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        let THIS=this;

        Dockable.makeLabel(this);
        if ("string" in this.retArgs && this.retArgs["string"].length > 1) {
            this.acceptsTypes = this.retArgs["string"].shift();
        }
        if (this.displaycell) this.displaygroup = this.displaycell.displaygroup;
        this.dummy = I(`${this.label}_DockableDummy`);

        window.addEventListener('ModalDropped', function (e:CustomEvent) {THIS.dropped(e)}, false);
        window.addEventListener('ModalStartDrag', function (e:CustomEvent) {THIS.undock(e)}, false);
    }
    undock(e:CustomEvent) {
        let modal = e.detail;
        let toolbar = <ToolBar>ToolBar.byLabel( modal.label.slice(0, -6) );
        let ishor = this.displaygroup.ishor;
        if (toolbar) {
            let index = this.displaygroup.cellArray.indexOf(toolbar.rootDisplayCell);
            if (index > -1) {        // is in this cellArray
                modal.coord.x = toolbar.rootDisplayCell.coord.x;
                modal.coord.y = toolbar.rootDisplayCell.coord.y;
                toolbar.state = (ishor) ? TBState.modalWasDockedInHor : TBState.modalWasDockedInVer;
                this.displaygroup.cellArray.splice(index, 1);
                toolbar.resizeForModal();
                toolbar.modal.show();
            }
        }        
    }
    dropped(e:CustomEvent){
        let modal = e.detail;
        let toolbar = <ToolBar>ToolBar.byLabel( modal.label.slice(0, -6) );
        if (this.dropZones) {
            if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
                toolbar.modal.hide();
                let ishor = this.displaygroup.ishor;
                toolbar.state = (ishor) ? TBState.dockedInHorizontal :TBState.dockedInVertical;
                toolbar.resizeFordock();
                this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = toolbar.rootDisplayCell;
                Dockable.activeDropZoneIndex = undefined;
                toolbar.parentDisplayGroup = this.displaygroup;
                this.dropZones = undefined;
                Handler.update();
            }

        }
    }
    makeDropZones(width:number, height:number){
        let ishor = this.displaygroup.ishor;
        let cellArray = this.displaygroup.cellArray;
        if (!this.dropZones) {                                       // define DropZones
            this.dropZones = [];
            for (let index = 0; index < cellArray.length; index++) {
                let displaycell  = cellArray[index];  // note scope is lost each loop
                let newCoord = new Coord();
                newCoord.copy( displaycell.coord );
                newCoord.assign(undefined, undefined,
                            (ishor) ? width : undefined,
                            (ishor) ? undefined : height);
                this.dropZones.push(newCoord);
            }
            let displaycell = cellArray[cellArray.length-1];
            let newCoord = new Coord();
            newCoord.copy( displaycell.coord );

            newCoord.assign((ishor) ? displaycell.coord.x + displaycell.coord.width - width : undefined,
                            (ishor) ? undefined : displaycell.coord.y + displaycell.coord.height - height,
                            (ishor) ? width : undefined,
                            (ishor) ? undefined : height );

            this.dropZones.push(newCoord);
        }
    }
    openCloseDropZones(modal:Modal, width:number, height:number){
        let ishor = this.displaygroup.ishor;
        let cellArray = this.displaygroup.cellArray;
        for (let index = 0; index < this.dropZones.length; index++) {
            let dropCoord = this.dropZones[index];
            if (!modal.coord.isCoordCompletelyOutside(dropCoord)) { // if hit zone, make zone
                if (Dockable.activeDropZoneIndex == undefined){
                    Dockable.DockableOwner = this.label;
                    Dockable.activeDropZoneIndex = index;
                    this.dummy.dim = `${(ishor) ? width : height}px`;
                    cellArray.splice(index, 0, this.dummy);
                }
            } else {                                                                  // When inactive, pop zone
                if (index == Dockable.activeDropZoneIndex && Dockable.DockableOwner == this.label) {
                    Dockable.activeDropZoneIndex = undefined;
                    cellArray.splice(index, 1);
        }   }   }
    }
    render(unuseddisplaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (Modal.movingInstace && Modal.movingInstace.type == ModalType.toolbar) {
            let modal = Modal.movingInstace;
            let toolbar = ToolBar.byLabel( modal.label.slice(0, -6) );
            if (!this.dropZones)                                        // define DropZones
                this.makeDropZones(toolbar.width, toolbar.height);
            this.openCloseDropZones(toolbar.modal, toolbar.width, toolbar.height);
       }
       if (Modal.movingInstace && Modal.movingInstace.type == ModalType.winModal && this.displaygroup.ishor) {
            let modal = Modal.movingInstace;
            // let winmodal = winModal.byLabel( modal.label.slice(0, -6) );
            if (!this.dropZones)                                        // define DropZones
                this.makeDropZones(modal.coord.width, modal.coord.height);
            this.openCloseDropZones(modal, modal.coord.width, modal.coord.height);
       }
}   }
                


function dockable(...Arguments:any) {
    let overlay=new Overlay("Dockable", ...Arguments);
    let newDockable = <Dockable>overlay.returnObj;
    let parentDisplaycell = newDockable.displaycell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Dockable"] = Dockable;





enum TBState {
    dockedInVertical = "dockedInVertical",
    dockedInHorizontal = "dockedInHorizontal",
    modalWasDockedInHor = "modalWasDockedInHor",
    modalWasDockedInVer = "modalWasDockedInVer"
}

class ToolBar extends Base {
    static labelNo = 0;
    static instances:ToolBar[] = [];
    static activeInstances:ToolBar[] = [];
    static defaults = { state:TBState.modalWasDockedInVer, checkerSize:8, type:"default" }
    static argMap = {
        string : ["label", "type"],
        number : ["width", "height"] 
    }
    retArgs:ArgsObj;   // <- this will appear

    label:string;
    state: TBState;
    displayCells:DisplayCell[];
    rootDisplayCell: DisplayCell;
    width:number;
    height:number;
    parentDisplayGroup: DisplayGroup;
    modal: Modal;
    checkerSize:number;
    type:string;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        ToolBar.makeLabel(this);
        if ("DisplayCell" in this.retArgs) this.displayCells = this.retArgs["DisplayCell"];
        this.buildModal();
    }
    buildModal(){
        let THIS = this;
        this.rootDisplayCell =
            h(`${this.label}_h`, `${this.height}px`,
                I(`${this.label}_handle`, DefaultTheme.llm_checker, `${this.checkerSize}px`,
                    events({ondblclick:function(e:MouseEvent){THIS.toggleDirection(e)}}),
                ),
                ...this.displayCells
            );
        this.modal = new Modal(`${this.label}_modal`, this.rootDisplayCell, ...this.size(), {type: ModalType.toolbar});
        this.modal.dragWith(`${this.label}_handle`);
    }
    size(){
        let isHor = (this.state == TBState.dockedInVertical || this.state == TBState.modalWasDockedInVer)
        let width = (isHor) ? this.width*this.displayCells.length+this.checkerSize : this.width;
        let height = (isHor) ? this.height : this.height*this.displayCells.length+this.checkerSize;
        return [width,height];
    }
    toggleDirection(e:MouseEvent){
        if (this.state == TBState.modalWasDockedInHor || this.state == TBState.modalWasDockedInVer){
            this.state = (this.state == TBState.modalWasDockedInHor) ? TBState.modalWasDockedInVer : TBState.modalWasDockedInHor;
            this.resizeForModal();
            Handler.update();
        }
    }
    resizeForModal() {
        let isHor = (this.state == TBState.modalWasDockedInVer)
        this.rootDisplayCell.displaygroup.ishor = isHor;
        this.rootDisplayCell.displaygroup.dim = `${(isHor) ? this.height : this.width}px`;

        let cellArray = this.rootDisplayCell.displaygroup.cellArray;
        for (let index = 1; index < cellArray.length; index++) 
            cellArray[index].dim = `${(isHor) ? this.width : this.height}px`;

        let [width, height] = this.size();
        this.modal.coord.assign(undefined, undefined, width, height);
    }
    resizeFordock() {
        let isHor = (this.state == TBState.dockedInVertical);
        this.rootDisplayCell.displaygroup.ishor = isHor;
        this.rootDisplayCell.dim = `${(isHor) ? this.height : this.width}px`;

        let cellArray = this.rootDisplayCell.displaygroup.cellArray;
        for (let index = 1; index < cellArray.length; index++) 
            cellArray[index].dim = `${(isHor) ? this.width : this.height}px`;
    }
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
        if (parentDisplaygroup) {
            if (parentDisplaygroup != this.parentDisplayGroup){
                // This only happens when docked at start!
                this.parentDisplayGroup = parentDisplaygroup;

                this.modal.hide();
                let ishor = parentDisplaygroup.ishor;
                this.state = (ishor) ? TBState.dockedInHorizontal :TBState.dockedInVertical;
                this.resizeFordock();
            }
        }
    }
}
function toolBar(...Arguments:any) {
    let overlay=new Overlay("ToolBar", ...Arguments);
    let newToolBar = <ToolBar>overlay.returnObj;
    let parentDisplaycell = newToolBar.rootDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["ToolBar"] = ToolBar;