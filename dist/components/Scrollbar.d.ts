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
    update(pixelsUsed: number, pixelsAvailable: number): number;
    limit(): void;
    constructor(...Arguments: any);
    onConnect(): void;
    preRender(derender: boolean, node: node_): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
    build(): void;
    onSmallArrow(e: PointerEvent): void;
    onBigArrow(e: PointerEvent): void;
    onSmallerBar(e: PointerEvent): void;
    onBiggerBar(e: PointerEvent): void;
    onBarDown(e: MouseEvent): void;
    onBarMove(e: MouseEvent, xmouseDiff: object): void;
}
declare function scrollbar(...Arguments: any): ScrollBar;
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
    constructor(...Arguments: any);
    reset(): void;
    static disableSelect(event: MouseEvent): void;
}
declare function onDrag(...Arguments: any): object;
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
    constructor(...Arguments: any);
    repeat(): void;
    onDown(e: MouseEvent): void;
}
declare function onHoldClick(...Arguments: any): object;
