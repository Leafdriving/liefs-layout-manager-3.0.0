/**
 * Tree
 */
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
    useSelected: boolean;
    selected: Selected;
    selectedNode: node_;
    selectedStartIndex: number;
    selectParents: boolean;
    cascadeCollapse: boolean;
    /**
     * Creates an instance of tree .
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Icons tree
     * @param node
     * @returns
     */
    static icon(node: node_): string;
    /**
     * News node
     * @param node
     */
    newNode(node: node_): void;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    /**
     * Renders tree
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
