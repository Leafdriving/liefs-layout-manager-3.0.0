class FunctionStack_BASE extends Function {
    constructor() {
      super('...args', 'return this.__self__.__call__(...args)')
      let self = this.bind(this);
      this["__self__"] = self;
      return self;
    }
}
class FunctionStack extends FunctionStack_BASE {
    functionArray:Function[] = [];
    constructor() {super()}
    __call__(...Arguments:any[]) {
        let elTarget = Arguments[0]["target"];
        if (this.functionArray && this.functionArray.length)
            for (let index = 0; index < this.functionArray.length; index++)
                this.functionArray[index].bind(elTarget)(...Arguments);
    }
    static push(prevFunction:Function|FunctionStack, newFunction:Function = undefined) {
        let functionStackInstance:FunctionStack;
        if (prevFunction && prevFunction.constructor && prevFunction.constructor.name == "FunctionStack") 
            functionStackInstance = <FunctionStack>prevFunction;
        else {
            functionStackInstance = new FunctionStack();
            if (prevFunction && typeof(prevFunction) == "function")
                functionStackInstance.functionArray.push(<Function>prevFunction);
        }
        if (newFunction) functionStackInstance.functionArray.push(newFunction);
        return functionStackInstance;
    }
    static pop(functionStackInstance:FunctionStack, label:string){
        for (let index = 0; index < functionStackInstance.functionArray.length; index++) 
            if (label == functionStackInstance.functionArray[index].name) 
                functionStackInstance.functionArray.splice(index--, 1);
        return functionStackInstance;
    }
  }
  class debounce_ extends FunctionStack_BASE {
    FUNCTION:Function;
    delay:number;
    lasttime:number;
    constructor(FUNCTION:Function, delay:number) {super();
        this.FUNCTION = FUNCTION;
        this.delay = delay;
        this.lasttime = new Date().getTime();
    }
    __call__(...Arguments:any[]) {
        let thistime = new Date().getTime();
        if (thistime - this.lasttime > this.delay) {
          this.FUNCTION(...Arguments);
          this.lasttime = thistime;
        }
  }
}
function debounce(FUNCTION:Function, delay:number){return new debounce_(FUNCTION, delay)}