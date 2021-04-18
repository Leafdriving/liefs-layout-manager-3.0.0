class Base /* extends Function */ {
    static defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim]
    static toCode:(ClassObjectInstance:object)=>string;

    retArgs:objectAny;
    label:string;

    constructor(...neverRead:any){}
    buildBase(...Arguments:any){this.constructor["buildBase"](this, ...Arguments);}
    static buildBase(THIS:any, ...Arguments:any){
        let CLASS = this;
        THIS.retArgs = Arguments_.argumentsByType(Arguments);
        let updatedDefaults : Object = Arguments_.ifObjectMergeWithDefaults(THIS, CLASS);
        let retArgsMapped : Object = Arguments_.retArgsMapped(updatedDefaults, THIS, CLASS);
        Arguments_.modifyClassProperties(retArgsMapped, THIS);
    }
    static makeLabel(instance:object){
        let CLASS = this;
        if (instance["label"] == undefined || instance["label"].trim() == ""){
            instance["label"] = `${CLASS["name"]}_${++CLASS["labelNo"]}`
        }
    }
}
class Component extends Base {
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[];
    onConnect():void{};
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{return undefined};
    Render(derender:boolean, node:node_, zindex:number):Component[]{return undefined};
    getChild(label:string) {
        for (let index = 0; index < this.children.length; index++) 
            if (this.children[index].label == label) return this.children[index];
        return undefined;
    }
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
