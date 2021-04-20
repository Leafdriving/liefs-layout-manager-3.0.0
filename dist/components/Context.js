class Context extends Component {
    // retArgs:objectAny;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Context.makeLabel(this);
        Context.instances[this.label] = this;
        if (!this.contextNode)
            this.contextNode = sample();
        this.build();
    }
    build() {
        let THIS = this;
        let displaycells = [];
        for (let index = 0; index < this.contextNode.children.length; index++) {
            let childNode = this.contextNode.children[index];
            let displaycell = childNode.Arguments[1];
            let label = childNode.Arguments[0];
            if (Arguments_.typeof(displaycell) == "DisplayCell")
                childNode["displaycell"] = displaycell;
            else
                displaycell = childNode["displaycell"] = I(`${this.label}_${label}`, label, Context.Css);
            let element = displaycell.getComponent("Element_");
            let eventObject = { onclick: function (e) { Context.onclick(e, (DisplayCell.instances[`${THIS.label}_${label}`]), childNode); } };
            if (childNode.children.length) {
                (childNode["displaycell"]).addComponent(context(`${childNode.label}_context`, "onmouseover", false, childNode));
            }
            element.addEvents(eventObject);
            displaycells.push(displaycell);
        }
        this.displaycell = v(`${this.label}_ContextV`, ...displaycells);
        this.displaygroup = this.displaycell.getComponent("DisplayGroup");
    }
    static onclick(e, displaycell, node) {
        console.log("click", e, displaycell, node);
    }
    static currentAndParent() {
        let currentInstance = Context.rootInstance;
        let parentInstance;
        while (currentInstance && currentInstance.activeChild) {
            parentInstance = currentInstance;
            currentInstance = currentInstance.activeChild;
        }
        return [currentInstance, parentInstance];
    }
    static ContextOnMouseMove(event) {
        let [currentInstance, parentInstance] = Context.currentAndParent();
        let inDisplayCell = currentInstance.displaycell.coord.isPointIn(event.clientX, event.clientY);
        if (currentInstance.byPoint) {
            if (!inDisplayCell)
                Context.pop();
        }
        else {
            let inParentCell = currentInstance.parentDisplayCell.coord.isPointIn(event.clientX, event.clientY);
            if (!inDisplayCell && !inParentCell)
                Context.pop();
        }
    }
    static pop() {
        let [currentInstance, parentInstance] = Context.currentAndParent();
        //console.log("popping", currentInstance.label)
        for (let index = 0; index < currentInstance.contextNode.children.length; index++)
            Render.update((currentInstance.contextNode.children[index]["displaycell"]), true);
        currentInstance.isShown = false;
        if (parentInstance && parentInstance.activeChild)
            parentInstance.activeChild = undefined;
        if (Context.rootInstance == currentInstance) {
            Context.rootInstance = undefined;
            window.onmousemove = FunctionStack.pop(window.onmousemove, "ContextOnMouseMove");
        }
    }
    static currentInstance(deep = 0) {
        let currentInstance = Context.rootInstance;
        if (currentInstance)
            ++deep;
        while (currentInstance && currentInstance.activeChild) {
            currentInstance = currentInstance.activeChild;
            ++deep;
        }
        return [currentInstance, deep];
    }
    launchContext(event = undefined) {
        let [lastContext, deep] = Context.currentInstance();
        event.preventDefault();
        this.launchEvent = event;
        if (!this.isShown) {
            this.isShown = true;
            if (!Context.rootInstance) {
                Context.rootInstance = this;
                window.onmousemove = FunctionStack.push(window.onmousemove, Context.ContextOnMouseMove);
            }
            else {
                lastContext.activeChild = this;
            }
            Render.scheduleUpdate();
        }
    }
    onConnect() {
        let element = (this.parentDisplayCell.getComponent("Element_"));
        // console.log(element)
        let eventObject = {};
        eventObject[this.eventType] = this.launchContext.bind(this);
        element.addEvents(eventObject);
    }
    ;
    setCoord(Pcoord = this.parentDisplayCell.coord, event = this.launchEvent) {
        let Dcoord = this.displaycell.coord;
        let Mcoord = Handler.ScreenSizeCoord;
        let x = (this.byPoint) ? this.launchEvent.clientX - Context.pointOffset : ((this.toTheRight) ? Pcoord.x + Pcoord.width : Pcoord.x);
        let y = (this.byPoint) ? this.launchEvent.clientY - Context.pointOffset : ((this.toTheRight) ? Pcoord.y : Pcoord.y + Pcoord.height);
        let width = this.width;
        let height = this.displaygroup.children.length * this.height;
        if (y + height > Mcoord.y + Mcoord.height)
            height = Mcoord.y + Mcoord.height - y;
        this.displaycell.coord.copy(Mcoord, x, y, width, height);
    }
    preRender(derender, node, zindex) { return undefined; }
    ;
    Render(derender, node, zindex) {
        if (this.isShown) {
            this.setCoord();
            return [this.displaycell];
        }
        return undefined;
    }
    ;
    getChild(label) {
        for (let index = 0; index < this.children.length; index++)
            if (this.children[index].label == label)
                return this.children[index];
        return undefined;
    }
    delete() { }
}
Context.Css = css("ContextCss", `color:black;background:white`, `color:white;background:black:cursor:pointer`);
Context.labelNo = 0;
Context.instances = {};
Context.activeInstances = {};
Context.defaults = { width: 150, height: 20, isShown: false, byPoint: true,
    eventType: "oncontextmenu", toTheRight: true };
