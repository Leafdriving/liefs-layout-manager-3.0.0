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
        // if (Dockable.instances.length == 1) {
            window.addEventListener('ModalDropped', function (e:CustomEvent) {THIS.dropped(e)}, false);
            window.addEventListener('ModalStartDrag', function (e:CustomEvent) {THIS.undock(e)}, false);
            
        // }
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
        console.log("Dropped")
        let modal = e.detail;
        let toolbar = <ToolBar>ToolBar.byLabel( modal.label.slice(0, -6) );
        if (this.dropZones) {
            console.log("Has Zones");
            console.log(Dockable.DockableOwner, this.label)
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
    render(unuseddisplaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (Modal.movingInstace && Modal.movingInstace.type == ModalType.toolbar) {
            let modal = Modal.movingInstace;
            let toolbar = ToolBar.byLabel( modal.label.slice(0, -6) );
            let ishor = this.displaygroup.ishor;
            
            let cellArray = this.displaygroup.cellArray;
            if (!this.dropZones) {                                       // define DropZones
                this.dropZones = [];
                for (let index = 0; index < cellArray.length; index++) {
                    let displaycell  = cellArray[index];  // note scope is lost each loop
                    let newCoord = new Coord();
                    newCoord.copy( displaycell.coord );
                    newCoord.assign(undefined, undefined,
                                (ishor) ? toolbar.width : undefined,
                                (ishor) ? undefined : toolbar.height);
                    this.dropZones.push(newCoord);
                }
                let displaycell = cellArray[cellArray.length-1];
                let newCoord = new Coord();
                newCoord.copy( displaycell.coord );

                newCoord.assign((ishor) ? displaycell.coord.x + displaycell.coord.width - toolbar.width : undefined,
                                (ishor) ? undefined : displaycell.coord.y + displaycell.coord.height - toolbar.height,
                                (ishor) ? toolbar.width : undefined,
                                (ishor) ? undefined : toolbar.height );
                
                // newCoord.assign((ishor) ? displaycell.coord.width - toolbar.width : undefined,
                //                 (ishor) ? undefined : displaycell.coord.height - toolbar.height,
                //                 (ishor) ? toolbar.width : undefined,
                //                 (ishor) ? undefined : toolbar.height );
                this.dropZones.push(newCoord);
                // console.log("DropZones", this.dropZones)
            }

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
        } //else {
            //if (this.dropZones) {
            //    console.log("DOCK!")
                // if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
                //     let toolbar = Dockable.activeToolbar;
                //     toolbar.modal_h.hide();
                //     toolbar.modal_v.hide();
                //     let ishor = this.displaygroup.ishor;
                //     toolbar.state = (ishor) ? ToolBarState.dockedInHorizontal :ToolBarState.dockedInVertical;
                //     this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = (ishor) ? toolbar.rootDisplayCell_v : toolbar.rootDisplayCell_h;
                //     Dockable.activeDropZoneIndex = undefined;
                //     toolbar.isDocked = true;
                //     toolbar.parentDisplayGroup = this.displaygroup;
                //     console.log("newHome", this.displaygroup)
                // }
                // this.dropZones = undefined;
                // Handler.update();
            //}
        //}
    }
}

        // console.log("Moving?", ToolBar.isMoving)
        // let ishor = this.displaygroup.ishor;
        // if (ToolBar.isMoving && !ToolBar.activeInstace.isDocked ){
        //     let toolbar = Dockable.activeToolbar = ToolBar.activeInstace;
        //     let cellArray = this.displaygroup.cellArray;
        //     if (!this.dropZones) {                                       // define DropZones
        //         this.dropZones = [];
        //         for (let index = 0; index < cellArray.length; index++) {
        //             let displaycell  = cellArray[index];  // note scope is lost each loop
        //             let newCoord = new Coord();
        //             newCoord.copy( displaycell.coord );
        //             newCoord.assign(undefined, undefined,
        //                         (ishor) ? toolbar.width : undefined,
        //                         (ishor) ? undefined : toolbar.height);
        //             this.dropZones.push(newCoord);
        //         }
        //         let displaycell = cellArray[cellArray.length-1];
        //         let newCoord = new Coord();
        //         newCoord.copy( displaycell.coord );
        //         console.log(ishor) ///////////////////////////////////////////
        //         newCoord.assign((ishor) ? displaycell.coord.width - toolbar.width : undefined,
        //                         (ishor) ? undefined : displaycell.coord.height - toolbar.height,
        //                         (ishor) ? toolbar.width : undefined,
        //                         (ishor) ? undefined : toolbar.height );
        //         this.dropZones.push(newCoord);
        //         console.log("DropZones", this.dropZones)
        //     }                                                                       // ok Zones Assigned! loop them!
        //     for (let index = 0; index < this.dropZones.length; index++) {
        //         let dropCoord = this.dropZones[index];
        //         if (!toolbar.modal_h.coord.isCoordCompletelyOutside(dropCoord)) { // if hit zone, make zone
        //             if (Dockable.activeDropZoneIndex == undefined){
        //                 Dockable.DockableOwner = this.label;
        //                 Dockable.activeDropZoneIndex = index;
        //                 this.dummy.dim = `${(ishor) ? toolbar.width : toolbar.height}px`;
        //                 cellArray.splice(index, 0, this.dummy);
        //             }
        //         } else {                                                                  // When inactive, pop zone
        //             if (index == Dockable.activeDropZoneIndex && Dockable.DockableOwner == this.label) {
        //                 Dockable.activeDropZoneIndex = undefined;
        //                 cellArray.splice(index, 1);
        //             }
        //         }
        //     }
        // } else {
        //     if (this.dropZones) {
        //         if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
        //             let toolbar = Dockable.activeToolbar;
        //             toolbar.modal_h.hide();
        //             toolbar.modal_v.hide();
        //             let ishor = this.displaygroup.ishor;
        //             toolbar.state = (ishor) ? ToolBarState.dockedInHorizontal :ToolBarState.dockedInVertical;
        //             this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = (ishor) ? toolbar.rootDisplayCell_v : toolbar.rootDisplayCell_h;
        //             Dockable.activeDropZoneIndex = undefined;
        //             toolbar.isDocked = true;
        //             toolbar.parentDisplayGroup = this.displaygroup;
        //             console.log("newHome", this.displaygroup)
        //         }
        //         this.dropZones = undefined;
        //         Handler.update();
        //     }
        // }
    //}

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
        // console.log("Rendered! - so far, do nothing!");
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



