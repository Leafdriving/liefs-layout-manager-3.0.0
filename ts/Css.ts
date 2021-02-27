class Css {
    static elementId="llmStyle";
    static instances:Css[] = [];
    static byLabel(label:string):Css{
        for (let key in Css.instances)
            if (Css.instances[key].label == label)
                return Css.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Css_${pf.pad_with_zeroes(Css.instances.length)}`},
        isClassname : true
    }
    static argMap = {
        string : ["label", "asString"],
        boolean : ["isClassname"]
    }
    label:string;
    asObj:object;
    asString:string;
    isClassname:boolean;

    constructor(...Arguments: any) {
        Css.instances.push(this);
        mf.applyArguments("Css", Arguments, Css.defaults, Css.argMap, this);
        if (this.asString == undefined) this.makeString();
        if (this.asObj == undefined) this.makeObj();
    }
    makeString(){
        this.asString = `${(this.isClassname)?".":""}${this.label} {\n`;
        for (let key in this.asObj) 
            this.asString += `  ${key}:${this.asObj[key]};\n`;
        this.asString += "}"
    }
    makeObj(){
        let str = this.asString;
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
        this.asObj = obj;
        this.makeString();
    }
    static byname(label:string){
        for (let cssInstance of Css.instances) if (cssInstance.label == label) return cssInstance;
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
            outstring += instance.asString + "\n";
        }
        style.innerHTML = outstring;
        if (!alreadyexists) document.getElementsByTagName('head')[0].appendChild(style);
    }
}
new Css("div","position:absolute;", false);
function css(label:string, content:string|object){return new Css(label, content);}