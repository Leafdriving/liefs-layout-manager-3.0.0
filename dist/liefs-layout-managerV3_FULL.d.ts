declare class pf {
    static isTypePx: (it: any) => boolean;
    static pxAsNumber: (dim: string) => number;
    static isTypePercent: (it: any) => boolean;
    static percentAsNumber: (dim: string) => number;
    static isDim: (it: any) => string;
    static isArray: (it: any) => string;
    static isObjectAClass: (it: any) => string;
    static defaultIsChecks: ((it: any) => string)[];
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
/**
 * Arguments_ :
 * This object is responsible for sorting Arguments for a new class or function.
 *
 */
declare class Arguments_ {
    /**
     * Arguments by type
     * @param Args Array of Arguments ie new Class(...Args)
     * @param [customTypes] Array of Functions returning Type Name (if qualifies), or undefined.
     * @returns An Object Key "TypeName", value Array of Arguments, of that Type, in the order discovered
     */
    static argumentsByType(Args: any[], // 1st argument is a list of args.
    customTypes?: Function[]): objectAny;
    /**
     * This function merges the defaults Object, with Argument Object(s)
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns Defaults Objects merged with Argument Objects
     */
    static ifObjectMergeWithDefaults(THIS: any, CLASS: any): object;
    /**
     * retArgsMapped
     * @param updatedDefaults (Return of Arguments_.ifObjectMergeWithDefaults())
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns args mapped
     */
    static retArgsMapped(updatedDefaults: object, THIS: any, CLASS: any): object;
    /**
     * Similar to javascript typeof, but returns custom types like "dim" (ending in "px" or "%")
     * @param Argument
     * @returns Type Name (If Object, Class Name)
     */
    static typeof(Argument: any): string;
    /**
     * Modifys class properties
     * @param argobj - Object to be mapped from
     * @param targetobject - Object (Class Instance) to be mapped to
     */
    static modifyClassProperties(argobj: object, targetobject: object): void;
    /**
     * Standard Merge objects function
     */
    static mergeObjects: (startObj: object, AddObj: object) => object;
}
/**
 * Base Class for most Classes (Extends Base)
 */
declare class Base {
    /**
     * Default custom check Function List (Array)
     */
    static defaultIsChecks: ((it: any) => string)[];
    /**
     * Future Implementation of Generating Launch Code, from an edited Object Tree.
     */
    static toCode: (ClassObjectInstance: object) => string;
    /**
     * Arguments of new - mapped to object with key:type value:array of Arguments of that type.
     */
    retArgs: objectAny;
    /**
     * Label of Object Instance
     */
    label: string;
    /**
     * Creates an instance of base.  This is called by the extended class
     * @param neverRead
     */
    constructor(...neverRead: any);
    buildBase(...Arguments: any): void;
    /**
     * Sorts Agruments by type, then applies them as attributes to the Class Object Instance,
     * according to default arguments map (argMap)  This is called by all Objects in the Constructor
     * @param THIS
     * @param Arguments
     */
    static buildBase(THIS: any, ...Arguments: any): void;
    /**
     * If label is not defined, create One.
     * @param instance
     */
    static makeLabel(instance: object): void;
}
declare class Component extends Base {
    /**
     * Node of component Created and Updated by the Render Class (upon Rendering)
     */
    node: node_;
    /**
     * Parent display cell of component - Set by Parent onConnect
     */
    parentDisplayCell: DisplayCell;
    /**
     * Children of component, to be rendered on an increased z-index
     */
    children: Component[];
    /**
     * When Parent DisplayCell Discovers this Component, onConnect is called by the Parent DisplayCell
     */
    onConnect(): void;
    /**
     * Pre Stage of Rendering a Page.  It is useful if a child component wished to modify a parent
     * component.  The parent is first altered here, then properly rendered at the Render Stage
     * @param derender - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered (Normally empty, since Render phase is usually a better choice)
     */
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    /**
     * Rendering stage of aa Page.(After preRender phase).  In this function, usually the Co-ordinates of
     * a child/childrend are calculated, and assigned, to be returned as an array
     * @param derender  - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Returns Child (in .children) by label
     * @param label
     * @returns child DisplayCell/Component
     */
    getChild(label: string): Component;
    /**
     * Deletes component
     */
    delete(): void;
}
/**
 * Function stack base
 */
declare class FunctionStack_BASE extends Function {
    constructor();
}
/**
 * Function stack
 */
declare class FunctionStack extends FunctionStack_BASE {
    functionArray: Function[];
    constructor();
    /**
     * Determines whether call
     * @param Arguments
     */
    __call__(...Arguments: any[]): void;
    /**
     * Pushs function stack
     * @param prevFunction
     * @param [newFunction]
     * @returns
     */
    static push(prevFunction: Function | FunctionStack, newFunction?: Function | FunctionStack): FunctionStack;
    /**
     * Pops function stack
     * @param functionStackInstance
     * @param label
     * @returns
     */
    static pop(functionStackInstance: FunctionStack, label: string): FunctionStack;
    /**
     * Determines whether in is
     * @param functionStackInstance
     * @param label
     * @returns
     */
    static isIn(functionStackInstance: FunctionStack, label: string): boolean;
}
/**
 * Debounce
 */
declare class debounce_ extends FunctionStack_BASE {
    FUNCTION: Function;
    delay: number;
    lasttime: number;
    /**
     * Creates an instance of debounce .
     * @param FUNCTION
     * @param delay
     */
    constructor(FUNCTION: Function, delay: number);
    /**
     * Determines whether call
     * @param Arguments
     */
    __call__(...Arguments: any[]): void;
}
declare function debounce(FUNCTION: Function, delay: number): debounce_;
/**
 * Node
 */
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
    /**
     * News node
     * @param THIS
     * @param Arguments
     * @returns
     */
    static newNode(THIS: node_, ...Arguments: any): node_;
    /**
     * Determines whether array as
     * @param node
     * @param [traverseFunction]
     * @returns array
     */
    static asArray(node: node_, traverseFunction?: (node: node_) => any): any[];
    /**
     * Traverses node
     * @param node
     * @param traverseFunction
     * @param [traverseChildren]
     * @param [traverseNode]
     */
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
    /**
     * Creates an instance of node .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Depths node
     * @param [deep]
     * @returns
     */
    depth(deep?: number): number;
    /**
     * Lengths node
     * @param [count]
     * @returns
     */
    length(count?: number): number;
    /**
     * News child
     * @param Arguments
     * @returns child
     */
    newChild(...Arguments: any): node_;
    /**
     * News sibling
     * @param Arguments
     * @returns sibling
     */
    newSibling(...Arguments: any): node_;
    /**
     * Pops node
     * @returns
     */
    pop(): this;
    /**
     * Dones node
     * @returns
     */
    done(): any;
    /**
     * Roots node
     * @returns
     */
    root(): node_;
    /**
     * Parents node
     * @returns
     */
    parent(): node_;
    /**
     * Logs node
     * @param [showNode]
     */
    log(showNode?: boolean): void;
}
declare function sample(): node_;
/**
 * Point - Yea, a interface would do the same thing... so whats the point!
 */
