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
    process: () => void;
    keyCells: {
        [key: string]: DisplayCell;
    };
    currentObject: object;
    currentObjectParentDisplayCell: DisplayCell;
    constructor(...Arguments: any);
    static processNode(node: node_ | object, parentDisplayCell?: DisplayCell): void;
    static setHeaderText(propertiesInstance: Properties, text: string): void;
    static HtmlBlockChange(variable: string, value: string): void;
    static HtmlBlockProcess(): void;
    static displayLabel(className: string, label: string, dim?: string): DisplayCell;
    static displayValue(className: string, label: string, disabled?: boolean, dim?: any): DisplayCell;
    static labelAndValue(className: string, label: string, keyCells: object, dim?: string): DisplayCell;
    static Coord(className: string, keyCells: object): DisplayCell;
    static HtmlBlock(): void;
}
declare class bCss {
    static editable: Css;
    static disabled: Css;
    static bgwhite: Css;
    static bgLight: Css;
    static bgLightCenter: Css;
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
    static buttonsSVGCss: Css;
    static bookSVG(classname: string): string;
    static htmlSVG(classname: string): string;
    static horSVG(classname: string): string;
    static verSVG(classname: string): string;
    static displaycellSVG(classname: string): string;
    static homeSVG(classname: string): string;
    static matchSVG(classname: string): string;
    static cursorSVG(classname: string): string;
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
    static clientHandler: Handler;
    static buildClientHandler(): void;
    static propertiesModal: winModal;
    static hoverModal: Modal;
    static mainHandler: Handler;
    static buildMainHandler(): void;
    static builderTreeRootNode: node_;
    static updateTree(): void;
    static noDisplayCellnode: node_;
    static noDisplayCells(node?: node_, newNode?: node_): node_;
    static TOOLBAR_events(buttonName: string): Events;
    static TOOLBAR_currentButton: Element;
    static TOOLBAR_currentButtonName: string;
    static TOOLBAR: DisplayCell;
    static xboxSVG(boundCoord: Coord, Boxes: Coord[]): string;
    static onClickTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onLeaveHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
}
declare let outside: Modal;
declare let inside: Modal;
declare let show: (coord: Coord) => void;
declare let hide: () => void;
