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
        getIndexerArray: (selectedInstance: Selected) => (DisplayCell | DisplayCell[])[];
    };
    static argMap: {
        string: string[];
        function: string[];
        Array: string[];
        number: string[];
        Pages: string[];
    };
    label: string;
    indexer_: (DisplayCell | DisplayCell[])[];
    get indexer(): (DisplayCell | DisplayCell[])[];
    set indexer(value: (DisplayCell | DisplayCell[])[]);
    getIndexerArray: (selectedInstance: Selected) => (DisplayCell | DisplayCell[])[];
    onselect: (index: number, displaycell: DisplayCell) => void;
    onunselect: (index: number, displaycell: DisplayCell) => void;
    startValue: number;
    currentButtonIndex: number;
    constructor(...Arguments: any);
    updateEvents(): void;
    select(displaycellOrNumber: DisplayCell | number): void;
    clear(): void;
    indexOf(displaycell: DisplayCell): number;
    onSelect(index: number): void;
    onUnselect(index: number): void;
}
