class FunctionStack {
    static instanceObj = {};
    static push(label: string, function_: Function){
        if (!(label in FunctionStack.instanceObj))
            FunctionStack.instanceObj[label] = [];
        FunctionStack.instanceObj[label].push( function_ );
    }
    static function(label:string) {
        return function(...Arguments:any) {
            let list = FunctionStack.instanceObj[label];
            if (list)
                for (let index = 0; index < list.length; index++)
                    list[index](...Arguments);
        }
    }
    static pop(label:string) {FunctionStack.instanceObj[label] = [];}
}