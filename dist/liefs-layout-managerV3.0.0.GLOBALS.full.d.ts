interface ArgsObj {
    [type: string]: any[];
}
interface ArgsFunctions {
    [type: string]: Function[];
}
interface ArgMap {
    [key: string]: string[];
}
interface Offset {
    x: number;
    y: number;
    width: number;
    height: number;
}
declare class BaseF {
    static ifObjectMergeWithDefaults(THIS: any, CLASS: any): object;
    static retArgsMapped(updatedDefaults: object, THIS: any, CLASS: any): object;
    static argumentsByType(Args: any[], // 1st argument is a list of args.
    customTypes?: Function[]): ArgsObj;
    static modifyClassProperties(argobj: object, targetobject: object): void;
    static mergeObjects: (startObj: object, AddObj: object) => object;
}
declare class Base {
    static defaultIsChecks: any;
    static byLabel(label: string): any;
    static pop(instance?: any): void;
    static push(instance: any, toActive?: boolean): void;
    static deactivate(instance: any): void;
    static activate(instance: any): void;
    static isActive(instance: any): boolean;
    static stringOrObject(instance: any): any;
    static defaults: object;
    static argMap: object;
    retArgs: ArgsObj;
    constructor();
    buildBase(...Arguments: any): void;
    static buildBase(THIS: any, ...Arguments: any): void;
    static makeLabel(instance: any): void;
}
interface FStack {
    [key: string]: [Function, string][];
}
declare class FunctionStack {
    static instanceObj: FStack;
    static push(label: string, function_: Function, name?: any): void;
    static function(label: string): (...Arguments: any) => void;
    static pop(label: string, name?: any): void;
}
declare class mf {
    /**
    * Sample Comment
    * argobj is blah blah
    * @returns blah blah
    */
    static modifyClassProperties(argobj: object, targetobject: object): void;
    static applyArguments(callLabel: string, Arguments: any, classDefaults: object, classArgmap: object, THIS: object, customtypes?: Function[]): void;
}
declare class pf {
    /**
    * 'message' is the string outputed to the viewer
    * @returns nothing
    */
    static errorHandling(message: string): void;
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
    static retArgsMapped(retArgs: ArgsObj, defaults: object, argsMap: object): object;
    static ifObjectMergeWithDefaults(retArgs: ArgsObj, defaults: object): object;
    static mergeObjects: (startObj: object, AddObj: object) => object;
    static sortArgs(Args: any[], // 1st argument is a list of args.
    label?: string, // 2nd argument is a debug label
    customTypes?: Function[]): ArgsObj;
    static setAttrib(el: Element, attrib: string, value: string): void;
    static getAttribs(el: HTMLElement, retObj?: object): object;
    static elExists(id_label: string): HTMLElement;
    static viewport(): number[];
    static errorReporting(errString: string): void;
    static uis0(num: number): number;
    static parseURLParams(url?: string): {};
}
declare class Point {
    x: number;
    y: number;
}
declare class Within {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(...Arguments: any);
    clipStyleString(sub: Coord): string;
    reset(): void;
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
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    zindex: number;
    within: Within;
    isRoot: boolean;
    hideWidth: boolean;
    offset: Offset;
    constructor(...Arguments: any);
    setOffset(x?: number, y?: number, width?: number, height?: number): void;
    cropWithin(within?: Coord | Within): void;
    applyMargins(left: number, top: number, right: number, bottom: number): void;
    assign(x?: any, y?: any, width?: any, height?: any, wx?: any, wy?: any, wwidth?: any, wheight?: any, zindex?: any): void;
    copy(fromCoord: Coord): void;
    log(): void;
    isCoordCompletelyOutside(WITHIN?: Coord | Within): boolean;
    derender(derender: boolean): boolean;
    clipStyleString(COORD: Coord): string;
    newClipStyleString(WITHIN?: Coord | Within): string;
    static clipStyleString(WITHIN: Coord | Within, COORD: Coord): string;
    isPointIn(x: number, y: number): boolean;
    asAttributeString(): string;
    newAsAttributeString(): string;
}
/**
 * This Class Holds the HTMLElement
 */
