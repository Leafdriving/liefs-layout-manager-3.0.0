interface objectValueClassFunction {[key: string]: (value: any, CLASS: string) => string}
interface objectKeyValueClassFunction {[key: string]: (key:string, value: any, CLASS: string) => string}
class ToCode{
    static definitions: {CLASS:string, NAME:string, VALUE:string}[];
    static define(obj:{CLASS:string, NAME:string, VALUE:string}){
        for (let index = 0; index < ToCode.definitions.length; index++) {
            let {CLASS, NAME, VALUE} = ToCode.definitions[index];
            if (CLASS == obj.CLASS && NAME == obj.NAME) return
        }
        ToCode.definitions.push(obj);
    }
    static toCode(asArray:boolean){
        let returnString = "";
        for (let index = 0; index < ToCode.definitions.length; index++) {
            let {CLASS, NAME, VALUE} = ToCode.definitions[index];
            returnString += `let ${CLASS}_${NAME} = ${VALUE}\n`;
        }
        return (asArray) ? ToCode.definitions:returnString;
    }
    static exemptions = ["tag", "retArgs", "toCode", "node_", "renderNode", "toString", "el", "dimArrayTotal"]; // do not read these....
    static addKey:ArgMap = { // for each, you must read these extra variables
        DisplayCell:["htmlBlock", "displaygroup"],
        Coord:["x", "y", "width", "height"],
    };
    static customs:objectValueClassFunction = {
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
            ToCode.define({CLASS:CLASS, NAME:`${this.label}_innerHTML`, VALUE:`"${value}";\n` });
            return `  innerHTML: ${CLASS}_${this.label}_innerHTML,\n`;
            },
        cellArray:function(cellArray:DisplayCell[], CLASS:string = ""){
            let arrayString = "";
            for (let index = 0; index < cellArray.length; index++) {
                ToCode.generic("DisplayCell", cellArray[index]);
                arrayString += ((index == 0) ? "" : ", " ) + `DisplayCell_${cellArray[index].label}`;
            }
            return `  cellArray: [${arrayString}],\n`;
        }
    }
    static callGeneric = function(key:string, value:HtmlBlock, CLASS=undefined){
        ToCode.generic(value.constructor.name, value);
        return `  ${key}: ${value.constructor.name}_`+ ((value.label) ? value.label : `label${ToCode.labelNo}`) + `,\n`;
    }
    static processType:objectKeyValueClassFunction = {
        string:function(key:string, value:string, CLASS=undefined){return `  ${key}: "${value}",\n`},
        number:function(key:string, value:number, CLASS=undefined){return `  ${key}: ${value},\n`},
        object:function(key:string, value:object, CLASS=undefined){return `  ${key}: ${ JSON.stringify(value) },\n`},
        boolean:function(key:string, value:boolean, CLASS=undefined){return `  ${key}: ${value},\n`},
        Array:function(key:string, value:boolean, CLASS=undefined){return ToCode.handleArray(key, value, CLASS)},
        undefined:function(key:string, value:boolean, CLASS=undefined){return `// ${key}: undefined,\n`},
        HtmlBlock:ToCode.callGeneric,
        Within:function(key:string, value:boolean, CLASS=undefined){return `  ${key}: new Within(),\n`},
        //Within:ToCode.callGeneric,
        Coord:ToCode.callGeneric,
        DisplayGroup:ToCode.callGeneric,
        DisplayCell:ToCode.callGeneric,
    }
    static handleArray(key:string, value:boolean, CLASS=undefined){
        console.log(key, value, CLASS);
        if (key == "cellArray" && CLASS == "DisplayGroup")
            console.log("DisplayGroup Found");
        if (key == "overlays" && CLASS == "DisplayCell")
            console.log("DisplayCell Overlyas Found");
        return `  ${key}: [/* must fix! */],\n`;
    }
    
    static generic(CLASS:string, classInstance:any){
        let addKeys = (CLASS in ToCode.addKey) ? ToCode.addKey[CLASS] : [];
        let exemptions = ToCode.exemptions;
        let inner = "";
        let keyValue:[string, string][]=[];                 // [key, type]
        let forconsolelog:string = `[`;

        for (let key in classInstance) {                     // get all variable from Class
            if (exemptions.indexOf(key) == -1) {
                // console.log(`pushed key "${key}"`,)
                forconsolelog += `"${key}", `;
                keyValue.push([key, BaseF.typeof(classInstance[key])]);
            }
        }
        for (let index = 0; index < addKeys.length; index++) {   // add keys from library by Class
            let key = addKeys[index];
            if (exemptions.indexOf(key) == -1)
                keyValue.push([key, BaseF.typeof(classInstance[key])]);
        }
        inner += "{\n";
        for (let index = 0; index < keyValue.length; index++) {
            let [key, type] = keyValue[index];
            if (key in ToCode.customs){
                inner += ToCode.customs[key].bind(classInstance)(classInstance[key], CLASS);
            }
            else {
                if (type in ToCode.processType) {
                    inner += ToCode.processType[type](key, classInstance[key], CLASS);

                } else inner += `// no manager for type "${type}" variable ${key}\n`;
            }
        }
        inner += "});\n";
        let label = (classInstance.label) ? classInstance.label : `label${++ToCode.labelNo}`;
        ToCode.define({CLASS, NAME:`${label}`, VALUE:`new ${CLASS}(${inner}`});
        // console.log(forconsolelog+"]")
    }
    static labelNo:number = 0;
}
let callFunction = function(asArray:boolean = false) {
    let CLASS = this.constructor.name;
    ToCode.definitions = [];
    ToCode.generic(CLASS, this);
    return ToCode.toCode(asArray);
}
Base.prototype.toCode = Within.prototype.toString = callFunction;
