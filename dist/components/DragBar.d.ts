/**
 * Drag bar
 */
declare class DragBar extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: DragBar;
    };
    static activeInstances: {
        [key: string]: DragBar;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static horCss: Css;
    static verCss: Css;
    /**
     * Parents display group
     * @param THIS
     * @returns display group
     */
    static parentDisplayGroup(THIS: DragBar): [DisplayGroup, boolean];
    /**
     * Drag start dim of drag bar
     */
    static dragStartDim: number;
    /**
     * Determines whether down on
     * @param e
     */
    static onDown(e: MouseEvent | PointerEvent): void;
    /**
     * Determines whether move on
     * @param e
     * @param offset
     */
    static onMove(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
    /**
     * Determines whether up on
     * @param e
     * @param offset
     */
    static onUp(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
    node: node_;
    parentDisplayCell: DisplayCell;
    parentDisplayGroup: DisplayGroup;
    parentDisplayGroupChild: DisplayCell;
    children: Component[];
    min: number;
    max: number;
    width: number;
    dragbarDisplayCell: DisplayCell;
    get isHor(): boolean;
    isLast: boolean;
    /**
     * Creates an instance of drag bar.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Renders drag bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare let dragbar: (...Arguments: any) => DragBar;
