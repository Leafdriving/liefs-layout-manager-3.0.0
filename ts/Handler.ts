// import {Base} from './Base';
// import {Coord} from './Coord';
// import {DisplayCell} from './DisplayCell';
// import {Css} from './Css';
// import {DisplayGroup} from './DisplayGroup';
// import {HtmlBlock} from './htmlBlock';
// import {Observe} from './Observe'
// import {Overlay} from './Overlay';
// import {Pages} from './Pages';
// import {mf, pf} from './PureFunctions';
// import {ScrollBar} from './ScrollBar';

// enum HandlerType {
//     winModal = "winModal",
//     modal = "modal",
//     toolbar = "toolbar",
//     layer = "layer",
//     undefined = "undefined"
// }

enum HandlerType {
    winModal = "winModal",
    modal = "modal",
    toolbar = "toolbar",
    other = "other",
    context = "context",
}

class Handler extends Base {
    static handlerMarginDefault=0;
    static firstRun = true;
    static instances:Handler[] = [];
    static activeInstances:Handler[] = [];
    static defaults = {
        cssString : " ",
        addThisHandlerToStack: true,
        activeOffset: false,
        type:HandlerType.other,
    }
    static argMap = {
        string : ["label"],
        number : ["handlerMargin"],
        Coord: ["coord"],
        function: ["preRenderCallback", "postRenderCallback"],
        boolean: ["addThisHandlerToStack"]
    }
    static screenSizeCoord: Coord = new Coord();
    static renderNullObjects:boolean = false;
    static argCustomTypes:Function[] = [];
    static handlerZindexStart:number = 1;
    static zindexIncrement:number = 1;
    static handlerZindexIncrement:number = 100;
    static currentZindex:number;
    static renderAgain:boolean;
    static activeOffset: boolean;
    static preRenderCallback: Function;
    static postRenderCallback: Function

    renderNode:node_; // render node

    type:HandlerType
    label:string;
    rootCell:DisplayCell = undefined;
    coord:Coord; // =  new Coord();
    cssString: string;
    handlerMargin: number;
    addThisHandlerToStack: boolean;
    preRenderCallback: Function;
    postRenderCallback: Function;
    


    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        Handler.updateScreenSize();

        if ("DisplayCell" in this.retArgs) this.rootCell = this.retArgs["DisplayCell"][0];
        if (!this.rootCell) pf.errorHandling(`Handler "${this.label}" requires a DisplayCell`);
        if (this.handlerMargin == undefined) this.handlerMargin = Handler.handlerMarginDefault;

        if (Handler.firstRun) {
            setTimeout(Render.update);
            // setTimeout(Handler.update,200);
            Handler.firstRun = false;
            for (let element of document.querySelectorAll(Css.deleteOnFirstRunClassname)) element.remove();
            
            window.onresize = function() {Render.update()};
            window.onwheel = function(event:WheelEvent){ScrollBar.onWheel(event);};
            window.addEventListener("popstate", function(event){Pages.popstate(event)})
            Pages.parseURL();
        }
        if (this.addThisHandlerToStack) {
            Handler.activeInstances.push(this);
        }
        Handler.makeLabel(this);
        Render.update(/* [this] */);
        Css.update();
    }
    pop():Handler {return Handler.pop(this);}
    toTop(){ // doesn't work!
    // console.log("toTop Called");
        let index = Handler.activeInstances.indexOf(this);
        if (index > -1 && index != Handler.activeInstances.length-1){
            // console.log("Before to Top", Handler.activeInstances)
            Handler.activeInstances.splice(index, 1);
            Handler.activeInstances.push(this);
            // console.log("after To Top", Handler.activeInstances)
            Render.update();
        }
    }
    static pop(handlerInstance = Handler.activeInstances[ Handler.activeInstances.length-1 ]): Handler {
        // console.log("pop Called", handlerInstance.label)
        let index = Handler.activeInstances.indexOf(handlerInstance);
        let poppedInstance:Handler = undefined;
        if (index != -1) {
            poppedInstance = Handler.activeInstances[index];
            Render.update(handlerInstance, true);
            Handler.activeInstances.splice(index, 1);
        }
        return poppedInstance;
    }
    static screensizeToCoord(dislaycell:DisplayCell, handlerMargin: number){
        let viewport = pf.viewport();
        dislaycell.coord.assign(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2,
                                handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2,Handler.currentZindex);
        //dislaycell.coord.copy(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2, Handler.currentZindex);
    }
    static updateScreenSize() {
        let [width, height] = pf.viewport();
        Handler.screenSizeCoord.assign(0,0,width,height,0,0,width,height,0)
    }
    static RenderStartingpoint(){
        if (Handler.preRenderCallback) Handler.preRenderCallback();
        Handler.updateScreenSize();
        let handlers:Handler[] = [];
        // console.clear();
        let types = ["other", "toolbar", "modal", "winModal", "context"]
        for (let index = 0; index < types.length; index++) {
            let type = types[index];
            for (let index = 0; index < Handler.activeInstances.length; index++) 
                if (Handler.activeInstances[index].type == HandlerType[type]){
                    // if (type=="context") console.log(Handler.activeInstances[index].label)
                    handlers.push(Handler.activeInstances[index])
                }
        }
        // console.log(handlers)
        return handlers //Handler.activeInstances;
    }
    static RenderEndingPoint(){
        if (Handler.postRenderCallback) Handler.postRenderCallback();   
    }
    static Render(handlerInstance:Handler, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        // console.log(handlerInstance.label)
        //handlerInstance.renderNode = node;

        if (handlerInstance.preRenderCallback) handlerInstance.preRenderCallback(handlerInstance);
        if (handlerInstance.coord) {
            handlerInstance.rootCell.coord.copy(handlerInstance.coord);
            handlerInstance.rootCell.coord.assign( undefined,undefined,undefined,undefined,
                                                   undefined,undefined,undefined,undefined, zindex)
        }
        else {
            Handler.screensizeToCoord(handlerInstance.rootCell, handlerInstance.handlerMargin);  
        }
        if (handlerInstance.postRenderCallback) handlerInstance.postRenderCallback(handlerInstance);

        let renderChildren = new RenderChildren;
        renderChildren.RenderSibling(handlerInstance.rootCell, derender);

        return {zindex,
            siblings: renderChildren.siblings};
    }
}
Render.register("Handler", Handler);
function H(...Arguments: any): Handler {
    return new Handler(...Arguments)
}
// export {H, Handler}