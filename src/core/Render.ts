class Render {
    static node:node_;
    static zindexIncrement:number = 5;
    static zindexHandlerIncrement:number = 100;
    static pleaseUpdate:boolean = false;
    static firstRun=true;
    static scheduleUpdate(){
        if (Render.firstRun){
            Render.firstRun = false;
            window.onresize = <any>FunctionStack.push(undefined, function fullupdate(e:Event){Render.fullupdate()})
        }
        if (!Render.pleaseUpdate) {
            Render.pleaseUpdate = true;
            setTimeout(() => {
                Render.pleaseUpdate = false;
                Render.fullupdate();
            }, 0);
        }
    }
    static fullupdate(derender = false){
        // console.log("FullUpdate");
        Css.update();
        Handler.updateScreenSizeCoord();
        Render.node = new node_("Root");
        let handlers = Handler.getHandlers(); 
        for (let index = 0; index < handlers.length; index++) {
            Render.update([handlers[index]],
                            derender,
                            Render.node,
                            index*Render.zindexHandlerIncrement);
        }
    }
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
    static classes = { /* DragBar,for wxample... filled in when modules load. */};
    static register(label:string, object_:object){Render.classes[label] = object_;}
}