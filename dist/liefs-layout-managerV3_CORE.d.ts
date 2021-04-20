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
    static push(prevFunction: Function | FunctionStack, newFunction?: Function): FunctionStack;
    static pop(functionStackInstance: FunctionStack, label: string): FunctionStack;
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
declare class Element_ extends Base {
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
    preRender(): void;
    Render(derender: boolean, node: node_): any[];
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
    preRender(derender: boolean, node: node_): void;
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
    type: string;
    label: string;
    startRendered: boolean;
    coord: Coord;
    parentDisplayCell: DisplayCell;
    children: Component[];
    node: node_;
    constructor(...Arguments: any);
    static ScreenSizeCoord: Coord;
    static updateScreenSizeCoord(): void;
    static getHandlers(): DisplayCell[];
    onConnect(): void;
    preRender(derender: boolean, node: node_): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
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
