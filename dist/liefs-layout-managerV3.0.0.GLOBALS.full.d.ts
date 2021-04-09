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
interface RenderChild {
    child: object;
    derender: boolean;
}
interface zindexAndRenderChildren {
    zindex: number;
    children?: RenderChild[];
    siblings?: RenderChild[];
}
declare class BaseF {
    static ifObjectMergeWithDefaults(THIS: any, CLASS: any): object;
    static retArgsMapped(updatedDefaults: object, THIS: any, CLASS: any): object;
    static typeof(Argument: any): string;
    static argumentsByType(Args: any[], // 1st argument is a list of args.
    customTypes?: Function[]): ArgsObj;
    static modifyClassProperties(argobj: object, targetobject: object): void;
    static mergeObjects: (startObj: object, AddObj: object) => object;
}
declare class Base {
    static Render(instance: object, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    toCode: Function;
    label: string;
    renderNode: node_;
    constructor(...neverRead: any);
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
    static exists(label: string, name: string): boolean;
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
    static insideOfFunctionString(functionString: string): string;
    static array_move(arr: any[], old_index: number, new_index: number): void;
    static preUnderscore(someString: string): string;
    static uis0(num: number): number;
    static parseURLParams(url?: string): {};
}
declare class Render {
    static oldRootnode: node_;
    static node: node_;
    static zIncrement: number;
    static zHandlerIncrement: number;
    static update(source?: any, derender?: boolean, zindex?: number): void;
    static RenderObjectList(renderChildren: RenderChild[], node: node_, zindex?: number, isSibling?: boolean): void;
    static classes: {};
    static className(object_: object): string;
    static register(label: string, object_: object): void;
    static log(show?: boolean): void;
}
declare class RenderChildren {
    children: RenderChild[];
    siblings: RenderChild[];
    RenderChild(child: object | object[], derender?: boolean): void;
    RenderSibling(child: object | object[], derender?: boolean): void;
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
    newAsAttributeString(zindex: number): string;
}
/**
 * This Class Holds the HTMLElement
 */
declare class HtmlBlock extends Base {
    #private;
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
        boolean: string[];
        function: string[];
    };
    renderNode: node_;
    label: string;
    tag: string;
    innerHTML: string;
    css: string;
    dim: string;
    get events(): Events;
    set events(events: Events);
    el: HTMLElement;
    attributes: object;
    hideWidth: boolean;
    minDisplayGroupSize: number;
    evalInnerHtml: (htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_, displaycell: DisplayCell) => void;
    constructor(...Arguments: any);
    static renderHtmlAttributes(el: HTMLElement, htmlblock: HtmlBlock, id: string): void;
    static Render(htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    static mergeEvents(label: string, events1: Events, events2: Events, name?: any): any;
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
    renderNode: node_;
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
    popOverlay(label: string, validate?: (overlay: Overlay) => boolean): void;
    hMenuBar(menuObj: object, ...Arguments: any): void;
    vMenuBar(menuObj: object): void;
    static editable(displaycell: DisplayCell, onedit: (e: FocusEvent, displaycell: DisplayCell, innerHTML: string) => void, validate?: (e: KeyboardEvent, displaycell: DisplayCell, innerHTML: string) => boolean): DisplayCell;
    static concatArray(main: DisplayCell[], added: DisplayCell[]): void;
    static Render(displaycell: DisplayCell, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    renderNode: node_;
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
    scrollbar_: ScrollBar;
    constructor(...Arguments: any);
    percentToPx(displaycell: DisplayCell): void;
    totalPx(addMin?: boolean): number;
    static allPx(displaygroup: DisplayGroup): number;
    static Render(displaygroup: DisplayGroup, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
}
declare function h(...Arguments: any): DisplayCell;
declare function v(...Arguments: any): DisplayCell;
declare enum HandlerType {
    winModal = "winModal",
    modal = "modal",
    toolbar = "toolbar",
    other = "other",
    context = "context"
}
declare class Handler extends Base {
    static handlerMarginDefault: number;
    static firstRun: boolean;
    static instances: Handler[];
    static activeInstances: Handler[];
    static defaults: {
        cssString: string;
        addThisHandlerToStack: boolean;
        activeOffset: boolean;
        type: HandlerType;
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
    static preRenderCallback: Function;
    static postRenderCallback: Function;
    renderNode: node_;
    type: HandlerType;
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
    static RenderStartingpoint(): Handler[];
    static RenderEndingPoint(): void;
    static Render(handlerInstance: Handler, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
}
declare function H(...Arguments: any): Handler;
declare class Selected extends Base {
    static labelNo: number;
    static instances: Selected[];
    static activeInstances: Selected[];
    static defaults: {
        indexer: any[];
        onSelect: typeof Selected.onSelect;
        onUnselect: typeof Selected.onUnselect;
    };
    static argMap: {
        string: string[];
        function: string[];
    };
    retArgs: ArgsObj;
    label: string;
    indexer: DisplayCell[];
    onSelect: (displaycell: DisplayCell) => void;
    onUnselect: (displaycell: DisplayCell) => void;
    currentButtonIndex: number;
    constructor(...Arguments: any);
    build(): void;
    select(event: PointerEvent, displaycell: DisplayCell): void;
    static onSelect(displaycell: DisplayCell): void;
    static onUnselect(displaycell: DisplayCell): void;
}
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
    static byname(css: string): Css;
    static update(): void;
}
declare function css(...Arguments: any): Css;
declare class DefaultTheme {
    static advisedDiv: Css;
    static advisedBody: Css;
    static bgLight: Css;
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
    renderNode: node_;
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
    static setPage(label: string, pageReference: number | string): void;
    static applyOnclick(): void;
    static button(pagename: string, index: string | number, keepAsNumber?: boolean): object;
    static parseURL(url?: string): void;
    static pushHistory(): void;
    static popstate(event: PopStateEvent): void;
}
declare function P(...Arguments: any): DisplayCell;
declare class Select extends Base {
    static labelNo: number;
    static instances: Select[];
    static activeInstances: Select[];
    static defaults: {
        choices: any[];
        currentSelected: number;
        lastSelected: number;
        onSelect: (mouseEvent: PointerEvent, el: any) => void;
    };
    static argMap: {
        string: string[];
        Array: string[];
        function: string[];
        dim: string[];
    };
    label: string;
    selectDisplayCell: DisplayCell;
    arrowDisplayCell: DisplayCell;
    rootDisplayCell: DisplayCell;
    choices: string[];
    menuObj: object;
    dim: string;
    clickableName: DisplayCell;
    onSelect: (mouseEvent: PointerEvent, el: any, THIS: Select) => void;
    lastSelected: number;
    currentSelected: number;
    constructor(...Arguments: any);
    changeDisplayNameToIndex(index: number): void;
    build(): void;
    onclick(mouseEvent: PointerEvent, index: number, THIS: Select): void;
    buildMenuObj(): void;
}
declare function select(...Arguments: any): DisplayCell;
declare class PageSelect extends Base {
    static labelNo: number;
    static instances: PageSelect[];
    static activeInstances: PageSelect[];
    static defaults: {
        cellArray: any[];
        ishor: boolean;
    };
    static argMap: {
        string: string[];
        Pages: string[];
        dim: string[];
        DisplayCell: string[];
    };
    retArgs: ArgsObj;
    renderNode: node_;
    dim: string;
    label: string;
    ishor: boolean;
    rootDisplayCell: DisplayCell;
    pages: Pages;
    cellArray: DisplayCell[];
    menuObj: {
        [key: string]: any;
    };
    whoops: DisplayCell;
    constructor(...Arguments: any);
    updateContextLabel(THIS?: PageSelect, index?: number, mouseEvent?: PointerEvent): void;
    buildMenuObj(): void;
    build(): void;
    breakFree(offset: {
        x: number;
        y: number;
    }, mouseEvent: MouseEvent): void;
    acceptDrop(winModalInstance: winModal): void;
}
declare function pageselect(...Arguments: any): DisplayCell;
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
    static new(CLASS: string, ...Arguments: any): DisplayCell;
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
    static debounce: number;
    renderNode: node_;
    label: string;
    parentDisplayCell: DisplayCell;
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
    lasttime: number;
    constructor(...Arguments: any);
    static Render(dragbar_: DragBar, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    static debounce: number;
    static startoffset: number;
    renderNode: node_;
    label: string;
    type: string;
    displaySize: number;
    viewPortSize: number;
    barSize: number;
    offset: number;
    ratioOffset: number;
    ratio: number;
    max_offset: number;
    ishor: boolean;
    coord: Coord;
    scrollbarDisplayCell: DisplayCell;
    preBar: DisplayCell;
    Bar: DisplayCell;
    postBar: DisplayCell;
    lasttime: number;
    BarPixels: number;
    constructor(...Arguments: any);
    build(): void;
    onBarDown(): void;
    onBarMove(xmouseDiff: object): void;
    onPreBar(mouseEvent?: MouseEvent): void;
    onPostBar(mouseEvent?: MouseEvent): void;
    onBackArrow(mouseEvent?: MouseEvent, unit?: number): void;
    onForwardArrow(mouseEvent?: MouseEvent, unit?: number): void;
    validateOffsetAndRender(): void;
    update(displaySize: number, viewportSize: number, x: number, y: number, width: number, height: number): number;
    delete(): void;
    onWheel(event: WheelEvent): void;
    static onWheel(event: WheelEvent): void;
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
    changeMenuObject(menuObj?: object): void;
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
    static onDown(): void;
    static onMove(offset: {
        x: number;
        y: number;
    }): void;
    static onUp(offset: {
        x: number;
        y: number;
    }): void;
    static startMoveModal(THIS: Modal): void;
    static moveModal(THIS: Modal, offset: {
        x: number;
        y: number;
    }): void;
    static defaults: {
        type: HandlerType;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
    };
    renderNode: node_;
    label: string;
    rootDisplayCell: DisplayCell;
    handler: Handler;
    type: HandlerType;
    get coord(): Coord;
    constructor(...Arguments: any);
    setSize(...numbers: number[]): void;
    show(): void;
    hide(): void;
    isShown(): boolean;
    dragWith(...Arguments: any): void;
    closeWith(...Arguments: any): void;
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
    static traverse(node: node_, traverseFunction: (node: node_) => void, traverseChildren?: (node: node_) => boolean, traverseNode?: (node: node_) => boolean): void;
    renderx: number;
    rendery: number;
    retArgs: ArgsObj;
    label: string;
    Arguments: any;
    ParentNodeTree: Tree_;
    ParentNode: node_;
    get PreviousSibling(): node_;
    set PreviousSibling(newNode: node_);
    get NextSibling(): node_;
    set NextSibling(newNode: node_);
    collapsed: boolean;
    displaycell: DisplayCell;
    children: node_[];
    constructor(...Arguments: any);
    depth(node?: node_, deep?: number): number;
    newChild(...Arguments: any): node_;
    newSibling(...Arguments: any): node_;
    done(): Tree_;
    root(): node_;
    parent(): node_;
    log(showNode?: boolean): void;
    byLabel(label: string): any;
    static copy(node: node_ | Tree_, suffix?: string, onNodeCreation?: (node: node_, newNode: node_) => void): node_;
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
    renderNode: node_;
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
    preRenderCallback: Function;
    scrollbarh: ScrollBar;
    scrollbarv: ScrollBar;
    onNodeCreation: (node: node_) => void;
    constructor(...Arguments: any);
    newRoot(node: node_): void;
    root(...Arguments: any): node_;
    log(): void;
    derender(node: node_): void;
    derenderChildren(node: node_): void;
    static Render(thisTree: Tree_, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    renderNode: node_;
    label: string;
    parentDisplayCell: DisplayCell;
    displaygroup: DisplayGroup;
    acceptsTypes: string[];
    dropZones: Coord[];
    dummy: DisplayCell;
    constructor(...Arguments: any);
    undock(e: CustomEvent): void;
    dropped(e: CustomEvent): void;
    makeDropZones(width: number, height: number): void;
    openCloseDropZones(modal: Modal, width: number, height: number): void;
    static Render(dockable_: Dockable, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
        function: string[];
    };
    retArgs: ArgsObj;
    renderNode: node_;
    label: string;
    state: TBState;
    displayCells: DisplayCell[];
    parentDisplayCell: DisplayCell;
    width: number;
    height: number;
    parentDisplayGroup: DisplayGroup;
    modal: Modal;
    checkerSize: number;
    type: string;
    selected: Selected;
    onSelect: (displaycell: DisplayCell) => void;
    onUnselect: (displaycell: DisplayCell) => void;
    constructor(...Arguments: any);
    buildModal(): void;
    size(): number[];
    toggleDirection(e: MouseEvent): void;
    resizeForModal(): void;
    resizeFordock(): void;
    static Render(toolbar_: ToolBar, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
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
    parentDisplayCell: DisplayCell;
    handler: Handler;
    constructor(...Arguments: any);
    render(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup, index: number, derender: boolean): void;
    static Render(bindHandler: BindHandler, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
}
declare function bindHandler(...Arguments: any): DisplayCell;
declare class winModal extends Base {
    static labelNo: number;
    static instances: winModal[];
    static activeInstances: winModal[];
    static defaults: {
        headerHeight: number;
        buttonsHeight: number;
        footerHeight: number;
        showOnStart: boolean;
        headerText: string;
        bodyText: string;
        highlightHeaderState1: boolean;
        highlightHeaderState2: boolean;
    };
    static argMap: {
        string: string[];
        DisplayCell: string[];
        function: string[];
        boolean: string[];
    };
    retArgs: ArgsObj;
    label: string;
    renderNode: node_;
    parentDisplayCell: DisplayCell;
    header: DisplayCell;
    headerHeight: number;
    headerText: string;
    body: DisplayCell;
    bodyText: string;
    showOnStart: boolean;
    footer: DisplayCell;
    footerHeight: number;
    footerText: string;
    hiddenCells: DisplayCell[];
    closeCallback: Function;
    modal: Modal;
    previousModalHeight: number;
    highlightHeaderState1: boolean;
    highlightHeaderState2: boolean;
    static validDropWinModalInstance: winModal;
    static validpageSelectInstance: PageSelect;
    static movingInstance: winModal;
    constructor(...Arguments: any);
    dropped(e: CustomEvent): void;
    buildClose(): DisplayCell;
    buildHeader(): DisplayCell;
    buildBody(): DisplayCell;
    buildFooter(): DisplayCell;
    toggleCollapse(mouseEvent: MouseEvent): void;
    toggleClose(): void;
    toggleOpen(): void;
    build(): void;
    render(displaycell: DisplayCell, displayGroup: DisplayGroup, index: number, derender: boolean): void;
    static Render(winmodal_: winModal, zindex: number, derender: boolean, node: node_): zindexAndRenderChildren;
    hightlightHeader(highlight?: boolean): void;
}
declare function winmodal(...Arguments: any): DisplayCell;
interface objectValueClassFunction {
    [key: string]: (value: any, CLASS: string) => string;
}
interface objectKeyValueClassFunction {
    [key: string]: (key: string, value: any, CLASS: string) => string;
}
declare class ToCode {
    static overlayPostString: string;
    static definitions: {
        CLASS: string;
        NAME: string;
        VALUE: string;
    }[];
    static define(obj: {
        CLASS: string;
        NAME: string;
        VALUE: string;
    }): void;
    static toCode(asArray: boolean): string | {
        CLASS: string;
        NAME: string;
        VALUE: string;
    }[];
    static exemptions: string[];
    static exemptionsByClass: {
        DragBar: string[];
    };
    static addKey: ArgMap;
    static customs: objectValueClassFunction;
    static callGeneric: (key: string, value: HtmlBlock, CLASS?: any) => string;
    static processType: objectKeyValueClassFunction;
    static handleArray(key: string, value: boolean, CLASS?: any): string;
    static generic(CLASS: string, classInstance: any): void;
    static labelNo: number;
}
declare let callFunction: (asArray?: boolean) => string | {
    CLASS: string;
    NAME: string;
    VALUE: string;
}[];
