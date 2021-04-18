// // import {ArgsObj, ArgsFunctions} from './Interfaces'
// // import {BaseF, Base} from './Base';
// // import {events, Events} from './Events';
// // import {Css, css} from './Css';
// // import {mf, pf} from './PureFunctions';

// /**
//  * This Class Holds the HTMLElement
//  */
// class HtmlBlock extends Base {
//     static instances:HtmlBlock[] = [];
//     static activeInstances:HtmlBlock[] = [];
//     static defaults = {
//         innerHTML : " ",
//         tag: "DIV",
//         css: "",
//         dim: "",
//     }
//     static argMap = {
//         string : ["label", "innerHTML", "css"],
//         dim : ["dim"],
//         Events : ["events"],
//         boolean: ["hideWidth"],
//         function: ["evalInnerHtml"]
//     }

//     renderNode:node_; // render node

//     label:string;
//     tag:string;
//     innerHTML:string;
//     css:string;
//     dim:string;
//     #events_: Events;
//     get events(){return this.#events_}
//     set events(events:Events){
//         if (!this.#events_) this.#events_ = events;
//         else Events.mergeEvents(this.label, this.#events_, events);
//     }
//     el:HTMLElement;
//     attributes:object = {};
//     hideWidth: boolean;
//     minDisplayGroupSize: number;
//     evalInnerHtml:(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell)=>void;

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);

//         let elementWithIdAsLabel = document.getElementById(this.label);
//         if(elementWithIdAsLabel){
//             this.innerHTML = elementWithIdAsLabel.innerHTML;
//             this.attributes = pf.getAttribs(elementWithIdAsLabel, this.attributes);
//             elementWithIdAsLabel.remove();
//         }
//         if ("Css" in this.retArgs)
//             for (let css of this.retArgs["Css"]) 
//                 this.css = (this.css + " "+  (<Css>css).classname).trim();

//         if ("string" in this.retArgs && this.retArgs.string.length > 3) 
//             this.css += " " + this.retArgs.string.splice(3).join(' ');

//         HtmlBlock.makeLabel(this);
//     }
//     delete() {
//         let parentDisplayCell = <DisplayCell>(this.renderNode.parent().Arguments[1]);
//         Render.update(parentDisplayCell, true)
//         //parentDisplayCell.htmlBlock = undefined;
//         // if (parentDisplayCell.isEmpty()){parentDisplayCell.delete()}
//     }
//     static renderHtmlAttributes(el:HTMLElement, htmlblock: HtmlBlock, id:string){
//         for (let key in htmlblock.attributes) {
//             let value = htmlblock.attributes[key];
//             if (key == "class") value += " " +htmlblock.css;
//             if (key == "id") value = id;
//             pf.setAttrib(el, key, value);
//         }
//         pf.setAttrib(el, "llm", "");
//     }
//     static Render(htmlBlock:HtmlBlock, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
//         let displaycell = <DisplayCell>(node.parent().Arguments[1])
//         if (displaycell) {
//             if (htmlBlock.evalInnerHtml) htmlBlock.evalInnerHtml(htmlBlock, zindex, derender, node, displaycell);
//             // if (derender) console.log("HTMLBLOCK Derender: ", displaycell.label)
//             let el:HTMLElement = pf.elExists(displaycell.label);
//             let alreadyexists:boolean = (el) ? true : false;
//             derender = displaycell.coord.derender( derender );
//             let isUndefined = (htmlBlock.innerHTML == undefined);
//             let isNulDiv = (htmlBlock.css.trim() == "" &&
//                             htmlBlock.innerHTML == "" &&
//                             Object.keys( htmlBlock.attributes ).length == 0 &&
//                             !Handler.renderNullObjects)
//             if (derender || (isNulDiv && !isUndefined)) {
//                 if (alreadyexists) el.remove();
//             } else {
//                 if (!alreadyexists) {
//                     el = document.createElement(htmlBlock.tag);
//                     pf.setAttrib(el, "id", displaycell.label);
//                 }
//                 if (htmlBlock.css.trim()) {
//                     pf.setAttrib(el, "class", htmlBlock.css);
//                 }
//                 HtmlBlock.renderHtmlAttributes(el, htmlBlock, displaycell.label);
//                 if (el.innerHTML != htmlBlock.innerHTML) {
//                     if (!isUndefined) el.innerHTML = htmlBlock.innerHTML;
//                 }
//                 if (!alreadyexists) {
//                     document.body.appendChild(el);
//                     htmlBlock.el = el;
//                     if (htmlBlock.events) htmlBlock.events.applyToHtmlBlock(htmlBlock);
//                 }
//                 let attrstring = displaycell.coord.newAsAttributeString(zindex) // + clipString;
//                 if (el.style.cssText != attrstring) el.style.cssText = attrstring;
//                 // el.style.cssText = attrstring;
//             }
//         } else console.log(`htmlblock: ${htmlBlock} has no parent Display Cell????`)
//         return {zindex}
//     }
// }
// Render.register("HtmlBlock", HtmlBlock);
// function html(...Arguments:any){
//     let htmlblock = new HtmlBlock(...Arguments)
//     // htmlblock.label = HtmlBlock.defaults["label"]();
//     return htmlblock;
// }
// // export {html, HtmlBlock}