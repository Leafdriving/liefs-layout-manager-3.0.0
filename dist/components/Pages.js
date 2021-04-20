class Pages extends Base {
    // retArgs:objectAny;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Pages.makeLabel(this);
        Pages.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs)
            this.cellArray = this.retArgs["DisplayCell"];
        Pages.instances[this.label] = this;
    }
    get dim() { return this.dim_; }
    set dim(value) { this.dim_ = value; }
    set currentPage(value) {
        this.currentPage_ = value;
        Render.scheduleUpdate();
    }
    get currentPage() { return this.currentPage_; }
    onConnect() {
        let THIS = this;
        this.parentDisplayCell.getdim = function () { return THIS.dim; };
        this.parentDisplayCell.setdim = function (value) { THIS.dim = value; };
    }
    ;
    preRender(derender, node) {
        return undefined;
    }
    ;
    Render(derender, node, zindex) {
        let newPage = this.evalFunction(this);
        if (newPage != this.prevPage) {
            Render.update(this.cellArray[this.prevPage], true);
            this.currentPage = newPage;
            this.prevPage = newPage;
        }
        this.cellArray[this.currentPage].coord.copy(this.parentDisplayCell.coord);
        return [this.cellArray[this.currentPage]];
    }
    ;
    delete() { }
}
Pages.labelNo = 0;
Pages.instances = {};
Pages.activeInstances = {};
Pages.defaults = {
    currentPage_: 0, prevPage: 0,
    evalFunction: function (thisPages) { return thisPages.currentPage; }
};
Pages.argMap = {
    string: ["label"],
    function: ["evalFunction"],
    dim: ["dim_"],
    // Selected: ["selected"],
};
Render.register("Pages", Pages);
function P(...Arguments) {
    return new DisplayCell(new Pages(...Arguments));
}
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
