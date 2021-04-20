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
    static rootInstance: Context;
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
    constructor(...Arguments: any);
    build(): void;
    static onclick(e: MouseEvent, displaycell: DisplayCell, node: node_): void;
    static currentAndParent(): Context[];
    static ContextOnMouseMove(event: MouseEvent | PointerEvent): void;
    static pop(): void;
    static currentInstance(deep?: number): [Context, number];
    launchContext(event?: PointerEvent | MouseEvent): void;
    onConnect(): void;
    setCoord(Pcoord?: Coord, event?: MouseEvent | PointerEvent): void;
    preRender(derender: boolean, node: node_, zindex: number): Component[] | void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    getChild(label: string): Component;
    delete(): void;
}
declare function context(...Arguments: any): Context;