// class Dockable extends Base {
//     static labelNo = 0;
//     static instances:Dockable[] = [];
//     static activeInstances:Dockable[] = [];
//     static defaults = { type:"All", }
//     static argMap = {
//         string : ["label", "type"],
//         DisplayCell: ["rootDisplayCell"],
//     }
//     // retArgs:ArgsObj;   // <- this will appear

//     static activeDropZoneIndex:number;
//     static activeToolbar:ToolBar;
//     static DockableOwner:string;
//     dummy:DisplayCell;
//     label: string;
//     type: string;
//     rootDisplayCell: DisplayCell;
//     displaygroup: DisplayGroup;
//     dropZones: Coord[];
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         if (this.rootDisplayCell) this.displaygroup = this.rootDisplayCell.displaygroup;
//         Dockable.makeLabel(this);
//         this.dummy = I(`${this.label}_DockableDummy`);
//     }
//     render(unuseddisplaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
//         // console.log("Moving?", ToolBar.isMoving)
//         let ishor = this.displaygroup.ishor;
//         if (ToolBar.isMoving && !ToolBar.activeInstace.isDocked ){
//             let toolbar = Dockable.activeToolbar = ToolBar.activeInstace;
//             let cellArray = this.displaygroup.cellArray;
//             if (!this.dropZones) {                                       // define DropZones
//                 this.dropZones = [];
//                 for (let index = 0; index < cellArray.length; index++) {
//                     let displaycell  = cellArray[index];  // note scope is lost each loop
//                     let newCoord = new Coord();
//                     newCoord.copy( displaycell.coord );
//                     newCoord.assign(undefined, undefined,
//                                 (ishor) ? toolbar.width : undefined,
//                                 (ishor) ? undefined : toolbar.height);
//                     this.dropZones.push(newCoord);
//                 }
//                 let displaycell = cellArray[cellArray.length-1];
//                 let newCoord = new Coord();
//                 newCoord.copy( displaycell.coord );
//                 // console.log(ishor) ///////////////////////////////////////////
//                 newCoord.assign((ishor) ? displaycell.coord.width - toolbar.width : undefined,
//                                 (ishor) ? undefined : displaycell.coord.height - toolbar.height,
//                                 (ishor) ? toolbar.width : undefined,
//                                 (ishor) ? undefined : toolbar.height );
//                 this.dropZones.push(newCoord);
//                 //console.log("DropZones", this.dropZones)
//             }                                                                       // ok Zones Assigned! loop them!
//             for (let index = 0; index < this.dropZones.length; index++) {
//                 let dropCoord = this.dropZones[index];
//                 if (!toolbar.modal_h.coord.isCoordCompletelyOutside(dropCoord)) { // if hit zone, make zone
//                     if (Dockable.activeDropZoneIndex == undefined){
//                         Dockable.DockableOwner = this.label;
//                         Dockable.activeDropZoneIndex = index;
//                         this.dummy.dim = `${(ishor) ? toolbar.width : toolbar.height}px`;
//                         cellArray.splice(index, 0, this.dummy);
//                     }
//                 } else {                                                                  // When inactive, pop zone
//                     if (index == Dockable.activeDropZoneIndex && Dockable.DockableOwner == this.label) {
//                         Dockable.activeDropZoneIndex = undefined;
//                         cellArray.splice(index, 1);
//                     }
//                 }
//             }
//         } else {
//             if (this.dropZones) {
//                 if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
//                     let toolbar = Dockable.activeToolbar;
//                     toolbar.modal_h.hide();
//                     toolbar.modal_v.hide();
//                     let ishor = this.displaygroup.ishor;
//                     toolbar.state = (ishor) ? ToolBarState.dockedInHorizontal :ToolBarState.dockedInVertical;
//                     this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = (ishor) ? toolbar.rootDisplayCell_v : toolbar.rootDisplayCell_h;
//                     Dockable.activeDropZoneIndex = undefined;
//                     toolbar.isDocked = true;
//                     toolbar.parentDisplayGroup = this.displaygroup;
//                     // console.log("newHome", this.displaygroup)
//                 }
//                 this.dropZones = undefined;
//                 Handler.update();
//             }
//         }
//     }
// }
// function dockable(...Arguments:any) {
//     let overlay=new Overlay("Dockable", ...Arguments);
//     let newDockable = <Dockable>overlay.returnObj;
//     let parentDisplaycell = newDockable.rootDisplayCell;
//     parentDisplaycell.addOverlay(overlay);
//     return parentDisplaycell;
// }
// Overlay.classes["Dockable"] = Dockable;



