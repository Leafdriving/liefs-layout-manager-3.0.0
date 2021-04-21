
class Modal extends Component {
    static labelNo = 0;
    static instances:{[key: string]: Modal;} = {};
    static activeInstances:{[key: string]: Modal;} = {};
    static closeCss = css("closeCss",`-moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;
                                    border: 1px solid black;background:white;`);
    static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
    static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
   </svg>`;
    static movingInstace:Modal;

    static offset:{x:number, y:number} // used during move Modal
    static onDown(){
        let THIS = this as unknown as Modal;
        window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
        Modal.movingInstace = THIS;Modal.x = THIS.coord.x;Modal.y = THIS.coord.y;
    }
    static onMove(mouseEvent:MouseEvent, offset:{x:number, y:number}){
        let THIS = this as unknown as Modal;
        THIS.coord.x = Modal.x + offset.x;THIS.coord.y = Modal.y + offset.y;
        Render.scheduleUpdate();
    }
    static onUp(mouseEvent:MouseEvent, offset:{x:number, y:number}){
        let THIS = this as unknown as Modal;
        Modal.movingInstace = undefined; Modal.x = undefined; Modal.y = undefined;
        window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
    }
    static defaults:{[key: string]: any;} = {sizer:{}}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        DisplayCell:["rootDisplayCell"],
        Coord: ["startCoord"],
    }
    static x:number;
    static y:number;
    // retArgs:objectAny;   // <- this will appear
    rootDisplayCell:DisplayCell;
    label:string;
    node:node_;
    parentDisplayCell:DisplayCell;
    //children: Component[];
    handler:Handler;
    get coord(){return this.handler.coord}
    startCoord:Coord;
    sizer:{ minWidth?:number, maxWidth?:number, minHeight?:number, maxHeight?:number, width?:number, height?:number }
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Modal.makeLabel(this); Modal.instances[this.label] = this;
        this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        this.parentDisplayCell = new DisplayCell(this.label).addComponent(this).addComponent(this.handler)
        if (this.startCoord) {
            this.sizer.width = this.startCoord.width;
            this.sizer.height = this.startCoord.height;
        }
        if ("number" in this.retArgs) {
            let numbers = this.retArgs["number"];
            let qty = numbers.length;
            this.sizer.width = numbers[0];
            if (qty > 1) this.sizer.height = numbers[1];
            if (qty > 2) this.sizer.minWidth = numbers[2];
            if (qty > 3) this.sizer.minHeight = numbers[3];
            if (qty > 4) this.sizer.maxWidth = numbers[4];
            if (qty > 5) this.sizer.maxHeight = numbers[5];
        }
    }
    onConnect():void{
        if (this.startCoord) this.handler.coord.copy(this.startCoord);
        else {
            let ssCoord = Handler.ScreenSizeCoord;
            let width = (this.sizer.width) ? this.sizer.width : Math.round( ssCoord.width/3 );
            let height = (this.sizer.height) ? this.sizer.height : Math.round( ssCoord.height/3 );
            let x = Math.round( (ssCoord.width - width)/2 );
            let y = Math.round( (ssCoord.height - height)/2 );
            this.coord.assign(x, y, width, height, 0, 0, ssCoord.width, ssCoord.height);
        }
    };
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{
        let ssCoord = Handler.ScreenSizeCoord;
        if (this.coord.x2 > ssCoord.width) this.coord.x -= ( this.coord.x2 - ssCoord.width );
        if (this.coord.y2 > ssCoord.height) this.coord.y -= ( this.coord.y2 - ssCoord.height);
        if (this.coord.x < 0) this.coord.x = 0;
        if (this.coord.y < 0) this.coord.y = 0;
        this.coord.within.width = ssCoord.width;
        this.coord.within.height = ssCoord.height;
        return undefined
    };
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        return undefined
    };
    getChild(label:string) {
        for (let index = 0; index < this.children.length; index++) 
            if (this.children[index].label == label) return this.children[index];
        return undefined;
    }
    delete(){}
    show(){
        if (!Handler.activeInstances[this.handler.label]) {
            Handler.activeInstances[this.handler.label] = this.handler;
            Render.scheduleUpdate();
        }
    }
    hide(event:MouseEvent|PointerEvent = undefined){
        if (Handler.activeInstances[this.handler.label]) {
            Render.update(Handler.activeInstances[this.handler.label], true);
            delete Handler.activeInstances[this.handler.label];
        }
    }
    isShown(){return (Handler.activeInstances[this.handler.label]) ? true : false}
    dragWith(...displaycells:DisplayCell[]){
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            const displaycell = displaycells[index];   
            let element=<Element_>displaycell.getComponent("Element_");
            // console.log(element)
            element.addEvents({ondrag:[Modal.onDown.bind(THIS),Modal.onMove.bind(THIS),Modal.onUp.bind(THIS)]});
        }
    }
    closeWith(...displaycells:DisplayCell[]){
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            displaycells[index].addEvents({ onclick: THIS.hide.bind(THIS) });
        }
    }
}

class winModal extends Base {
    static labelNo = 0;
    static instances:{[key: string]: winModal;} = {};
    static activeInstances:{[key: string]: winModal;} = {};
    static defaults:{[key: string]: any;} = {headerHeight:20, titleText:"My Title", innerHTML:"Body"}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label", "titleText", "innerHTML"],
        DisplayCell: ["bodyDisplayCell"],
    }
    static titleCss = css(`titleCss`,`background:#00CED1;cursor:pointer;text-align: center;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`, {type:"llm"});
    static closeSVGCss = css(`closeIcon`,`stroke: black;background:white;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`,`stroke: white;background:red`,
    {type:"llm"});
    static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
      </svg>`;
    static whiteBGCss = css(`whiteBGCss`,`background:white;box-sizing: border-box;-moz-box-sizing: border-box;
                                            -webkit-box-sizing: border-box;border: 1px solid black;`)
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[];
    modal:Modal;
    titleText:string;
    innerHTML:string;
    headerHeight:number
    fullDisplayCell:DisplayCell;
    titleDisplayCell:DisplayCell;
    closeDisplayCell:DisplayCell;
    headerDisplayCell:DisplayCell;
    bodyDisplayCell:DisplayCell;
    show(){this.modal.show()}
    hide(){this.modal.hide()}
    

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        winModal.makeLabel(this); winModal.instances[this.label] = this;
        this.build();
        this.modal = new Modal(`${this.label}`, this.fullDisplayCell);
        this.modal.dragWith(this.titleDisplayCell);
        this.modal.closeWith(this.closeDisplayCell);
        this.show();
    }
    build(){
        this.titleDisplayCell = I(`${this.label}_titleCell`, this.titleText, winModal.titleCss);
        this.closeDisplayCell = I(`${this.label}_closeIcon`, winModal.closeSVG, `${this.headerHeight}px`);
        this.headerDisplayCell = h(`${this.label}_header`, `${this.headerHeight}px`,
            this.titleDisplayCell,
            this.closeDisplayCell,
        )
        if (!this.bodyDisplayCell) this.bodyDisplayCell = I(`${this.label}_body`, this.innerHTML, winModal.whiteBGCss);
        this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.bodyDisplayCell);
    }
}





// class Modal extends Base {
// //     static closeCss = css("closeCss",`-moz-box-sizing: border-box;
// //                                       -webkit-box-sizing: border-box;
// //                                       border: 1px solid black;background:white;`);
// //     static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
// //     static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
// //     <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
// //    </svg>`;
//     static labelNo = 0;
//     static instances:Modal[] = [];
//     static activeInstances:Modal[] = [];
//     static x:number;
//     static y:number;
//     static offset:{x:number, y:number} // used during move Modal
//     static movingInstace:Modal;        // undefined if not moving
//     static setSize(THIS:Modal, ...numbers:number[]) {
//         let [vpX, vpY] = pf.viewport();
//         let numberOfArgs = numbers.length;
//         let x:number, y:number, width:number, height:number;
//         if (numberOfArgs >= 2 && numberOfArgs < 4) {
//             width=numbers[0];
//             height=numbers[1];
//             x = (vpX - width)/2;
//             y = (vpY - height)/2;
//             THIS.coord.assign(x, y, width, height, 0, 0, vpX, vpY);
//         } else if (numberOfArgs >= 4) {
//             THIS.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3], 0, 0, vpX, vpY);
//         } else {
//             THIS.coord.assign(Math.round(vpX/4), Math.round(vpY/4), Math.round(vpX/2), Math.round(vpY/2), 0, 0, vpX, vpY);
//         }
//     }
//     static events(THIS:Modal){
//         return events({ondrag: 
//              {onDown: Modal.onDown.bind(THIS),
//                 onMove: Modal.onMove.bind(THIS),
//                 onUp : Modal.onUp.bind(THIS),
//             }});
//     };
//     static onDown(){
//         // console.log("ondown")
//         let THIS = this as unknown as Modal;
//         Modal.movingInstace = THIS;
//         window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
//         return Modal.startMoveModal(THIS)
//     }
    
//     static onMove(offset:{x:number, y:number}){
//         //console.log("onmove")
//         let THIS = this as unknown as Modal;
//         return Modal.moveModal(THIS, offset);
//     }
//     static onUp(offset:{x:number, y:number}){
//         // console.log("onup")
//         let THIS = this as unknown as Modal;
//         Modal.movingInstace = undefined;
//         window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
//     }
//     static startMoveModal(THIS:Modal){
//         THIS.handler.toTop()
//         Modal.x = THIS.handler.coord.x;
//         Modal.y = THIS.handler.coord.y;
//     }
//     static moveModal(THIS:Modal, offset:{x:number, y:number}){
//         let handler = THIS.handler
//         // console.log(handler)
//         Modal.offset = offset;
//         let [width, height]=pf.viewport()
//         let x=Modal.x + offset["x"];
//         if (x < 0) x = 0;
//         if (x + handler.coord.width > width) x = width - handler.coord.width;
//         handler.coord.x = x;

//         let y=Modal.y + offset["y"]
//         if (y < 0) y = 0;
//         if (y + handler.coord.height > height) y = height - handler.coord.height;
//         handler.coord.y = y;
//         // console.log(handler.coord.x, handler.coord.y)
//         Render.update();
//     }
//     static defaults = {type:HandlerType.other}
//     static argMap = {
//         string : ["label"],
//         DisplayCell : ["rootDisplayCell"],
//     }
//     // retArgs:ArgsObj;   // <- this will appear

//     renderNode:node_; // render node

//     label:string;
//     rootDisplayCell: DisplayCell;
//     handler:Handler
//     type: HandlerType;
//     get coord():Coord {return this.handler.coord}
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         Modal.makeLabel(this);
//         this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord(),{type:this.type});
//         if ("number" in this.retArgs){
//             this.setSize(...this.retArgs["number"]);
//         } else this.setSize();
//         if (this.rootDisplayCell.displaygroup && this.type == "winModal") {
//             let dg2 = this.rootDisplayCell.displaygroup.cellArray[1].displaygroup
            
//             let totalPx = DisplayGroup.allPx(dg2);            
//             if (totalPx){
//                 if (dg2.ishor)
//                     this.coord.width = totalPx + pf.pxAsNumber(this.rootDisplayCell.displaygroup.cellArray[0].dim);
//                 else
//                     this.coord.height = totalPx + pf.pxAsNumber(this.rootDisplayCell.displaygroup.cellArray[0].dim);
//             }
//         }
//     }
//     setSize(...numbers:number[]){Modal.setSize(this, ...numbers)}
//     show(){Handler.activate(this.handler);Render.update();}
//     hide(){
//         // console.log("Modal Hide Called");
//         this.handler.pop();
//     }
//     isShown(){return Handler.isActive(this.handler)}
//     dragWith(...Arguments:any){
//         let retArgs = BaseF.argumentsByType(Arguments);
//         let htmlblock:HtmlBlock;
//         if ("string" in retArgs) htmlblock = HtmlBlock.byLabel(retArgs["string"][0])
//         else if ("HtmlBlock" in retArgs) htmlblock = retArgs["HtmlBlock"][0];
//         else if ("DisplayCell" in retArgs) htmlblock = retArgs["DisplayCell"][0].htmlBlock;

//         let modalEvents = Modal.events(this);
//         if (htmlblock){
//             if (htmlblock.events)
//                 htmlblock.events.actions["ondrag"] = modalEvents.actions["ondrag"];
//             else
//                 htmlblock.events = Modal.events(this);
//             if (this.isShown()){this.hide();this.show()}
//         }
//     }
//     closeWith(...Arguments:any){
//         let THIS = this;
//         let retArgs = BaseF.argumentsByType(Arguments);
//         let htmlblock:HtmlBlock;
//         if ("string" in retArgs) htmlblock = HtmlBlock.byLabel(retArgs["string"][0])
//         else if ("HtmlBlock" in retArgs) htmlblock = retArgs["HtmlBlock"][0];
//         else if ("DisplayCell" in retArgs) htmlblock = retArgs["DisplayCell"][0].htmlBlock;
        
//         if (htmlblock){
//             htmlblock.events = events({onclick:function(){
//                 if ("function" in retArgs) retArgs["function"][0](THIS);  // Close Callback executed here!
//                 THIS.hide();
//             }});
//             if (this.isShown()){this.hide();this.show()}
//         }
//     }
// }
