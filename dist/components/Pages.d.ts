declare class Pages extends Base {
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
    preRender(derender: boolean, node: node_): void;
    Render(derender: boolean, node: node_, zindex: number): Component[];
    delete(): void;
}
declare function P(...Arguments: any): DisplayCell;
declare class Selected extends Base {
    static labelNo: number;
    static instances: {
        [key: string]: Selected;
    };
    static activeInstances: {
        [key: string]: Selected;
    };
    static defaults: {
        indexer: any[];
    };
    static argMap: {
        string: string[];
        function: string[];
        Array: string[];
        number: string[];
        Pages: string[];
    };
    label: string;
    indexer: (DisplayCell | DisplayCell[])[];
    onselect: (index: number, displaycell: DisplayCell) => void;
    onunselect: (index: number, displaycell: DisplayCell) => void;
    startValue: number;
    currentButtonIndex: number;
    pages: Pages;
    constructor(...Arguments: any);
    build(): void;
    select(displaycellOrNumber: DisplayCell | number): void;
    clear(): void;
    indexOf(displaycell: DisplayCell): number;
    onSelect(index: number): void;
    onUnselect(index: number): void;
}
