/**
 * Selected
 */
class Selected extends Base {
    /**
     * Creates an instance of selected.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Selected.makeLabel(this);
        this.updateEvents();
        if (this.startValue != undefined)
            this.select(this.startValue);
        Selected.instances[this.label] = this;
    }
    get indexer() { return this.getIndexerArray(this); }
    set indexer(value) { this.indexer_ = value; }
    /**
     * Updates events
     */
    updateEvents() {
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {
            let displayCells;
            let type = Arguments_.typeof(this.indexer[index]);
            if (type == "DisplayCell")
                displayCells = this.indexer[index] = [(this.indexer[index])];
            else if (type == "Array")
                displayCells = (this.indexer[index]);
            for (let index = 0; index < displayCells.length; index++)
                displayCells[index].addEvents({ onclick: function selected(e) { THIS.select(displayCells[index]); } });
        }
    }
    /**
     * Selects selected
     * @param displaycellOrNumber
     */
    select(displaycellOrNumber) {
        let newIndex;
        let type = Arguments_.typeof(displaycellOrNumber);
        if (type == "number")
            newIndex = displaycellOrNumber;
        else if (type == "DisplayCell")
            newIndex = this.indexOf(displaycellOrNumber);
        if (newIndex != undefined) {
            if (this.currentButtonIndex != newIndex) {
                if (this.currentButtonIndex != undefined)
                    this.onUnselect(this.currentButtonIndex);
                this.currentButtonIndex = newIndex;
                this.onSelect(this.currentButtonIndex);
            }
        }
    }
    /**
     * Clears selected
     */
    clear() { this.onUnselect(this.currentButtonIndex); this.currentButtonIndex = undefined; }
    /**
     * Indexs of
     * @param displaycell
     * @returns of
     */
    indexOf(displaycell) {
        for (let index = 0; index < this.indexer.length; index++)
            if (this.indexer[index].indexOf(displaycell) > -1)
                return index;
        return undefined;
    }
    /**
     * Determines whether select on
     * @param index
     */
    onSelect(index) {
        // console.log("onSelectCalled", this.indexer)
        let selectArray = (this.indexer[index]);
        for (let i = 0; i < selectArray.length; i++) {
            const displaycell = selectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element)
                element.setAsSelected();
            if (this.onselect)
                this.onselect(index, displaycell);
        }
    }
    /**
     * Determines whether unselect on
     * @param index
     */
    onUnselect(index) {
        let unSelectArray = (this.indexer[index]);
        for (let i = 0; i < unSelectArray.length; i++) {
            const displaycell = unSelectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element)
                element.setAsUnSelected();
            if (this.onunselect)
                this.onunselect(index, displaycell);
        }
    }
}
Selected.labelNo = 0;
Selected.instances = {};
Selected.activeInstances = {};
Selected.defaults = { indexer: [], getIndexerArray: function (selectedInstance) { return selectedInstance.indexer_; } };
Selected.argMap = {
    string: ["label"],
    function: ["onselect", "onunselect"],
    Array: ["indexer_"],
    number: ["startValue"],
    Pages: ["pages"],
};
