declare class Tree_ extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Tree_;
    };
    static activeInstances: {
        [key: string]: Tree_;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static scrollArrowsSVGCss: Css;
    static collapsedSVG(classname?: string): string;
    static expandedSVG(classname?: string): string;
    static extension: string;
    static toggleCollapse(el: HTMLElement, node: node_, mouseEvent: PointerEvent): void;
    static deRenderChildren(parentNode: node_): void;
    static pointerCss: Css;
    label: string;
    offsetx: number;
    offsety: number;
    css: string;
    Css: Css;
    indent: number;
    events: object;
    topMargin: number;
    sideMargin: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
    scrollbarh: ScrollBar;
    scrollbarv: ScrollBar;
    node: node_;
    parentTreeNode: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    constructor(...Arguments: any);
    static icon(node: node_): string;
    newNode(node: node_): void;
    onConnect(): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