// class ToolBar extends Base {
//     static labelNo = 0;
//     static instances:ToolBar[] = [];
//     static activeInstances:ToolBar[] = [];

//     static defaults = { sizePx: 25, isDocked: false, isHor:true, type:"All", state:ToolBarState.modalWasDockedInVer}
//     static argMap = {
//         string : ["label", "type"],              // DisplayCell : see constructor,
//         number: ["width", "height"],
//     }
//     static triggerUndockDistance:number =  15;
//     static isMoving:boolean =  false;
//     static activeInstace: ToolBar;
//     static checkerSize:number = 10;

//     // retArgs:ArgsObj;   // <- this will appear
//     state: ToolBarState;

//     label:string;
//     type:string;

//     height: number;
//     width: number;

//     parentDisplayGroup: DisplayGroup;

//     rootDisplayCell_h: DisplayCell;
//     rootDisplayCell_v: DisplayCell;
//     displaycells_h: DisplayCell[];
//     displaycells_v: DisplayCell[];
//     spacer:DisplayCell;

//     modal_h: Modal;
//     modal_v: Modal;
//     isDocked: boolean;
//     // isHor: boolean;
//     coord: Coord;

//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         ToolBar.makeLabel(this);
//         this.spacer = I(`${this.label}_toolbar_spacer`);

//         if ("DisplayCell" in this.retArgs) {
//             this.displaycells_h = this.retArgs["DisplayCell"];
//             for (let index = 0; index < this.displaycells_h.length; index++) {
//                 let displaycell = this.displaycells_h[index];
//                 if (!displaycell.dim) displaycell.dim = `${this.width}px`;
//             }
//             this.displaycells_v = [];
//             for (let index = 0; index < this.displaycells_h.length; index++) {
//                 let displaycell = new DisplayCell( this.displaycells_h[index].label+"_V_",
//                                                    this.displaycells_h[index].htmlBlock,
//                                                    `${this.height}px`);
//                 this.displaycells_v.push(displaycell);
//             }
//         }

//         if (!this.rootDisplayCell_h) this.build();
//         this.makeModal();
//     }
//     static startMoveToolbar(THIS: ToolBar, handler:Handler){
//         Modal.movingInstace = (THIS.state == ToolBarState.dockedInVertical) ? THIS.modal_h: THIS.modal_v;
//     }
//     static moveToolbar(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
//         let displaycell = (THIS.state == ToolBarState.dockedInVertical) ? THIS.rootDisplayCell_h : THIS.rootDisplayCell_v;
//         displaycell.coord.setOffset(offset.x, offset.y);
//         if ( Math.abs(offset["x"]) > ToolBar.triggerUndockDistance ||  Math.abs(offset["y"]) > ToolBar.triggerUndockDistance){
//             displaycell.coord.setOffset();
//             ToolBar.undock(THIS, handler, offset);
//         }
//         Handler.update();
//     }
//     static undock(THIS: ToolBar, handler: Handler, offset:{x:number, y:number}){
//         console.log("Before",THIS.parentDisplayGroup.label)
//         console.log("Before",THIS.parentDisplayGroup.cellArray)
//         let ishor = THIS.parentDisplayGroup.ishor;
//         let vp = pf.viewport();
//         let modal:Modal;
//         let displaycell: DisplayCell;

