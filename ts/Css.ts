// import {BaseF, Base} from './Base';
// import {mf, pf} from './PureFunctions';



class Selected extends Base {
    static labelNo = 0;
    static instances:Selected[] = [];
    static activeInstances:Selected[] = [];
    static defaults = {indexer:[], onSelect:Selected.onSelect, onUnselect:Selected.onUnselect }
    static argMap = {
        string : ["label"],
        function: ["onSelect", "onUnselect"],
    }
    retArgs:ArgsObj;   // <- this will appear
    label:string;

    indexer:DisplayCell[];
    onSelect:(displaycell:DisplayCell)=>void
    onUnselect:(displaycell:DisplayCell)=>void;

    currentButtonIndex:number;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Selected.makeLabel(this);

        if ("DisplayCell" in this.retArgs) this.indexer = this.retArgs["DisplayCell"]
        this.build()
    }
    build(){
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {

            let displaycell = this.indexer[index];
            let htmlblock = displaycell.htmlBlock
            if (!htmlblock.events) htmlblock.events = events({});
            let oldOnclick = htmlblock.events.actions["onclick"];
            if (oldOnclick) FunctionStack.push(`${this.label}_${index}`, oldOnclick)
            FunctionStack.push(`${this.label}_${index}`, function(event:PointerEvent){ THIS.select(event, displaycell) })
            htmlblock.events.actions["onclick"] = FunctionStack.function(`${this.label}_${index}`);
        
        }
    }
    select(event:PointerEvent, displaycell:DisplayCell) {
        let newIndex = this.indexer.indexOf(displaycell);     
        if (this.currentButtonIndex != newIndex){
            if (this.currentButtonIndex != undefined) 
                this.onUnselect( this.indexer[this.currentButtonIndex] );
            this.currentButtonIndex = newIndex;
            this.onSelect( displaycell );
        }
    }
    static onSelect(displaycell:DisplayCell){
        let htmlblock = displaycell.htmlBlock;
        let el=htmlblock.el;
        let oldClassName = el.className;
        if (!oldClassName.endsWith("Selected"))
            el.className = oldClassName + "Selected";
        htmlblock.css += "Selected";
    }
    static onUnselect(displaycell:DisplayCell){
        let htmlblock = displaycell.htmlBlock;
        let el=htmlblock.el;
        let oldClassName = el.className;
        if (oldClassName.endsWith("Selected"))
            el.className = oldClassName.slice(0, -8);
        htmlblock.css = htmlblock.css.slice(0, -8);
    }
}



class Css extends Base {
    static theme:any // set by theme class
    static elementId="llmStyle";
    static instances:Css[] = [];
    static activeInstances:Css[] = [];

    static byLabel(classname:string):Css{
        for (let key in Css.instances)
            if (Css.instances[key].classname == classname)
                return Css.instances[key];
        return undefined;
    }
    static defaults = {
        css : function(){return `Css_${pf.pad_with_zeroes(Css.instances.length)}`},
        isClassname : true
    }
    static argMap = {
        string : ["classname", "css", "cssHover", "cssSelect", "cssSelectHover"],
        boolean : ["isClassname"]
    }
    static deleteOnFirstRunClassname=".remove";
    classname:string;

    css:string;
    cssObj:object;

    cssHover: string;
    cssHoverObj: object;

    cssSelect: string;
    cssSelectObj: object;

    cssSelectHover: string;
    cssSelectHoverObj: object;

    isClassname:boolean;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        if (this.cssObj == undefined) {
            this.cssObj = this.makeObj();
            this.css = this.makeString();
        }
        if (this.cssHover) {
            this.cssHoverObj = this.makeObj(this.cssHover);
            this.cssHover = this.makeString(this.cssHoverObj, "hover");            
        }
        if (this.cssSelect) {
            this.cssSelectObj = this.makeObj(this.cssSelect);
            this.cssSelect = this.makeString(this.cssSelectObj, "", "Selected");            
        }
    }
    makeString(obj:object = this.cssObj, postfix:string = "", addToClassName=""):string{
        let returnString:string  = `${(this.isClassname)?".":""}${this.classname}${addToClassName}${(postfix) ? ":" + postfix:""} {\n`;
        for (let key in obj) 
            returnString += `  ${key}:${obj[key]};\n`;
        returnString += "}"
        return returnString;
    }
    makeObj(str:string = this.css):object {
        //let str = this.asString;
        let obj = {};
        if (str.indexOf('{') > -1) {
            str = str.split('{')[1];
            str = str.split('}')[0];
        }
        let strArray = str.split(';');
        let index:number
        let arr:string[];
        for (let ele of strArray) {
            index = ele.indexOf(':');
            if (index > -1) {
                arr = ele.split(':');
                obj[ arr[0].trim() ] = arr[1].trim();
            }
        }
        return obj;
    }
    static byname(css:string){
        for (let cssInstance of Css.instances) if (cssInstance.css == css) return cssInstance;
        return undefined;
    }
    static update() {
        let style:HTMLElement = document.getElementById(Css.elementId);
        let alreadyexists = true;    
        if (!style) {
            alreadyexists = false;
            style = document.createElement('style');
        }
        pf.setAttrib(style, "id", Css.elementId);
        let outstring = "\n";
        for (let instance of Css.instances) {
            if (instance.css){ outstring += instance.css + "\n";}
            if (instance.cssHover){ outstring += instance.cssHover + "\n";}
            if (instance.cssSelect){ outstring += instance.cssSelect + "\n";}
        }
        style.innerHTML = outstring;
        if (!alreadyexists) document.getElementsByTagName('head')[0].appendChild(style);
    }
}
function css(...Arguments:any){return new Css(...Arguments);}
// export {Css, css}