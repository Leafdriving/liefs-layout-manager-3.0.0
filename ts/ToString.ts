interface custom1 {[key: string]: (value: any, CLASS: string) => string}
interface custom2 {[key: string]: (key:string, value: any, CLASS: string) => string}
class ToString{
    static definitions: {CLASS:string, NAME:string, VALUE:string}[];
    static define(obj:{CLASS:string, NAME:string, VALUE:string}){
        for (let index = 0; index < ToString.definitions.length; index++) {
            let {CLASS, NAME, VALUE} = ToString.definitions[index];
            if (CLASS == obj.CLASS && NAME == obj.NAME) return
        }
        ToString.definitions.push(obj);
    }
    static toCode(){
        let returnString = "";
        for (let index = 0; index < ToString.definitions.length; index++) {
            let {CLASS, NAME, VALUE} = ToString.definitions[index];
            returnString += `let ${CLASS}_${NAME} = ${VALUE}\n`;
        }
        return returnString;
    }
    static exemptions = ["tag", "retArgs", "toString"];
    static addKey:ArgMap = {
        HtmlBlock:[],
        DisplayCell:["htmlBlock"],
    };
    static customs:custom1 = {
        isRendered:function(value:string, CLASS:string = ""){return ""},
        attributes:function(value:object, CLASS:string = ""){
            return ((Object.keys(value).length == 0) ? "" : `attributes: ${JSON.stringify(value)},\n`);
            },
        css:function(value:string, CLASS:string = ""){
            return ((!value.length) ? "" : `  css: "${value}",\n`);
            },
        dim:function(value:string, CLASS:string = ""){
            return ((!value.length) ? "" : `  dim: "${value}",\n`)
            },
        innerHTML:function(value:string, CLASS:string = "") {
            ToString.define({CLASS:CLASS, NAME:`${this.label}_innerHTML`, VALUE:`"${value}";\n` });
            return `  innerHTML: ${CLASS}_${this.label}_innerHTML,\n`;
        }
    }
    static processType:custom2 = {
        string:function(key:string, value:string, CLASS=undefined){return `  ${key}: "${value}",\n`},
        number:function(key:string, value:number, CLASS=undefined){return `  ${key}: ${value},\n`},
        object:function(key:string, value:object, CLASS=undefined){return `  ${key}: ${ JSON.stringify(value) },\n`},
        boolean:function(key:string, value:boolean, CLASS=undefined){return `  ${key}: ${value},\n`},
        HtmlBlock:function(key:string, value:HtmlBlock, CLASS=undefined){
            ToString.generic(value.constructor.name, value); return `  ${key}: ${value.constructor.name}_${value.label},\n`
        },
    }
    static generic(CLASS:string, classInstance:any){
        let addKeys = ToString.addKey[CLASS];
        let exemptions = ToString.exemptions;
        let inner = "";
        let keyValue:[string, string][]=[];                 // [key, type]

        for (let key in classInstance) {                     // get all variable from Class
            if (exemptions.indexOf(key) == -1)
                keyValue.push([key, BaseF.typeof(classInstance[key])]);
        }
        for (let index = 0; index < addKeys.length; index++) {   // add keys from library by Class
            let key = addKeys[index];
            if (exemptions.indexOf(key) == -1)
                keyValue.push([key, BaseF.typeof(classInstance[key])]);
        }
        inner += "{\n";
        for (let index = 0; index < keyValue.length; index++) {
            let [key, type] = keyValue[index];
            if (key in ToString.customs){
                inner += ToString.customs[key].bind(classInstance)(classInstance[key], CLASS);
            }
            else {
                if (type in ToString.processType) {
                    inner += ToString.processType[type](key, classInstance[key], CLASS);

                } else inner += `// no manager for type "${type}" variable ${key}\n`;
            }
        }
        inner += "});\n";
        ToString.define({CLASS, NAME:`${classInstance.label}`, VALUE:`new ${CLASS}(${inner}`});
    }
}
Base.prototype.toString = function() {
    let CLASS = this.constructor.name;
    ToString.definitions = [];
    ToString.generic(CLASS, this);
    return ToString.toCode();
}
