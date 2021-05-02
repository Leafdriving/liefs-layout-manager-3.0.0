
/**
 * Modal
 */
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
    /**
     * Determines whether down on
     */
    static onDown(){
        let THIS = this as unknown as Modal;
        window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
        Modal.movingInstace = THIS;Modal.x = THIS.coord.x;Modal.y = THIS.coord.y;
    }
    /**
     * Determines whether move on
     * @param mouseEvent 
     * @param offset 
     */
    static onMove(mouseEvent:MouseEvent, offset:{x:number, y:number}){
        let THIS = this as unknown as Modal;
        THIS.coord.x = Modal.x + offset.x;THIS.coord.y = Modal.y + offset.y;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether up on
     * @param mouseEvent 
     * @param offset 
     */
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
        Handler: ["handler"],
    }
    static x:number;
    static y:number;
    // retArgs:objectAny;   // <- this will appear
    rootDisplayCell:DisplayCell;
    label:string;
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[] = [];
    handler:Handler;
    get coord(){return this.handler.coord}
    startCoord:Coord;
    sizer:{ minWidth?:number, maxWidth?:number, minHeight?:number, maxHeight?:number, width?:number, height?:number }
    stretch:Stretch;
    /**
     * Creates an instance of modal.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Modal.makeLabel(this); Modal.instances[this.label] = this;
        if (!this.handler) this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        if (!this.handler.coord) this.handler.coord = new Coord();
        if (this.handler.parentDisplayCell) this.parentDisplayCell = this.handler.parentDisplayCell;
        else this.parentDisplayCell = new DisplayCell(this.label).addComponent(this.handler)
        this.parentDisplayCell.addComponent(this);
        if (this.startCoord) {
            this.sizer.width = this.startCoord.width;
            this.sizer.height = this.startCoord.height;
        }
        if ("number" in this.retArgs) this.sizer = this.evalNumbers(this.retArgs["number"]);
    }
    /**
     * Evals numbers
     * @param numbers 
     * @returns numbers 
     */
    evalNumbers(numbers:number[]):{ minWidth?:number, maxWidth?:number, minHeight?:number, maxHeight?:number, width?:number, height?:number }{
        let qty = numbers.length;
        let sizer:{ minWidth?:number, maxWidth?:number, minHeight?:number, maxHeight?:number, width?:number, height?:number } = {}
        sizer.width = numbers[0];
        if (qty > 1) sizer.height = numbers[1];
        if (qty > 2) sizer.minWidth = numbers[2];
        if (qty > 3) sizer.minHeight = numbers[3];
        if (qty > 4) sizer.maxWidth = numbers[4];
        if (qty > 5) sizer.maxHeight = numbers[5];
        return sizer;
    }
    /**
     * Determines whether connect on
     */
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
    /**
     * Pre render
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{
        if (this.sizer.minWidth && !this.stretch) this.stretch = new Stretch(this);
        let ssCoord = Handler.ScreenSizeCoord;
        if (this.coord.x2 > ssCoord.width) this.coord.x -= ( this.coord.x2 - ssCoord.width );
        if (this.coord.y2 > ssCoord.height) this.coord.y -= ( this.coord.y2 - ssCoord.height);
        if (this.coord.x < 0) this.coord.x = 0;
        if (this.coord.y < 0) this.coord.y = 0;
        this.coord.within.width = ssCoord.width;
        this.coord.within.height = ssCoord.height;
        return undefined;
    };
    /**
     * Renders modal
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        return this.children;
    };
    /**
     * Gets child
     * @param label 
     * @returns  
     */
    getChild(label:string) {
        for (let index = 0; index < this.children.length; index++) 
            if (this.children[index].label == label) return this.children[index];
        return undefined;
    }
    /**
     * Shows modal
     */
    show(){
        if (!Handler.activeInstances[this.handler.label]) {
            Handler.activeInstances[this.handler.label] = this.handler;
            Render.scheduleUpdate();
        }
    }
    /**
     * Hides modal
     * @param [event] 
     */
    hide(event:MouseEvent|PointerEvent = undefined){
        if (Handler.activeInstances[this.handler.label]) {
            Render.update(Handler.activeInstances[this.handler.label], true);
            delete Handler.activeInstances[this.handler.label];
        }
    }
    /**
     * Determines whether shown is
     * @returns  
     */
    isShown(){return (Handler.activeInstances[this.handler.label]) ? true : false}
    /**
     * Drags with
     * @param displaycells 
     */
    dragWith(...displaycells:DisplayCell[]){
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            const displaycell = displaycells[index];   
            let element=<Element_>displaycell.getComponent("Element_");
            // console.log(element)
            element.addEvents({ondrag:[Modal.onDown.bind(THIS),Modal.onMove.bind(THIS),Modal.onUp.bind(THIS)]});
        }
    }
    /**
     * Closes with
     * @param displaycells 
     */
    closeWith(...displaycells:DisplayCell[]){
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            displaycells[index].addEvents({ onclick: THIS.hide.bind(THIS) });
        }
    }
}

/**
 * Win modal
 */
class winModal extends Base {
    static labelNo = 0;
    static instances:{[key: string]: winModal;} = {};
    static activeInstances:{[key: string]: winModal;} = {};
    static defaults:{[key: string]: any;} = {headerHeight:20, titleText:"My Title", innerHTML:"Body"}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label", "titleText", "innerHTML"],
        DisplayCell: ["bodyDisplayCell"],
        function: ["onclose"],
        Handler:["suppliedHandler"],
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
    get parentDisplayCell(){return this.modal.parentDisplayCell}
    set parentDisplayCell(value){this.modal.parentDisplayCell = value}
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
    suppliedHandler:Handler;
    show(){this.modal.show()}
    hide(){this.modal.hide()}
    onclose:()=>void;
    
