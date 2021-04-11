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
    static displayValue(className: string, label: string, disabled?: boolean, dim?: any, evalFunction?: (htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_, displaycell: DisplayCell) => void): DisplayCell;
    static coordValue(key: string): (htmlBlock: HtmlBlock, zindex: number, derender: boolean, node: node_, displaycell: DisplayCell) => void;
    static Coord(className: string, keyCells: object): DisplayCell;
    static HtmlBlockTreeClicked(objectWithProperties: object): void;
    static HtmlBlock(): void;
    static HtmlBlockChange(variable: string, value: string): void;
    static DisplayGroup(): void;
    static DisplayGroupTreeClicked(objectWithProperties: DisplayGroup): void;
    static DragBar(): void;
    static DragBarTreeClicked(objectWithProperties: object): void;
    static Handler(): void;
    static HandlerTreeClicked(objectWithProperties: object): void;
    static Pages(): void;
    static PagesTreeClicked(objectWithProperties: Pages): void;
}
declare class htmlBlockProps {
    constructor();
    static monacoStartString: string;
    static quillDisplayCell: DisplayCell;
    static monacoContainer: any;
    static MonicoContainerDisplayCell: DisplayCell;
    static editHtmlwinModal: winModal;
    static quill: Quill;
    static quillPages: Pages;
    static eventsDisplayCell: DisplayCell;
    static cssDisplayCell: DisplayCell;
    static cssSelect: Select;
    static cssCurrentValueDisplayCell: DisplayCell;
    static cssBodyDisplayCell: DisplayCell;
    static displayEventFunction: DisplayCell;
    static selectInstanceWhichOnEvent: Select;
    static currentDisplayFunction: string;
    static winModalConfirmInstance: winModal;
    static toolbarOptions: (string[] | {
        header: (number | boolean)[];
    }[] | {
        list: string;
    }[] | {
        script: string;
    }[] | {
        indent: string;
    }[] | {
        direction: string;
    }[] | {
        size: (string | boolean)[];
    }[] | ({
        color: any[];
        background?: undefined;
    } | {
        background: any[];
        color?: undefined;
    })[] | {
        font: any[];
    }[] | {
        align: any[];
    }[])[];
    static options: {
        debug: string;
        modules: {
            toolbar: (string[] | {
                header: (number | boolean)[];
            }[] | {
                list: string;
            }[] | {
                script: string;
            }[] | {
                indent: string;
            }[] | {
                direction: string;
            }[] | {
                size: (string | boolean)[];
            }[] | ({
                color: any[];
                background?: undefined;
            } | {
                background: any[];
                color?: undefined;
            })[] | {
                font: any[];
            }[] | {
                align: any[];
            }[])[];
        };
        placeholder: string;
        readOnly: boolean;
        theme: string;
    };
    static getState(): number;
    static treeClicked(objectWithProperties: object): void;
    static saveState(getState?: number): void;
    static launchState(getState?: number): void;
    static cssChange(mouseEvent: PointerEvent, choice: string, select: Select): void;
    static availableCss(objectWithProperties: HtmlBlock): string[];
    static onClickPreDefinedEvent(actionEventName: string): void;
    static onCloseCallback(THIS: any): void;
    static postConfirm(answer: string): void;
    static onChooseSelectEvent(pointerEvent: PointerEvent, key: string): void;
    static saveAndLoadEvent(pointerEvent: PointerEvent, eventName: string): void;
    static confirmwinModal(confirmText: string, execute: string, dontExecute: string): void;
    static colorPick(type: string): void;
    static colorSet(type: string, colorHex: string): void;
}
declare class DisplayGroupProps {
    static rootcell: DisplayCell;
    static horizontalCellArray: DisplayCell;
    constructor();
    static treeClicked(objectWithProperties: DisplayGroup): void;
    static onCloseCallback(modal: Modal): void;
    static updateProperties(objectWithProperties: DisplayGroup): void;
    static upIndex(index: number): void;
    static deleteIndex(index: number): void;
    static insertIndex(index: number): void;
}
declare class HandlerProps {
    constructor();
    static treeClicked(objectWithProperties: object): void;
    static onCloseCallback(modal: Modal): void;
    static updateProperties(objectWithProperties: object): void;
}
declare class DragBarProps {
    constructor();
    static treeClicked(objectWithProperties: object): void;
    static onCloseCallback(modal: Modal): void;
    static updateProperties(objectWithProperties: object): void;
}
declare class PagesProps {
    static monacoContainer: any;
    static MonicoContainerDisplayCell: DisplayCell;
    constructor();
    static treeClicked(objectWithProperties: Pages): void;
    static onCloseCallback(modal: Modal): void;
    static updateProperties(objectWithProperties: Pages): void;
}
declare class bCss {
    static editable: Css;
    static disabled: Css;
    static bgwhite: Css;
    static bgLight: Css;
    static bgLightBorder: Css;
    static bgWhiteBorder: Css;
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
    static treeItem: Css;
    static bookSVGCss: Css;
    static buttonsSVGCss: Css;
    static treenodeCss: Css;
    static buttons: Css;
    static buttonsPressed: Css;
    static bookSVG(classname: string): string;
    static htmlSVG(classname: string): string;
    static horSVG(classname: string): string;
    static verSVG(classname: string): string;
    static displaycellSVG(classname: string): string;
    static homeSVG(classname: string): string;
    static matchSVG(classname: string): string;
    static cursorSVG(classname: string): string;
    static dragbarSVG(classname: string): string;
    static pagesSVG(classname: string): string;
    static dockableSVG(classname: string): string;
}
declare class Quill {
    constructor(...Arguments: any);
}
declare function monacoContainer(code: string, language?: string): void;
declare class Picker {
    constructor(...Arguments: any);
}
declare function saveAs(...Arguments: any): void;
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
    static context: Context;
    static buildClientHandler(): void;
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
    static createDisplayGroup(displaygroup: DisplayGroup, displaycell: DisplayCell): void;
    static oncontextmenu(event: PointerEvent, el: HTMLElement): void;
    static get buttonIndex(): number;
    static onHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static onLeaveHoverTree(mouseEvent: MouseEvent, el: HTMLElement): void;
    static horDivide(mouseEvent: MouseEvent): void;
    static propertiesModal: winModal;
    static hoverModal: Modal;
    static fileSave(content: string, filename: string, type?: string): void;
    static boilerPlate(javascript: string, title?: string): string;
}
declare let horVerModal: Modal;
