// import {ArgsObj} from './Interfaces';
// import {Base, BaseF} from './Base';
// import {HtmlBlock} from './htmlBlock';
// import {Drag} from './Drag';
// import {Hold} from './Hold';

class Events extends Base {
    static elementId="llmEvents";
    static instances:Events[] = [];
    static activeInstances:Events[] = [];
    static history:string[] = [];
    static defaults = {
    }
    static argMap = {
        string : ["label"]
    }
    label:string;
    actions: object;

    constructor(...Arguments: any) {
        super();
        let retArgs : ArgsObj = BaseF.argumentsByType(Arguments);
        if ("object" in retArgs) {
            this.actions = retArgs["object"][0];
            delete retArgs["object"];
        }
        this.buildBase(...Arguments);
        Events.makeLabel(this);
    }
    applyToHtmlBlock(htmlblock:HtmlBlock){
        let el:HTMLElement = htmlblock.el;
        this.label = htmlblock.label;
        for (let key in this.actions) {
            if (key=="onhold") {
                new Hold(el, this.actions[key])
            } else if (key=="ondrag") {
                new Drag(el, this.actions[key])
            } else {
                let value_Function = this.actions[key];
                Events.history.push(`document.getElementById("${htmlblock.label}").${key} = ${value_Function}`);
                el[key] = value_Function;
            }
        }
    }
    static do(event:MouseEvent){
        console.log(event);
        console.log(this);
    }
}
function events(...Arguments:any) {return new Events(...Arguments);}
// export {events, Events}
