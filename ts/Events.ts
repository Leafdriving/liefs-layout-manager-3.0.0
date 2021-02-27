//interface Action { [key: string]: Function; }
class Events {
    static elementId="llmEvents";
    static instances:Events[] = [];
    static byLabel(label:string):Events{
        for (let key in Events.instances)
            if (Events.instances[key].label == label)
                return Events.instances[key];
        return undefined;
    }
    static history:string[] = [];
    static defaults = {
        label : function(){return `Events_${pf.pad_with_zeroes(Events.instances.length)}`},
    }
    static argMap = {
        string : ["label"]
    }
    label:string;
    actions: object;

    constructor(...Arguments: any) {
        Events.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Events");
        if ("object" in retArgs) {
            this.actions = retArgs["object"][0];
            delete retArgs["object"];
        }
        let updatedDefaults : Object = pf.ifObjectMergeWithDefaults(retArgs, Events.defaults);
        let retArgsMapped : Object = pf.retArgsMapped(retArgs, updatedDefaults, Events.argMap);
        mf.modifyClassProperties(retArgsMapped, this);
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
}
function events(...arguments:any) {return new Events(...arguments);}