declare class Point {
    x: number;
    y: number;
}
/**
 * Within - Coordinates of the Parent - to determine if this (child) is partially cut off
 * or goes partially (or completly) out of view
 */
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
    /**
     * Creates an instance of within.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Resets within
     */
    reset(): void;
    /**
     * To string of within
     */
    toString: Function;
}
/**
 * Coord
 */
declare class Coord extends Base {
    #private;
    /**
     * Instances  of coord
     */
    static instances: Coord[];
    /**
     * Active instances of coord
     */
    static activeInstances: Coord[];
    /**
     * Defaults  of coord
     */
    static defaults: {
        x: number;
        y: number;
        width: number;
        height: number;
        zindex: number;
    };
    /**
     * Arg map of coord
     */
    static argMap: {
        string: string[];
        number: string[];
        boolean: string[];
    };
    /**
     * Copy arg map of coord
     */
    static CopyArgMap: {
        Within: string[];
        Coord: string[];
        boolean: string[];
        number: string[];
    };
    /**
     * Label  of coord
     */
    label: string;
    /**
     * Frozen  of coord
     */
    frozen: boolean;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    /**
     * Gets x2
     */
    get x2(): number;
    /**
     * Gets y2
     */
    get y2(): number;
    /**
     * Zindex  of coord
     */
    zindex: number;
    /**
     * Within  of coord
     */
    within: Within;
    /**
     * Hide width of coord
     */
    hideWidth: boolean;
    /**
     * Offset  of coord
     */
    offset: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    constructor(...Arguments: any);
    /**
     * Sets offset
     * @param [x]
     * @param [y]
     * @param [width]
     * @param [height]
     */
    setOffset(x?: number, y?: number, width?: number, height?: number): void;
    /**
     * Merges within
     * @param p
     * @returns
     */
    mergeWithin(p: Coord): this;
    /**
     * Applys margins
     * @param [left]
     * @param [right]
     * @param [top]
     * @param [bottom]
     * @returns
     */
    applyMargins(left?: number, right?: number, top?: number, bottom?: number): this;
    /**
     * Assigns coord
     * @param [x]
     * @param [y]
     * @param [width]
     * @param [height]
     * @param [wx]
     * @param [wy]
     * @param [wwidth]
     * @param [wheight]
     * @param [zindex]
     * @returns
     */
    assign(x?: any, y?: any, width?: any, height?: any, wx?: any, wy?: any, wwidth?: any, wheight?: any, zindex?: any): this;
    /**
     * Copys coord
     * @param fromCoord
     * @param [x]
     * @param [y]
     * @param [width]
     * @param [height]
     * @param [zindex]
     * @returns
     */
    copy(fromCoord: Coord, x?: number, y?: number, width?: number, height?: number, zindex?: number): this;
    /**
     * Logs coord
     */
    log(): void;
    /**
     * Determines whether coord completely outside is
     * @param [WITHIN]
     * @returns
     */
    isCoordCompletelyOutside(WITHIN?: Coord | Within): boolean;
    /**
     * Derenders coord
     * @param derender
     * @returns
     */
    derender(derender: boolean): boolean;
    /**
     * Determines whether point in is
     * @param x
     * @param y
     * @returns true if point in
     */
    isPointIn(x: number, y: number): boolean;
    /**
     * Red coord
     * @param [id]
     */
    red(id?: string): void;
}
declare function events(object_: object): {
    processEvents: object;
};
/**
 * Element
 */
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
    /**
     * Custom events of element
     */
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
    /**
     * Creates an instance of element .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Loads element
     * @param el
     */
    loadElement(el: HTMLDivElement): void;
    /**
     * Applys events
     */
    applyEvents(): void;
    /**
     * Adds events
     * @param eventObject
     */
    addEvents(eventObject: object): void;
    /**
     * Renders html attributes
     */
    renderHtmlAttributes(): void;
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Renders element
     * @param derender
     * @param node
     * @returns
     */
    Render(derender: boolean, node: node_): any[];
    /**
     * Sets as selected
     */
    setAsSelected(): void;
    /**
     * Sets as un selected
     */
    setAsUnSelected(): void;
    /**
     * Clips style string
     * @param element
     * @returns
     */
    static clipStyleString(element: Element_): string;
    /**
     * Styles element
     * @param element
     * @returns style
     */
    static style(element: Element_): string;
    /**
     * Gets attribs
     * @param el
     * @param [retObj]
     * @returns attribs
     */
    static getAttribs(el: HTMLDivElement, retObj?: objectString): objectString;
    /**
     * exists
     * @param id_label
     * @returns
     */
    static elExists(id_label: string): HTMLDivElement;
    /**
     * Sets attribs
     * @param element
     */
    static setAttribs(element: Element_): void;
    /**
     * Sets attrib
     * @param el
     * @param attrib
     * @param value
     */
    static setAttrib(el: HTMLElement, attrib: string, value: string): void;
    /**
     * Attrib filter of element
     */
    static attribFilter: string[];
}
declare function I(...Arguments: any): DisplayCell;
/**
 * Display cell
 */
