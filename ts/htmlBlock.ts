// import {ArgsObj, ArgsFunctions} from './Interfaces'
// import {BaseF, Base} from './Base';
// import {events, Events} from './Events';
// import {Css, css} from './Css';
// import {mf, pf} from './PureFunctions';

/**
 * This Class Holds the HTMLElement
 */
class HtmlBlock extends Base {
    static instances:HtmlBlock[] = [];
    static activeInstances:HtmlBlock[] = [];
    static defaults = {
        innerHTML : " ",
        tag: "DIV",
        css: "",
        dim: ""
    }
    static argMap = {
        string : ["label", "innerHTML", "css"],
        dim : ["dim"],
        Events : ["events"],
        boolean: ["hideWidth"],
    }

    label:string;
    tag:string;
    innerHTML:string;
    css:string;
    dim:string;
    events: Events;
    el:HTMLElement;
    attributes:object = {};
    hideWidth: boolean;
    minDisplayGroupSize: number;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        let elementWithIdAsLabel = document.getElementById(this.label);
        if(elementWithIdAsLabel){
            this.innerHTML = elementWithIdAsLabel.innerHTML;
            this.attributes = pf.getAttribs(elementWithIdAsLabel, this.attributes);
            elementWithIdAsLabel.remove();
        }
        if ("Css" in this.retArgs)
            for (let css of this.retArgs["Css"]) 
                this.css = (this.css + " "+  (<Css>css).classname).trim();

        if ("string" in this.retArgs && this.retArgs.string.length > 3) 
            this.css += " " + this.retArgs.string.splice(3).join(' ');

        // if ("number" in this.retArgs) {
        //     let length = this.retArgs["number"].length;
        //     if (length == 1) {
        //         this.marginRight = this.marginTop = this.marginBottom = this.marginLeft;
        //     } else if (length == 2) {
        //         this.marginRight = this.marginLeft;
        //         this.marginBottom = this.marginTop;
        //     }
        // }
        HtmlBlock.makeLabel(this);
    }
    // static renderHtmlBlock(displaycell:DisplayCell, derender=false, parentDisplaygroup:DisplayGroup){
      
    // }
    static renderHtmlAttributes(el:HTMLElement, htmlblock: HtmlBlock, id:string){
        for (let key in htmlblock.attributes) {
            let value = htmlblock.attributes[key];
            if (key == "class") value += " " +htmlblock.css;
            if (key == "id") value = id;
            pf.setAttrib(el, key, value);
        }
        pf.setAttrib(el, "llm", "");
    }
    static Render(htmlBlock:HtmlBlock, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        let displaycell = <DisplayCell>(node.parent().Arguments[1])

        let el:HTMLElement = pf.elExists(displaycell.label);
        let alreadyexists:boolean = (el) ? true : false;

        derender = displaycell.coord.derender( derender );

        let isNulDiv = (htmlBlock.css.trim() == "" &&
                        htmlBlock.innerHTML.trim() == "" &&
                        Object.keys( htmlBlock.attributes ).length == 0 &&
                        !Handler.renderNullObjects)

        if (derender || isNulDiv) {
            if (alreadyexists) el.remove();
        } else {
            if (!alreadyexists) el = document.createElement(htmlBlock.tag);
            pf.setAttrib(el, "id", displaycell.label);
            if (htmlBlock.css.trim()) pf.setAttrib(el, "class", htmlBlock.css);
            HtmlBlock.renderHtmlAttributes(el, htmlBlock, displaycell.label);
            if (el.innerHTML != htmlBlock.innerHTML) el.innerHTML = htmlBlock.innerHTML;
            if (!alreadyexists) {
                document.body.appendChild(el);
                htmlBlock.el = el;
                if (htmlBlock.events) htmlBlock.events.applyToHtmlBlock(htmlBlock);
            }
            let attrstring = displaycell.coord.newAsAttributeString(zindex) // + clipString;
            if (el.style.cssText != attrstring) el.style.cssText = attrstring;
        }

        return {zindex}
    }
}
Render.register("HtmlBlock", HtmlBlock);
function html(...Arguments:any){
    let htmlblock = new HtmlBlock(...Arguments)
    // htmlblock.label = HtmlBlock.defaults["label"]();
    return htmlblock;
}
// export {html, HtmlBlock}