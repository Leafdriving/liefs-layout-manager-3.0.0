// // import {Base} from './Base';
// // import {DisplayCell} from './DisplayCell';
// // import {Handler} from './Handler';
// // import {Css, css} from './Css';
// // import {mf, pf} from './PureFunctions';
// // import {Tree, tree} from './Tree';

// class Pages extends Base {
//     static activePages:Pages[] = [];
//     static instances:Pages[] = [];
//     static activeInstances:Pages[] = [];

//     static defaults = {
//         currentPage : 0, previousPage : 0,
//         evalFunction : function (thisPages:Pages):number {return thisPages.currentPage}
//     }
//     static argMap = {
//         string : ["label"],
//         number : ["currentPage"],
//         function : ["evalFunction"],
//         dim: ["dim"],
//         // DisplayCell: ["displaycells"] <- but the whole array done in constructor
//     }

//     renderNode:node_; // render node

//     label:string;
//     displaycells: DisplayCell[];
//     currentPage: number;
//     previousPage: number;
//     evalFunction: Function;
//     // dim:string;
//     get dim() { return this.evalCell().dim; }
//     set dim(value:string) {console.log (`Do Not Set 'Dim' value in Pages("${this.label}").  It is inherited.`)}

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         Pages.pop(this);                        // pages must be added
//         Pages.instances.unshift(this);          // in reverse order!

//         if (this.retArgs["DisplayCell"])
//             this.displaycells = this.retArgs["DisplayCell"];
//         else
//             this.displaycells = [];
//         Pages.makeLabel(this);
//     }
//     eval(){return this.evalFunction(this)}
//     evalCell(){return this.displaycells[ this.eval() ];}
//     setPage(pageNumber:number|string){
//         if (typeof(pageNumber) == "string") pageNumber = this.byLabel(pageNumber);
//         if (pageNumber != this.currentPage){
//             // this.previousPage = this.currentPage;
//             this.currentPage = pageNumber;
//             Render.update();Render.update(); /// whats up here?????? needed!
//         }
//     }
//     byLabel(label:string): number {
//         for (let index = 0; index < this.displaycells.length; index++) {
//             let displaycell = this.displaycells[index];

            
//             let dslabel = displaycell.label
//             if (dslabel.endsWith("_DisplayCell")) {  /////////////////////////////////////// double check!
//                 dslabel = dslabel.slice(0, -12);
//             }


//             if (dslabel == label) return index;
//         }
//         return -1
//     }
//     static byLabel(label:string) {
//         for (let index = 0; index < Pages.instances.length; index++) {
//             const page = Pages.instances[index];
//             if (page.label == label) return page;
//         }
//         return undefined;
//     }
//     addSelected(pageNumber:number = this.currentPage){
//         let labelOfPageNumber = this.displaycells[pageNumber].label
//         if (labelOfPageNumber.endsWith("_DisplayCell")) {  /////////////////////////////////////// double check!
//             labelOfPageNumber = labelOfPageNumber.slice(0, -12);
//         }
//         let querry = document.querySelectorAll(
//             `[pagebutton='${this.label}|${pageNumber}'], [pagebutton='${this.label}|${labelOfPageNumber}']`); // ".classA, .classB"
//         let el:Element;
//         let select:string;
//         for (let i = 0; i < querry.length; i++){
//             el = querry[i];
//             select = el.getAttribute("select");
//             if (select) pf.setAttrib(el,"class", select)
//             else {
//                 let currentClass = el.getAttribute("class");
//                 if( Css.byLabel(currentClass).cssSelect ) {
//                     pf.setAttrib(el, "class", currentClass + "Selected")
//                 }
                
//             }
//         }
//         // console.log(el);
//     }
//     static setPage(label:string, pageReference:number|string) {(<Pages>Pages.byLabel(label)).setPage(pageReference)}
//     static applyOnclick(){
//         let querry = document.querySelectorAll(`[pagebutton]`);
//         let el:HTMLElement;
//         let value:string;
//         let pagename:string;
//         let pageReference:string;
//         let onclick:string;
//         for (let i = 0; i < querry.length; i++){
//             el = <HTMLElement>(querry[i]);
//             value = el.attributes["pagebutton"].value;
//             onclick = (el.attributes["onclick"]) ? el.attributes["onclick"].value : undefined; 
//             [pagename, pageReference] = value.split("|");
//             if (!onclick) {
//                 el.onclick = function(mouseEvent:MouseEvent){ Pages.setPage(pagename, pageReference) }
//             } else {
//                 el.onclick = function(mouseEvent:MouseEvent){ Pages.setPage(pagename, pageReference); eval(onclick) };
//                 el.removeAttribute("onclick")
//             }
//             el.removeAttribute("pagebutton");
//         }
//     }
//     static button(pagename:string, index:string|number, keepAsNumber = false): object {
//         let page = Pages.byLabel(pagename);
//         if (!keepAsNumber && page && typeof(index) == "number") {
//             index = page.displaycells[index].label;
//             if (index.endsWith("_DisplayCell")) {  /////////////////////////////////////// double check!
//                 index = index.slice(0, -12);
//             }
//         }
//         return {attributes : {pagebutton : `${pagename}|${index}`}}
//     }
//     static parseURL(url = window.location.href){
//         let argsObj = pf.parseURLParams(url)
//         if (argsObj)
//             for (let key in argsObj) {
//                 let pageInstance = Pages.byLabel(key);
//                 if (pageInstance)pageInstance.currentPage = argsObj[key];
//             }
//     }
//     static pushHistory(){
//         // let newUrl = window.location.href.split("?")[0];
//         // let prefix = "?";
//         // for (const page of Pages.activePages) {
//         //     if (page.currentPage){
//         //         newUrl +=`${prefix}${page.label}=${page.currentPage}`;
//         //         prefix = "&";
//         //     }
//         // }
//         // history.pushState(null, null, newUrl)
//         // //console.log(newUrl);
//     }
//     static popstate(event:PopStateEvent){
//         // // history.back();
//         // for (let index = 0; index < Pages.activePages.length; index++) {
//         //     const page = Pages.activePages[index];
//         //     page.currentPage = 0;
//         // }
//         // Pages.parseURL();
//         // Render.update();
//     }
// }
// function P(...Arguments:any){
//     let displaycell = new DisplayCell(new Pages(...Arguments) );
//     if (displaycell.pages.dim) displaycell.dim = displaycell.pages.dim;
//     return displaycell;
// }
// // export {P, Pages}


// // interface menuObject {
// //     [key: string]: ()=>void | menuObject
// // }