declare class DisplayCell extends Component {
    static labelNo: number;
    /**
     * Instances  of display cell
     */
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
    /**
     * Creates an instance of display cell.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Adds component
     * @param component
     * @returns component
     */
    addComponent(component: Component): DisplayCell;
    /**
     * Gets component
     * @param type
     * @param [label]
     * @returns component
     */
    getComponent(type: string, label?: string): object;
    /**
     * Deletes component
     * @param type
     * @param [label]
     * @returns true if component
     */
    deleteComponent(type: string, label?: string): boolean;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns
     */
    preRender(derender: boolean, node: node_, zindex: number): any[];
    /**
     * Renders display cell
     * @param [derender]
     * @param node
     * @param zindex
     * @returns
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Adds events
     * @param Argument
     */
    addEvents(Argument: object): void;
    /**
     * Margins assign
     * @param cell
     * @param numberArray
     */
    static marginAssign(cell: DisplayCell, numberArray: number[]): void;
}
/**
 * Display group
 */
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
    /**
     * Creates an instance of display group.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Renders display group
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): DisplayCell[];
    /**
     * Forces min
     * @param answersArray
     * @returns
     */
    static forceMin(answersArray: {
        px: number;
        percent: number;
        min: number;
    }[]): number;
}
declare function h(...Arguments: any): DisplayCell;
declare function v(...Arguments: any): DisplayCell;
/**
 * Handler
 */
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
    /**
     * Links handlers
     */
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
    /**
     * Creates an instance of handler.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Screen size coord of handler
     */
    static ScreenSizeCoord: Coord;
    /**
     * Updates screen size coord
     */
    static updateScreenSizeCoord(): void;
    /**
     * Gets handlers
     * @returns handlers
     */
    static getHandlers(): DisplayCell[];
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Pre render
     * @param derender
     * @param node
     */
    preRender(derender: boolean, node: node_): void;
    /**
     * Renders handler
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Shows handler
     */
    show(): void;
    /**
     * Hides handler
     */
    hide(): void;
}
declare function H(...Arguments: any): DisplayCell;
/**
 * Css
 */
