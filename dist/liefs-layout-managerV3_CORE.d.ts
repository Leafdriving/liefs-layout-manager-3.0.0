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
 * Node - A basic Tree Object.  Node by itself doesn't do much.
 * It purpose is determined by its parent, usually a Tree_ Object
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
     * New node - Used Interally
     * @param THIS
     * @param Arguments
     * @returns
     */
    static newNode(THIS: node_, ...Arguments: any): node_;
    /**
     * Returns a Tree Structure, as An Array
     * @param node
     * @param [traverseFunction]
     * @returns array
     */
    static asArray(node: node_, traverseFunction?: (node: node_) => any): any[];
    /**
     * Traverses node
     * @param node - parent starting node
     * @param traverseFunction - what to do on each iteration
     * @param [traverseChildren] - Boolean Return - Traverse this Child?
     * @param [traverseNode] - Boolean Return - Traverse this Node?
     */
    static traverse(node: node_, traverseFunction: (node: node_) => void, traverseChildren?: (node: node_) => boolean, traverseNode?: (node: node_) => boolean): void;
    label: string;
    Arguments: any;
    ParentNodeTree: any;
    ParentNode: node_;
    /**
     * Gets previous sibling
     */
    get PreviousSibling(): node_;
    set PreviousSibling(newNode: node_);
    /**
     * Gets next sibling
     */
    get NextSibling(): node_;
    set NextSibling(newNode: node_);
    /**
     * Collapsed  true if node is collapsed
     */
    collapsed: boolean;
    children: node_[];
    /**
     * Creates an instance of node .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Depth - returns number of steps up parent, to reach the root
     * @param [deep]
     * @returns
     */
    depth(deep?: number): number;
    /**
     * Length - returns number of node children (Recursive)
     * @param [count]
     * @returns
     */
    length(count?: number): number;
    /**
     * Create New Child Node.
     * Either a) Fill node.Arguements Array or
     * b) insert type node here.
     * @param Arguments
     * @returns child
     */
    newChild(...Arguments: any): node_;
    /**
     * Create New Sibling Node
     * Either a) Fill node.Arguements Array or
     * b) insert type node here.
     * @param Arguments
     * @returns sibling
     */
    newSibling(...Arguments: any): node_;
    /**
     * Pops node from node tree
     * @returns
     */
    pop(): this;
    /**
     * Done - returns ParentNodeTree
     * @returns
     */
    done(): any;
    /**
     * Return Root Node Of Tree
     * @returns
     */
    root(): node_;
    /**
     * Returns Parent of Current Node
     * @returns
     */
    parent(): node_;
    /**
     * Logs node to console.  set (true) to get full node objects as well
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
     * Resets within to undefined values
     */
    reset(): void;
    /**
     * To string of within (No Implemented yet)
     */
    toString: Function;
}
/**
 * Coord
 */
