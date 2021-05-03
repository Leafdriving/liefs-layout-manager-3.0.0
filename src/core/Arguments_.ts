/**
 * Arguments_ :
 * This object is responsible for sorting Arguments for a new class or function.
 * 
 */
class Arguments_ {
    /**
     * Arguments by type
     * @param Args Array of Arguments ie new Class(...Args)
     * @param [customTypes] Array of Functions returning Type Name (if qualifies), or undefined.
     * @returns An Object Key "TypeName", value Array of Arguments, of that Type, in the order discovered
     */
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
    /**
     * This function merges the defaults Object, with Argument Object(s)
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns Defaults Objects merged with Argument Objects
     */
         static ifObjectMergeWithDefaults(THIS:any, CLASS:any) : object{
            if ("object" in THIS.retArgs) {
                let returnObj = CLASS.defaults; // mergeObjects doens't overwrite this!
                for (let key in THIS.retArgs["object"]) 
                    returnObj = Arguments_.mergeObjects(returnObj, THIS.retArgs["object"][key])
                return returnObj;
            }
            return CLASS.defaults;
        }
    /**
     * retArgsMapped
     * @param updatedDefaults (Return of Arguments_.ifObjectMergeWithDefaults())
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns args mapped 
     */
    static retArgsMapped(updatedDefaults: object, THIS:any, CLASS:any) : object {
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

    /**
     * Similar to javascript typeof, but returns custom types like "dim" (ending in "px" or "%")
     * @param Argument 
     * @returns Type Name (If Object, Class Name)
     */
    static typeof(Argument:any) {return (Object.keys(Arguments_.argumentsByType([Argument])))[0];}

    /**
     * Modifys class properties
     * @param argobj - Object to be mapped from
     * @param targetobject - Object (Class Instance) to be mapped to
     */
    static modifyClassProperties(argobj:object, targetobject:object){
        for (let key of Object.keys(argobj))
            targetobject[key] = argobj[key];
    }
    /**
     * Standard Merge objects function
     */
    static mergeObjects = function (startObj: object, AddObj: object){
        let returnObject: object = {};
        for (let i in startObj) returnObject[i] = startObj[i];
        for (let j in AddObj) returnObject[j] = AddObj[j];
        return returnObject;
    };
}