declare class Css extends Base {
    static theme: any;
    static elementId: string;
    static instances: {
        [key: string]: Css;
    };
    static activeInstances: {
        [key: string]: Css;
    };
    /**
     * label
     * @param classname
     * @returns label
     */
    static byLabel(classname: string): Css;
    static defaults: {
        isClassname: boolean;
    };
    /**
     * Arg map of css
     */
    static argMap: {
        string: string[];
        boolean: string[];
    };
    /**
     * Delete on first run classname of css
     */
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
    /**
     * Creates an instance of css.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * News string
     * @param data
     */
    newString(data: string): void;
    /**
     * Makes string
     * @param [obj]
     * @param [postfix]
     * @param [addToClassName]
     * @returns string
     */
    makeString(obj?: object, postfix?: string, addToClassName?: string): string;
    /**
     * Makes obj
     * @param [str]
     * @returns obj
     */
    makeObj(str?: string): object;
    /**
     * Updates css
     */
    static update(): void;
    static advisedDiv: Css;
    static advisedBody: Css;
    static advisedHtml: Css;
}
declare function css(...Arguments: any): Css;
/**
 * Render
 */
declare class Render {
    static node: node_;
    static zindexIncrement: number;
    static zindexHandlerIncrement: number;
    static pleaseUpdate: boolean;
    static firstRun: boolean;
    /**
     * Schedules update
     */
    static scheduleUpdate(): void;
    /**
     * Fullupdates render
     * @param [derender]
     */
    static fullupdate(derender?: boolean): void;
    /**
     * Updates render
     * @param [components_]
     * @param [derender]
     * @param [parentNode]
     * @param [zindex]
     */
    static update(components_?: Component[] | Component, derender?: boolean, parentNode?: node_, zindex?: number): void;
    /**
     * Classes  of render
     */
    static classes: {};
    /**
     * Registers render
     * @param label
     * @param object_
     */
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
    /**
     * Updates scroll bar
     * @param pixelsUsed
     * @param pixelsAvailable
     * @returns update
     */
    update(pixelsUsed: number, pixelsAvailable: number): number;
    /**
     * Limits scroll bar
     */
    limit(): void;
    /**
     * Creates an instance of scroll bar.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Pre render
     * @param derender
     * @param node
     * @returns render
     */
    preRender(derender: boolean, node: node_): void;
    /**
     * Renders scroll bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Deletes scroll bar
     */
    delete(): void;
    /**
     * Builds scroll bar
     */
    build(): void;
    onSmallArrow(e: PointerEvent): void;
    onBigArrow(e: PointerEvent): void;
    onSmallerBar(e: PointerEvent): void;
    onBiggerBar(e: PointerEvent): void;
    onBarDown(e: MouseEvent): void;
    onBarMove(e: MouseEvent, xmouseDiff: object): void;
}
declare function scrollbar(...Arguments: any): ScrollBar;
/**
 * On drag
 */
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
    /**
     * Creates an instance of on drag .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Resets on drag
     */
    reset(): void;
    static disableSelect(event: MouseEvent): void;
}
declare function onDrag(...Arguments: any): object;
/**
 * On hold click
 */
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
    /**
     * Creates an instance of on hold click .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Repeats on hold click
     */
    repeat(): void;
    onDown(e: MouseEvent): void;
}
declare function onHoldClick(...Arguments: any): object;
/**
 * Selected
 */
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
    /**
     * Creates an instance of selected.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Updates events
     */
    updateEvents(): void;
    /**
     * Selects selected
     * @param displaycellOrNumber
     */
    select(displaycellOrNumber: DisplayCell | number): void;
    /**
     * Clears selected
     */
    clear(): void;
    /**
     * Indexs of
     * @param displaycell
     * @returns of
     */
    indexOf(displaycell: DisplayCell): number;
    /**
     * Determines whether select on
     * @param index
     */
    onSelect(index: number): void;
    /**
     * Determines whether unselect on
     * @param index
     */
    onUnselect(index: number): void;
}
/**
 * Pages
 */
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
    /**
     * Creates an instance of pages.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Renders pages
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare function P(...Arguments: any): DisplayCell;
/**
 * Tree
 */
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
    /**
     * Creates an instance of tree .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Icons tree
     * @param node
     * @returns
     */
    static icon(node: node_): string;
    /**
     * News node
     * @param node
     */
    newNode(node: node_): void;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    /**
     * Renders tree
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
/**
 * Context
 */
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
    static activeInstanceArray: Context[];
    newFunctionReplacesold: boolean;
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
    onclick: (e: MouseEvent, displaycell: DisplayCell, node: node_) => void;
    /**
     * Creates an instance of context.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Builds context
     */
    build(): void;
    /**
     * Contexts on mouse move
     * @param event
     * @returns
     */
    static ContextOnMouseMove(event: MouseEvent | PointerEvent): number;
    /**
     * Pops all
     * @param [keepFunction]
     */
    static popAll(keepFunction?: boolean): void;
    /**
     * Pops context
     * @param [keepFunction]
     */
    pop(keepFunction?: boolean): void;
    /**
     * Launchs context
     * @param [event]
     */
    launchContext(event?: PointerEvent | MouseEvent): void;
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Sets coord
     * @param [Pcoord]
     * @param [event]
     */
    setCoord(Pcoord?: Coord, event?: MouseEvent | PointerEvent): void;
    /**
     * Renders context
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare function context(...Arguments: any): Context;
/**
 * Modal
 */
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
    /**
     * Determines whether down on
     */
    static onDown(): void;
    /**
     * Determines whether move on
     * @param mouseEvent
     * @param offset
     */
    static onMove(mouseEvent: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    /**
     * Determines whether up on
     * @param mouseEvent
     * @param offset
     */
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
    children: Component[];
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
    stretch: Stretch;
    /**
     * Creates an instance of modal.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Evals numbers
     * @param numbers
     * @returns numbers
     */
    evalNumbers(numbers: number[]): {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        width?: number;
        height?: number;
    };
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    /**
     * Renders modal
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Gets child
     * @param label
     * @returns
     */
    getChild(label: string): Component;
    /**
     * Shows modal
     */
    show(): void;
    /**
     * Hides modal
     * @param [event]
     */
    hide(event?: MouseEvent | PointerEvent): void;
    /**
     * Determines whether shown is
     * @returns
     */
    isShown(): boolean;
    /**
     * Drags with
     * @param displaycells
     */
    dragWith(...displaycells: DisplayCell[]): void;
    /**
     * Closes with
     * @param displaycells
     */
    closeWith(...displaycells: DisplayCell[]): void;
}
/**
 * Win modal
 */
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
    get parentDisplayCell(): DisplayCell;
    set parentDisplayCell(value: DisplayCell);
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
    suppliedHandler: Handler;
    show(): void;
    hide(): void;
    onclose: () => void;
    /**
     * Creates an instance of win modal.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Builds win modal
     */
    build(): void;
}
/**
 * Stretch
 */
