// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Handler} from './Handler';
// import {Coord} from './Coord';
// import {FunctionStack} from './FunctionStack';
// import {DisplayGroup} from './DisplayGroup';
// import {mf, pf} from './PureFunctions';

class Observe extends Base {
    static instances:Observe[] = [];
    static activeInstances:Observe[] = [];
    static defaults = {
    }
    static argMap = {
        string : ["label"],
        HTMLDivElement : ["el"],
        DisplayCell: ["parentDisplayCell"],
    }
    static Os_ScrollbarSize = 15;
    label:string;
    el: HTMLDivElement;
    parentDisplayCell: DisplayCell;
    // derendering: boolean = false;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        let observerInstance = this;
        let handler = Handler.byLabel(observerInstance.label);
        if (!handler.coord) handler.coord = new Coord();
        // put handler in stack if not there already (push Handler)
        if (Handler.activeInstances.indexOf(handler) == -1){
            Handler.activeInstances.push(handler);
        }
        this.parentDisplayCell.htmlBlock.el.onscroll = function(event:WheelEvent){Observe.onScroll(event);};
        handler.controlledBySomething = true;

        if (!this.parentDisplayCell.postRenderCallback)
            this.parentDisplayCell.postRenderCallback = FunctionStack.function(this.parentDisplayCell.label);

        Observe.makeLabel(this);
        FunctionStack.push(this.parentDisplayCell.label, function(displaycell: DisplayCell,
            parentDisplaygroup: DisplayGroup = undefined, index:number = undefined, derender:boolean = false){

                let el = displaycell.htmlBlock.el
                let dCoord = displaycell.coord;
                let handler = Handler.byLabel(observerInstance.label);
                let hCoord = handler.coord;
                let bound = observerInstance.el.getBoundingClientRect();
                hCoord.x=bound.x;
                hCoord.y=bound.y;
                hCoord.width=bound.width;
                hCoord.height=bound.height;

                hCoord.within.x=dCoord.x;
                hCoord.within.y=dCoord.y;

                hCoord.within.width=dCoord.width - ((el.scrollHeight > el.clientHeight) ? Observe.Os_ScrollbarSize : 0 );
                hCoord.within.height=dCoord.height- ((el.scrollWidth > el.clientWidth) ? Observe.Os_ScrollbarSize : 0 );

            });
        Render.update()
    }
    static derender(displaycell:DisplayCell){
        let handler:Handler;
        // 
        for (let index = 0; index < Observe.instances.length; index++) {
            let observeInstance = Observe.instances[index];
            if (observeInstance.parentDisplayCell == displaycell){
                handler = Handler.byLabel(observeInstance.label);
                let Hindex = Handler.activeInstances.indexOf(handler)
                if (Hindex > -1) {
                    Handler.activeInstances.splice(Hindex,1);
                }
                let Oindex = Observe.instances.indexOf(observeInstance);
                Observe.instances.splice(Oindex, 1);
                Render.update(handler.rootCell, true)
                //Handler.renderDisplayCell(handler.rootCell, undefined, undefined, true)
                index -= 1;
            }
        }
        FunctionStack.pop(displaycell.label);
    }
    static onScroll(event:WheelEvent) {
        for (let index = 0; index < Observe.instances.length; index++) {
            const observeInstance = Observe.instances[index];
            observeInstance.parentDisplayCell.postRenderCallback(observeInstance.parentDisplayCell);
            Render.update();
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
        // for (let index = 0; index < Observe.instances.length; index++) {  // now pop any Observers no longer needed
        //     const observeInstance = Observe.instances[index];
        //     if (activeLabels.indexOf(observeInstance.label) == -1) {
        //         observeInstance.pop();
        //     }
        // }
    }
}
// export {Observe}
