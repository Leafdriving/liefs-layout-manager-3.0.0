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
//     static closeCss = css("closeCss",`-moz-box-sizing: border-box;
//                                       -webkit-box-sizing: border-box;
//                                       border: 1px solid black;background:white;`);
//     static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
//     static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
//     <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
//    </svg>`;
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
    // static titleCss = css("modalTitle",`-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
    // border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`)
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
        return I(`${this.label}_close`, DefaultTheme.closeSVG, DefaultTheme.closeCss, `${this.headerHeight}px`);
    }
    buildHeader(){
        this.header =  h(`${this.label}_header`, `${this.headerHeight}px`,
            I(`${this.label}_title`, this.headerText, DefaultTheme.titleCss),
            this.buildClose(),
        )
        return this.header;
    }
    buildBody(){
        this.body = I(`${this.label}_body`, this.bodyText, DefaultTheme.closeCss)
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