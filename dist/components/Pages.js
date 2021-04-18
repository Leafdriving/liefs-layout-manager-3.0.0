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
