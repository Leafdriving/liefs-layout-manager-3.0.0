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
