/**
 * Context
 */
declare class Context extends Component {
    static Css: Css;
    static labelNo: number;
    static instances: {
        [key: string]: Context;
    };
    static activeInstances: {
        [key: string]: Context;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    static pointOffset: number;
    static activeInstanceArray: Context[];
    newFunctionReplacesold: boolean;
    byPoint: boolean;
    toTheRight: boolean;
    eventType: string;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    contextNode: node_;
    width: number;
    height: number;
    isShown: boolean;
    activeChild: Context;
    displaycell: DisplayCell;
    displaygroup: DisplayGroup;
    launchEvent: MouseEvent | PointerEvent;
    onclick: (e: MouseEvent, displaycell: DisplayCell, node: node_) => void;
    /**
     * Creates an instance of context.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Builds context
     */
    build(): void;
    /**
     * Contexts on mouse move
     * @param event
     * @returns
     */
    static ContextOnMouseMove(event: MouseEvent | PointerEvent): number;
    /**
     * Pops all
     * @param [keepFunction]
     */
    static popAll(keepFunction?: boolean): void;
    /**
     * Pops context
     * @param [keepFunction]
     */
    pop(keepFunction?: boolean): void;
    /**
     * Launchs context
     * @param [event]
     */
    launchContext(event?: PointerEvent | MouseEvent): void;
    /**
     * Determines whether connect on
     */
    onConnect(): void;
    /**
     * Sets coord
     * @param [Pcoord]
     * @param [event]
     */
    setCoord(Pcoord?: Coord, event?: MouseEvent | PointerEvent): void;
    /**
     * Renders context
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare function context(...Arguments: any): Context;
