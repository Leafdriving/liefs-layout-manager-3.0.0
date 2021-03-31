class Render {
    static oldRootnode:node_;
    static node:node_;

    static zIncrement:number =5;
    static zHandlerIncrement:number =100;
    static update(source:any = undefined, derender = false, zindex = 1){
        // if (source) console.log(`${BaseF.typeof(source)}:${source["label"]} ${derender}`)
        let renderChildren = new RenderChildren;
        if (source) {
            if ( BaseF.typeof(source) == "node_") source = (<node_>source).Arguments[1];
            renderChildren.RenderSibling( (BaseF.typeof(source) == "Array") ? source : [source], derender);
            Render.RenderObjectList( renderChildren.siblings, Render.node, zindex );
        } else {
            Render.oldRootnode = Render.node;
            Render.node = new node_("Root");
            renderChildren.RenderSibling(Handler.RenderStartingpoint(), derender);
            Render.RenderObjectList( renderChildren.siblings, Render.node , zindex, true);
            Handler.RenderEndingPoint();
        }
    }
    static RenderObjectList(renderChildren:RenderChild[], node:node_, zindex = 1, isSibling = false){
        for (let index = 0; index < renderChildren.length; index++) {
            let object_ = renderChildren[index].child;
            let derender = renderChildren[index].derender;/////////////////////////////////// HERE!!!!!!!!!!!!!!!!!!!!
            let objectType = BaseF.typeof(object_);
            
            let CLASS = Render.classes[objectType];
            if (CLASS){
                if (isSibling && index != 0) node = node.newSibling(`${object_["label"]}${(objectType == "DisplayCell")?"_":""}`, object_);
                else node = node.newChild(`${object_["label"]}${(objectType == "DisplayCell")?"_":""}`, object_);
                object_["renderNode"] = node;
                let returnObj:zindexAndRenderChildren = CLASS.Render(object_, zindex, derender, node); // this is render call
                zindex = returnObj.zindex;
                let children:RenderChild[] = returnObj.children;
                let siblings:RenderChild[] = returnObj.siblings;
                if (children && children.length) Render.RenderObjectList(children, node, zindex);
                if (siblings && siblings.length) Render.RenderObjectList(siblings, node, zindex, true);
            } else console.log(`Class:${objectType} not regestered`);
            if (objectType == "Handler") {
                zindex = Math.trunc(zindex/Render.zHandlerIncrement)*Render.zHandlerIncrement + Render.zHandlerIncrement;
            }
        }
    }
    static classes = {
        //    DragBar,for wxample... filled in when modules load.
        };
    static className(object_:object){ // use this for "static" and BaseF.typeof for instance.
        for (const key in Render.classes) if (object_ == Render.classes[key]) return key;return undefined;
    }
    static register(label:string, object_:object){
        Render.classes[label] = object_;
    }
    static log(show=false){Render.node.log(show);}
}

class RenderChildren {
    children:RenderChild[] = [];
    siblings:RenderChild[] = [];
    RenderChild(child:object|object[], derender:boolean = false) {
        if (BaseF.typeof(child) == "Array")
            for (let index = 0; index < (child as object[]).length; index++) 
                this.children.push({child:child[index], derender})
        else this.children.push({child, derender})
    }
    RenderSibling(child:object|object[], derender:boolean = false) {
        if (BaseF.typeof(child) == "Array")
            for (let index = 0; index < (child as object[]).length; index++) 
                this.siblings.push({child:child[index], derender})
        else this.siblings.push({child, derender})
        // if (derender) console.log("RenderSibling Derender", derender)
    }
}