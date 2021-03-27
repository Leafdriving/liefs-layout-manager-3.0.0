// import {ArgsObj} from './Interfaces';
class BaseF {
    static ifObjectMergeWithDefaults(THIS:any, CLASS:any) : object{
        if ("object" in THIS.retArgs) {
            let returnObj = CLASS.defaults; // mergeObjects doens't overwrite this!
            for (let key in THIS.retArgs["object"]) 
                returnObj = BaseF.mergeObjects(returnObj, THIS.retArgs["object"][key])
            return returnObj;
        }
        return CLASS.defaults;
    }
    static retArgsMapped(updatedDefaults: object,  THIS:any, CLASS:any) : object {
        let returnObject: object = {};
        let indexNo: number;
        for (let i in updatedDefaults) returnObject[i] = updatedDefaults[i];

        for (let typeName in THIS.retArgs) {
            if (typeName in CLASS.argMap){
                indexNo = 0;
                while (indexNo < THIS.retArgs[typeName].length && 
                       indexNo < CLASS.argMap[typeName].length
                    ) {
                        returnObject[ CLASS.argMap[typeName][indexNo] ] = THIS.retArgs[typeName][indexNo];
                        indexNo++;
                    }
            }
        }
        return returnObject;
    }
    static typeof(Argument:any) {return (Object.keys(BaseF.argumentsByType([Argument])))[0];}
    static argumentsByType(Args:any[],                                                 // 1st argument is a list of args.
        customTypes:Function[] = []) { // 2rd argument is a list of functions for custion types.
        customTypes= customTypes.concat(Base.defaultIsChecks) // assumed these are included.
        let returnArray : ArgsObj = {};
        let valueType:string;
        let returnValue:string;
        for (let value of Args) {
            valueType = typeof(value);                                   // evaluate type
            for (let checkFunction of customTypes) {                // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue) valueType = returnValue;
            }
            if (!(valueType in returnArray)) returnArray[valueType] = []; // If type doesn't exist, add empty array
            returnArray[valueType].push(value);                          // Assign Type Value
        }
        return returnArray;
    }
    static modifyClassProperties(argobj:object, targetobject:object){
        for (let key of Object.keys(argobj))
            targetobject[key] = argobj[key];
    }
    static mergeObjects = function (startObj: object, AddObj: object){
        let returnObject: object = {};
        for (let i in startObj) returnObject[i] = startObj[i];
        for (let j in AddObj) returnObject[j] = AddObj[j];
        return returnObject;
    };
}
class Base {
    static Render(instance:object, zindex:number, derender:boolean, node:node_): zindexAndRenderChildren {
        console.log('render not implemented -> So make CLASS.Render()', this);
        return {zindex:0, children:[]};
    }

    static defaultIsChecks:any // = [pf.isArray, pf.isObjectAClass, pf.isDim];
    // static instances:any[] = [];
    // static activeInstances:any[] = [];

    static byLabel(label:string) {
    let CLASS = this;
        for (let key in CLASS["instances"])
            if (CLASS["instances"][key].label == label)
                return CLASS["instances"][key];
        return undefined;
    }
    static pop(instance:any = undefined){
        let CLASS = this;instance = CLASS.stringOrObject(instance);
        if (instance == undefined)
            instance = CLASS["instances"][ CLASS["instances"].length-1 ]
        CLASS.deactivate(instance);
        let index = CLASS["instances"].indexOf(instance);
        if (index != -1) CLASS["instances"].splice(index,1);            
    }
    static push(instance:any, toActive = false){
        let CLASS = this;instance = CLASS.stringOrObject(instance);
        CLASS.pop(instance);          // if pushing same, remove previous
        CLASS["instances"].push(instance);
        if (toActive) CLASS.activate(instance);
    }
    static deactivate(instance:any){
        let CLASS = this;instance = CLASS.stringOrObject(instance);
        let index = CLASS["activeInstances"].indexOf(instance);
        if ( index != -1) CLASS["activeInstances"].splice(index,1);
    }
    static activate(instance:any){
        let CLASS = this;instance = CLASS.stringOrObject(instance);
        CLASS.deactivate(instance);
        CLASS["activeInstances"].push(instance);
    }
    static isActive(instance:any) {
        let CLASS = this;instance = CLASS.stringOrObject(instance);
        return (CLASS["activeInstances"].indexOf(instance) > -1)
    }
    static stringOrObject(instance:any) {
        if (typeof(instance) == "string") instance = this.byLabel(instance)
        return instance;
    }
    static defaults: object;
    static argMap: object;
    retArgs:ArgsObj;
    toString:Function;
    label:string;
    renderNode:node_;

    constructor(){
    }
    buildBase(...Arguments:any){this.constructor["buildBase"](this, ...Arguments);}
    static buildBase(THIS:any, ...Arguments:any){
        let CLASS = this;
        if (CLASS["labelNo"] == undefined) CLASS["labelNo"] = 0;
        if (CLASS["defaults"] == undefined) CLASS["defaults"] = {};
        if (CLASS["argMap"] == undefined) CLASS["argMap"] = {};
        if (CLASS["instances"] == undefined) CLASS["instances"] = [];
        if (CLASS["activeInstances"] == undefined) CLASS["activeInstances"] = [];
        CLASS.push(THIS);
        THIS.retArgs = BaseF.argumentsByType(Arguments);
        let updatedDefaults : Object = BaseF.ifObjectMergeWithDefaults(THIS, CLASS);
        let retArgsMapped : Object = BaseF.retArgsMapped(updatedDefaults, THIS, CLASS);
        BaseF.modifyClassProperties(retArgsMapped, THIS);
    }
    static makeLabel(instance:any){
        let CLASS = this;
        if (instance["label"] == undefined || instance["label"].trim() == ""){
            CLASS["labelNo"] += 1;
            instance["label"] = `${CLASS["name"]}_${CLASS["labelNo"]}`
        }
    }
}
// export {BaseF, Base};

// class Test extends Base {
//     static labelNo = 0;
//     static instances:Test[] = [];
//     static activeInstances:Test[] = [];
//     static defaults = {
//         tag: "DIV",
//     }
//     static argMap = {
//         string : ["label", "innerHTML", "css"],
//         number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
//     }
//     // retArgs:ArgsObj;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);

//         Test.makeLabel(this);
//     }
// }
