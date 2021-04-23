class Modal extends Component {
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        Modal.makeLabel(this);
        Modal.instances[this.label] = this;
        this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        this.parentDisplayCell = new DisplayCell(this.label).addComponent(this).addComponent(this.handler);
        if (this.startCoord) {
            this.sizer.width = this.startCoord.width;
            this.sizer.height = this.startCoord.height;
        }
        if ("number" in this.retArgs)
            this.sizer = this.evalNumbers(this.retArgs["number"]);
        // console.log(this.sizer , !this.stretch)
        //if (this.sizer.minWidth && !this.stretch) this.stretch = new Stretch(this);
    }
    static onDown() {
        let THIS = this;
        window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
        Modal.movingInstace = THIS;
        Modal.x = THIS.coord.x;
        Modal.y = THIS.coord.y;
    }
    static onMove(mouseEvent, offset) {
        let THIS = this;
        THIS.coord.x = Modal.x + offset.x;
        THIS.coord.y = Modal.y + offset.y;
        Render.scheduleUpdate();
    }
    static onUp(mouseEvent, offset) {
        let THIS = this;
        Modal.movingInstace = undefined;
        Modal.x = undefined;
        Modal.y = undefined;
        window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
    }
    get coord() { return this.handler.coord; }
    evalNumbers(numbers) {
        let qty = numbers.length;
        let sizer = {};
        sizer.width = numbers[0];
        if (qty > 1)
            sizer.height = numbers[1];
        if (qty > 2)
            sizer.minWidth = numbers[2];
        if (qty > 3)
            sizer.minHeight = numbers[3];
        if (qty > 4)
            sizer.maxWidth = numbers[4];
        if (qty > 5)
            sizer.maxHeight = numbers[5];
        return sizer;
    }
    onConnect() {
        if (this.startCoord)
            this.handler.coord.copy(this.startCoord);
        else {
            let ssCoord = Handler.ScreenSizeCoord;
            let width = (this.sizer.width) ? this.sizer.width : Math.round(ssCoord.width / 3);
            let height = (this.sizer.height) ? this.sizer.height : Math.round(ssCoord.height / 3);
            let x = Math.round((ssCoord.width - width) / 2);
            let y = Math.round((ssCoord.height - height) / 2);
            this.coord.assign(x, y, width, height, 0, 0, ssCoord.width, ssCoord.height);
        }
    }
    ;
    preRender(derender, node, zindex) {
        if (this.sizer.minWidth && !this.stretch)
            this.stretch = new Stretch(this);
        let ssCoord = Handler.ScreenSizeCoord;
        if (this.coord.x2 > ssCoord.width)
            this.coord.x -= (this.coord.x2 - ssCoord.width);
        if (this.coord.y2 > ssCoord.height)
            this.coord.y -= (this.coord.y2 - ssCoord.height);
        if (this.coord.x < 0)
            this.coord.x = 0;
        if (this.coord.y < 0)
            this.coord.y = 0;
        this.coord.within.width = ssCoord.width;
        this.coord.within.height = ssCoord.height;
        return undefined;
    }
    ;
    Render(derender, node, zindex) {
        return this.children;
    }
    ;
    getChild(label) {
        for (let index = 0; index < this.children.length; index++)
            if (this.children[index].label == label)
                return this.children[index];
        return undefined;
    }
    delete() { }
    show() {
        if (!Handler.activeInstances[this.handler.label]) {
            Handler.activeInstances[this.handler.label] = this.handler;
            Render.scheduleUpdate();
        }
    }
    hide(event = undefined) {
        if (Handler.activeInstances[this.handler.label]) {
            Render.update(Handler.activeInstances[this.handler.label], true);
            delete Handler.activeInstances[this.handler.label];
        }
    }
    isShown() { return (Handler.activeInstances[this.handler.label]) ? true : false; }
    dragWith(...displaycells) {
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            const displaycell = displaycells[index];
            let element = displaycell.getComponent("Element_");
            // console.log(element)
            element.addEvents({ ondrag: [Modal.onDown.bind(THIS), Modal.onMove.bind(THIS), Modal.onUp.bind(THIS)] });
        }
    }
    closeWith(...displaycells) {
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            displaycells[index].addEvents({ onclick: THIS.hide.bind(THIS) });
        }
    }
}
Modal.labelNo = 0;
Modal.instances = {};
Modal.activeInstances = {};
Modal.closeCss = css("closeCss", `-moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;
                                    border: 1px solid black;background:white;`);
