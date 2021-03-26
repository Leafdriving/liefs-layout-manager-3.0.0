declare class Properties extends Base {
    static labelNo: number;
    static instances: Properties[];
    static activeInstances: Properties[];
    static defaults: {};
    static argMap: {
        string: string[];
        DisplayCell: string[];
        winModal: string[];
        function: string[];
    };
    static defaultsize: number[];
    label: string;
    rootDisplayCell: DisplayCell;
    winModal: winModal;
    modal: Modal;
    process: (objectWithProperties: object) => void;
    keyCells: {
        [key: string]: DisplayCell;
    };
    constructor(...Arguments: any);
    static processNode(node: node_): void;
    static HtmlBlockChange(objectWithProperties: HtmlBlock, variable: string, value: string): void;
    static HtmlBlock(objectWithProperties: HtmlBlock): void;
}
declare class bCss {
    static editable: Css;
    static bgwhite: Css;
    static bgLight: Css;
    static bgGreen: Css;
    static bgBlue: Css;
    static bgCyan: Css;
    static bgBlack: Css;
    static menuItem: Css;
    static menuSpace: Css;
    static handlerSVG: Css;
    static hSVG: Css;
    static vSVG: Css;
    static ISVG: Css;
    static pagesSVG: Css;
    static treeItem: Css;
    static bookSVGCss: Css;
    static bookSVG(classname: string): string;
    static htmlSVG(classname: string): string;
    static horSVG(classname: string): string;
    static verSVG(classname: string): string;
    static homeSVG(classname: string): string;
}
declare class Builder extends Base {
    static labelNo: number;
    static instances: Builder[];
    static activeInstances: Builder[];
    static defaults: {};
    static argMap: {
        string: string[];
    };
    constructor(...Arguments: any);
    static makeHandlerTree(): node_;
    static makeDisplayCell(node: node_, displaycell: DisplayCell): void;
    static clientHandler: Handler;
    static buildClientHandler(): void;
    static propertiesModal: winModal;
    static hoverModal: Modal;
    static xboxSVG(boundCoord: Coord, Boxes: Coord[]): string;
    static onClickTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onLeaveHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onNodeCreation(node: node_): void;
    static mainHandler: Handler;
    static buildMainHandler(): void;
    static updateTree(): void;
    static TOOLBAR: DisplayCell;
}
declare let outside: Modal;
declare let inside: Modal;
declare let show: (coord: Coord) => void;
declare let hide: () => void;
