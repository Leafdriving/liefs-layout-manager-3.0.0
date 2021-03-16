// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Handler} from './Handler';
// import {Css, css} from './Css';
// import {mf, pf} from './PureFunctions';
// import {Tree, tree} from './Tree';

class Pages extends Base {
    static activePages:Pages[] = [];
    static instances:Pages[] = [];
    static activeInstances:Pages[] = [];

    static defaults = {
        currentPage : 0, previousPage : 0,
        evalFunction : function(thisPages:Pages):number {return thisPages.currentPage}
    }
    static argMap = {
        string : ["label"],
        number : ["currentPage"],
        function : ["evalFunction"],
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
        super();this.buildBase(...Arguments);
        Pages.pop(this);
        Pages.instances.unshift(this);

        if (this.retArgs["DisplayCell"])
            this.displaycells = this.retArgs["DisplayCell"];
        else
            pf.errorHandling("Pages Requires at least one DisplayCells");
        Pages.makeLabel(this);
    }
    eval(){return this.evalFunction(this)}
    evalCell(){return this.displaycells[ this.eval() ];}
    setPage(pageNumber:number){
        if (pageNumber != this.currentPage){
            // this.previousPage = this.currentPage;
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
            el.onclick = function(event) {Tree.onclick.bind(this)(event);}
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
    static parseURL(url = window.location.href){
        let argsObj = pf.parseURLParams(url)
        if (argsObj)
            for (let key in argsObj) {
                let pageInstance = Pages.byLabel(key);
                if (pageInstance)pageInstance.currentPage = argsObj[key];
            }
    }
    static pushHistory(){
        let newUrl = window.location.href.split("?")[0];
        let prefix = "?";
        for (const page of Pages.activePages) {
            if (page.currentPage){
                newUrl +=`${prefix}${page.label}=${page.currentPage}`;
                prefix = "&";
            }
        }
        history.pushState(null, null, newUrl)
        //console.log(newUrl);
    }
    static popstate(event:PopStateEvent){
        // history.back();
        for (let index = 0; index < Pages.activePages.length; index++) {
            const page = Pages.activePages[index];
            page.currentPage = 0;
        }
        Pages.parseURL();
        Handler.update();
    }
}
function P(...Arguments:any){
    let displaycell = new DisplayCell(new Pages(...Arguments) );
    if (displaycell.pages.dim) displaycell.dim = displaycell.pages.dim;
    return displaycell;
}
// export {P, Pages}