declare class HtmlBlock extends Base {
    static instances: HtmlBlock[];
    static activeInstances: HtmlBlock[];
    static defaults: {
        innerHTML: string;
        tag: string;
        css: string;
        dim: string;
    };
    static argMap: {
        string: string[];
        dim: string[];
        Events: string[];
        number: string[];
        boolean: string[];
    };
    label: string;
    tag: string;
    innerHTML: string;
    css: string;
    dim: string;
    events: Events;
    el: HTMLElement;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    attributes: object;
    hideWidth: boolean;
    minDisplayGroupSize: number;
    constructor(...Arguments: any);
}
declare function html(...Arguments: any): HtmlBlock;
declare class Events extends Base {
    static elementId: string;
    static instances: Events[];
    static activeInstances: Events[];
    static history: string[];
    static defaults: {};
    static argMap: {
        string: string[];
    };
    label: string;
    actions: object;
    constructor(...Arguments: any);
    applyToHtmlBlock(htmlblock: HtmlBlock): void;
    static do(event: MouseEvent): void;
}
declare function events(...Arguments: any): Events;
declare class DisplayCell extends Base {
    #private;
    static instances: DisplayCell[];
    static activeInstances: DisplayCell[];
    static minDisplayGroupSize: number;
    static defaults: {
        dim: string;
    };
    static argMap: {
        string: string[];
        HtmlBlock: string[];
        DisplayGroup: string[];
        dim: string[];
        Pages: string[];
        function: string[];
    };
    label: string;
    coord: Coord;
    get htmlBlock(): HtmlBlock;
    set htmlBlock(htmlblock: HtmlBlock);
    get displaygroup(): DisplayGroup;
    set displaygroup(displaygroup: DisplayGroup);
    overlays: Overlay[];
    dim: string;
    isRendered: boolean;
    pages: Pages;
    preRenderCallback: Function;
    postRenderCallback: Function;
    minDisplayGroupSize_: number;
    get minDisplayGroupSize(): number;
    set minDisplayGroupSize(size: number);
    constructor(...Arguments: any);
    addOverlay(overlay: Overlay): void;
    getOverlay(label: string): Overlay;
    getOverlays(label: string): Overlay[];
    popOverlay(label: string): void;
    hMenuBar(menuObj: object): void;
    vMenuBar(menuObj: object): void;
    static concatArray(main: DisplayCell[], added: DisplayCell[]): void;
}
declare function I(...Arguments: any): DisplayCell;
declare class DisplayGroup extends Base {
    static defaultMargins: number;
    static instances: DisplayGroup[];
    static activeInstances: DisplayGroup[];
    static defaults: {
        ishor: boolean;
        marginHor: number;
        marginVer: number;
    };
    static argMap: {
        string: string[];
        boolean: string[];
        number: string[];
        dim: string[];
    };
    static argCustomTypes: Function[];
    label: string;
    ishor: boolean;
    cellArray: DisplayCell[];
    coord: Coord;
    htmlBlock: HtmlBlock;
    marginHor: number;
    marginVer: number;
    dim: string;
    offset: number;
    dimArrayTotal: number;
    constructor(...Arguments: any);
    percentToPx(displaycell: DisplayCell): void;
    totalPx(addMin?: boolean): number;
}
declare function h(...Arguments: any): DisplayCell;
declare function v(...Arguments: any): DisplayCell;
declare class Handler extends Base {
    static handlerMarginDefault: number;
    static firstRun: boolean;
    static instances: Handler[];
    static activeInstances: Handler[];
    static defaults: {
        cssString: string;
        addThisHandlerToStack: boolean;
        controlledBySomething: boolean;
        activeOffset: boolean;
    };
    static argMap: {
        string: string[];
        number: string[];
        Coord: string[];
        function: string[];
        boolean: string[];
    };
    static screenSizeCoord: Coord;
    static renderNullObjects: boolean;
    static argCustomTypes: Function[];
    static handlerZindexStart: number;
    static zindexIncrement: number;
    static handlerZindexIncrement: number;
    static currentZindex: number;
    static renderAgain: boolean;
    static activeOffset: boolean;
    label: string;
    rootCell: DisplayCell;
    coord: Coord;
    cssString: string;
    handlerMargin: number;
    addThisHandlerToStack: boolean;
    preRenderCallback: Function;
    postRenderCallback: Function;
    constructor(...Arguments: any);
    pop(): Handler;
    toTop(): void;
    static pop(handlerInstance?: Handler): Handler;
    static screensizeToCoord(dislaycell: DisplayCell, handlerMargin: number): void;
    static updateScreenSize(): void;
    static update(ArrayofHandlerInstances?: Handler[], instanceNo?: number, derender?: boolean): void;
    static renderDisplayCell(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    static renderDisplayGroup(parentDisplaycell: DisplayCell, derender: boolean): void;
    static renderHtmlBlock(displaycell: DisplayCell, derender: boolean, parentDisplaygroup: DisplayGroup): void;
    static renderHtmlAttributes(el: HTMLElement, htmlblock: HtmlBlock, id: string): void;
}
declare function H(...Arguments: any): Handler;
declare class Css extends Base {
    static theme: any;
    static elementId: string;
    static instances: Css[];
    static activeInstances: Css[];
    static byLabel(classname: string): Css;
    static defaults: {
        css: () => string;
        isClassname: boolean;
    };
    static argMap: {
        string: string[];
        boolean: string[];
    };
    static deleteOnFirstRunClassname: string;
    classname: string;
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
    makeString(obj?: object, postfix?: string, addToClassName?: string): string;
    makeObj(str?: string): object;
    static byname(css: string): Css;
    static update(): void;
}
declare function css(...Arguments: any): Css;
declare class DefaultTheme {
    static advisedDiv: Css;
    static advisedBody: Css;
    static titleCss: Css;
    static ScrollBar_whiteBG: Css;
    static ScrollBar_blackBG: Css;
    static scrollArrowsSVGCss: Css;
    static arrowSVGCss: Css;
    static leftArrowSVG(classname: string): string;
    static rightArrowSVG(classname: string): string;
    static upArrowSVG(classname: string): string;
    static downArrowSVG(classname: string): string;
    static closeCss: Css;
    static closeSVGCss: Css;
    static closeSVG: string;
    static horCss: Css;
    static verCss: Css;
    static context: Css;
    static llm_checker: Css;
}
declare class Pages extends Base {
    static activePages: Pages[];
    static instances: Pages[];
    static activeInstances: Pages[];
    static defaults: {
        currentPage: number;
        previousPage: number;
        evalFunction: (thisPages: Pages) => number;
    };
    static argMap: {
        string: string[];
        number: string[];
        function: string[];
        dim: string[];
    };
    label: string;
    displaycells: DisplayCell[];
    currentPage: number;
    previousPage: number;
    evalFunction: Function;
    get dim(): string;
    set dim(value: string);
    constructor(...Arguments: any);
    eval(): any;
    evalCell(): DisplayCell;
    setPage(pageNumber: number | string): void;
    byLabel(label: string): number;
    static byLabel(label: string): Pages;
    addSelected(pageNumber?: number): void;
    static setPage(label: string, pageNumber: number | string): void;
    static applyOnclick(): void;
    static button(pagename: string, index: string | number, keepAsNumber?: boolean): object;
    static parseURL(url?: string): void;
    static pushHistory(): void;
    static popstate(event: PopStateEvent): void;
}
declare function P(...Arguments: any): DisplayCell;
declare class Drag extends Base {
    static instances: Drag[];
    static activeInstances: Drag[];
    static defaults: {};
    static argMap: {
        string: string[];
    };
    label: string;
    el: HTMLDivElement;
    onDown: Function;
    onMove: Function;
    onUp: Function;
    isDown: boolean;
    mousePos: object;
    mouseDiff: object;
    constructor(...Arguments: any);
    reset(): void;
    static disableSelect(event: MouseEvent): void;
}
declare class Swipe extends Base {
    static swipeDistance: number;
    static elementId: string;
    static instances: Swipe[];
    static activeInstances: Swipe[];
    static defaults: {
        swipeDistance: number;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    label: string;
    swipeDistance: number;
    constructor(...Arguments: any);
}
declare function swipe(...Arguments: any): object;
declare class Hold extends Base {
    static instances: Hold[];
    static activeInstances: Hold[];
    static defaults: {
        startTime: number;
        repeatTime: number;
        doOnclick: boolean;
    };
    static argMap: {
        string: string[];
    };
    doOnclick: boolean;
    label: string;
    el: HTMLDivElement;
    onDown: Function;
    event: Function;
    onUp: Function;
    isDown: boolean;
    startTime: number;
    repeatTime: number;
    constructor(...Arguments: any);
    static start(THIS: Hold): void;
}
declare class Overlay {
    static instances: Overlay[];
    static byLabel(label: string): Overlay;
    static classes: {};
    label: string;
    sourceClassName: string;
    returnObj: object;
    currentlyRendered: boolean;
    constructor(...Arguments: any);
    renderOverlay(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare class DragBar extends Base {
    static instances: DragBar[];
    static activeInstances: DragBar[];
    static defaults: {
        horcss: Css;
        vercss: Css;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        number: string[];
        Css: string[];
    };
    label: string;
    parentDisplaycell: DisplayCell;
    parentDisplaygroup: DisplayGroup;
    displaycell: DisplayCell;
    startpos: number;
    min: number;
    max: number;
    pxsize: number;
    horcss: Css;
    vercss: Css;
    ishor: boolean;
    isLast: boolean;
    constructor(...Arguments: any);
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function dragbar(...Arguments: any): DisplayCell;
declare class ScrollBar extends Base {
    static labelNo: number;
    static instances: ScrollBar[];
    static activeInstances: ScrollBar[];
    static defaults: {
        barSize: number;
        offset: number;
        type: string;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        number: string[];
        boolean: string[];
    };
    static startoffset: number;
    label: string;
    type: string;
    displaySize: number;
    viewPortSize: number;
    barSize: number;
    offset: number;
    scaleFactor: number;
    ishor: boolean;
    coord: Coord;
    parentDisplaycell: DisplayCell;
    scrollbarDisplayCell: DisplayCell;
    preBar: DisplayCell;
    Bar: DisplayCell;
    postBar: DisplayCell;
    constructor(...Arguments: any);
    build(): void;
    onBarDown(): void;
    onBarMove(xmouseDiff: object): void;
    onPreBar(mouseEvent?: MouseEvent): void;
    onPostBar(mouseEvent?: MouseEvent): void;
    onBackArrow(mouseEvent?: MouseEvent): void;
    onForwardArrow(mouseEvent?: MouseEvent): void;
    validateOffsetAndRender(): void;
    update(displaySize: number): number;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    delete(): void;
    onWheel(event: WheelEvent): void;
    static onWheel(event: WheelEvent): void;
    static distOfMouseFromWheel(THIS: ScrollBar, event: WheelEvent): number;
}
declare function scrollbar(...Arguments: any): DisplayCell;
declare class Context extends Base {
    static lastRendered: Context;
    static subOverlapPx: number;
    static instances: Context[];
    static activeInstances: Context[];
    static defaultObj: {
        one: () => void;
        two: () => void;
        three: () => void;
    };
    static defaults: {
        width: number;
        cellheight: number;
        css: any;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    label: string;
    menuObj: object;
    x: number;
    y: number;
    width: number;
    cellheight: number;
    height: number;
    displaycell: DisplayCell;
    coord: Coord;
    css: Css;
    handler: Handler;
    launchcell: DisplayCell;
    parentContext: Context;
    constructor(...Arguments: any);
    buildCell(): void;
    popAll(): void;
    pop(): void;
    managePop(mouseEvent: MouseEvent): void;
    render(mouseEvent: MouseEvent, x?: number, y?: number): void;
    hMenuBarx(): number;
    hMenuBary(): number;
    vMenuBarx(): number;
    vMenuBary(): number;
}
declare let context: (...Arguments: any) => (mouseEvent: MouseEvent) => boolean;
declare let hMenuBar: (...Arguments: any) => (mouseEvent: MouseEvent) => boolean;
declare let vMenuBar: (...Arguments: any) => (mouseEvent: MouseEvent) => boolean;
declare enum ModalType {
    winModal = "winModal",
    toolbar = "toolbar",
    other = "other"
}
declare class Modal extends Base {
    static labelNo: number;
    static instances: Modal[];
    static activeInstances: Modal[];
    static x: number;
    static y: number;
    static offset: {
        x: number;
        y: number;
    };
    static movingInstace: Modal;
    static setSize(THIS: Modal, ...numbers: number[]): void;
    static events(THIS: Modal): Events;
    static startMoveModal(THIS: Modal): void;
    static moveModal(THIS: Modal, offset: {
        x: number;
        y: number;
    }): void;
    static defaults: {
        type: ModalType;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
    };
    label: string;
    rootDisplayCell: DisplayCell;
    handler: Handler;
    type: ModalType;
    get coord(): Coord;
    constructor(...Arguments: any);
    setSize(...numbers: number[]): void;
    show(): void;
    hide(): void;
    isShown(): boolean;
    dragWith(...Arguments: any): void;
    closeWith(...Arguments: any): void;
}
declare class winModal extends Base {
    static labelNo: number;
    static instances: winModal[];
    static activeInstances: winModal[];
    static defaults: {
        headerHeight: number;
        buttonsHeight: number;
        footerHeight: number;
        headerText: string;
        bodyText: string;
    };
    static argMap: {
        string: string[];
    };
    retArgs: ArgsObj;
    label: string;
    rootDisplayCell: DisplayCell;
    header: DisplayCell;
    headerHeight: number;
    headerText: string;
    body: DisplayCell;
    bodyText: string;
    footer: DisplayCell;
    footerHeight: number;
    footerText: string;
    modal: Modal;
    constructor(...Arguments: any);
    buildClose(): DisplayCell;
    buildHeader(): DisplayCell;
    buildBody(): DisplayCell;
    buildFooter(): DisplayCell;
    build(): void;
}
declare class node_ extends Base {
    static labelNo: number;
    static instances: Tree_[];
    static activeInstances: Tree_[];
    static defaults: {
        collapsed: boolean;
    };
    static argMap: ArgMap;
    static newNode(THIS: node_, ...Arguments: any): node_;
    renderx: number;
    rendery: number;
    retArgs: ArgsObj;
    label: string;
    Arguments: any;
    ParentNodeTree: Tree_;
    ParentNode: node_;
    PreviousSibling: node_;
    NextSibling: node_;
    collapsed: boolean;
    displaycell: DisplayCell;
    children: node_[];
    constructor(...Arguments: any);
    depth(node?: node_, deep?: number): number;
    siblingObject(top?: node_, returnObject?: {}): {};
    newChild(...Arguments: any): node_;
    newSibling(...Arguments: any): node_;
    topSibling(): node_;
    bottomSibling(): node_;
    pop(): this;
    nextSibling(): node_;
    previousSibling(): node_;
    firstChild(): node_;
    done(): Tree_;
    root(): node_;
    parent(): node_;
    log(): void;
    byLabel(label: string): any;
}
declare function sample(): Tree_;
declare const defaultArgMap: ArgMap;
declare class Tree_ extends Base {
    static labelNo: number;
    static instances: Tree_[];
    static activeInstances: Tree_[];
    static toggleCollapse(el: HTMLElement, node: node_, mouseEvent: MouseEvent): void;
    static onNodeCreation(node: node_): void;
    static defaults: {
        height: number;
        indent: number;
        onNodeCreation: typeof Tree_.onNodeCreation;
        topMargin: number;
        sideMargin: number;
        tabSize: number;
        collapsedIcon: string;
        expandedIcon: string;
        iconClass: string;
        offsetx: number;
        offsety: number;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        function: string[];
        number: string[];
        Css: string[];
        Events: string[];
        node_: string[];
    };
    Arguments: any;
    retArgs: ArgsObj;
    label: string;
    collapsedIcon: string;
    expandedIcon: string;
    iconClass: string;
    offsetx: number;
    offsety: number;
    rootNode: node_;
    height: number;
    css: string;
    Css: Css;
    indent: number;
    parentDisplayCell: DisplayCell;
    events: Events;
    offset: number;
    finalParentDisplayCellWidth: number;
    node_arg_map: ArgMap;
    topMargin: number;
    sideMargin: number;
    tabSize: number;
    onNodeCreation: (node: node_) => void;
    traverse(traverseFunction: (node: node_) => void, node?: node_, traverseChildren?: (node: node_) => boolean, traverseNode?: (node: node_) => boolean): void;
    constructor(...Arguments: any);
    newRoot(node: node_): void;
    root(...Arguments: any): node_;
    log(): void;
    derender(node: node_): void;
    derenderChildren(node: node_): void;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    popOverlay(ishor: boolean): void;
    getScrollBarsFromOverlays(): ScrollBar[];
}
declare function tree(...Arguments: any): DisplayCell;
declare class Observe extends Base {
    static instances: Observe[];
    static activeInstances: Observe[];
    static defaults: {};
    static argMap: {
        string: string[];
        HTMLDivElement: string[];
        DisplayCell: string[];
    };
    static Os_ScrollbarSize: number;
    label: string;
    el: HTMLDivElement;
    parentDisplayCell: DisplayCell;
    constructor(...Arguments: any);
    static derender(displaycell: DisplayCell): void;
    static onScroll(event: WheelEvent): void;
    static update(): void;
}
declare class Dockable extends Base {
    static activeDropZoneIndex: number;
    static DockableOwner: string;
    static labelNo: number;
    static instances: Dockable[];
    static activeInstances: Dockable[];
    static defaults: {
        acceptsTypes: string[];
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
    };
    retArgs: ArgsObj;
    label: string;
    displaycell: DisplayCell;
    displaygroup: DisplayGroup;
    acceptsTypes: string[];
    dropZones: Coord[];
    dummy: DisplayCell;
    constructor(...Arguments: any);
    undock(e: CustomEvent): void;
    dropped(e: CustomEvent): void;
    render(unuseddisplaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function dockable(...Arguments: any): DisplayCell;
declare enum TBState {
    dockedInVertical = "dockedInVertical",
    dockedInHorizontal = "dockedInHorizontal",
    modalWasDockedInHor = "modalWasDockedInHor",
    modalWasDockedInVer = "modalWasDockedInVer"
}
declare class ToolBar extends Base {
    static labelNo: number;
    static instances: ToolBar[];
    static activeInstances: ToolBar[];
    static defaults: {
        state: TBState;
        checkerSize: number;
        type: string;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    retArgs: ArgsObj;
    label: string;
    state: TBState;
    displayCells: DisplayCell[];
    rootDisplayCell: DisplayCell;
    width: number;
    height: number;
    parentDisplayGroup: DisplayGroup;
    modal: Modal;
    checkerSize: number;
    type: string;
    constructor(...Arguments: any);
    buildModal(): void;
    size(): number[];
    toggleDirection(e: MouseEvent): void;
    resizeForModal(): void;
    resizeFordock(): void;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function toolBar(...Arguments: any): DisplayCell;
declare class BindHandler extends Base {
    static labelNo: number;
    static instances: BindHandler[];
    static activeInstances: BindHandler[];
    static defaults: {};
    static argMap: {
        string: string[];
        DisplayCell: string[];
        Handler: string[];
    };
    parentDisplaycell: DisplayCell;
    handler: Handler;
    constructor(...Arguments: any);
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function bindHandler(...Arguments: any): DisplayCell;