Modal.closeSVGCss = css(`closeIcon`, `stroke: black;background:white`, `stroke: white;background:red`);
Modal.closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
   </svg>`;
Modal.defaults = { sizer: {} };
Modal.argMap = {
    string: ["label"],
    DisplayCell: ["rootDisplayCell"],
    Coord: ["startCoord"],
};
class winModal extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        winModal.makeLabel(this);
        winModal.instances[this.label] = this;
        this.build();
        this.modal = new Modal(`${this.label}`, this.fullDisplayCell);
        this.modal.dragWith(this.titleDisplayCell);
        this.modal.closeWith(this.closeDisplayCell);
        if (this.onclose)
            this.closeDisplayCell.addEvents({ onclick: this.onclose });
        if ("number" in this.retArgs)
            this.modal.evalNumbers(this.retArgs["number"]);
        if (this["sizer"]) {
            this.modal.sizer = this["sizer"];
            delete this["sizer"];
        }
        this.show();
    }
    get parentDisplayCell() { return this.modal.parentDisplayCell; }
    set parentDisplayCell(value) { this.modal.parentDisplayCell = value; }
    show() { this.modal.show(); }
    hide() { this.modal.hide(); }
    build() {
        this.titleDisplayCell = I(`${this.label}_titleCell`, this.titleText, winModal.titleCss);
        this.closeDisplayCell = I(`${this.label}_closeIcon`, winModal.closeSVG, `${this.headerHeight}px`);
        this.headerDisplayCell = h(`${this.label}_header`, `${this.headerHeight}px`, this.titleDisplayCell, this.closeDisplayCell);
        if (!this.bodyDisplayCell)
            this.bodyDisplayCell = I(`${this.label}_body`, this.innerHTML, winModal.whiteBGCss);
        this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.bodyDisplayCell);
    }
}
winModal.labelNo = 0;
winModal.instances = {};
winModal.activeInstances = {};
winModal.defaults = { headerHeight: 20, titleText: "My Title", innerHTML: "Body" };
winModal.argMap = {
    string: ["label", "titleText", "innerHTML"],
    DisplayCell: ["bodyDisplayCell"],
    function: ["onclose"],
};
winModal.titleCss = css(`titleCss`, `background:#00CED1;cursor:pointer;text-align: center;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`, { type: "llm" });
winModal.closeSVGCss = css(`closeIcon`, `stroke: black;background:white;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`, `stroke: white;background:red`, { type: "llm" });
winModal.closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
      </svg>`;
winModal.whiteBGCss = css(`whiteBGCss`, `background:white;box-sizing: border-box;-moz-box-sizing: border-box;
                                            -webkit-box-sizing: border-box;border: 1px solid black;`);
class Stretch extends Component {
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        Stretch.makeLabel(this);
        Stretch.instances[this.label] = this;
        this.build();
        console.log("Stretch Created", this.modal);
        if (this.modal)
            this.modal.children.push(this);
        this.parentDisplayCell = this.modal.parentDisplayCell;
    }
    static setStart(e) {
        let THIS = this;
        Stretch.startDrag.copy(THIS.modal.coord);
    }
    static updateCoord(modal, x, y, w, h, offset) {
        let sd = Stretch.startDrag, mc = modal.coord, ms = modal.sizer;
        mc.x = sd.x + offset.x * x;
        mc.width = sd.width + offset.x * w;
        mc.y = sd.y + offset.y * y;
        mc.height = sd.height + offset.y * h;
        if (mc.width < ms.minWidth)
            mc.width = ms.minWidth;
        if (mc.width > ms.maxWidth)
            mc.width = ms.maxWidth;
        if (mc.height < ms.minHeight)
            mc.height = ms.minHeight;
        if (mc.height > ms.maxHeight)
            mc.height = ms.maxHeight;
        Render.scheduleUpdate();
    }
    ;
    static ulDrag(e, offset) { Stretch.updateCoord(this["modal"], 1, 1, -1, -1, offset); }
    static urDrag(e, offset) { Stretch.updateCoord(this["modal"], 0, 1, 1, -1, offset); }
    static llDrag(e, offset) { Stretch.updateCoord(this["modal"], 1, 0, -1, 1, offset); }
    static lrDrag(e, offset) { Stretch.updateCoord(this["modal"], 0, 0, 1, 1, offset); }
    build() {
        this.upperLeft = I(`${this.label}_ul`, Stretch.CssNW, events({ ondrag: [Stretch.setStart.bind(this), Stretch.ulDrag.bind(this)] }));
        this.upperRight = I(`${this.label}_ur`, Stretch.CssNE, events({ ondrag: [Stretch.setStart.bind(this), Stretch.urDrag.bind(this)] }));
        this.lowerLeft = I(`${this.label}_ll`, Stretch.CssNE, events({ ondrag: [Stretch.setStart.bind(this), Stretch.llDrag.bind(this)] }));
        this.lowerRight = I(`${this.label}_lr`, Stretch.CssNW, events({ ondrag: [Stretch.setStart.bind(this), Stretch.lrDrag.bind(this)] }));
    }
    onConnect() {
        console.log("STretch Connected");
    }
    ;
    preRender(derender, node, zindex) {
        //console.log("Stretch Pre-Render");
        return undefined;
    }
    ;
    Render(derender, node, zindex) {
        if (this.parentDisplayCell) {
            let z = -(zindex + Render.zindexIncrement * 10);
            let PDCoord = this.parentDisplayCell.coord;
            this.upperLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.upperRight.coord.copy(PDCoord, PDCoord.x2 - Stretch.pixelSize, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y2 - Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerRight.coord.copy(PDCoord, PDCoord.x2 - Stretch.pixelSize, PDCoord.y2 - Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z);
            return [this.upperRight, this.upperLeft, this.lowerLeft, this.lowerRight];
        }
        return undefined;
    }
    ;
}
Stretch.labelNo = 0;
Stretch.instances = {};
Stretch.activeInstances = {};
Stretch.defaults = {};
Stretch.argMap = {
    Modal: ["modal"],
};
Stretch.CssNE = css("CssNE", `cursor:ne-resize`);
Stretch.CssNW = css("CssNW", `cursor:nw-resize`);
Stretch.pixelSize = 10;
Stretch.startDrag = new Coord();
