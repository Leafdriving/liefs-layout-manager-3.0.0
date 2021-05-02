/**
 * Function stack base
 */
class FunctionStack_BASE extends Function {
    constructor() {
      super('...args', 'return this.__self__.__call__(...args)')
      let self = this.bind(this);
      this["__self__"] = self;
      return self;
    }
}
/**
 * Function stack
 */
class FunctionStack extends FunctionStack_BASE {
    functionArray:Function[] = [];
    constructor() {super()}
    /**
     * Determines whether call  
     * @param Arguments 
     */
    __call__(...Arguments:any[]) {
        let elTarget = Arguments[0]["target"];
        if (this.functionArray && this.functionArray.length)
            for (let index = 0; index < this.functionArray.length; index++)
                this.functionArray[index].bind(elTarget)(...Arguments);
    }
    /**
     * Pushs function stack
     * @param prevFunction 
     * @param [newFunction] 
     * @returns  
     */
    static push(prevFunction:Function|FunctionStack, newFunction:Function|FunctionStack = undefined) {
        let functionStackInstance:FunctionStack;
        if (prevFunction && prevFunction.constructor && prevFunction.constructor.name == "FunctionStack") 
            functionStackInstance = <FunctionStack>prevFunction;
        else {
            functionStackInstance = new FunctionStack();
            if (prevFunction && typeof(prevFunction) == "function")
                functionStackInstance.functionArray.push(<Function>prevFunction);
        }
        if (newFunction) {
            if (newFunction.constructor && newFunction.constructor.name == "FunctionStack")
                functionStackInstance.functionArray = functionStackInstance.functionArray.concat( (<FunctionStack>newFunction).functionArray )
            else
                functionStackInstance.functionArray.push( <Function>newFunction );
        }
        return functionStackInstance;
    }
    /**
     * Pops function stack
     * @param functionStackInstance 
     * @param label 
     * @returns  
     */
    static pop(functionStackInstance:FunctionStack, label:string){
        for (let index = 0; index < functionStackInstance.functionArray.length; index++) 
            if (label == functionStackInstance.functionArray[index].name) 
                functionStackInstance.functionArray.splice(index--, 1);
        return functionStackInstance;
    }
    /**
     * Determines whether in is
     * @param functionStackInstance 
     * @param label 
     * @returns  
     */
    static isIn(functionStackInstance:FunctionStack, label:string){
        for (let index = 0; index < functionStackInstance.functionArray.length; index++) 
            if (label == functionStackInstance.functionArray[index].name) return true;
        return false;
    }
  }
  /**
   * Debounce 
   */
  class debounce_ extends FunctionStack_BASE {
    FUNCTION:Function;
    delay:number;
    lasttime:number;
    /**
     * Creates an instance of debounce .
     * @param FUNCTION 
     * @param delay 
     */
    constructor(FUNCTION:Function, delay:number) {super();
        this.FUNCTION = FUNCTION;
        this.delay = delay;
        this.lasttime = new Date().getTime();
    }
    /**
     * Determines whether call  
     * @param Arguments 
     */
    __call__(...Arguments:any[]) {
        let thistime = new Date().getTime();
        if (thistime - this.lasttime > this.delay) {
          this.FUNCTION(...Arguments);
          this.lasttime = thistime;
        }
  }
}
function debounce(FUNCTION:Function, delay:number){return new debounce_(FUNCTION, delay)}