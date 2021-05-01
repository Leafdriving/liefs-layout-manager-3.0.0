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
    constructor(...Arguments: any);
    build(): void;
    static ContextOnMouseMove(event: MouseEvent | PointerEvent): number;
    static popAll(keepFunction?: boolean): void;
    pop(keepFunction?: boolean): void;
    launchContext(event?: PointerEvent | MouseEvent): void;
    onConnect(): void;
    setCoord(Pcoord?: Coord, event?: MouseEvent | PointerEvent): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
declare function context(...Arguments: any): Context;
