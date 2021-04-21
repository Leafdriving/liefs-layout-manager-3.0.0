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
    static parentDisplayGroup(THIS: DragBar): [DisplayGroup, boolean];
    static dragStartDim: number;
    static onDown(e: MouseEvent | PointerEvent): void;
    static onMove(e: MouseEvent | PointerEvent, offset: {
        x: number;
        y: number;
    }): void;
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
    constructor(...Arguments: any);
    Render(derender: boolean, node: node_, zindex: number): Component[];
}
