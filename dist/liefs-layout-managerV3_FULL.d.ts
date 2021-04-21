declare class pf {
    static isTypePx: (it: any) => boolean;
    static pxAsNumber: (dim: string) => number;
    static isTypePercent: (it: any) => boolean;
    static percentAsNumber: (dim: string) => number;
    static isDim: (it: any) => string;
    static isArray: (it: any) => string;
    static isObjectAClass: (it: any) => any;
    static defaultIsChecks: ((it: any) => any)[];
    static classProperties: (a: string[]) => string[];
    static commonKeys(obj1: object, obj2: object): string[];
    static pad_with_zeroes: (Number: number, length?: number) => string;
    static mergeObjects: (startObj: object, AddObj: object) => object;
    static viewport(): number[];
    static errorReporting(errString: string): void;
    static insideOfFunctionString(functionString: string): string;
    static array_move(arr: any[], old_index: number, new_index: number): void;
    static undefinedIs(thing: any, value?: any): any;
    static preUnderscore(someString: string): string;
    static uis0(num: number): number;
    static parseURLParams(url?: string): {};
    static decimalPlaces(number: number, places: number): number;
}
interface objectStringArray {
    [key: string]: Array<string>;
}
interface objectAny {
    [type: string]: any[];
}
interface objectFunction {
    [type: string]: Function;
}
interface objectString {
    [type: string]: string;
}
declare class Arguments_ {
    static ifObjectMergeWithDefaults(THIS: any, CLASS: any): object;
    static retArgsMapped(updatedDefaults: object, THIS: any, CLASS: any): object;
    static typeof(Argument: any): string;
    static argumentsByType(Args: any[], // 1st argument is a list of args.
    customTypes?: Function[]): objectAny;
    static modifyClassProperties(argobj: object, targetobject: object): void;
    static mergeObjects: (startObj: object, AddObj: object) => object;
}
declare class Base {
    static defaultIsChecks: ((it: any) => any)[];
    static toCode: (ClassObjectInstance: object) => string;
    retArgs: objectAny;
    label: string;
    constructor(...neverRead: any);
    buildBase(...Arguments: any): void;
    static buildBase(THIS: any, ...Arguments: any): void;
    static makeLabel(instance: object): void;
}
declare class Component extends Base {
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    onConnect(): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    getChild(label: string): Component;
    delete(): void;
}
declare class FunctionStack_BASE extends Function {
    constructor();
}
declare class FunctionStack extends FunctionStack_BASE {
    functionArray: Function[];
    constructor();
    __call__(...Arguments: any[]): void;
    static push(prevFunction: Function | FunctionStack, newFunction?: Function | FunctionStack): FunctionStack;
    static pop(functionStackInstance: FunctionStack, label: string): FunctionStack;
    static isIn(functionStackInstance: FunctionStack, label: string): boolean;
}
declare class debounce_ extends FunctionStack_BASE {
    FUNCTION: Function;
    delay: number;
    lasttime: number;
    constructor(FUNCTION: Function, delay: number);
    __call__(...Arguments: any[]): void;
}
declare function debounce(FUNCTION: Function, delay: number): debounce_;
declare class node_ extends Base {
    static labelNo: number;
    static instances: {
        [key: string]: node_;
    };
    static activeInstances: {
        [key: string]: node_;
    };
    static defaults: {
        collapsed: boolean;
    };
    static argMap: objectStringArray;
    static newNode(THIS: node_, ...Arguments: any): node_;
    static asArray(node: node_, traverseFunction?: (node: node_) => any): any[];
    static traverse(node: node_, traverseFunction: (node: node_) => void, traverseChildren?: (node: node_) => boolean, traverseNode?: (node: node_) => boolean): void;
    label: string;
    Arguments: any;
    ParentNodeTree: any;
    ParentNode: node_;
    get PreviousSibling(): node_;
    set PreviousSibling(newNode: node_);
    get NextSibling(): node_;
    set NextSibling(newNode: node_);
    collapsed: boolean;
    children: node_[];
    constructor(...Arguments: any);
    depth(deep?: number): number;
    length(count?: number): number;
    newChild(...Arguments: any): node_;
    newSibling(...Arguments: any): node_;
    pop(): this;
    done(): any;
    root(): node_;
    parent(): node_;
    log(showNode?: boolean): void;
}
declare function sample(): node_;
declare class Point {
    x: number;
    y: number;
}
declare class Within {
    lockedToScreenSize: boolean;
    x_: number;
    get x(): number;
    set x(x: number);
    y_: number;
    get y(): number;
    set y(y: number);
    width_: number;
    get width(): number;
    set width(width: number);
    height_: number;
    get height(): number;
    set height(height: number);
    constructor(...Arguments: any);
    reset(): void;
    toString: Function;
}
declare class Coord extends Base {
    #private;
    static instances: Coord[];
    static activeInstances: Coord[];
    static defaults: {
        x: number;
        y: number;
        width: number;
        height: number;
        zindex: number;
    };
    static argMap: {
        string: string[];
        number: string[];
        boolean: string[];
    };
    static CopyArgMap: {
        Within: string[];
        Coord: string[];
        boolean: string[];
        number: string[];
    };
    label: string;
    frozen: boolean;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    get x2(): number;
    get y2(): number;
    zindex: number;
    within: Within;
    hideWidth: boolean;
    offset: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    constructor(...Arguments: any);
    setOffset(x?: number, y?: number, width?: number, height?: number): void;
    mergeWithin(p: Coord): this;
    applyMargins(left?: number, right?: number, top?: number, bottom?: number): this;
    assign(x?: any, y?: any, width?: any, height?: any, wx?: any, wy?: any, wwidth?: any, wheight?: any, zindex?: any): this;
    copy(fromCoord: Coord, x?: number, y?: number, width?: number, height?: number, zindex?: number): this;
    log(): void;
    isCoordCompletelyOutside(WITHIN?: Coord | Within): boolean;
    derender(derender: boolean): boolean;
    isPointIn(x: number, y: number): boolean;
}
declare function events(object_: object): {
    processEvents: object;
};
declare class Element_ extends Component {
    static eventsArray: any[];
    static labelNo: number;
    static instances: {
        [key: string]: Element_;
    };
    static activeInstances: {
        [key: string]: Element_;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static customEvents: {
        [type: string]: (newData: any) => object;
    };
    ignoreInner: boolean;
    label: string;
    el: HTMLDivElement;
    evalInner: (THIS: Element_) => string;
    innerHTML: string;
    css_: string;
    dim_: string;
    get dim(): string;
    set dim(value: string);
    get css(): string;
    set css(value: string);
    Css: Css;
    events: objectFunction;
    processEvents: objectFunction;
    attributes: objectString;
    parentDisplayCell: DisplayCell;
    get coord(): Coord;
    constructor(...Arguments: any);
    loadElement(el: HTMLDivElement): void;
    applyEvents(): void;
    addEvents(eventObject: object): void;
    renderHtmlAttributes(): void;
    onConnect(): void;
    Render(derender: boolean, node: node_): any[];
    setAsSelected(): void;
    setAsUnSelected(): void;
    static clipStyleString(element: Element_): string;
    static style(element: Element_): string;
    static getAttribs(el: HTMLDivElement, retObj?: objectString): objectString;
    static elExists(id_label: string): HTMLDivElement;
    static setAttribs(element: Element_): void;
    static setAttrib(el: HTMLElement, attrib: string, value: string): void;
    static attribFilter: string[];
}
declare function I(...Arguments: any): DisplayCell;
declare class DisplayCell extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: DisplayCell;
    };
    static activeInstances: {
        [key: string]: DisplayCell;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static objectTypes: Set<string>;
    coord: Coord;
    children: Component[];
    parentDisplayCell: DisplayCell;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    node: node_;
    getdim: Function;
    setdim: Function;
    dim_: string;
    set dim(value: string);
    get dim(): string;
    min: number;
    constructor(...Arguments: any);
    addComponent(component: Component): DisplayCell;
    getComponent(type: string, label?: string): object;
    deleteComponent(type: string, label?: string): boolean;
    preRender(derender: boolean, node: node_, zindex: number): any[];
    Render(derender: boolean, node: node_, zindex: number): Component[];
    addEvents(Argument: object): void;
    static marginAssign(cell: DisplayCell, numberArray: number[]): void;
}
declare class DisplayGroup extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: DisplayGroup;
    };
    static activeInstances: {
        [key: string]: DisplayGroup;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    allowScrollBar: boolean;
    label: string;
    dim_: string;
    get dim(): string;
    set dim(value: string);
    get coord(): Coord;
    margin: number;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: DisplayCell[];
    isHor: boolean;
    scrollbar: ScrollBar;
    offset: number;
    constructor(...Arguments: any);
    onConnect(): void;
    Render(derender: boolean, node: node_, zindex: number): DisplayCell[];
    static forceMin(answersArray: {
        px: number;
        percent: number;
        min: number;
    }[]): number;
}
declare function h(...Arguments: any): DisplayCell;
declare function v(...Arguments: any): DisplayCell;
declare class Handler extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Handler;
    };
    static activeInstances: {
        [key: string]: Handler;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static linkHandlerOldList: Handler[];
    static linkHandlerNewList: Handler[];
    static linkHandlers(): void;
    type: string;
    label: string;
    startRendered: boolean;
    coord: Coord;
    parentDisplayCell: DisplayCell;
    children: Component[];
    node: node_;
    preRenderCallBack: (handler: Handler) => void;
    postRenderCallBack: (handler: Handler) => void;
    constructor(...Arguments: any);
    static ScreenSizeCoord: Coord;
    static updateScreenSizeCoord(): void;
    static getHandlers(): DisplayCell[];
    onConnect(): void;
    preRender(derender: boolean, node: node_): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    show(): void;
    hide(): void;
}
declare function H(...Arguments: any): DisplayCell;
declare class Css extends Base {
    static theme: any;
    static elementId: string;
    static instances: {
        [key: string]: Css;
    };
    static activeInstances: {
        [key: string]: Css;
    };
    static byLabel(classname: string): Css;
    static defaults: {
        isClassname: boolean;
    };
    static argMap: {
        string: string[];
        boolean: string[];
    };
    static deleteOnFirstRunClassname: string;
    classname: string;
    type: string;
    css: string;
    cssObj: object;
    cssHover: string;
    cssHoverObj: object;
    cssSelect: string;
    cssSelectObj: object;
    cssSelectHover: string;
    cssSelectHoverObj: object;
    isClassname: boolean;
    constructor(...Arguments: any);
    newString(data: string): void;
    makeString(obj?: object, postfix?: string, addToClassName?: string): string;
    makeObj(str?: string): object;
    static update(): void;
    static advisedDiv: Css;
    static advisedBody: Css;
}
declare function css(...Arguments: any): Css;
declare class Render {
    static node: node_;
    static zindexIncrement: number;
    static zindexHandlerIncrement: number;
    static pleaseUpdate: boolean;
    static firstRun: boolean;
    static scheduleUpdate(): void;
    static fullupdate(derender?: boolean): void;
    static update(components_?: Component[] | Component, derender?: boolean, parentNode?: node_, zindex?: number): void;
    static classes: {};
    static register(label: string, object_: object): void;
}
declare class ScrollBar extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: ScrollBar;
    };
    static activeInstances: {
        [key: string]: ScrollBar;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static ScrollBar_whiteBG: Css;
    static ScrollBar_blackBG: Css;
    static scrollArrowsSVGCss: Css;
    static arrowSVGCss: Css;
    static leftArrowSVG(classname: string): string;
    static rightArrowSVG(classname: string): string;
    static upArrowSVG(classname: string): string;
    static downArrowSVG(classname: string): string;
    static startoffset: number;
    node: node_;
    parentDisplayCell: DisplayCell;
    totalPixels: number;
    viewingPixels: number;
    scrollbarDisplayCell: DisplayCell;
    preBar: DisplayCell;
    Bar: DisplayCell;
    postBar: DisplayCell;
    isHor: boolean;
    barSize: number;
    pixelsUsed: number;
    pixelsAvailable: number;
    offset: number;
    scrollMultiplier: number;
    get scrollbarPixels(): number;
    get ratio(): number;
    update(pixelsUsed: number, pixelsAvailable: number): number;
    limit(): void;
    constructor(...Arguments: any);
    onConnect(): void;
    preRender(derender: boolean, node: node_): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
    build(): void;
    onSmallArrow(e: PointerEvent): void;
    onBigArrow(e: PointerEvent): void;
    onSmallerBar(e: PointerEvent): void;
    onBiggerBar(e: PointerEvent): void;
    onBarDown(e: MouseEvent): void;
    onBarMove(e: MouseEvent, xmouseDiff: object): void;
}
declare function scrollbar(...Arguments: any): ScrollBar;
declare class onDrag_ extends Base {
    static instances: onDrag_[];
    static activeInstances: onDrag_[];
    static defaults: {};
    static argMap: {
        string: string[];
        function: string[];
    };
    label: string;
    el: HTMLDivElement;
    onDown: Function;
    onMove: Function;
    onUp: Function;
    isDown: boolean;
    mousePos: object;
    mouseDiff: object;
    returnObject: object;
    constructor(...Arguments: any);
    reset(): void;
    static disableSelect(event: MouseEvent): void;
}
declare function onDrag(...Arguments: any): object;
declare class onHoldClick_ extends Base {
    static labelNo: number;
    static instances: {
        [key: string]: onHoldClick_;
    };
    static activeInstances: {
        [key: string]: onHoldClick_;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    label: string;
    initialDelay: number;
    repeatDelay: number;
    FUNCTION: Function;
    returnObject: object;
    isDown: number;
    timeDown: number;
    mouseDownEvent: PointerEvent;
    constructor(...Arguments: any);
    repeat(): void;
    onDown(e: MouseEvent): void;
}
declare function onHoldClick(...Arguments: any): object;
declare class Selected extends Base {
    static labelNo: number;
    static instances: {
        [key: string]: Selected;
    };
    static activeInstances: {
        [key: string]: Selected;
    };
    static defaults: {
        indexer: any[];
        getIndexerArray: (selectedInstance: Selected) => (DisplayCell | DisplayCell[])[];
    };
    static argMap: {
        string: string[];
        function: string[];
        Array: string[];
        number: string[];
        Pages: string[];
    };
    label: string;
    indexer_: (DisplayCell | DisplayCell[])[];
    get indexer(): (DisplayCell | DisplayCell[])[];
    set indexer(value: (DisplayCell | DisplayCell[])[]);
    getIndexerArray: (selectedInstance: Selected) => (DisplayCell | DisplayCell[])[];
    onselect: (index: number, displaycell: DisplayCell) => void;
    onunselect: (index: number, displaycell: DisplayCell) => void;
    startValue: number;
    currentButtonIndex: number;
    constructor(...Arguments: any);
    updateEvents(): void;
    select(displaycellOrNumber: DisplayCell | number): void;
    clear(): void;
    indexOf(displaycell: DisplayCell): number;
    onSelect(index: number): void;
    onUnselect(index: number): void;
}
declare class Pages extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Pages;
    };
    static activeInstances: {
        [key: string]: Pages;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    label: string;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    tree: Tree_;
    evalFunction: (thisPages: Pages) => number;
    cellArray: DisplayCell[];
    dim_: string;
    get dim(): string;
    set dim(value: string);
    prevPage: number;
    currentPage_: number;
    set currentPage(value: number);
    get currentPage(): number;
    constructor(...Arguments: any);
    onConnect(): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
declare function P(...Arguments: any): DisplayCell;
declare class Tree_ extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Tree_;
    };
    static activeInstances: {
        [key: string]: Tree_;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static scrollArrowsSVGCss: Css;
    static collapsedSVG(classname?: string): string;
    static expandedSVG(classname?: string): string;
    static extension: string;
    static toggleCollapse(el: HTMLElement, node: node_, mouseEvent: PointerEvent): void;
    static deRenderChildren(parentNode: node_): void;
    static pointerCss: Css;
    label: string;
    offsetx: number;
    offsety: number;
    css: string;
    Css: Css;
    indent: number;
    events: object;
    topMargin: number;
    sideMargin: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    scrollbarh: ScrollBar;
    scrollbarv: ScrollBar;
    node: node_;
    parentTreeNode: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    useSelected: boolean;
    selected: Selected;
    selectedNode: node_;
    selectedStartIndex: number;
    selectParents: boolean;
    cascadeCollapse: boolean;
    constructor(...Arguments: any);
    static icon(node: node_): string;
    newNode(node: node_): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
declare class Context extends Component {
    static Css: Css;
    static labelNo: number;
    static instances: {
        [key: string]: Context;
    };
    static activeInstances: {
        [key: string]: Context;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static pointOffset: number;
    static rootInstance: Context;
    byPoint: boolean;
    toTheRight: boolean;
    eventType: string;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    contextNode: node_;
    width: number;
    height: number;
    isShown: boolean;
    activeChild: Context;
    displaycell: DisplayCell;
    displaygroup: DisplayGroup;
    launchEvent: MouseEvent | PointerEvent;
    constructor(...Arguments: any);
    build(): void;
    static onclick(e: MouseEvent, displaycell: DisplayCell, node: node_): void;
    static currentAndParent(): Context[];
    static ContextOnMouseMove(event: MouseEvent | PointerEvent): void;
    static pop(): void;
    static currentInstance(deep?: number): [Context, number];
    launchContext(event?: PointerEvent | MouseEvent): void;
    onConnect(): void;
    setCoord(Pcoord?: Coord, event?: MouseEvent | PointerEvent): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    getChild(label: string): Component;
    delete(): void;
}
declare function context(...Arguments: any): Context;
declare class Modal extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Modal;
    };
    static activeInstances: {
        [key: string]: Modal;
    };
    static closeCss: Css;
    static closeSVGCss: Css;
    static closeSVG: string;
    static movingInstace: Modal;
    static offset: {
        x: number;
        y: number;
    };
    static onDown(): void;
    static onMove(mouseEvent: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    static onUp(mouseEvent: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static x: number;
    static y: number;
    rootDisplayCell: DisplayCell;
    label: string;
    node: node_;
    parentDisplayCell: DisplayCell;
    handler: Handler;
    get coord(): Coord;
    startCoord: Coord;
    sizer: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        width?: number;
        height?: number;
    };
    constructor(...Arguments: any);
    onConnect(): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    getChild(label: string): Component;
    delete(): void;
    show(): void;
    hide(event?: MouseEvent | PointerEvent): void;
    isShown(): boolean;
    dragWith(...displaycells: DisplayCell[]): void;
    closeWith(...displaycells: DisplayCell[]): void;
}
declare class winModal extends Base {
    static labelNo: number;
    static instances: {
        [key: string]: winModal;
    };
    static activeInstances: {
        [key: string]: winModal;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static titleCss: Css;
    static closeSVGCss: Css;
    static closeSVG: string;
    static whiteBGCss: Css;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    modal: Modal;
    titleText: string;
    innerHTML: string;
    headerHeight: number;
    fullDisplayCell: DisplayCell;
    titleDisplayCell: DisplayCell;
    closeDisplayCell: DisplayCell;
    headerDisplayCell: DisplayCell;
    bodyDisplayCell: DisplayCell;
    show(): void;
    hide(): void;
    constructor(...Arguments: any);
    build(): void;
}
declare class DragBar extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: DragBar;
    };
    static activeInstances: {
        [key: string]: DragBar;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static horCss: Css;
    static verCss: Css;
    static parentDisplayGroup(THIS: DragBar): [DisplayGroup, boolean];
    static dragStartDim: number;
    static onDown(e: MouseEvent | PointerEvent): void;
    static onMove(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
    static onUp(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
    node: node_;
    parentDisplayCell: DisplayCell;
    parentDisplayGroup: DisplayGroup;
    parentDisplayGroupChild: DisplayCell;
    children: Component[];
    min: number;
    max: number;
    width: number;
    dragbarDisplayCell: DisplayCell;
    get isHor(): boolean;
    isLast: boolean;
    constructor(...Arguments: any);
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