declare class Stretch extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Stretch;
    };
    static activeInstances: {
        [key: string]: Stretch;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static CssNE: Css;
    static CssNW: Css;
    static pixelSize: number;
    static startDrag: Coord;
    static setStart(e: MouseEvent): void;
    static updateCoord(modal: Modal, x: number, y: number, w: number, h: number, offset: {
        x: number;
        y: number;
    }): void;
    static ulDrag(e: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    static urDrag(e: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    static llDrag(e: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    static lrDrag(e: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    modal: Modal;
    upperLeft: DisplayCell;
    upperRight: DisplayCell;
    lowerLeft: DisplayCell;
    lowerRight: DisplayCell;
    /**
     * Creates an instance of stretch.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Builds stretch
     */
    build(): void;
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    /**
     * Renders stretch
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
/**
 * Drag bar
 */
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
    /**
     * Parents display group
     * @param THIS
     * @returns display group
     */
    static parentDisplayGroup(THIS: DragBar): [DisplayGroup, boolean];
    /**
     * Drag start dim of drag bar
     */
    static dragStartDim: number;
    /**
     * Determines whether down on
     * @param e
     */
    static onDown(e: MouseEvent | PointerEvent): void;
    /**
     * Determines whether move on
     * @param e
     * @param offset
     */
    static onMove(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
    /**
     * Determines whether up on
     * @param e
     * @param offset
     */
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
    /**
     * Creates an instance of drag bar.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Renders drag bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare let dragbar: (...Arguments: any) => DragBar;
