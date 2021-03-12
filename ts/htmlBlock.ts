/**
 * This Class Holds the HTMLElement
 */
class HtmlBlock {
    static instances:HtmlBlock[] = [];
    static byLabel(label:string):HtmlBlock{
        for (let key in HtmlBlock.instances)
            if (HtmlBlock.instances[key].label == label)
                return HtmlBlock.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `htmlBlock_${pf.pad_with_zeroes(HtmlBlock.instances.length)}`},
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
        HtmlBlock.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "HtmlBlock");
        mf.applyArguments("HtmlBlock", Arguments, HtmlBlock.defaults, HtmlBlock.argMap, this);

        let elementWithIdAsLabel = document.getElementById(this.label);
        if(elementWithIdAsLabel){
            this.innerHTML = elementWithIdAsLabel.innerHTML;
            this.attributes = pf.getAttribs(elementWithIdAsLabel, this.attributes);
            elementWithIdAsLabel.remove();
        }
        if ("Css" in retArgs)
            for (let css of retArgs["Css"]) 
                this.css = (this.css + " "+  (<Css>css).classname).trim();

        if ("string" in retArgs && retArgs.string.length > 3) 
            this.css += " " + retArgs.string.splice(3).join(' ');

        if ("number" in retArgs) {
            let length = retArgs["number"].length;
            if (length == 1) {
                this.marginRight = this.marginTop = this.marginBottom = this.marginLeft;
            } else if (length == 2) {
                this.marginRight = this.marginLeft;
                this.marginBottom = this.marginTop;
            }
        }
        if (this.label.trim() == "") this.label = `htmlBlock_${pf.pad_with_zeroes(HtmlBlock.instances.length)}`;
    }
}
function html(...Arguments:any){
    let htmlblock = new HtmlBlock("",...Arguments)
    htmlblock.label = HtmlBlock.defaults["label"]();
    return htmlblock;
}