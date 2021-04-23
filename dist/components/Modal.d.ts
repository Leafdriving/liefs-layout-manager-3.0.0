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
    static onDown(): void;
    static onMove(mouseEvent: MouseEvent, offset: {
        x: number;
        y: number;
    }): void;
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
    constructor(...Arguments: any);
    evalNumbers(numbers: number[]): {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        width?: number;
        height?: number;
    };
    onConnect(): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    getChild(label: string): Component;
    delete(): void;
    show(): void;
    hide(event?: MouseEvent | PointerEvent): void;
    isShown(): boolean;
    dragWith(...displaycells: DisplayCell[]): void;
    closeWith(...displaycells: DisplayCell[]): void;
}
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
    show(): void;
    hide(): void;
    onclose: () => void;
    constructor(...Arguments: any);
    build(): void;
}
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
    constructor(...Arguments: any);
    build(): void;
    onConnect(): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
