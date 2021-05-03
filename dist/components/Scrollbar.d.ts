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