//         if (ishor) {
//             displaycell = THIS.rootDisplayCell_v;
//             modal = THIS.modal_v;
//         } else {
//             displaycell = THIS.rootDisplayCell_h;
//             modal = THIS.modal_h;
//         }

//         let index = THIS.parentDisplayGroup.cellArray.indexOf(displaycell);
//         console.log("index", index)
//         if (index > -1) THIS.parentDisplayGroup.cellArray.splice(index, 1);  // pop from previous DisplayGroup
//         else console.log("Not Found");
//         console.log("Middle",THIS.parentDisplayGroup.cellArray)
//         THIS.isDocked = false;                                                // Mark as unDocked
//         THIS.state = (ishor) ? ToolBarState.modalWasDockedInHor : ToolBarState.modalWasDockedInVer;

//         Modal.x = displaycell.coord.x;
//         Modal.y = displaycell.coord.y

//         let [width, height] = THIS.setModalSize();
//         let x = Modal.x + offset.x;
//         let y = Modal.y + offset.y;
//         modal.setSize(x, y, width, height);
//         modal.show();
//         console.log("After",THIS.parentDisplayGroup.cellArray)

//     }
//     show(){if (!this.isDocked) this.modal_h.show()}
//     hide(){if (!this.isDocked) this.modal_h.hide()}
//     setArrayPx(value:number) {
//         for (let index = 1; index < this.displaycells_h.length; index++)
//             this.displaycells_h[index].dim = `${value}px`;
//     }
//     build(){
//         let THIS = this;
//         let EVENTSh = events({ondrag: {
//             onDown : function(){
//                 console.log("hDown");
//                 ToolBar.isMoving = true; ToolBar.activeInstace = THIS;
//                 if (THIS.isDocked)
//                     ToolBar.startMoveToolbar(THIS, THIS.modal_h.handler)
//                 else
//                     Modal.startMoveModal(THIS.modal_h.handler);
//             },
//             onMove : function(offset:{x:number, y:number}) {
//                 if (THIS.isDocked)
//                     ToolBar.moveToolbar(THIS, THIS.modal_h.handler, offset);
//                 else
//                     Modal.moveModal(THIS.modal_h.handler, offset);
//             },
//             onUp : function(offset:{x:number, y:number}) {
//                 ToolBar.isMoving = false; ToolBar.activeInstace = undefined; Modal.movingInstace = undefined;
//                 if (THIS.isDocked) {
//                     THIS.rootDisplayCell_h.coord.setOffset();
//                     THIS.rootDisplayCell_v.coord.setOffset();
//                 }
//                 Handler.update();
//             }
//                                   }})
//         let EVENTSv = events({ondrag: {
//         onDown : function(){
//             console.log("vDown");
//             ToolBar.isMoving = true; ToolBar.activeInstace = THIS;
//             if (THIS.isDocked)
//                 ToolBar.startMoveToolbar(THIS, THIS.modal_v.handler)
//             else
//                 Modal.startMoveModal(THIS.modal_v.handler);
//         },
//         onMove : function(offset:{x:number, y:number}) {
//             if (THIS.isDocked)
//                 ToolBar.moveToolbar(THIS, THIS.modal_v.handler, offset);
//             else
//                 Modal.moveModal(THIS.modal_v.handler, offset);
//         },
//         onUp : function(offset:{x:number, y:number}) {
//             ToolBar.isMoving = false; ToolBar.activeInstace = undefined; Modal.movingInstace = undefined;
//             if (THIS.isDocked) {
//                 THIS.rootDisplayCell_v.coord.setOffset();
//             }
//             Handler.update();
//         }
//                                 }})                                  
//         let checker_h = I(`${this.label}_checkerh`, DefaultTheme.llm_checker, `${ToolBar.checkerSize}px`,EVENTSh);
//         this.rootDisplayCell_h = h(`${this.label}_hBar`, `${this.height}px`);
//         this.rootDisplayCell_h.displaygroup.cellArray = this.displaycells_h;

