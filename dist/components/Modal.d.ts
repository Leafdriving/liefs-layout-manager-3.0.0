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
    constructor(...Arguments: any);
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
    parentDisplayCell: DisplayCell;
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
