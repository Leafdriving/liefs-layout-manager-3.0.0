class Pages {
    static activePages:Pages[] = [];
    static instances:Pages[] = [];
    static byLabel(label:string, source=Pages.instances):Pages{
        for (let key in Pages.instances)
            if (Pages.instances[key].label == label)
                return Pages.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Pages_${pf.pad_with_zeroes(Pages.instances.length)}`},
        currentPage : 0, previousPage : 0,
        evalFunction : function(thisPages:Pages):number {return thisPages.currentPage}
    }
    static argMap = {
        string : ["label"],
        number : ["currentPage"],
        Function : ["evalFunction"],
        dim: ["dim"]
    }

    label:string;
    displaycells: DisplayCell[];
    currentPage: number;
    previousPage: number;
    evalFunction: Function;
    dim:string;

    constructor(...Arguments: any) {
        Pages.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Pages");
        mf.applyArguments("Pages", Arguments, Pages.defaults, Pages.argMap, this);
        if (retArgs["DisplayCell"])
            this.displaycells = retArgs["DisplayCell"];
        else
            pf.errorHandling("Pages Requires at least one DisplayCells");
    }
    eval(){return this.evalFunction(this)}
    evalCell(){return this.displaycells[ this.eval() ];}
    setPage(pageNumber:number){
        if (pageNumber != this.currentPage){
            this.previousPage = this.currentPage;
            this.currentPage = pageNumber;
            Handler.update();
        }
    }
    // removeSelected(pageNumber:number = this.previousPage){
    //     // console.log("RemoveSelected for Page " + pageNumber);
    //     // console.log(
    //     //     document.querySelectorAll(`[pagebutton='${this.label}|${pageNumber}']`)
    //     // );
    // }
    addSelected(pageNumber:number = this.currentPage){
        let querry = document.querySelectorAll(`[pagebutton='${this.label}|${pageNumber}']`);
        let el:Element;
        let select:string;
        for (let i = 0; i < querry.length; i++){
            el = querry[i];
            select = el.getAttribute("select");
            if (select) pf.setAttrib(querry[i],"class", select)
        }
    }
    static setPage(label:string, pageNumber:number) {Pages.byLabel(label).setPage(pageNumber)}
    static applyOnclick(){
        let querry = document.querySelectorAll(`[pagebutton]`);
        let value:string;
        let valueArray:string[];
        let pagename:string;
        let pageNo:number;
        let el:Element;
        for (let i = 0; i < querry.length; i++){
            el = querry[i];
            value = el.getAttribute("pagebutton");
            valueArray = value.split("|");
            pagename = valueArray[0];
            pageNo = parseInt( valueArray[1] );
            el.setAttribute("onclick", `Pages.setPage('${pagename}',${pageNo})`)
        }
    }
}
function P(...arguments:any){
    let displaycell = new DisplayCell(new Pages(...arguments) );
    if (displaycell.pages.dim) displaycell.dim = displaycell.pages.dim;
    return displaycell;
}