declare class Coord extends Base {
    #private;
    /**
     * Instances of coord object (Key = label)
     */
    static instances: Coord[];
    /**
     * Active instances of coord (Not Implemented)
     */
    static activeInstances: Coord[];
    /**
     * Defaults of coord
     */
    static defaults: {
        x: number;
        y: number;
        width: number;
        height: number;
        zindex: number;
    };
    /**
     * Arg map of coord: for example:
     * instance.label = first string argument
     * instance.x , y, width, height, zindex = first though fifth arguments
     * instance.hidewidth = first boolean argument
     */
    static argMap: {
        string: string[];
        number: string[];
        boolean: string[];
    };
    /**
     * Copy arg map of coord
     */
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
     * Gets x2 (Read Only)
     */
    get x2(): number;
    /**
     * Gets y2 (Read Only)
     */
    get y2(): number;
    /**
     * Zindex of coord
     */
    zindex: number;
    /**
     * Within of coord
     */
    within: Within;
    /**
     * Hide width of coord - if true, 'div' ends at end of text, rather than end of cell size.
     */
    hideWidth: boolean;
    /**
     * Offset  of coord - Used for "Moving" DisplayCells (Not Implemented yet)
     */
    offset: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    constructor(...Arguments: any);
    /**
     * Sets offset (x=0, y=0, width=0, height=0)
     */
    setOffset(x?: number, y?: number, width?: number, height?: number): void;
    /**
     * Merges parent Within with this Within (to see if part goes off-screen)
     * @param p Coord Object
     */
    mergeWithin(p: Coord): this;
    /**
     * Applys margins (left:number = 0, right:number = 0, top:number =0, bottom:number =0)
     * @returns
     */
    applyMargins(left?: number, right?: number, top?: number, bottom?: number): this;
    /**
     * Assigns coord (x, y, width, height, wx, wy, wwidth, wheight, zindex)
     * Used for assigning a "New Coord Root"
     */
    assign(x?: any, y?: any, width?: any, height?: any, wx?: any, wy?: any, wwidth?: any, wheight?: any, zindex?: any): this;
    /**
     * Copys coord (and uses their 'within', and applies child co-ordinates)
     * @param (fromCoord,  x, y, width, height, zindex)
     * @returns
     */
    copy(fromCoord: Coord, x?: number, y?: number, width?: number, height?: number, zindex?: number): this;
    /**
     * Logs coord
     */
    log(): void;
    /**
     * Determines whether coord completely outside is
     * if true, de-render, rather than render.
     * @param WITHIN or Coord
     * @returns boolean
     */
    isCoordCompletelyOutside(WITHIN?: Coord | Within): boolean;
    /**
     * Derenders - if was already derender, or completly outside, then derender.
     * @param derender
     * @returns boolean
     */
    derender(derender: boolean): boolean;
    /**
     * Determines whether point is in Coord
     * @param (x, y)
     * @returns true if point whithin Coord.
     */
    isPointIn(x: number, y: number): boolean;
    /**
     * Red coord - used for de-bugging - Renders a Coord "Red"
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
 * Display cell houses all the Componenets within a Coord (div)
 * It can have multiple children.  All Components must be withing a DisplayCell
 */
declare class DisplayCell extends Component {
    static labelNo: number;
    /**
     * Instances of display cell as object key=label of DisplayCell
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
     * Arguments are first string = label, and object to become children.
     * usually, you will use displaycellInstance.addComponent()
     */
    constructor(...Arguments: any);
    /**
     * Adds component to children of DisplayCell, and runs onConnect()
     */
    addComponent(component: Component): DisplayCell;
    /**
     * Gets component from the Children of DisplayCell
     * @param type ie Element_, DisplayGroup
     * @param label of above type, in cases of multiple similar types in children
     */
    getComponent(type: string, label?: string): object;
    /**
     * Deletes component from DisplayCell Children
     */
    deleteComponent(type: string, label?: string): boolean;
    /**
     * Pre render phase is identical to Render, but gives you an oppotunity
     * to change the parent DisplayCells, before they are rendered
     */
    preRender(derender: boolean, node: node_, zindex: number): any[];
    /**
     * Renders objects and expects a return array of children of this object to be rendered.
     * It is at this point that the co-ordinates of the children are set.
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    /**
     * Adds events to expected child Element_
     */
    addEvents(Argument: object): void;
    /**
     * Sets Margins, in different ways depending on number of arguments.
     * if one, all set to that value, if two, left and right to first, top and bottom to second,
     * if 4, left, right, top, bottom set to those values
     */
    static marginAssign(cell: DisplayCell, numberArray: number[]): void;
}
/**
 * Display group Objects stores an Array of children to be
 * rendered in either a column (vertical) or row (horizontal)
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
     * first string argument is label,
     * first number argument is number of pixels between cells
     * optional "dim" value expected (ends with "px" or "%")
     * if new DisplayGroup() - first boolean true = horizontal, false = vertical
     */
    constructor(...Arguments: any);
    /**
     * This is called by the parent when it finds this child.
     * Parent retrieves "dim" value of this, and copies Margins.
     */
    onConnect(): void;
    /**
     * Renders Displaygroup (Called during Render Phase)
     * (derender:boolean, node:node_, zindex:number)
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
 * Css - This class is used like a css sheet.
 * It stores the data in an object, rather than css sheet
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
     * Argument map of css
     * First String is classname, Second is css, third is onhover css, fourth is on Selected
     */
    static argMap: {
        string: string[];
        boolean: string[];
    };
    /**
     * On First Run, all elements with class = "remove", are removed.
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
     * First String is classname, Second is css, third is onhover css, fourth is on Selected
     */
    constructor(...Arguments: any);
    /**
     * News string
     * @param data
     */
    newString(data: string): void;
    /**
     * Converts Obect to String
     */
    makeString(obj?: object, postfix?: string, addToClassName?: string): string;
    /**
     * Makes an object from a css string (within the {} of class definition)
     * @returns obj
     */
    makeObj(str?: string): object;
    /**
     * Updates css Objects in DOM <style id="llmstyle"></style>
     */
    static update(): void;
    static advisedDiv: Css;
    static advisedBody: Css;
    static advisedHtml: Css;
}
declare function css(...Arguments: any): Css;
/**
 * Render Object - Renders Components
 */
declare class Render {
    static node: node_;
    static zindexIncrement: number;
    static zindexHandlerIncrement: number;
    static pleaseUpdate: boolean;
    static firstRun: boolean;
    /**
     * Schedules update - Prefered Method for updating
     */
    static scheduleUpdate(): void;
    /**
     * Fullupdates render
     * @param [derender]
     */
    static fullupdate(derender?: boolean): void;
    /**
     * Updates render - usually called for de-render
     * update(SomeObject, true);
     * @param [components_]
     * @param [derender]
     * @param [parentNode]
     * @param [zindex]
     */
    static update(components_?: Component[] | Component, derender?: boolean, parentNode?: node_, zindex?: number): void;
    /**
     * Classes of render - Used for determinine what modules are loaded
     */
    static classes: {};
    /**
     * Registers render
     * @param label
     * @param object_
     */
    static register(label: string, object_: object): void;
}
