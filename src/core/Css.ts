/**
 * Css
 */
class Css extends Base {
    static theme:any // set by theme class
    static elementId="llmStyle";
    static instances:{[key: string]: Css;} = {};
    static activeInstances:{[key: string]: Css;} = {};

    /**
     * label
     * @param classname 
     * @returns label 
     */
    static byLabel(classname:string):Css{
        for (let key in Css.instances)
            if (Css.instances[key].classname == classname)
                return Css.instances[key];
        return undefined;
    }
    static defaults = {isClassname : true}
    /**
     * Arg map of css
     */
    static argMap = {
        string : ["classname", "css", "cssHover", "cssSelect", "cssSelectHover"],
        boolean : ["isClassname"]
    }
    /**
     * Delete on first run classname of css
     */
    static deleteOnFirstRunClassname=".remove";
    classname:string;
    type:string;

    css:string;
    cssObj:object;

    cssHover: string;
    cssHoverObj: object;

    cssSelect: string;
    cssSelectObj: object;

    cssSelectHover: string;
    cssSelectHoverObj: object;

    isClassname:boolean;

    /**
     * Creates an instance of css.
     * @param Arguments 
     */
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
        Css.instances[this.classname] = this;
    }
    /**
     * News string
     * @param data 
     */
    newString(data:string){
        this.cssObj = this.makeObj(data);
        this.css = this.makeString();
    }
    /**
     * Makes string
     * @param [obj] 
     * @param [postfix] 
     * @param [addToClassName] 
     * @returns string 
     */
    makeString(obj:object = this.cssObj, postfix:string = "", addToClassName=""):string{
        let returnString:string  = `${(this.isClassname)?".":""}${this.classname}${addToClassName}${(postfix) ? ":" + postfix:""} {\n`;
        for (let key in obj) 
            returnString += `  ${key}:${obj[key]};\n`;
        returnString += "}"
        return returnString;
    }
    /**
     * Makes obj
     * @param [str] 
     * @returns obj 
     */
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

    /**
     * Updates css
     */
    static update() {
        let style:HTMLElement = document.getElementById(Css.elementId);
        let alreadyexists = true;    
        if (!style) {
            alreadyexists = false;
            style = document.createElement('style');
        }
        Element_.setAttrib(style, "id", Css.elementId);
        let outstring = "\n";
        for (const key in Css.instances) {
            const instance = Css.instances[key];
            if (instance.css){ outstring += instance.css + "\n";}
            if (instance.cssHover){ outstring += instance.cssHover + "\n";}
            if (instance.cssSelect){ outstring += instance.cssSelect + "\n";}
        }
        style.innerHTML = outstring;
        // console.log("outstring",outstring)
        if (!alreadyexists) document.getElementsByTagName('head')[0].appendChild(style);
    }
    static advisedDiv = new Css("div[llm]","position:absolute;", false, {type:"llm"});
    static advisedBody = new Css("body","overflow: auto hidden;", false, {type:"llm"});
    static advisedHtml = new Css("html","overflow: auto hidden;", false, {type:"llm"});
}
function css(...Arguments:any){return new Css(...Arguments);}