    /**
     * Creates an instance of win modal.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        winModal.makeLabel(this); winModal.instances[this.label] = this;
        this.build();
        this.modal = new Modal(`${this.label}`, (this.suppliedHandler) ? this.suppliedHandler : this.fullDisplayCell);
        this.modal.dragWith(this.titleDisplayCell);
        this.modal.closeWith(this.closeDisplayCell);
        if (this.onclose) this.closeDisplayCell.addEvents({onclick:this.onclose})
        if ("number" in this.retArgs) this.modal.evalNumbers(this.retArgs["number"]);
        if (this["sizer"]) {this.modal.sizer = this["sizer"];delete this["sizer"];}
        this.show();
    }
    /**
     * Builds win modal
     */
    build(){
        this.titleDisplayCell = I(`${this.label}_titleCell`, this.titleText, winModal.titleCss);
        this.closeDisplayCell = I(`${this.label}_closeIcon`, winModal.closeSVG, `${this.headerHeight}px`);
        this.headerDisplayCell = h(`${this.label}_header`, `${this.headerHeight}px`,
            this.titleDisplayCell,
            this.closeDisplayCell,
        )
        if (!this.bodyDisplayCell) this.bodyDisplayCell = I(`${this.label}_body`, this.innerHTML, winModal.whiteBGCss);
        if (this.suppliedHandler) {
            this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.suppliedHandler.parentDisplayCell);
        }
        else
            this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.bodyDisplayCell);
    }
}
/**
 * Stretch
 */
class Stretch extends Component {
    static labelNo = 0;
    static instances:{[key: string]: Stretch;} = {};
    static activeInstances:{[key: string]: Stretch;} = {};
    static defaults:{[key: string]: any;} = {}
    static argMap:{[key: string]: Array<string>;} = {
        Modal : ["modal"],
    }
    static CssNE = css("CssNE",`cursor:ne-resize`);
    static CssNW = css("CssNW",`cursor:nw-resize`);
    static pixelSize=10;
    static startDrag=new Coord();
    static setStart(e:MouseEvent){
        let THIS = this as unknown as Stretch;
        Stretch.startDrag.copy(THIS.modal.coord)
    }
    static updateCoord(modal:Modal, x:number, y:number, w:number, h:number, offset:{x:number, y:number}){
        let sd = Stretch.startDrag, mc = modal.coord, ms = modal.sizer;
        mc.x = sd.x + offset.x*x;
        mc.width = sd.width + offset.x*w;
        mc.y = sd.y + offset.y*y;
        mc.height = sd.height + offset.y*h;
        if (mc.width < ms.minWidth)  mc.width = ms.minWidth;
        if (mc.width > ms.maxWidth)  mc.width = ms.maxWidth;
        if (mc.height < ms.minHeight)  mc.height = ms.minHeight;
        if (mc.height > ms.maxHeight)  mc.height = ms.maxHeight;
        Render.scheduleUpdate();
    };
    static ulDrag(e:MouseEvent, offset:{x:number, y:number}){Stretch.updateCoord(this["modal"], 1,1,-1,-1,offset);}
    static urDrag(e:MouseEvent, offset:{x:number, y:number}){Stretch.updateCoord(this["modal"], 0,1,1,-1,offset);}
    static llDrag(e:MouseEvent, offset:{x:number, y:number}){Stretch.updateCoord(this["modal"], 1,0,-1,1,offset);}
    static lrDrag(e:MouseEvent, offset:{x:number, y:number}){Stretch.updateCoord(this["modal"], 0,0,1,1,offset);}
    
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[] = [];
    modal:Modal;
    upperLeft:DisplayCell;
    upperRight:DisplayCell;
    lowerLeft:DisplayCell;
    lowerRight:DisplayCell;
    /**
     * Creates an instance of stretch.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Stretch.makeLabel(this); Stretch.instances[this.label] = this;
        this.build();
        console.log("Stretch Created", this.modal);
        if (this.modal) this.modal.children.push(this);
        this.parentDisplayCell = this.modal.parentDisplayCell;
    }
    /**
     * Builds stretch
     */
    build(){
        this.upperLeft = I(`${this.label}_ul`, Stretch.CssNW, events({ondrag:[Stretch.setStart.bind(this),Stretch.ulDrag.bind(this)]}));
        this.upperRight = I(`${this.label}_ur`, Stretch.CssNE,events({ondrag:[Stretch.setStart.bind(this),Stretch.urDrag.bind(this)]}));
        this.lowerLeft = I(`${this.label}_ll`, Stretch.CssNE, events({ondrag:[Stretch.setStart.bind(this),Stretch.llDrag.bind(this)]}));
        this.lowerRight = I(`${this.label}_lr`, Stretch.CssNW, events({ondrag:[Stretch.setStart.bind(this),Stretch.lrDrag.bind(this)]}));
    }
    /**
     * Determines whether connect on
     */
    onConnect():void{
        console.log("STretch Connected")
    };
    /**
     * Pre render
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{
        //console.log("Stretch Pre-Render");
        return undefined
    };
    /**
     * Renders stretch
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        if (this.parentDisplayCell) {
            let z = -(zindex+Render.zindexIncrement*10)
            let PDCoord = this.parentDisplayCell.coord;
            this.upperLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.upperRight.coord.copy(PDCoord, PDCoord.x2-Stretch.pixelSize, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y2-Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerRight.coord.copy(PDCoord, PDCoord.x2-Stretch.pixelSize, PDCoord.y2-Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z)
            return [this.upperRight, this.upperLeft, this.lowerLeft, this.lowerRight];
        }
        return undefined
    };
}