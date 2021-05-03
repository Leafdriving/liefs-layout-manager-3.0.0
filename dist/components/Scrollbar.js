class ScrollBar extends Component {
    /**
     * Creates an instance of scroll bar.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        ScrollBar.makeLabel(this);
        ScrollBar.instances[this.label] = this;
        this.build();
        ScrollBar.instances[this.label] = this;
    }
    static leftArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(182.31 12.399 12.341)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;
    }
    static rightArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;
    }
    static upArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(-87.663 12.607 12.106)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;
    }
    static downArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
      <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
      </svg>`;
    }
    get scrollbarPixels() {
        let coord = this.scrollbarDisplayCell.coord;
        return (this.isHor) ? coord.width - this.barSize * 2 : coord.height - this.barSize * 2;
    }
    get ratio() {
        return pf.decimalPlaces(this.pixelsUsed / this.scrollbarPixels, 3);
    }
    /**
     * Updates scroll bar
     * @param pixelsUsed
     * @param pixelsAvailable
     * @returns update
     */
    update(pixelsUsed, pixelsAvailable) {
        this.pixelsUsed = pixelsUsed;
        this.pixelsAvailable = pixelsAvailable;
        this.limit();
        return this.offset;
    }
    /**
     * Limits scroll bar
     */
    limit() {
        if (this.offset < 0)
            this.offset = 0;
        if (this.offset > this.pixelsUsed - this.pixelsAvailable)
            this.offset = this.pixelsUsed - this.pixelsAvailable;
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        this.preRender(undefined, undefined);
        Render.scheduleUpdate();
    }
    ;
    /**
     * Pre render
     * @param derender
     * @param node
     * @returns render
     */
    preRender(derender, node) {
        if (this.isHor)
            this.parentDisplayCell.coord.height -= this.barSize;
        else
            this.parentDisplayCell.coord.width -= this.barSize;
        return undefined;
    }
    ;
    /**
     * Renders scroll bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        // console.log("Scrollbar Render");
        let coord = this.parentDisplayCell.coord;
        let x = (this.isHor) ? coord.x : coord.x + coord.width;
        let y = (this.isHor) ? coord.y + coord.height : coord.y;
        let width = (this.isHor) ? coord.width : this.barSize;
        let height = (this.isHor) ? this.barSize : coord.height;
        this.scrollbarDisplayCell.coord.assign(x, y, width, height, x, y, width, height, zindex);
        this.preBar.dim = `${this.offset / this.ratio}px`;
        this.Bar.dim = `${this.scrollbarPixels * this.pixelsAvailable / this.pixelsUsed - 1}px`;
        this.postBar.dim = `100%`;
        return [this.scrollbarDisplayCell];
    }
    ;
    /**
     * Deletes scroll bar
     */
    delete() {
        Render.update(this.scrollbarDisplayCell, true);
        Render.scheduleUpdate();
    }
    /**
     * Builds scroll bar
     */
    build() {
        let label = this.label + ((this.isHor) ? "_H" : "_V");
        this.preBar = I(`${label}_preBar`, ScrollBar.ScrollBar_whiteBG, events({ onclick: this.onSmallerBar.bind(this) }));
        this.Bar = I(`${label}_Bar`, ScrollBar.ScrollBar_blackBG, events({ ondrag: [this.onBarDown.bind(this), this.onBarMove.bind(this)] }));
        this.postBar = I(`${label}_postBar`, ScrollBar.ScrollBar_whiteBG, events({ onclick: this.onBiggerBar.bind(this) }));
        this.scrollbarDisplayCell =
            h(`${label}_h`, this.isHor, I(`${label}_backArrow`, `${this.barSize}px`, (this.isHor) ? ScrollBar.leftArrowSVG("scrollArrows") : ScrollBar.upArrowSVG("scrollArrows"), events({ onholdclick: [this.onSmallArrow.bind(this)] })), this.preBar, this.Bar, this.postBar, I(`${label}_forwardArrow`, `${this.barSize}px`, (this.isHor) ? ScrollBar.rightArrowSVG("scrollArrows") : ScrollBar.downArrowSVG("scrollArrows"), events({ onholdclick: [this.onBigArrow.bind(this)] })));
    }
    onSmallArrow(e) { this.offset -= this.ratio * this.scrollMultiplier; this.limit(); Render.scheduleUpdate(); }
    onBigArrow(e) { this.offset += this.ratio * this.scrollMultiplier; this.limit(); Render.scheduleUpdate(); }
    onSmallerBar(e) { this.offset -= this.pixelsAvailable; this.limit(); Render.scheduleUpdate(); }
    onBiggerBar(e) { this.offset += this.pixelsAvailable; this.limit(); Render.scheduleUpdate(); }
    onBarDown(e) { ScrollBar.startoffset = this.offset; }
    onBarMove(e, xmouseDiff) {
        let dist = (this.isHor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + dist * this.ratio;
        this.limit();
        Render.scheduleUpdate();
    }
}
ScrollBar.labelNo = 0;
ScrollBar.instances = {};
ScrollBar.activeInstances = {};
ScrollBar.defaults = { barSize: 15, offset: 0, scrollMultiplier: 5 };
ScrollBar.argMap = {
    string: ["label"],
    boolean: ["isHor"],
    //DisplayGroup : ["parentDisplayGroup"],
};
ScrollBar.ScrollBar_whiteBG = css("whiteBG", "background-color:white;outline: 1px solid black;outline-offset: -1px;", { type: "llm" });
ScrollBar.ScrollBar_blackBG = css("blackBG", "background-color:black;color:white;cursor: -webkit-grab; cursor: grab;", { type: "llm" });
// arrows  //scrollArrows
ScrollBar.scrollArrowsSVGCss = css(`scrollArrows`, `stroke: black;`, `fill: white;`, { type: "llm" });
ScrollBar.arrowSVGCss = css(`arrowIcon`, `stroke: black;cursor:pointer;`, `fill: white;`, { type: "llm" });
Render.register("ScrollBar", ScrollBar);
function scrollbar(...Arguments) {
    return new ScrollBar(...Arguments);
}
/**
 * On drag
 */
class onDrag_ extends Base {
    /**
     * Creates an instance of on drag .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.onDown = function () { };
        this.onMove = function () { };
        this.onUp = function () { };
        this.isDown = false;
        this.buildBase(...Arguments);
        if ("Array" in this.retArgs) {
            let array = this.retArgs["Array"][0];
            let num = array.length;
            if (num > 0)
                this.onDown = array[0];
            if (num > 1)
                this.onMove = array[1];
            if (num > 2)
                this.onUp = array[2];
        }
        let THIS = this;
        onDrag_.makeLabel(this);
        this.returnObject = {
            onmousedown: function (e) {
                THIS.onDown(e);
                THIS.isDown = true;
                THIS.mousePos = { x: e.clientX, y: e.clientY };
                window.addEventListener('selectstart', onDrag_.disableSelect);
                window.onmousemove = FunctionStack.push(window.onmousemove, function onDragMove(e) {
                    THIS.mouseDiff = { x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"] };
                    THIS.onMove(e, THIS.mouseDiff);
                });
                window.onmouseup = FunctionStack.push(window.onmouseup, function onDragUp(e) {
                    THIS.reset();
                    THIS.onUp(e, THIS.mouseDiff);
                });
            }
        };
    }
    /**
     * Resets on drag
     */
    reset() {
        FunctionStack.pop((window.onmousemove), "onDragMove");
        FunctionStack.pop((window.onmouseup), "onDragUp");
        window.removeEventListener('selectstart', onDrag_.disableSelect);
        this.isDown = false;
    }
    static disableSelect(event) { event.preventDefault(); }
}
onDrag_.instances = [];
onDrag_.activeInstances = [];
onDrag_.defaults = {};
onDrag_.argMap = {
    string: ["label"],
    function: ["onDown", "onMove", "onUp"],
};
function onDrag(...Arguments) { return (new onDrag_(...Arguments)).returnObject; }
Element_.customEvents["ondrag"] = function (newData) { return onDrag(newData); };
/**
 * On hold click
 */
class onHoldClick_ extends Base {
    /**
     * Creates an instance of on hold click .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        onHoldClick_.makeLabel(this);
        onHoldClick_.instances[this.label] = this;
        let THIS = this;
        this.returnObject = {
            onmousedown: function (e) {
                THIS.mouseDownEvent = e;
                THIS.onDown(e);
                THIS.isDown = new Date().getTime();
                window.onmouseup = FunctionStack.push(window.onmouseup, function onHoldClickUp(e) {
                    //console.log("mouseUp");
                    FunctionStack.pop((window.onmouseup), "onHoldClickUp");
                    THIS.isDown = undefined;
                });
                setTimeout(() => {
                    let newTime = new Date().getTime();
                    // console.log("ok",newTime - THIS.isDown, THIS.initialDelay)
                    if (THIS.isDown && (newTime - THIS.isDown) >= THIS.initialDelay) {
                        THIS.repeat();
                    }
                }, THIS.initialDelay);
            }
        };
    }
    /**
     * Repeats on hold click
     */
    repeat() {
        let THIS = this;
        this.FUNCTION(this.mouseDownEvent);
        setTimeout(() => { if (THIS.isDown)
            THIS.repeat(); }, THIS.repeatDelay);
    }
    onDown(e) { this.FUNCTION(e); }
}
onHoldClick_.labelNo = 0;
onHoldClick_.instances = {};
onHoldClick_.activeInstances = {};
onHoldClick_.defaults = { initialDelay: 1000, repeatDelay: 75 };
onHoldClick_.argMap = {
    string: ["label"],
    number: ["initialDelay", "repeatDelay"],
    function: ["FUNCTION"],
};
function onHoldClick(...Arguments) { return (new onHoldClick_(...Arguments)).returnObject; }
Element_.customEvents["onholdclick"] = function (newData) { return onHoldClick(...newData); };
