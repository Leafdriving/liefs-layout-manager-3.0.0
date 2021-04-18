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