//         let checker_v = I(`${this.label}_checkerv`, DefaultTheme.llm_checker, `${ToolBar.checkerSize}px`,EVENTSv);
//         this.rootDisplayCell_v = v(`${this.label}_vBar`, `${this.width}px`);
//         this.rootDisplayCell_v.displaygroup.cellArray = this.displaycells_v;
        
//         this.rootDisplayCell_h.displaygroup.cellArray.unshift(checker_h);
//         this.rootDisplayCell_v.displaygroup.cellArray.unshift(checker_v);
//     }
//     makeModal(){
//         this.modal_h = new Modal(`${this.label}_modal_h`,
//                         {fullCell:this.rootDisplayCell_h},
//                         this.displaycells_h.length * this.width + ToolBar.checkerSize,
//                         this.height,
//         );
//         this.modal_v = new Modal(`${this.label}_modal_b`,
//                         {fullCell:this.rootDisplayCell_v},
//                         this.width,
//                         this.displaycells_v.length * this.height+ ToolBar.checkerSize
//         );
//     }
//     setModalSize():  [number, number] {
//         let width = (this.state == ToolBarState.modalWasDockedInHor) ? this.width 
//                                                                     : this.displaycells_h.length * this.width + ToolBar.checkerSize;
//         let height = (this.state == ToolBarState.modalWasDockedInHor) ? this.displaycells_h.length * this.height+ ToolBar.checkerSize
//                                                                     : this.height;
//         return [width, height];
//     }
//     // alignToolbarToDiplayGroup(oldState:ToolBarState) {
//     //     if (oldState == ToolBarState.modalWasDockedInHor && this.state == ToolBarState.dockedInVertical) {
//     //         this.setArrayPx(this.width);
//     //         this.rootDisplayCell_h.displaygroup.ishor = true;
//     //         this.rootDisplayCell_h.dim = `${this.height}px`;
//     //         // console.log("height set to ", this.height)
//     //     }
//     //     if (oldState == ToolBarState.modalWasDockedInVer && this.state == ToolBarState.dockedInHorizontal) {
//     //         this.setArrayPx(this.height);
//     //         this.rootDisplayCell_h.displaygroup.ishor = false;
//     //         this.rootDisplayCell_h.dim = `${this.width}px`;
//     //         // console.log("Width set to ", this.width)
//     //     }
//     // }
//     evalState(){
//         let newState: ToolBarState;
//         if (this.parentDisplayGroup) {
//             let isModal = this.parentDisplayGroup.label.endsWith("_MODAL");
//             if (isModal) {
//                 if (this.state == ToolBarState.dockedInHorizontal) newState = ToolBarState.modalWasDockedInHor;
//                 else if (this.state == ToolBarState.dockedInVertical) newState = ToolBarState.modalWasDockedInVer;
//                 else newState = this.state;
//             } else {
//                 newState = (this.parentDisplayGroup.ishor) ? ToolBarState.dockedInHorizontal : ToolBarState.dockedInVertical
//             }
//         }
//         return newState;
//     }
//     render(displaycell:DisplayCell, parentDisplayGroup: DisplayGroup, index:number, derender:boolean){
//         if (parentDisplayGroup) {
//             if (this.parentDisplayGroup != parentDisplayGroup) {
//                 this.parentDisplayGroup = parentDisplayGroup;
//                 console.log("Parent Now: "+ this.parentDisplayGroup.label)
//             }
//             let wasState = this.state;
//             let newState =  this.evalState();

//             if (newState && wasState != newState) {  // respond to state change
//                 this.state = newState;
//                 //let wasDocked = this.isDocked;
//                 this.isDocked = (this.state == ToolBarState.dockedInHorizontal || this.state == ToolBarState.dockedInVertical);
//                 // let wasHor = (wasState == ToolBarState.dockedInVertical || wasState == ToolBarState.modalWasDockedInVer);
//                 // let isHor = (this.state == ToolBarState.dockedInVertical || this.state == ToolBarState.modalWasDockedInVer);

//                 // if (wasHor != isHor) {

//                 //     this.setArrayPx( (isHor) ? this.width : this.height );
//                 //     this.rootDisplayCell_h.displaygroup.ishor = isHor;
//                 // }
//                 // if (wasDocked != this.isDocked) {

//                 // }
//             }
//         }
//     }
// }
// function tool_bar(...Arguments:any) {
//     let overlay=new Overlay("ToolBar", ...Arguments);
//     let newToolBar = <ToolBar>overlay.returnObj;
//     let parentDisplaycell = newToolBar.rootDisplayCell_h;
//     parentDisplaycell.addOverlay(overlay);
//     return parentDisplaycell;
// }
// Overlay.classes["ToolBar"] = ToolBar;
// export {tool_bar, ToolBar, Dockable, dockable}