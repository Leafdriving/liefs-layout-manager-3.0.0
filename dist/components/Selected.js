class Selected extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Selected.makeLabel(this);
        this.build();
        if (this.startValue != undefined)
            this.select(this.startValue);
        Selected.instances[this.label] = this;
    }
    build() {
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {
            let displayCells;
            let type = Arguments_.typeof(this.indexer[index]);
            if (type == "DisplayCell")
                displayCells = this.indexer[index] = [(this.indexer[index])];
            else if (type == "Array")
                displayCells = (this.indexer[index]);
            for (let index = 0; index < displayCells.length; index++)
                displayCells[index].getComponent("Element_")
                    .addEvents({ onclick: function (e) { THIS.select(displayCells[index]); } });
        }
    }
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
    clear() { this.onUnselect(this.currentButtonIndex); this.currentButtonIndex = undefined; }
    indexOf(displaycell) {
        for (let index = 0; index < this.indexer.length; index++)
            if (this.indexer[index].indexOf(displaycell) > -1)
                return index;
        return undefined;
    }
    onSelect(index) {
        let selectArray = (this.indexer[index]);
        for (let i = 0; i < selectArray.length; i++) {
            const displaycell = selectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element && !element.attributes.class.endsWith("Selected")) {
                element.attributes.class += "Selected";
                if (element.el)
                    Element_.setAttrib(element.el, "class", element.attributes.class);
            }
            if (this.onselect)
                this.onselect(index, displaycell);
        }
        if (this.pages)
            this.pages.currentPage = index;
    }
    onUnselect(index) {
        let unSelectArray = (this.indexer[index]);
        for (let i = 0; i < unSelectArray.length; i++) {
            const displaycell = unSelectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element && element.attributes.class.endsWith("Selected")) {
                element.attributes.class = element.attributes.class.slice(0, -8);
                if (element.el)
                    Element_.setAttrib(element.el, "class", element.attributes.class);
            }
            if (this.onunselect)
                this.onunselect(index, displaycell);
        }
    }
}
Selected.labelNo = 0;
Selected.instances = {};
Selected.activeInstances = {};
Selected.defaults = { indexer: [], };
Selected.argMap = {
    string: ["label"],
    function: ["onselect", "onunselect"],
    Array: ["indexer"],
    number: ["startValue"],
    Pages: ["pages"],
};
