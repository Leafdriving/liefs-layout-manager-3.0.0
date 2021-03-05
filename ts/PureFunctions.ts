interface ArgsObj {
    [type: string]: any[];   
}
interface ArgsFunctions {
    [type: string]: Function[];
}
class mf {
  /**
  * Sample Comment
  * argobj is blah blah
  * @returns blah blah
  */
    static modifyClassProperties(argobj:object, targetobject:object){
        for (let key of Object.keys(argobj)){
            if (typeof(argobj[key]) == "function" && key=="label"){

                targetobject[key] = argobj[key]();
            }
            else
                targetobject[key] = argobj[key];
        }
    }
    static applyArguments(callLabel:string, Arguments: any, classDefaults:object, classArgmap:object, THIS:object, customtypes : Function[] = []) {
        let retArgs : ArgsObj = pf.sortArgs(Arguments, callLabel, customtypes);
        let updatedDefaults : Object = pf.ifObjectMergeWithDefaults(retArgs, classDefaults);
        let retArgsMapped : Object = pf.retArgsMapped(retArgs, updatedDefaults, classArgmap);
        mf.modifyClassProperties(retArgsMapped, THIS);
    }
}
class pf {
  /**
  * 'message' is the string outputed to the viewer
  * @returns nothing
  */    
    static errorHandling(message:string) {
        console.log(`Error Handeling Called\n${message}`);
    }
    static isTypePx = function(it:any){if (typeof(it) == "string" && it.substr(-2) == "px") return "pixels"}
    static pxAsNumber = function(dim:string){ return +(dim.slice(0, -2));}
    static isTypePercent = function(it:any){if (typeof(it) == "string" && it.substr(-1) == "%") return "percent"}
    static percentAsNumber = function(dim:string){ return +(dim.slice(0, -1));}
    static isDim = function(it:any){if ((typeof(it) == "string") && (it.substr(-2) == "px" || it.substr(-1) == "%")) return "dim"}
    static isArray = function(it:any){if (typeof(it) == "object" && Array.isArray(it)) return "Array"}
    static isObjectAClass = function(it:any){if (typeof(it) == "object" && it.constructor.name != "Object") return it.constructor.name}
    static defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim];

    static classProperties = function(a:string[]){return Object.getOwnPropertyNames(a)}

    static commonKeys(obj1:object, obj2:object) : string[] {
        let returnStringArray = [];
        for (let index in obj1) 
            if (index in obj2) returnStringArray.push(index);
        return returnStringArray;
    }
    static pad_with_zeroes = function(Number: number, length: number = 3) {
        let returnString = '' + Number;
        while (returnString.length < length) returnString = '0' + returnString;
        return returnString;
    }
    static retArgsMapped(retArgs:ArgsObj, defaults: object, argsMap: object) : object {
        let returnObject: object = {};
        let propertyName:string;
        let indexNo: number;
        for (let i in defaults) returnObject[i] = defaults[i];

        for (let typeName in retArgs) {
            if (typeName in argsMap){
                indexNo = 0;
                while (indexNo < retArgs[typeName].length && 
                       indexNo < argsMap[typeName].length
                    ) {
                        returnObject[ argsMap[typeName][indexNo] ] = retArgs[typeName][indexNo];
                        indexNo++;
                    }
            }
        }
        return returnObject;
    }
    static ifObjectMergeWithDefaults(retArgs:ArgsObj, defaults: object) : object{
        return ("object" in retArgs) ? pf.mergeObjects(defaults, retArgs["object"][0]) : defaults;
    }
    static mergeObjects = function (startObj: object, AddObj: object){
        let returnObject: object = {};
        for (let i in startObj) returnObject[i] = startObj[i];
        for (let j in AddObj) returnObject[j] = AddObj[j];
        return returnObject;
    };
    static sortArgs(Args:any[],                                                 // 1st argument is a list of args.
                    label = "unlabeled",                                        // 2nd argument is a debug label
                    customTypes:Function[] = []) { // 3rd argument is a list of functions for custion types.
        customTypes= customTypes.concat(pf.defaultIsChecks) // assumed these are included.

        let returnArray : ArgsObj = {};
        let valueType:string;
        let returnValue:string;

        for (let value of Args) {
            valueType = typeof(value);                                   // evaluate type

            for (let checkFunction of customTypes) {                // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue) {valueType = returnValue;}
            }

            if (!(valueType in returnArray)) {                           // If type doesn't exist, add empty array
                returnArray[valueType] = [];
            }
            returnArray[valueType].push(value);                          // Assign Type Value
        };
        return returnArray;
    }
    static setAttrib(el:Element, attrib:string, value:string) {
        let prevAttrib = el.getAttribute(attrib);
        if (prevAttrib != value) {
            let att = document.createAttribute(attrib);
            att.value = value;
            el.setAttributeNode(att);
        }
    }
    static getAttribs(el:HTMLElement, retObj:object = {}) {
        for (let i = 0; i < el.attributes.length; i++) {
            retObj[el.attributes[i].name] = el.attributes[i].value;
        }
        return retObj;
    }
    static elExists(id_label:string){return document.getElementById(id_label)}
    static viewport()
    {
        var width  = window.innerWidth || document.documentElement.clientWidth || 
        document.body.clientWidth;
        var height = window.innerHeight|| document.documentElement.clientHeight|| 
        document.body.clientHeight;
        return [width, height];
    }
    static errorReporting(errString:string) {
        console.log("Error Reporting");
        console.log(errString);
    }
    static uis0(num:number){return (num == undefined) ? 0 : num}
    static concatArray(main:DisplayCell[], added:DisplayCell[]){for (let displaycell of added) main.push(displaycell)}
    static parseURLParams(url = window.location.href) {
        let queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
}