class Arguments_ {
    static ifObjectMergeWithDefaults(THIS:any, CLASS:any) : object{
        if ("object" in THIS.retArgs) {
            let returnObj = CLASS.defaults; // mergeObjects doens't overwrite this!
            for (let key in THIS.retArgs["object"]) 
                returnObj = Arguments_.mergeObjects(returnObj, THIS.retArgs["object"][key])
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
    static typeof(Argument:any) {return (Object.keys(Arguments_.argumentsByType([Argument])))[0];}
    static argumentsByType(Args:any[],                                                 // 1st argument is a list of args.
        customTypes:Function[] = []) { // 2rd argument is a list of functions for custion types.
        customTypes= customTypes.concat(Base.defaultIsChecks) // assumed these are included.
        let returnObject : objectAny = {};
        let  valueType:string;
        let returnValue:string;
        for (let value of Args) {
            valueType = typeof(value);                                   // evaluate type
            for (let checkFunction of customTypes) {                // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue) valueType = returnValue;
            }
            if (!(valueType in returnObject)) returnObject[valueType] = []; // If type doesn't exist, add empty array
            returnObject[valueType].push(value);                          // Assign Type Value
        }
        return returnObject;
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