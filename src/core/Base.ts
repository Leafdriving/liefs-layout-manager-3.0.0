/**
 * Base Class for most Classes (Extends Base)
 */
class Base /* extends Function */ {
    /**
     * Default custom check Function List (Array)
     */
    static defaultIsChecks:((it: any) => string)[] = [pf.isArray, pf.isObjectAClass, pf.isDim]
    /**
     * Future Implementation of Generating Launch Code, from an edited Object Tree.
     */
    static toCode:(ClassObjectInstance:object)=>string;

    /**
     * Arguments of new - mapped to object with key:type value:array of Arguments of that type.
     */
    retArgs:objectAny;
    /**
     * Label of Object Instance
     */
    label:string;

    /**
     * Creates an instance of base.  This is called by the extended class
     * @param neverRead 
     */
    constructor(...neverRead:any){}
    buildBase(...Arguments:any){this.constructor["buildBase"](this, ...Arguments);}
    /**
     * Sorts Agruments by type, then applies them as attributes to the Class Object Instance,
     * according to default arguments map (argMap)  This is called by all Objects in the Constructor
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
     * If label is not defined, create One.
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
     * Node of component Created and Updated by the Render Class (upon Rendering)
     */
    node:node_;
    /**
     * Parent display cell of component - Set by Parent onConnect
     */
    parentDisplayCell:DisplayCell;
    /**
     * Children of component, to be rendered on an increased z-index
     */
    children: Component[];
    /**
     * When Parent DisplayCell Discovers this Component, onConnect is called by the Parent DisplayCell
     */
    onConnect():void{};
    /**
     * Pre Stage of Rendering a Page.  It is useful if a child component wished to modify a parent
     * component.  The parent is first altered here, then properly rendered at the Render Stage
     * @param derender - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered (Normally empty, since Render phase is usually a better choice)
     */
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{return undefined};
    /**
     * Rendering stage of aa Page.(After preRender phase).  In this function, usually the Co-ordinates of
     * a child/childrend are calculated, and assigned, to be returned as an array
     * @param derender  - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{return undefined};
    /**
     * Returns Child (in .children) by label
     * @param label 
     * @returns child DisplayCell/Component
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

// The following is boierplate code, and left here for reference

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
