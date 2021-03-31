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
    static displayLabel(className: string, label: string, dim?: string): DisplayCell;
    static displayValue(className: string, label: string, disabled?: boolean, dim?: any, evalFunction?: (htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_, displaycell: DisplayCell) => void): DisplayCell;
    static labelAndValue(className: string, label: string, keyCells: object, dim?: string): DisplayCell;
    static coordValue(key: string): (htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_, displaycell: DisplayCell) => void;
    static Coord(className: string, keyCells: object): DisplayCell;
    static HtmlBlock(currentObject: object): void;
    static HtmlBlockChange(variable: string, value: string): void;
}
declare class bCss {
    static editable: Css;
    static disabled: Css;
    static bgwhite: Css;
    static bgLight: Css;
    static bgLightBorder: Css;
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
    static treenodeCss: Css;
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
    static onSelect(displaycell: DisplayCell): void;
    static onUnselect(displaycell: DisplayCell): void;
    static TOOLBAR_currentButton_el: Element;
    static TOOLBAR_B1: DisplayCell;
    static TOOLBAR_B2: DisplayCell;
    static TOOLBAR_B3: DisplayCell;
    static TOOLBAR_B4: DisplayCell;
    static TOOLBAR: DisplayCell;
    static xboxSVG(boundCoord: Coord, Boxes: Coord[]): string;
    static onClickTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static get buttonIndex(): number;
    static onHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onLeaveHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static horDivide(mouseEvent: MouseEvent): void;
}
declare let horVerModal: Modal;
