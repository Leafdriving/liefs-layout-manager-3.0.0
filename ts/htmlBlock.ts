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
        number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
        // Tree: ["tree"],
        boolean: ["hideWidth"],
    }

    label:string;
    tag:string;
    innerHTML:string;
    css:string;
    dim:string;
    events: Events;
    el:HTMLElement;
    marginLeft : number;
    marginRight : number;
    marginTop : number;
    marginBottom : number;
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

        if ("number" in this.retArgs) {
            let length = this.retArgs["number"].length;
            if (length == 1) {
                this.marginRight = this.marginTop = this.marginBottom = this.marginLeft;
            } else if (length == 2) {
                this.marginRight = this.marginLeft;
                this.marginBottom = this.marginTop;
            }
        }
        HtmlBlock.makeLabel(this);
    }
}
function html(...Arguments:any){
    let htmlblock = new HtmlBlock("",...Arguments)
    htmlblock.label = HtmlBlock.defaults["label"]();
    return htmlblock;
}