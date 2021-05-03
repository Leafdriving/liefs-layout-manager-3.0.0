/**
 * Selected
 */
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
    /**
     * Creates an instance of selected.
     * @param Arguments
     */
    constructor(...Arguments: any);
    /**
     * Updates events
     */
    updateEvents(): void;
    /**
     * Selects selected
     * @param displaycellOrNumber
     */
    select(displaycellOrNumber: DisplayCell | number): void;
    /**
     * Clears selected
     */
    clear(): void;
    /**
     * Indexs of
     * @param displaycell
     * @returns of
     */
    indexOf(displaycell: DisplayCell): number;
    /**
     * Determines whether select on
     * @param index
     */
    onSelect(index: number): void;
    /**
     * Determines whether unselect on
     * @param index
     */
    onUnselect(index: number): void;
}
