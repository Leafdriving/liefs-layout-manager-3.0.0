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
        dim: ["dim"],
        // DisplayCell: ["displaycells"] <- but the whole array done in constructor
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
    addSelected(pageNumber:number = this.currentPage){
        let querry = document.querySelectorAll(`[pagebutton='${this.label}|${pageNumber}']`);
        let el:Element;
        let select:string;
        for (let i = 0; i < querry.length; i++){
            el = querry[i];
            select = el.getAttribute("select");
            if (select) pf.setAttrib(el,"class", select)
            else {
                let currentClass = el.getAttribute("class");
                if( Css.byLabel(currentClass).cssSelect ) {
                    pf.setAttrib(el, "class", currentClass + "Selected")
                }
                
            }
        }
        // console.log(el);
    }
    static setPage(label:string, pageNumber:number) {Pages.byLabel(label).setPage(pageNumber)}
    static applyOnclick(){
        let querry = document.querySelectorAll(`[pagebutton]`);
        let value:string;
        let valueArray:string[];
        let pagename:string;
        let pageNo:string;
        let el:HTMLElement;
        let THIS = this;
        for (let i = 0; i < querry.length; i++){
            el = <HTMLElement>(querry[i]);
            // value = el.getAttribute("pagebutton");
            // valueArray = value.split("|");
            // pagename = valueArray[0];
            // pageNo = valueArray[1];
            // if (pageNo.charCodeAt(0) < 47 || pageNo.charCodeAt(0) > 57) {
            //     let newIndex = Pages.byLabel(pagename).indexByName(pageNo);
            //     if (newIndex == -1) {
            //         console.log(`Pages.button -> no page called ${pageNo}`);
            //     }
            //     pageNo = newIndex.toString();
            // }
            
            el.onclick = function(event) {
                Tree.onclick.bind(this)(event);
                // treeOnclick(event);
            }
            // if (!el.getAttribute("onclick")) {
            //     el.setAttribute("onclick", `Pages.setPage('${pagename}',${pageNo});if (HtmlBlock.byLabel(this.id).events) {var doit=HtmlBlock.byLabel(this.id).events.actions.onclick.bind(this);doit(event)}`)
            // }
        }
    }
    indexByName(name:string): number {
        for (let index = 0; index < this.displaycells.length; index++) {
            const displaycell = this.displaycells[index];
            if (displaycell.label == name) return index;
        }
        return -1
    }
    static button(pagename:string, index:string|number): object {
        // let page = Pages.byLabel(pagename);
        // let newIndex:number
        // if (typeof(index) == "string") {
        //     newIndex = page.indexByName(index);
        //     if (newIndex == -1) {
        //         console.log(`Pages.button -> no page called ${index}`);
        //         return {}
        //     }
        //     index = newIndex;
        // }
        return {attributes : {pagebutton : `${pagename}|${index}`}}
    }
}
function P(...arguments:any){
    let displaycell = new DisplayCell(new Pages(...arguments) );
    if (displaycell.pages.dim) displaycell.dim = displaycell.pages.dim;
    return displaycell;
}
