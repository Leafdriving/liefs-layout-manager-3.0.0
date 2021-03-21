// import {Base} from './Base';
// import {Css, css} from './Css';
// import {DisplayCell, I} from './DisplayCell';
// import {Handler, H} from './Handler';
// import {Coord} from './Coord';
// import {DisplayGroup, v, h} from './DisplayGroup';
// import {events, Events} from './Events';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';
enum ModalType {
    winModal = "winModal",
    toolbar = "toolbar",
    other = "other",
}

class Modal extends Base {
    static closeCss = css("closeCss",`-moz-box-sizing: border-box;
                                      -webkit-box-sizing: border-box;
                                      border: 1px solid black;background:white;`);
    static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
    static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
   </svg>`;
    static labelNo = 0;
    static instances:Modal[] = [];
    static activeInstances:Modal[] = [];
    static x:number;
    static y:number;
    static offset:{x:number, y:number} // used during move Modal
    static movingInstace:Modal;        // undefined if not moving
    static setSize(THIS:Modal, ...numbers:number[]) {
        let [vpX, vpY] = pf.viewport();
        let numberOfArgs = numbers.length;
        let x:number, y:number, width:number, height:number;
        if (numberOfArgs >= 2 && numberOfArgs < 4) {
            width=numbers[0];
            height=numbers[1];
            x = (vpX - width)/2;
            y = (vpY - height)/2;
            THIS.coord.assign(x, y, width, height, 0, 0, vpX, vpY);
        } else if (numberOfArgs >= 4) {
            THIS.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3], 0, 0, vpX, vpY);
        } else {
            THIS.coord.assign(Math.round(vpX/4), Math.round(vpY/4), Math.round(vpX/2), Math.round(vpY/2), 0, 0, vpX, vpY);
        }
    }
    static events(THIS:Modal){
        return events({ondrag: 
               {onDown : function(){
                   Modal.movingInstace = THIS;
                   window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
                   return Modal.startMoveModal(THIS)},
                onMove : function(offset:{x:number, y:number}) {return Modal.moveModal(THIS, offset)},
                onUp   : function(offset:{x:number, y:number}) {
                    Modal.movingInstace = undefined;
                    window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
                }
            }});
    };
    static startMoveModal(THIS:Modal){
        THIS.handler.toTop()
        Modal.x = THIS.handler.coord.x;
        Modal.y = THIS.handler.coord.y;
    }
    static moveModal(THIS:Modal, offset:{x:number, y:number}){
        let handler = THIS.handler
        Modal.offset = offset;
        let [width, height]=pf.viewport()
        let x=Modal.x + offset["x"];
        if (x < 0) x = 0;
        if (x + handler.coord.width > width) x = width - handler.coord.width;
        handler.coord.x = x;

        let y=Modal.y + offset["y"]
        if (y < 0) y = 0;
        if (y + handler.coord.height > height) y = height - handler.coord.height;
        handler.coord.y = y;
        Handler.update();
    }
    //static event = new Event('ModalDropped');
    static defaults = {type:ModalType.other}
    static argMap = {
        string : ["label"],
        DisplayCell : ["rootDisplayCell"],
    }
    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    rootDisplayCell: DisplayCell;
    handler:Handler
    type: ModalType;
    get coord():Coord {return this.handler.coord}
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Modal.makeLabel(this);

        this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        if ("number" in this.retArgs){
            this.setSize(...this.retArgs["number"]);
        } else this.setSize();
    }
    setSize(...numbers:number[]){Modal.setSize(this, ...numbers)}
    show(){Handler.activate(this.handler);Handler.update();}
    hide(){this.handler.pop();}
    isShown(){return Handler.isActive(this.handler)}
    dragWith(...Arguments:any){
        let retArgs = BaseF.argumentsByType(Arguments);
        let htmlblock:HtmlBlock;
        if ("string" in retArgs) htmlblock = HtmlBlock.byLabel(retArgs["string"][0])
        else if ("HtmlBlock" in retArgs) htmlblock = retArgs["HtmlBlock"][0];
        else if ("DisplayCell" in retArgs) htmlblock = retArgs["DisplayCell"][0].htmlBlock;


        //console.log("htmlblock.events", htmlblock.events);
        //console.log("Modal.events(this)", Modal.events(this));

        let modalEvents = Modal.events(this);
        if (htmlblock){
            if (htmlblock.events)
                htmlblock.events.actions["ondrag"] = modalEvents.actions["ondrag"];
            else
                htmlblock.events = Modal.events(this);
            if (this.isShown()){this.hide();this.show()}
        }
    }
    closeWith(...Arguments:any){
        let THIS = this;
        let retArgs = BaseF.argumentsByType(Arguments);
        let htmlblock:HtmlBlock;
        if ("string" in retArgs) htmlblock = HtmlBlock.byLabel(retArgs["string"][0])
        else if ("HtmlBlock" in retArgs) htmlblock = retArgs["HtmlBlock"][0];
        else if ("DisplayCell" in retArgs) htmlblock = retArgs["DisplayCell"][0].htmlBlock;
        
        if (htmlblock){
            htmlblock.events = events({onclick:function(){THIS.hide()}});
            if (this.isShown()){this.hide();this.show()}
        }
    }
}

class winModal extends Base {
    static titleCss = css("modalTitle",`-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
    border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`)
    static labelNo = 0;
    static instances:winModal[] = [];
    static activeInstances:winModal[] = [];
    static defaults = {headerHeight: 20, buttonsHeight: 50, footerHeight:20, headerText:"Window", bodyText:"Body"}
    static argMap = {
        string : ["label"],
    }
    retArgs:ArgsObj;   // <- this will appear
    label:string;

    rootDisplayCell: DisplayCell;

    header: DisplayCell;
    headerHeight: number;
    headerText:string;

    body: DisplayCell;
    bodyText: string;

    // buttons: DisplayCell;
    // buttonsHeight:number;

    footer: DisplayCell;
    footerHeight:number;
    footerText:string;

    modal: Modal;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        winModal.makeLabel(this);
        this.build()
    }
    buildClose(): DisplayCell {
        return I(`${this.label}_close`, Modal.closeSVG, Modal.closeCss, `${this.headerHeight}px`);
    }
    buildHeader(){
        this.header =  h(`${this.label}_header`, `${this.headerHeight}px`,
            I(`${this.label}_title`, this.headerText, winModal.titleCss),
            this.buildClose(),
        )
        return this.header;
    }
    buildBody(){
        this.body = I(`${this.label}_body`, this.bodyText, Modal.closeCss)
        return this.body;
    }
    buildFooter(){
        this.footer = I(`${this.label}_footer`, this.footerText, `${this.footerHeight}px`);
        return this.footer;
    }
    build(){
        this.buildHeader();
        this.buildBody();
        if (this.footerText) this.buildFooter();
        

        let cells:DisplayCell[] = [this.header, this.body];
        if (this.footer) cells.push(this.footer);
        
        this.rootDisplayCell = v(`${this.label}_V`, ...cells);
        let numbers = this.retArgs["number"];
        
        if (!numbers) numbers = [];
        this.modal = new Modal(`${this.label}_modal`, this.rootDisplayCell, ...numbers, {type: ModalType.winModal});
        this.modal.dragWith(`${this.label}_title`);
        this.modal.closeWith(`${this.label}_close`);
        this.modal.show();
    }
}








// class Modal extends Base {
//     static instances:Modal[] = [];
//     static activeInstances:Modal[] = [];

//     static headerCss:Css = css("HeaderTitle","background-color:blue;color:white;text-align: center;border: 1px solid black;cursor: -webkit-grab; cursor: grab;")
//     static footerCss:Css = css("FooterTitle","background-color:white;color:black;border: 1px solid black;");
//     static closeCss:Css = css("Close","background-color:white;color:black;border: 1px solid black;font-size: 20px;");
//     static closeCssHover:Css = css("Close:hover","background-color:red;color:white;border: 1px solid black;font-size: 20px;");
//     static bodyCss:Css = css("ModalBody","background-color:white;border: 1px solid black;");
//     static optionsCss:Css = css("ModalOptions","background-color:white;border: 1px solid black;display: flex;justify-content: center;align-items: center;");
//     static defaults = {
//         showHeader : true, showFooter: false, resizeable : true, showClose: true, showOptions: true,
//         headerHeight: 20, footerHeight : 20, headerTitle:"",footerTitle:"" ,  innerHTML:"", optionsHeight: 30,
//     }
//     static argMap = {
//         string : ["label", "innerHTML", "headerTitle", "footerTitle"],
//         DisplayCell: ["bodyCell", "optionsCell", "footerCell", "headerCell"],
//         Coord: ["coord", "withinCoord"]
//     }
//     static x:number; // used during move Modal
//     static y:number; // used during move Modal
//     static offset:{x:number, y:number} // used during move Modal
//     static movingInstace:Modal;    // used during move Modal
//     label:string;
//     headerTitle:string;
//     footerTitle:string;
//     innerHTML:string;

//     fullCell:DisplayCell;
//     headerCell:DisplayCell;
//     bodyCell:DisplayCell;
//     optionsCell:DisplayCell;
//     footerCell:DisplayCell;

//     headerHeight: number;
//     optionsHeight: number;
//     footerHeight: number;

//     showHeader:boolean;
//     showClose:boolean;
//     showFooter:boolean;
//     showOptions:boolean;
//     resizeable:boolean;

//     handler: Handler;
//     coord:Coord;
//     withinCoord: Coord;
// //////////////////////////////whats a withinCoord Doing Herer????????

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         if ("number" in this.retArgs){
//             this.setSize(...this.retArgs["number"]);
//         } 
//         if (!this.coord) {
//             let [vpX, vpY] = pf.viewport();
//             this.coord = new Coord( Math.round(vpX/4), Math.round(vpY/4), Math.round(vpX/2), Math.round(vpY/2));
//             this.coord.within.x = this.coord.within.y = 0;
//             this.coord.within.width = vpX;
//             this.coord.within.height = vpY;
//         }
//         if (!this.withinCoord) {
//             this.withinCoord = Handler.screenSizeCoord;
//             // this.withinCoord = (Handler.activeInstances.length) ? Handler.activeInstances[0].rootCell.coord
//             //                                                     : Handler.screenSizeCoord;
//         }

//         if (!this.fullCell) {
//             if (!this.bodyCell){this.bodyCell = I(this.label, this.innerHTML, Modal.bodyCss);}
//             if (this.footerTitle) {this.showFooter = true}
//             Modal.makeLabel(this); // see Base.ts
//             this.build();
//         }
//         this.handler = H(`${this.label}_h`,v(`${this.label}_MODAL`, this.fullCell), this.coord, false, this.preRenderCallback.bind(this));
//     }
//     setSize(...numbers:number[]) {
//         let [vpX, vpY] = pf.viewport();
//         let numberOfArgs = numbers.length;
//         let x:number, y:number, width:number, height:number;
//         if (numberOfArgs >= 2 && numberOfArgs < 4) {
//             if (!this.coord) this.coord = new Coord();
//             width=numbers[0];
//             height=numbers[1];
//             x = (vpX - width)/2;
//             y = (vpY - height)/2;
//             this.coord.assign(x, y, width, height, 0, 0, vpX, vpY);
//             // console.log("Two Input");this.coord.log();
//         } else if (numberOfArgs >= 4) {
//             if (!this.coord) this.coord = new Coord();
//             this.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3], 0, 0, vpX, vpY);
//             // console.log("Four Input");this.coord.log();
//         }
//     }
//     setBody(newBody:DisplayCell){
//         let index = this.fullCell.displaygroup.cellArray.indexOf(this.bodyCell);
//         if (index > -1) {
//             this.fullCell.displaygroup.cellArray[index] = newBody;
//             this.bodyCell = newBody;
//         } else console.log("Not Found");
//     }
//     setContent(html:string){this.bodyCell.htmlBlock.innerHTML = html;Handler.update();}
//     setTitle(html:string) {this.headerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html;Handler.update();}
//     setFooter(html:string) {this.footerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html;Handler.update();}
//     buildClose(): DisplayCell {
//         let THIS = this;
//         return I({innerHTML:`<svg viewPort="0 0 ${this.headerHeight} ${this.headerHeight}" version="1.1"
//         xmlns="http://www.w3.org/2000/svg" style="width: ${this.headerHeight}px; height: ${this.headerHeight}px;">
//         <line x1="3" y1="${this.headerHeight-3}" x2="${this.headerHeight-3}" y2="3" 
//           stroke="black" stroke-width="2"/>
//         <line x1="3" y1="3" x2="${this.headerHeight-3}" y2="${this.headerHeight-3}" 
//           stroke="black" stroke-width="2"/></svg>`
//         },
//         Modal.closeCss,
//         `${this.headerHeight}px`,
//         events({onclick:function(){ THIS.hide() }}))
//     }
//     buildHeader(){
//         let THIS = this;
//         if (!this.headerCell){
//             this.headerCell = h(`${this.label}_header`, `${this.headerHeight}px`,
//                                 I(`${this.label}_headerTitle`,
//                                     this.headerTitle,
//                                     Modal.headerCss,
//                                     events({ondrag: {onDown : function(){Modal.movingInstace = THIS;return Modal.startMoveModal(THIS.handler)},
//                                                      onMove : function(offset:{x:number, y:number}) {return Modal.moveModal(THIS.handler, offset)},
//                                                      onUp : function(offset:{x:number, y:number}) {Modal.movingInstace = undefined}
//                                                     }}),
//                                 ));
//             if (this.showClose) {this.headerCell.displaygroup.cellArray.push(this.buildClose())}
//         }
//     }
//     buildFooter(){
//         if (!this.footerCell)
//             this.footerCell = h(`${this.label}_footer`, `${this.footerHeight}px`,
//                                 I(`${this.label}_footerTitle`,this.footerTitle, Modal.footerCss)
//                                 );
//     }
//     buildOptions(){
//         let THIS = this;
//         if (!this.optionsCell)
//             this.optionsCell = h(`${this.label}_options`, `${this.optionsHeight}px`,
//                                 I(`${this.label}_okButton`,
//                                     `<button>OK</button>`,
//                                     Modal.optionsCss,
//                                     events({onclick:function(){ THIS.hide() }}))
//                                 );
//     }
//     buildFull(){
//         this.fullCell = v(`${this.label}_fullCell`, this.bodyCell)
//         if (this.showHeader){
//             this.fullCell.displaygroup.cellArray.unshift(this.headerCell)
//         }
//         if (this.showOptions) {
//             this.fullCell.displaygroup.cellArray.push(this.optionsCell);
//         }
//         if (this.showFooter) {
//             this.fullCell.displaygroup.cellArray.push(this.footerCell);
//         }
//     }
//     build() {
//         this.buildHeader();
//         this.buildFooter();
//         this.buildOptions();
//         this.buildFull();
//     }
//     show(){
//         Handler.activate(this.handler);
//         Handler.update();
//     }
//     hide(){
//         this.handler.pop();
//     }
//     preRenderCallback(handler:Handler){
//         // let within = this.withinCoord.within;
//         // let x = within.x, y=within.y, x2 = within.x + within.width, y2 = within.y + within.height;
//         // let coord = handler.coord;
//         // if (coord.x + coord.width > x2) coord.x = x2 - coord.width;  // something
//         // if (coord.x < x) {coord.width += coord.x;coord.x = x;}       // is off here - make outer margin huge to see!
//         // if (coord.y + coord.height > y2) coord.y = y2 - coord.height;
//         // if (coord.y < y) {coord.height += coord.y;coord.y = y;}
//     }
//     static startMoveModal(handler:Handler){
//         handler.toTop()
//         Modal.x = handler.coord.x;
//         Modal.y = handler.coord.y;

//     }
//     static moveModal(handler:Handler, offset:{x:number, y:number}){
//         Modal.offset = offset;
//         let vp=pf.viewport()
//         let x=Modal.x + offset["x"];
//         if (x < 0) x = 0;
//         if (x+handler.coord.width > vp[0]) x = vp[0] - handler.coord.width;
//         handler.coord.x = x;

//         let y=Modal.y + offset["y"]
//         if (y < 0) y = 0;
//         if (y+handler.coord.height > vp[1]) y = vp[1] - handler.coord.height;
//         handler.coord.y = y;
//         Handler.update();
//     }
// }



// class Stretch extends Base {
//     static labelNo = 0;
//     static instances:Stretch[] = [];
//     static activeInstances:Stretch[] = [];
//     static defaults = {
//         pxSize:10, minWidth:200, minHeight:200,onUpCallBack:function(){},
//     }
//     static argMap = {
//         string : ["label"],
//         Modal: ["parentModal"],
//     }
//     static NWcss = new Css("NWcss",`cursor: nw-resize;`);
//     static NEcss = new Css("NEcss",`cursor: ne-resize;`);
//     static startCoord = new Coord();
//     static corner:string;
//     // retArgs:ArgsObj;   // <- this will appear
//     label: string;

//     parentModal: Modal;
//     parentDisplaycell: DisplayCell;
//     pxSize: number;

//     UL: DisplayCell;
//     UR: DisplayCell;
//     LL: DisplayCell;
//     LR: DisplayCell;

//     minWidth: number;
//     minHeight: number;
//     maxWidth: number;
//     maxHeight: number;

//     onUpCallBack: Function;

//     events(corner:string) {
//         let THIS = this;
//         return events({ondrag: {onDown :
//             function(mouseDiff:object){
//                 let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
//                 Stretch.startCoord.copy(coord); Stretch.corner = corner;
//             },                      onMove :
//             function(diff:{x:number, y:number}) {
//                 let [vpX, vpY] = pf.viewport();
//                 let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
//                 let ssc = Stretch.startCoord;
//                 let x:number,y:number,width:number,height:number
//                 switch (Stretch.corner) {
//                     case "UL":
//                         width = ssc.width - diff.x;
//                         if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
//                         height = ssc.height - diff.y;
//                         if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
//                         x = ssc.x + diff.x;
//                         if (x < 0) {width += x;x = 0;}
//                         y = ssc.y + diff.y;
//                         if (y < 0) {height += y;y = 0;}
//                         break;
//                     case "UR":
//                         x= ssc.x;
//                         width = ssc.width + diff.x;
//                         if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
//                         if (x + width > vpX) {width += (vpX - (x+width));}
//                         height = ssc.height - diff.y;
//                         if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
//                         y = ssc.y + diff.y;
//                         if (y < 0) {height += y;y = 0;}
//                         break;
//                     case "LL":
//                         width = ssc.width - diff.x;
//                         if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
//                         x = ssc.x + diff.x;
//                         if (x < 0) {width += x;x = 0;}
//                         y = ssc.y; 
//                         height = ssc.height + diff.y;
//                         if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
//                         if (height + y > vpY) {height = vpY - y;}
//                         break;
//                     case "LR":
//                         x=ssc.x; y=ssc.y;
//                         width = ssc.width + diff.x;
//                         if (width < THIS.minWidth) width = THIS.maxWidth;
//                         if (width + x > vpX) width = vpX - x;
//                         height = ssc.height + diff.y;
//                         if (height < THIS.minHeight) height = THIS.maxHeight;
//                         if (height + y > vpY ) height = vpY - y;
//                         break;
//                     default:
//                         break;
//                 }
//                 coord.assign(x, y, width, height);
//                 Handler.update();
//             },
//             onUp : this.onUpCallBack
//         }})
//     };

//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         if (!this.parentDisplaycell && this.parentModal) this.parentDisplaycell = this.parentModal.fullCell;
//         this.UL = I(`${this.label}_UL`, Stretch.NWcss, this.events("UL"));
//         this.UR = I(`${this.label}_UR`, Stretch.NEcss, this.events("UR"));
//         this.LL = I(`${this.label}_LL`, Stretch.NEcss, this.events("LL"));
//         this.LR = I(`${this.label}_LR`, Stretch.NWcss, this.events("LR"));
//         Stretch.makeLabel(this);
//     }

//     render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
//         if (!derender) {
//             let coord = this.parentDisplaycell.coord;
//             this.UL.coord.assign(coord.x, coord.y, this.pxSize, this.pxSize,
//                                     coord.within.x, coord.within.y, coord.within.width, coord.within.height,
//                                     coord.zindex + Handler.zindexIncrement);

//             this.UR.coord.assign(coord.x+coord.width-this.pxSize+1 , coord.y, this.pxSize, this.pxSize,
//                 coord.within.x, coord.within.y, coord.within.width, coord.within.height,
//                 coord.zindex + Handler.zindexIncrement);

//             this.LL.coord.assign(coord.x, coord.y+coord.height-this.pxSize+1, this.pxSize, this.pxSize,
//                 coord.within.x, coord.within.y, coord.within.width, coord.within.height,
//                 coord.zindex + Handler.zindexIncrement);

//             this.LR.coord.assign(coord.x+coord.width-this.pxSize+1, coord.y+coord.height-this.pxSize+1, this.pxSize, this.pxSize,
//                 coord.within.x, coord.within.y, coord.within.width, coord.within.height,
//                 coord.zindex + Handler.zindexIncrement);                
//         }
//         let array = [this.UL, this.UR, this.LL, this.LR];
//         for (let index = 0; index < array.length; index++) 
//             Handler.renderDisplayCell(array[index], undefined, undefined, derender);
//     }
// }
// function stretch(...Arguments:any) {
//     let overlay=new Overlay("Stretch", ...Arguments);
//     let newStretch = <Stretch>overlay.returnObj;
//     let parentDisplaycell = newStretch.parentDisplaycell;
//     parentDisplaycell.addOverlay(overlay);
//     return (newStretch.parentModal) ? newStretch.parentModal : parentDisplaycell;
// }
// Overlay.classes["Stretch"] = Stretch;






// export {Modal, stretch}




// events({ondrag: {onDown :function(xmouseDiff:object){
//     if (pf.isTypePercent(dragbar.parentDisplaycell.dim)) {
//         dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplaycell);
//     }
//     dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplaycell.dim);
// },
// onMove :function(xmouseDiff:object){
//     let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"]: xmouseDiff["y"])*((dragbar.isLast) ? -1 :1);
//     if (newdim > dragbar.max) newdim = dragbar.max;
//     if (newdim < dragbar.min) newdim = dragbar.min;
//     dragbar.parentDisplaycell.dim = `${newdim}px`;
//     Handler.update();
// },
// // onUp: function(ouxmouseDifftput:object){}
// } })