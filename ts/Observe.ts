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
        // console.log(`${this.label} Observe Created`);
        let observerInstance = this;
        let handler = Handler.byLabel(observerInstance.label);
        if (!handler.coord) handler.coord = new Coord();
        // put handler in stack if not there already (push Handler)
        if (Handler.activeHandlers.indexOf(handler) == -1){
            Handler.activeHandlers.push(handler);
        }
        this.parentDisplayCell.htmlBlock.el.onscroll = function(event:WheelEvent){Observe.onScroll(event);};
        handler.controlledBySomething = true;

        this.parentDisplayCell.postRenderCallback = function(displaycell: DisplayCell,
            parentDisplaygroup: DisplayGroup = undefined, index:number = undefined, derender:boolean = false){
                // console.log(displaycell.coord);
                let dCoord = displaycell.coord;
                let handler = Handler.byLabel(observerInstance.label);
                let hCoord = handler.coord;
                let bound = observerInstance.el.getBoundingClientRect();
                // console.log(JSON.stringify(Handler.byLabel(observerInstance.label).coord));
                hCoord.x=bound.x;
                hCoord.y=bound.y;
                hCoord.width=bound.width;
                hCoord.height=bound.height;

                hCoord.within.x=dCoord.x;
                hCoord.within.y=dCoord.y;
                hCoord.within.width=dCoord.width;
                hCoord.within.height=dCoord.height;
            }
    }
    static onScroll(event:WheelEvent) {
        // console.log("Observe Wheel Event Fired!");
        for (let index = 0; index < Observe.instances.length; index++) {
            const observeInstance = Observe.instances[index];
            observeInstance.parentDisplayCell.postRenderCallback(observeInstance.parentDisplayCell);
            Handler.update();
            // setTimeout(function(){ Handler.update(); }, 50);
            // setTimeout(function(){ Handler.update(); }, 100);
            // setTimeout(function(){ Handler.update(); }, 200);
            
        }
    }
    pop(){
        console.log(`Popping Observer ${this.label}`);
        // pop observer
        let Oindex = Observe.instances.indexOf(this);
        Observe.instances.splice(Oindex, 1);
        // pop handler
        let handler = Handler.byLabel(this.label);
        let Hindex = Handler.activeHandlers.indexOf(handler)
        if (Hindex > -1) {
            Handler.update([handler], 0, true);
            Handler.activeHandlers.splice(Hindex,1);
        }
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
