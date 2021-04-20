class Pages extends Base {
    // retArgs:objectAny;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let THIS = this;
        Pages.makeLabel(this);
        Pages.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs)
            this.cellArray = this.retArgs["DisplayCell"];
        let index = -1;
        if (this.tree) {
            this.cellArray = [];
            node_.traverse(this.tree.parentTreeNode, function (node) {
                let label = node.Arguments[0];
                let displaycell = DisplayCell.instances[label];
                if (!displaycell)
                    displaycell = I(label);
                let element_ = (node["displaycell"]).getComponent("Element_");
                let i = index;
                element_.addEvents({ onclick: function () { THIS.currentPage = i; } });
                THIS.cellArray.push(displaycell);
                index++;
            });
            this.cellArray.shift();
        }
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
        if (newPage != this.prevPage)
            Render.update(this.cellArray[this.prevPage], true);
        this.currentPage_ = this.prevPage = newPage;
        //console.log("parentDisplayCell", this.parentDisplayCell.label)
        //this.parentDisplayCell.coord.log()
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
    Tree_: ["tree"],
};
Render.register("Pages", Pages);
function P(...Arguments) {
    return new DisplayCell(new Pages(...Arguments));
}
