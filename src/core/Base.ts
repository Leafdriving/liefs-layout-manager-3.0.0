/**
 * Base
 */
class Base /* extends Function */ {
    /**
     * Default is checks of base
     */
    static defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim]
    /**
     * To code of base
     */
    static toCode:(ClassObjectInstance:object)=>string;

    /**
     * Ret args of base
     */
    retArgs:objectAny;
    /**
     * Label of base
     */
    label:string;

    /**
     * Creates an instance of base.
     * @param neverRead 
     */
    constructor(...neverRead:any){}
    buildBase(...Arguments:any){this.constructor["buildBase"](this, ...Arguments);}
    /**
     * Builds base
     * @param THIS 
     * @param Arguments 
     */
    static buildBase(THIS:any, ...Arguments:any){
        let CLASS = this;
        THIS.retArgs = Arguments_.argumentsByType(Arguments);
        let updatedDefaults : Object = Arguments_.ifObjectMergeWithDefaults(THIS, CLASS);
        let retArgsMapped : Object = Arguments_.retArgsMapped(updatedDefaults, THIS, CLASS);
        Arguments_.modifyClassProperties(retArgsMapped, THIS);
    }
    /**
     * Makes label
     * @param instance 
     */
    static makeLabel(instance:object){
        let CLASS = this;
        if (instance["label"] == undefined || instance["label"].trim() == ""){
            instance["label"] = `${CLASS["name"]}_${++CLASS["labelNo"]}`
        }
    }
}
class Component extends Base {
    /**
     * Node  of component
     */
    node:node_;
    /**
     * Parent display cell of component
     */
    parentDisplayCell:DisplayCell;
    /**
     * Children  of component
     */
    children: Component[];
    /**
     * Determines whether connect on
     */
    onConnect():void{};
    /**
     * Pre render
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{return undefined};
    /**
     * Renders component
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{return undefined};
    /**
     * Gets child
     * @param label 
     * @returns  
     */
    getChild(label:string) {
        for (let index = 0; index < this.children.length; index++) 
            if (this.children[index].label == label) return this.children[index];
        return undefined;
    }
    /**
     * Deletes component
     */
    delete(){}
}


// class Test extends Base {
//     static labelNo = 0;
//     static instances:{[key: string]: Test;} = {};
//     static activeInstances:{[key: string]: Test;} = {};
//     static defaults:{[key: string]: any;} = {}
//     static argMap:{[key: string]: Array<string>;} = {
//         string : ["label", "innerHTML", "css"],
//         number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
//     }
//     // retArgs:objectAny;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         Test.makeLabel(this); Test.instances[this.label] = this;
//     }
// }
