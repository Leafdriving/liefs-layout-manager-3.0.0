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
    static isTypePx: (it: any) => string;
    static pxAsNumber: (dim: string) => number;
    static isTypePercent: (it: any) => string;
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
    clipStyleString(sub: Coord | Within): string;
}
declare class Coord {
    static instances: Coord[];
    static byLabel(label: string): Coord;
    static defaults: {
        label: () => string;
        x: number;
        y: number;
        width: number;
        height: number;
        zindex: number;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    static CopyArgMap: {
        Within: string[];
        Coord: string[];
        boolean: string[];
        number: string[];
    };
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zindex: number;
    within: Within;
    isRoot: boolean;
    constructor(...Arguments: any);
    copyWithin(...Arguments: any): void;
    copy(...Arguments: any): void;
    replace(x: number, y: number, width: number, height: number, zindex?: number): void;
    isCoordCompletelyOutside(WITHIN?: Coord | Within): boolean;
    derender(derender: boolean): boolean;
    clipStyleString(COORD: Coord | Within): string;
    newClipStyleString(WITHIN?: Coord | Within): string;
    static clipStyleString(WITHIN: Coord | Within, COORD: Coord | Within): string;
    isPointIn(x: number, y: number): boolean;
    asAttributeString(): string;
    newAsAttributeString(): string;
}
/**
 * This Class Holds the HTMLElement
 */
declare class HtmlBlock {
    static instances: HtmlBlock[];
    static byLabel(label: string): HtmlBlock;
    static defaults: {
        label: () => string;
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
        Tree: string[];
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
    /**
     * Constructor Arguments include:
     *
     *  label:string;[first string argument]
     *  innerHTML:string;[second string argument]
     *  tag:string;
     *  dim:string;
     *
     *  events: Events;
     *  el:HTMLElement;
     *
     *  marginLeft : number;
     *  marginRight : number;
     *  marginTop : number;
     *  marginBottom : number;
     *
     *
     * css:string - generated Argument of Class Css
     */
    constructor(...Arguments: any);
}
declare function html(...Arguments: any): HtmlBlock;
declare class Events {
    static elementId: string;
    static instances: Events[];
    static byLabel(label: string): Events;
    static history: string[];
    static defaults: {
        label: () => string;
    };
    static argMap: {
        string: string[];
    };
    label: string;
    actions: object;
    constructor(...Arguments: any);
    applyToHtmlBlock(htmlblock: HtmlBlock): void;
}
declare function events(...arguments: any): Events;
declare class DisplayCell {
    static instances: DisplayCell[];
    static byLabel(label: string): DisplayCell;
    static defaults: {
        dim: string;
    };
    static argMap: {
        string: string[];
        HtmlBlock: string[];
        DisplayGroup: string[];
        dim: string[];
        Pages: string[];
    };
    label: string;
    coord: Coord;
    htmlBlock: HtmlBlock;
    displaygroup: DisplayGroup;
    overlays: Overlay[];
    dim: string;
    isRendered: boolean;
    pages: Pages;
    constructor(...Arguments: any);
    addOverlay(overlay: Overlay): void;
    hMenuBar(menuObj: object): void;
    vMenuBar(menuObj: object): void;
}
declare function I(...Arguments: any): DisplayCell;
declare class DisplayGroup {
    static defaultMargins: number;
    static instances: DisplayGroup[];
    static byLabel(label: string): DisplayGroup;
    static defaults: {
        label: () => string;
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
    renderStartIndex: number;
    renderEndIndex: number;
    constructor(...Arguments: any);
    totalPx(): number;
}
declare function h(...Arguments: any): DisplayCell;
declare function v(...Arguments: any): DisplayCell;
declare class Handler {
    static handlerMarginDefault: number;
    static firstRun: boolean;
    static instances: Handler[];
    static byLabel(label: string): Handler;
    static defaults: {
        label: () => string;
        cssString: string;
        addThisHandlerToStack: boolean;
    };
    static argMap: {
        string: string[];
        number: string[];
        Coord: string[];
    };
    static argCustomTypes: Function[];
    static handlerZindexStart: number;
    static zindexIncrement: number;
    static handlerZindexIncrement: number;
    static currentZindex: number;
    label: string;
    rootCell: DisplayCell;
    coord: Coord;
    cssString: string;
    handlerMargin: number;
    addThisHandlerToStack: boolean;
    constructor(...Arguments: any);
    pop(): void;
    toTop(): void;
    static pop(handlerInstance?: Handler): void;
    static screensizeToCoord(dislaycell: DisplayCell, handlerMargin: number): void;
    static update(ArrayofHandlerInstances?: Handler[], instanceNo?: number, derender?: boolean): void;
    static renderDisplayCell(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    static renderDisplayGroup(parentDisplaycell: DisplayCell, derender: boolean): void;
    static renderHtmlBlock(displaycell: DisplayCell, derender: boolean, parentDisplaygroup: DisplayGroup): void;
    static renderHtmlAttributes(el: HTMLElement, htmlblock: HtmlBlock, id: string): void;
}
declare function H(...Arguments: any): Handler;
declare class Css {
    static elementId: string;
    static instances: Css[];
    static byLabel(label: string): Css;
    static defaults: {
        label: () => string;
        isClassname: boolean;
    };
    static argMap: {
        string: string[];
        boolean: string[];
    };
    label: string;
    asObj: object;
    asString: string;
    isClassname: boolean;
    constructor(...Arguments: any);
    makeString(): void;
    makeObj(): void;
    static byname(label: string): Css;
    static update(): void;
}
declare function css(label: string, content: string | object): Css;
declare class Pages {
    static activePages: Pages[];
    static instances: Pages[];
    static byLabel(label: string, source?: Pages[]): Pages;
    static defaults: {
        label: () => string;
        currentPage: number;
        previousPage: number;
        evalFunction: (thisPages: Pages) => number;
    };
    static argMap: {
        string: string[];
        number: string[];
        Function: string[];
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
}
declare function P(...arguments: any): DisplayCell;
declare class Drag {
    static instances: Drag[];
    static byLabel(label: string): Drag;
    static defaults: {
        label: () => string;
    };
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
}
declare class Swipe {
    static swipeDistance: number;
    static elementId: string;
    static instances: Swipe[];
    static defaults: {
        label: () => string;
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
declare class Hold {
    static instances: Hold[];
    static byLabel(label: string): Hold;
    static defaults: {
        label: () => string;
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
declare class DragBar {
    static horCss: Css;
    static verCss: Css;
    static instances: DragBar[];
    static byLabel(label: string): DragBar;
    static defaults: {
        label: () => string;
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
declare class ScrollBar {
    static instances: ScrollBar[];
    static byLabel(label: string): ScrollBar;
    static whiteBG: Css;
    static blackBG: Css;
    static defaults: {
        label: () => string;
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
    clickLeftorUp(mouseEvent: MouseEvent): void;
    clickRightOrDown(mouseEvent: MouseEvent): void;
    clickPageLeftorUp(mouseEvent: MouseEvent): void;
    clickPageRightOrDown(mouseEvent: MouseEvent): void;
    dragging(output: object): void;
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
}
declare class Context {
    static lastRendered: Context;
    static subOverlapPx: number;
    static instances: Context[];
    static byLabel(label: string): Context;
    static defaultContextCss: Css;
    static defaultContextCssHover: Css;
    static defaultMenuBarCss: Css;
    static defaultMenuBarHover: Css;
    static defaultMenuBarNoHoverCss: Css;
    static defaultObj: {
        one: () => void;
        two: () => void;
        three: () => void;
    };
    static defaults: {
        label: () => string;
        width: number;
        cellheight: number;
        css: Css;
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
declare class Modal {
    static instances: Modal[];
    static byLabel(label: string): Modal;
    static headerCss: Css;
    static footerCss: Css;
    static closeCss: Css;
    static closeCssHover: Css;
    static defaults: {
        label: () => string;
        showHeader: boolean;
        showFooter: boolean;
        resizeable: boolean;
        showClose: boolean;
        headerHeight: number;
        footerHeight: number;
        headerTitle: string;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        Coord: string[];
    };
    static x: number;
    static y: number;
    label: string;
    fullCell: DisplayCell;
    headerTitle: string;
    footerTitle: string;
    headerCell: DisplayCell;
    bodyCell: DisplayCell;
    footerCell: DisplayCell;
    coord: Coord;
    headerHeight: number;
    footerHeight: number;
    showHeader: boolean;
    showClose: boolean;
    showFooter: boolean;
    resizeable: boolean;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    handler: Handler;
    constructor(...Arguments: any);
    buildHeader(): void;
    buildFooter(): void;
    buildFull(): void;
    build(): void;
    show(): void;
    hide(): void;
    static startMoveModal(handler: Handler): void;
    static moveModal(handler: Handler, offset: object): void;
}
declare class TreeNode {
    static instances: TreeNode[];
    static byLabel(label: string): TreeNode;
    static defaults: {
        label: () => string;
    };
    static argMap: {
        DisplayCell: string[];
        string: string[];
        Props: string[];
        Array: string[];
        boolean: string[];
    };
    label: string;
    collapsed: boolean;
    labelCell: DisplayCell;
    props: Props;
    children: TreeNode[];
    horizontalDisplayCell: DisplayCell;
    nodeCellArray: DisplayCell[];
    constructor(...Arguments: any);
    visibleChildren(noChildren?: number): number;
    addDisplayCells(newCellArray?: DisplayCell[], isFirst?: boolean): DisplayCell[];
}
declare function T(...Arguments: any): TreeNode;
declare class Props {
    static instances: Props[];
    static byLabel(label: string): Props;
    static defaults: {
        label: () => string;
    };
    static argMap: {
        string: string[];
    };
    label: string;
    cellArray: DisplayCell[];
    constructor(...Arguments: any);
}
declare function props(...Arguments: any): Props;
declare class Tree {
    static instances: Tree[];
    static byLabel(label: string): Tree;
    static defaultObj: TreeNode;
    static defaults: {
        label: () => string;
        cellHeight: number;
        SVGColor: string;
        startIndent: number;
        indent: number;
        collapsePad: number;
        collapseSize: number;
    };
    static argMap: {
        string: string[];
        number: string[];
        TreeNode: string[];
        DisplayCell: string[];
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
    constructor(...Arguments: any);
    drawSVG(collapsed: boolean): string;
    toggleCollapse(node: TreeNode, mouseEvent: MouseEvent, el: any): void;
    static temp(cellArray: DisplayCell[]): void;
    buildTreeNode(node: TreeNode, cellArray: DisplayCell[], indent?: number): void;
    render(displaycell: DisplayCell): void;
}
declare function tree(...Arguments: any): DisplayCell;
