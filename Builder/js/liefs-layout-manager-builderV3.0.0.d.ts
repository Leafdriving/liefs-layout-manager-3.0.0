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
    static stringOrObject(instance: any): any;
    static defaults: object;
    static argMap: object;
    retArgs: ArgsObj;
    constructor();
    buildBase(...Arguments: any): void;
    static buildBase(THIS: any, ...Arguments: any): void;
    static makeLabel(instance: any): void;
}
declare class Test extends Base {
    static labelNo: number;
    static instances: Test[];
    static activeInstances: Test[];
    static defaults: {
        tag: string;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    constructor(...Arguments: any);
}
declare class FunctionStack {
    static instanceObj: {};
    static push(label: string, function_: Function): void;
    static function(label: string): (...Arguments: any) => void;
    static pop(label: string): void;
}
interface ArgsObj {
    [type: string]: any[];
}
interface ArgsFunctions {
    [type: string]: Function[];
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
    static concatArray(main: DisplayCell[], added: DisplayCell[]): void;
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
interface Offset {
    x: number;
    y: number;
    width: number;
    height: number;
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
declare function events(...arguments: any): Events;
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
    hMenuBar(menuObj: object): void;
    vMenuBar(menuObj: object): void;
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
        Overlay: string[];
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
    overlay: Overlay;
    offset: number;
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
    static context: Css;
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
    dim: string;
    constructor(...Arguments: any);
    eval(): any;
    evalCell(): DisplayCell;
    setPage(pageNumber: number): void;
    addSelected(pageNumber?: number): void;
    static setPage(label: string, pageNumber: number): void;
    static applyOnclick(): void;
    indexByName(name: string): number;
    static button(pagename: string, index: string | number): object;
    static parseURL(url?: string): void;
    static pushHistory(): void;
    static popstate(event: PopStateEvent): void;
}
declare function P(...arguments: any): DisplayCell;
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
    static horCss: Css;
    static verCss: Css;
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
    static instances: ScrollBar[];
    static activeInstances: ScrollBar[];
    static whiteBG: Css;
    static blackBG: Css;
    static defaults: {
        offset: number;
        displayAtEnd: boolean;
        scrollWidth: number;
        currentlyRendered: boolean;
        arrowOffset: number;
    };
    static argMap: {
        string: string[];
        DisplayGroup: string[];
        number: string[];
        boolean: string[];
    };
    static scrollWheelMult: number;
    static triggerDistance: number;
    label: string;
    currentlyRendered: boolean;
    ishor: boolean;
    arrowOffset: number;
    scrollWidth: number;
    displayAtEnd: boolean;
    fixedPixels: number;
    viewingPixels: number;
    offset: number;
    maxOffset: number;
    offsetAtDrag: number;
    offsetPixelRatio: number;
    parentDisplaygroup: DisplayGroup;
    displaygroup: DisplayGroup;
    displaycell: DisplayCell;
    leftArrow: DisplayCell;
    upArrow: DisplayCell;
    prePaddle: DisplayCell;
    paddle: DisplayCell;
    postPaddle: DisplayCell;
    rightArrow: DisplayCell;
    downArrow: DisplayCell;
    paddleSizePx: number;
    displayedFixedPx: number;
    constructor(...Arguments: any);
    build(): void;
    clickLeftorUp(mouseEvent: MouseEvent | WheelEvent, noTimes?: number): void;
    clickRightOrDown(mouseEvent: MouseEvent | WheelEvent, noTimes?: number): void;
    clickPageLeftorUp(mouseEvent: MouseEvent | WheelEvent): void;
    clickPageRightOrDown(mouseEvent: MouseEvent | WheelEvent): void;
    dragging(output: object): void;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    static distOfMouseFromWheel(THIS: ScrollBar, event: WheelEvent): number;
    static onWheel(event: WheelEvent): void;
}
declare class Context extends Base {
    static lastRendered: Context;
    static subOverlapPx: number;
    static instances: Context[];
    static activeInstances: Context[];
    static defaultMenuBarCss: Css;
    static defaultMenuBarHover: Css;
    static defaultMenuBarNoHoverCss: Css;
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
declare class Modal extends Base {
    static instances: Modal[];
    static activeInstances: Modal[];
    static headerCss: Css;
    static footerCss: Css;
    static closeCss: Css;
    static closeCssHover: Css;
    static bodyCss: Css;
    static optionsCss: Css;
    static defaults: {
        showHeader: boolean;
        showFooter: boolean;
        resizeable: boolean;
        showClose: boolean;
        showOptions: boolean;
        headerHeight: number;
        footerHeight: number;
        headerTitle: string;
        footerTitle: string;
        innerHTML: string;
        optionsHeight: number;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        Coord: string[];
    };
    static x: number;
    static y: number;
    static offset: {
        x: number;
        y: number;
    };
    static movingInstace: Modal;
    label: string;
    headerTitle: string;
    footerTitle: string;
    innerHTML: string;
    fullCell: DisplayCell;
    headerCell: DisplayCell;
    bodyCell: DisplayCell;
    optionsCell: DisplayCell;
    footerCell: DisplayCell;
    headerHeight: number;
    optionsHeight: number;
    footerHeight: number;
    showHeader: boolean;
    showClose: boolean;
    showFooter: boolean;
    showOptions: boolean;
    resizeable: boolean;
    handler: Handler;
    coord: Coord;
    withinCoord: Coord;
    constructor(...Arguments: any);
    setSize(...numbers: number[]): void;
    setContent(html: string): void;
    setTitle(html: string): void;
    setFooter(html: string): void;
    buildClose(): DisplayCell;
    buildHeader(): void;
    buildFooter(): void;
    buildOptions(): void;
    buildFull(): void;
    build(): void;
    show(): void;
    hide(): void;
    preRenderCallback(handler: Handler): void;
    static startMoveModal(handler: Handler): void;
    static moveModal(handler: Handler, offset: {
        x: number;
        y: number;
    }): void;
}
declare class Stretch extends Base {
    static labelNo: number;
    static instances: Stretch[];
    static activeInstances: Stretch[];
    static defaults: {
        pxSize: number;
        minWidth: number;
        minHeight: number;
        onUpCallBack: () => void;
    };
    static argMap: {
        string: string[];
        Modal: string[];
    };
    static NWcss: Css;
    static NEcss: Css;
    static startCoord: Coord;
    static corner: string;
    label: string;
    parentModal: Modal;
    parentDisplaycell: DisplayCell;
    pxSize: number;
    UL: DisplayCell;
    UR: DisplayCell;
    LL: DisplayCell;
    LR: DisplayCell;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    onUpCallBack: Function;
    events(corner: string): Events;
    constructor(...Arguments: any);
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function stretch(...Arguments: any): DisplayCell | Modal;
declare class TreeNode extends Base {
    static instances: TreeNode[];
    static activeInstances: TreeNode[];
    static defaults: {};
    static argMap: {
        DisplayCell: string[];
        string: string[];
        Array: string[];
        boolean: string[];
    };
    label: string;
    collapsed: boolean;
    labelCell: DisplayCell;
    children: TreeNode[];
    horizontalDisplayCell: DisplayCell;
    nodeCellArray: DisplayCell[];
    constructor(...Arguments: any);
    visibleChildren(noChildren?: number): number;
    addDisplayCells(newCellArray?: DisplayCell[], isFirst?: boolean): DisplayCell[];
}
declare function T(...Arguments: any): TreeNode;
declare class Tree extends Base {
    static instances: Tree[];
    static activeInstances: Tree[];
    static defaultObj: TreeNode;
    static defaults: {
        cellHeight: number;
        SVGColor: string;
        startIndent: number;
        indent: number;
        collapsePad: number;
        collapseSize: number;
        margin: number;
    };
    static argMap: {
        string: string[];
        number: string[];
        TreeNode: string[];
        DisplayCell: string[];
        Events: string[];
        t_: string[];
    };
    collapseSize: number;
    collapsePad: number;
    startIndent: number;
    indent: number;
    label: string;
    parentDisplayCell: DisplayCell;
    rootTreeNode: TreeNode;
    cellHeight: number;
    SVGColor: string;
    coord: Coord;
    t_instance: t_;
    margin: number;
    css: string;
    events: Events;
    constructor(...Arguments: any);
    drawSVG(collapsed: boolean): string;
    toggleCollapse(node: TreeNode, mouseEvent: MouseEvent, el: any): void;
    buildTreeNode(node: TreeNode, cellArray: DisplayCell[], indent?: number): void;
    render(displaycell: DisplayCell): void;
    static autoLabelTreenodes(label: string, rootNode: t_): TreeNode;
    static autoLabel(tObj: t_, postfix: string): void;
    static makeTreeNodes(node: t_): TreeNode;
    static t(...Arguments: any): t_;
    static i(...Arguments: any): i_;
    static onclick(event: MouseEvent): void;
}
declare function tree(...Arguments: any): DisplayCell;
declare function TI(...Arguments: any): t_;
declare class i_ {
    label: string;
    Arguments: any[];
    constructor(...Arguments: any);
}
declare class t_ {
    label: string;
    TreeNodeArguments: any[];
    ItemArguments: any[];
    constructor(...Arguments: any);
}
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
    static labelNo: number;
    static instances: Dockable[];
    static activeInstances: Dockable[];
    static defaults: {
        type: string;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
    };
    static open: number;
    static activeToolbar: ToolBar;
    dummy: DisplayCell;
    label: string;
    type: string;
    rootDisplayCell: DisplayCell;
    displaygroup: DisplayGroup;
    dropZones: Coord[];
    constructor(...Arguments: any);
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function dockable(...Arguments: any): DisplayCell;
declare class ToolBar extends Base {
    static labelNo: number;
    static instances: ToolBar[];
    static activeInstances: ToolBar[];
    static llm_checker: Css;
    static defaults: {
        sizePx: number;
        isDocked: boolean;
        isHor: boolean;
        type: string;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    static triggerUndockDistance: number;
    static isMoving: boolean;
    static activeInstace: ToolBar;
    label: string;
    type: string;
    sizePx: number;
    parentDisplayGroup: DisplayGroup;
    rootDisplayCell: DisplayCell;
    displaycells: DisplayCell[];
    spacer: DisplayCell;
    hBar: DisplayCell;
    vBar: DisplayCell;
    modal: Modal;
    isDocked: boolean;
    isHor: boolean;
    coord: Coord;
    constructor(...Arguments: any);
    static startMoveToolbar(THIS: ToolBar, handler: Handler): void;
    static moveToolbar(THIS: ToolBar, handler: Handler, offset: {
        x: number;
        y: number;
    }): void;
    static undock(THIS: ToolBar, handler: Handler, offset: {
        x: number;
        y: number;
    }): void;
    build(): void;
    makeModal(): void;
    setModalSize(): [number, number];
    sizeFunction(thisPages: Pages): number;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare function tool_bar(...Arguments: any): DisplayCell;
declare class bCss {
    static bgLight: Css;
    static bgGreen: Css;
    static bgBlue: Css;
    static bgCyan: Css;
    static menuItem: Css;
    static menuSpace: Css;
    static handlerSVG: Css;
    static hSVG: Css;
    static vSVG: Css;
    static ISVG: Css;
    static pagesSVG: Css;
}
declare class Builder {
    constructor();
    static updateTree(handler: Handler): t_;
    static DC(displaycell: DisplayCell, indent: string): string;
    static HB(htmlblock: HtmlBlock, indent: string): string;
    static DG(displaygroup: DisplayGroup, indent: string): string;
    static PG(pages: Pages, indent: string): string;
}
