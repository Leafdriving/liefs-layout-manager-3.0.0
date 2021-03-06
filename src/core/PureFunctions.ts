class pf {
    static isTypePx = function(it:any):boolean{if (typeof(it) == "string" && it.substr(-2) == "px") return true;return false;}
    static pxAsNumber = function(dim:string):number{ return +(dim.slice(0, -2));}
    static isTypePercent = function(it:any):boolean{if (typeof(it) == "string" && it.substr(-1) == "%") return true;return false;}
    static percentAsNumber = function(dim:string):number{ return +(dim.slice(0, -1));}
    static isDim = function(it:any):string{if ((typeof(it) == "string") && (it.substr(-2) == "px" || it.substr(-1) == "%")) return "dim"}
    static isArray = function(it:any):string{if (typeof(it) == "object" && Array.isArray(it)) return "Array"}
    static isObjectAClass = function(it:any):string{if (typeof(it) == "object" && it.constructor.name != "Object") return it.constructor.name}
    static defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim];

    static classProperties = function(a:string[]){return Object.getOwnPropertyNames(a)}

    static commonKeys(obj1:object, obj2:object) : string[] {
        let returnStringArray = [];
        for (let index in obj1) 
            if (index in obj2) returnStringArray.push(index);
        return returnStringArray;
    }
    static pad_with_zeroes = function(Number: number, length: number = 3):string {
        let returnString = '' + Number;
        while (returnString.length < length) returnString = '0' + returnString;
        return returnString;
    }
    static mergeObjects = function (startObj: object, AddObj: object){
        let returnObject: object = {};
        for (let i in startObj) returnObject[i] = startObj[i];
        for (let j in AddObj) returnObject[j] = AddObj[j];
        return returnObject;
    };
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
    static insideOfFunctionString(functionString:string) {
        return functionString.substring(functionString.indexOf("{")+1, functionString.lastIndexOf("}"))
    }
    static array_move(arr:any[], old_index:number, new_index:number) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    };
    static undefinedIs(thing:any,value:any=0){return (thing == undefined) ? value : thing}
    static preUnderscore(someString:string) {return someString.substring(0, someString.indexOf("_"));}
    static uis0(num:number){return (num == undefined) ? 0 : num}
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
    static decimalPlaces(number:number,places:number) {return Math.round(Math.pow(10,places)*number)/Math.pow(10,places);}
}