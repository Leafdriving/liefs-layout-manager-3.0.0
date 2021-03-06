class Observe {
    static instances:Observe[] = [];
    static byLabel(label:string):Observe{
        for (let key in Observe.instances)
            if (Observe.instances[key].label == label)
                return Observe.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Observe_${pf.pad_with_zeroes(Observe.instances.length)}`},
    }
    static argMap = {
        string : ["label"],
        HTMLDivElement : ["el"],
        DisplayCell: ["parentDisplayCell"],
    }
    label:string;
    el: HTMLDivElement;
    parentDisplayCell: DisplayCell;

    constructor(...Arguments: any) {
        Observe.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Observe");
        mf.applyArguments("Observe", Arguments, Observe.defaults, Observe.argMap, this);
        console.log(`${this.label} Observe Created`);
        //console.log(this.parentDisplayCell.htmlBlock.el);
        let THIS = this;
        // this.parentDisplayCell.htmlBlock.el.onscroll = function(event) {
        //     let recObj = THIS.el.getBoundingClientRect(); 
        //     console.log(recObj.x, recObj.y, recObj.width, recObj.height);
        // }
    }
    pop(){
        console.log(`Popping Observer ${this.label}`);
        let index = Observe.instances.indexOf(this);
        Observe.instances.splice(index, 1);
    }
    static onWheel(event:WheelEvent) {
        console.log("Observe Wheel Event Fired!");
    }
    static update(){
        let els:NodeListOf<Element> =  document.querySelectorAll("[parentof]");
        let activeLabels:string[] = [];
        for (let index = 0; index < els.length; index++) { // loop elements in dom with parentof attribute...
            let el = <HTMLElement>els[index];
            let attribObj = pf.getAttribs(el);
            let handlerLabel = attribObj["parentof"];
            let handlerInstance = Handler.byLabel(handlerLabel);
            if (handlerInstance) {                                  // if matching handler exists,
                activeLabels.push(handlerLabel);
                if (!Observe.byLabel(handlerLabel)) {               // if not matching Observe instance exists
                    let parentEl = el.parentElement;
                    let parentDisplayCell: DisplayCell;
                    while (parentEl && !parentDisplayCell) {        // loop until parent matching displaycell found
                        parentDisplayCell = DisplayCell.byLabel(parentEl.id);
                        parentEl = parentEl.parentElement;
                    }
                    new Observe(handlerLabel, el, parentDisplayCell);// Create Observe Object!
                }
            } // else console.log(`Handler "${handlerLabel}" not found`);
        }
        for (let index = 0; index < Observe.instances.length; index++) {  // now pop any Observers no longer needed
            const observeInstance = Observe.instances[index];
            if (activeLabels.indexOf(observeInstance.label) == -1) {
                observeInstance.pop();
            }
        }
    }
}