Context.argMap = {
    string: ["label", "eventType"],
    node_: ["contextNode"],
    number: ["width", "height"],
    boolean: ["byPoint", "toTheRight"],
};
Context.pointOffset = 5;
function context(...Arguments) { return new Context(...Arguments); }
Render.register("Context", Context);
// class Context extends Base {
//     static lastRendered: Context;
//     static subOverlapPx = 4;
//     static instances:Context[] = [];
//     static activeInstances:Context[] = [];
//     static defaultObj = {one:function(){console.log("one")},
//                          two:function(){console.log("two")},
//                          three:function(){console.log("three")},
//                         }
//     static defaults = {
//         width : 100,
//         cellheight : 25,
//         css: Css.theme.context, //Context.defaultContextCss
//     }
//     static argMap = {
//         string : ["label"],
//         number : ["width", "cellheight"]
//     }
//     label:string;
//     menuObj:object;
//     x: number;
//     y: number;
//     width:number;
//     cellheight:number;
//     height:number;
//     displaycell: DisplayCell;
//     coord:Coord = new Coord();
//     css: Css;
//     handler:Handler;
//     launchcell:DisplayCell;
//     parentContext:Context;
//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         if (!this.menuObj) this.menuObj = Context.defaultObj;
//         Context.makeLabel(this);
//         this.changeMenuObject();
//     }
//     changeMenuObject(menuObj = this.menuObj){
//         if (menuObj != this.menuObj) this.menuObj = menuObj;
//         this.height = Object.keys(this.menuObj).length*this.cellheight;
//         let THIS = this;
//         let cellArray:DisplayCell[] = [];
//         let numKeys = Object.keys(menuObj).length;
//         let index = 0;
//         let newContext: Context;
//         this.displaycell = v({cellArray:[/* filled at bottom */]})
//         for (let key in menuObj) {
//             let valueFunctionOrObject = menuObj[key];
//             if (typeof(valueFunctionOrObject) == "function"){
//                 cellArray.push(I(   ( (index == numKeys-1)?"100%":`${this.cellheight}px`  ),
//                                     {innerHTML: key},
//                                     this.css,
//                                     events({onclick: function(mouseEvent:MouseEvent){
//                                         valueFunctionOrObject(mouseEvent, THIS);
//                                         THIS.popAll();
//                                     }})
//                                 ));
//             } else {
//                 newContext = new Context({menuObj:valueFunctionOrObject,
//                                           width: this.width,
//                                           cellheight: this.cellheight,
//                                           css: this.css,
//                                           parentContext: this
//                                         });
//                 newContext.launchcell=I(( (index == numKeys-1)?"100%":`${this.cellheight}px`),
//                         {innerHTML: key},
//                         this.css,
//                         events({onmouseover: function() {
//                                     let coord = THIS.coord;
//                                     if (!newContext.handler)
//                                         newContext.render(undefined, coord.x + coord.width - Context.subOverlapPx,
//                                                         coord.y + THIS.cellheight*(index-2) - Context.subOverlapPx);
//                                 }
//                         })
//                 );
//                 cellArray.push(newContext.launchcell);       
//             }
//             index += 1; 
//         }
//         this.displaycell.displaygroup.cellArray = cellArray;
//     }
//     popAll(){
//         this.pop();
//         if (this.parentContext) this.parentContext.popAll();
//         else window.onmousemove = function(){};
//     }
//     pop(){
//         this.handler.pop();
//         this.handler = undefined;
//         if (this.parentContext) Context.lastRendered = this.parentContext;
//     }
//     managePop(mouseEvent:MouseEvent) {
//         let x = mouseEvent.clientX;
//         let y= mouseEvent.clientY;
//         let pop = !this.displaycell.coord.isPointIn(x,y)
//         if (pop && this.launchcell && this.launchcell.coord.isPointIn(x,y)) pop = false;
//         let THIS = this
//         if (pop){
//             if (this.parentContext)
//                 window.onmousemove = function(mouseEvent:MouseEvent){THIS.parentContext.managePop(mouseEvent);};
//             else
//             window.onmousemove = function(){};
//             this.pop();
//         }
//     }
//     render(mouseEvent:MouseEvent, x:number=0, y:number=0) {
//         if (mouseEvent){
//             mouseEvent.preventDefault();
//             x=mouseEvent.clientX - Context.subOverlapPx;
//             y=mouseEvent.clientY - Context.subOverlapPx;
//         }
//         this.coord.assign(x, y, (this.launchcell && (this.width == Context.defaults.width)) ? this.launchcell.coord.width :this.width , this.height);
//         this.handler = H(this.displaycell, this.coord, {type:"context"});
//         let THIS = this;
//         window.onmousemove = function(mouseEvent:MouseEvent){THIS.managePop(mouseEvent);}
//         Context.lastRendered = this;
//     }
//     // static Render(displaygroup:DisplayGroup, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
//     //     return {zindex}
//     // }
//     hMenuBarx(){return this.launchcell.coord.x}
//     hMenuBary(){return this.launchcell.coord.y+this.launchcell.coord.height}
//     vMenuBarx(){return this.launchcell.coord.x + this.launchcell.coord.width}
//     vMenuBary(){return this.launchcell.coord.y}
// }
// //Render.register("Context", Context);
// let context = function(...Arguments:any){
//     let newcontext=new Context(...Arguments);
//     return function(mouseEvent:MouseEvent){newcontext.render(mouseEvent);return false;}
// }
// let hMenuBar = function(...Arguments:any){ // requires launchcell
//     let newcontext=new Context(...Arguments);
//     return function(mouseEvent:MouseEvent){
//         if (Context.lastRendered && Context.lastRendered.handler){
//             Context.lastRendered.popAll();
//         }
//         newcontext.render(undefined, newcontext.hMenuBarx(), newcontext.hMenuBary());
//         return false;
//     }
// }
// let vMenuBar = function(...Arguments:any){ // requires launchcell
//     let newcontext=new Context(...Arguments);
//     return function(mouseEvent:MouseEvent){
//         newcontext.render(undefined, newcontext.vMenuBarx(), newcontext.vMenuBary());
//         return false;
//     }
// }
// // export {vMenuBar, hMenuBar, context, Context}
