/**
 * Render Object - Renders Components
 */
class Render {
    static node:node_;
    static zindexIncrement:number = 5;
    static zindexHandlerIncrement:number = 100;
    static pleaseUpdate:boolean = false;
    static firstRun=true;
    /**
     * Schedules update - Prefered Method for updating
     */
    static scheduleUpdate(){
        if (Render.firstRun){
            Render.firstRun = false;
            window.onresize = <any>FunctionStack.push(undefined, function fullupdate(e:Event){Render.fullupdate()})
            window.addEventListener('scroll', function () {Render.fullupdate();}, true);
            window.onwheel = <any>FunctionStack.push(undefined, function fullupdate(e:Event){Render.fullupdate()});
            let deletes  = document.getElementsByClassName("remove");
            for (let index = 0; index < deletes.length; index++) deletes[index].remove();
        }
        if (!Render.pleaseUpdate) {
            Render.pleaseUpdate = true;
            setTimeout(() => {
                Render.pleaseUpdate = false;
                Render.fullupdate();
            }, 0);
        }
    }
    /**
     * Fullupdates render
     * @param [derender] 
     */
    static fullupdate(derender = false){
        Css.update();
        Render.node = new node_("Root");
        Handler.updateScreenSizeCoord();

        Handler.linkHandlers();
        let handlers = Handler.getHandlers();
        let currentNumberOfHandlers = handlers.length;
        for (let index = 0; index < handlers.length; index++) {
            Render.update([handlers[index]],
                            derender,
                            Render.node,
                            index*Render.zindexHandlerIncrement);
        }
    }
    /**
     * Updates render - usually called for de-render
     * update(SomeObject, true);
     * @param [components_] 
     * @param [derender] 
     * @param [parentNode] 
     * @param [zindex] 
     */
    static update(components_:Component[]|Component = undefined,
                    derender = false,
                    parentNode:node_ = undefined,
                    zindex=0) {
        if (components_) {
            let components:Component[];
            if (Arguments_.typeof(components_) != "Array") components = [<Component>components_];
            else components = <Component[]>components_;

            let node:node_;
            for (let index = 0; index < components.length; index++) {
                const component = components[index];
                let type = Arguments_.typeof(component);
                if (derender) node = component.node;
                else {
                    node = parentNode.newChild(component.label, component);
                    component.node = node;
                }
                if (type == "DisplayCell") {
                    let newObjects = component.preRender(derender, node, zindex);
                    if (newObjects && newObjects.length) Render.update(newObjects, derender, node, zindex + Render.zindexIncrement);
                }
                let newObjects = component.Render(derender, node, zindex);
                if (newObjects && newObjects.length) Render.update(newObjects, derender, node, zindex + Render.zindexIncrement);
            }
        }
    }
    /**
     * Classes of render - Used for determinine what modules are loaded
     */
    static classes = { /* DragBar,for wxample... filled in when modules load. */};
    /**
     * Registers render
     * @param label 
     * @param object_ 
     */
    static register(label:string, object_:object){Render.classes[label] = object_;}
}