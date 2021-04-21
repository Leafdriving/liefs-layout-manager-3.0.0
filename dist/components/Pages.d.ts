declare class Pages extends Component {
    static labelNo: number;
    static instances: {
        [key: string]: Pages;
    };
    static activeInstances: {
        [key: string]: Pages;
    };
    static defaults: {
        [key: string]: any;
    };
    static argMap: {
        [key: string]: Array<string>;
    };
    label: string;
    node: node_;
    parentDisplayCell: DisplayCell;
    children: Component[];
    tree: Tree_;
    evalFunction: (thisPages: Pages) => number;
    cellArray: DisplayCell[];
    dim_: string;
    get dim(): string;
    set dim(value: string);
    prevPage: number;
    currentPage_: number;
    set currentPage(value: number);
    get currentPage(): number;
    constructor(...Arguments: any);
    onConnect(): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
declare function P(...Arguments: any): DisplayCell;
