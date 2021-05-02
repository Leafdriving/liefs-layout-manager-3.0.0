/**
 * Context
 */
class Context extends Component {
    static Css = css("ContextCss",`color:black;background:white`, `color:white;background:black:cursor:pointer`)
    static labelNo = 0;
    static instances:{[key: string]: Context;} = {};
    static activeInstances:{[key: string]: Context;} = {};
    static defaults:{[key: string]: any;} = {width:150,height:20, isShown:false, byPoint:true,
            eventType:"oncontextmenu", toTheRight:true, newFunctionReplacesold:false}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label","eventType"],
        node_:["contextNode"],
        number:["width", "height"],
        boolean:["byPoint", "toTheRight"],
        function: ["onclick"],
    }
    static pointOffset = 5;
    static activeInstanceArray:Context[] = [];
    newFunctionReplacesold:boolean;
    byPoint:boolean; // if true, on point, if false, by parent location
    toTheRight:boolean;
    eventType:string; // default oncontextmenu
    node:node_;
    parentDisplayCell:DisplayCell;
    children: Component[];
    contextNode:node_;

    width:number;
    height:number;
    isShown:boolean;
    activeChild:Context;


    displaycell:DisplayCell;
    displaygroup:DisplayGroup;
    launchEvent:MouseEvent|PointerEvent;
    onclick:(e:MouseEvent, displaycell:DisplayCell, node:node_)=>void;

    // retArgs:objectAny;   // <- this will appear
    /**
     * Creates an instance of context.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Context.makeLabel(this); Context.instances[this.label] = this;
        if (!this.contextNode) this.contextNode = sample();
        this.build();
    }
    /**
     * Builds context
     */
    build(){
        let THIS = this;
        let displaycells:DisplayCell[] = [];
        for (let index = 0; index < this.contextNode.children.length; index++) {
            let childNode = this.contextNode.children[index];
            let retArgs = Arguments_.argumentsByType(childNode.Arguments);
            let label = ("string" in retArgs) ? retArgs["string"][0]: undefined;
            let displaycell = ("DisplayCell" in retArgs) ? <DisplayCell>retArgs["DisplayCell"][0] : undefined;
            let function_ = ("function" in retArgs) ? <Function>retArgs["function"][0] : undefined;

            if (!label && displaycell) label = displaycell.label;
            displaycell = (displaycell) ? displaycell : I(`${this.label}_${label}`, label, Context.Css);
            let onclick = (THIS.onclick) ? (e:MouseEvent)=>{Context.popAll();THIS.onclick(e, displaycell, childNode);}
                                         : (e:MouseEvent)=>{Context.popAll();}
            if (function_) {
                displaycell.addEvents({onclick: function_});
                if (THIS.onclick && !this.newFunctionReplacesold) displaycell.addEvents( {onclick} );
            } else {
                displaycell.addEvents({onclick})
            }
            if (childNode.children.length) 
                displaycell.addComponent( context(`${childNode.label}_context`, "onmouseover", false, childNode, this.onclick) );
            childNode["displaycell"] = displaycell;
            
            displaycells.push( displaycell );
        }
        this.displaygroup = new DisplayGroup(`${this.label}_ContextV`, false, ...displaycells);
        this.displaycell = new DisplayCell(this.displaygroup);
    }
    /**
     * Contexts on mouse move
     * @param event 
     * @returns  
     */
    static ContextOnMouseMove(event:MouseEvent|PointerEvent){
        let X = event.clientX, Y = event.clientY;
        let length = Context.activeInstanceArray.length;
        let topInstance = Context.activeInstanceArray[length -1];
        let valid = ((topInstance.parentDisplayCell.coord.isPointIn(X, Y) && (length > 1 || !topInstance.byPoint))
                    || topInstance.displaycell.coord.isPointIn(X, Y))
        if (!valid) topInstance.pop();
        return Context.activeInstanceArray.length
    }
    /**
     * Pops all
     * @param [keepFunction] 
     */
    static popAll(keepFunction=false){
        while (Context.activeInstanceArray.length)
            Context.activeInstanceArray[Context.activeInstanceArray.length-1].pop(keepFunction);
    }
    /**
     * Pops context
     * @param [keepFunction] 
     */
    pop(keepFunction=false){
        // console.log("pop")
        let index = Context.activeInstanceArray.indexOf(this);
        if (index != -1) {
            Render.update(this.displaycell, true);
            this.isShown = false;
            Context.activeInstanceArray.splice(index, 1);
            if (Context.activeInstanceArray.length == 0 && !keepFunction) 
                window.onmousemove = <any>FunctionStack.pop(window.onmousemove as any as FunctionStack, "ContextOnMouseMove");
        }
    }
    /**
     * Launchs context
     * @param [event] 
     */
    launchContext(event:PointerEvent|MouseEvent = undefined){
        // console.log("launch")
        event.preventDefault();
        let length = Context.activeInstanceArray.length;
        if (length) {
            if (this.contextNode.root() != Context.activeInstanceArray[0].contextNode.root()) Context.popAll(true);
            else {
                let lastContextInstance = Context.activeInstanceArray[ length-1 ];
                if (this.contextNode.depth() <= lastContextInstance.contextNode.depth()) lastContextInstance.pop();
            }
        } else window.onmousemove = <any>FunctionStack.push(window.onmousemove, Context.ContextOnMouseMove);

        Context.activeInstanceArray.push(this)
        this.launchEvent = event;
        this.isShown = true;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether connect on
     */
    onConnect():void{
        let eventObject:object = {};
        eventObject[this.eventType] = this.launchContext.bind(this);
        this.parentDisplayCell.addEvents( eventObject );
    };
    /**
     * Sets coord
     * @param [Pcoord] 
     * @param [event] 
     */
    setCoord(Pcoord=this.parentDisplayCell.coord, event:MouseEvent|PointerEvent = this.launchEvent){
        let Dcoord = this.displaycell.coord;
        let Mcoord = Handler.ScreenSizeCoord;
        let x = (this.byPoint) ? this.launchEvent.clientX - Context.pointOffset : ((this.toTheRight) ? Pcoord.x + Pcoord.width : Pcoord.x);
        let y = (this.byPoint) ? this.launchEvent.clientY - Context.pointOffset : ((this.toTheRight) ? Pcoord.y : Pcoord.y + Pcoord.height);
        let width = this.width;
        let height = this.displaygroup.children.length*this.height;
        if (y + height > Mcoord.y + Mcoord.height) height = Mcoord.y + Mcoord.height - y; 
        this.displaycell.coord.copy(Mcoord, x, y, width, height);
    }
    /**
     * Renders context
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        if (this.isShown) {
            this.setCoord();
            return [this.displaycell];
        } 
        return undefined
    };

}
function context(...Arguments:any){ return new Context(...Arguments); }
Render.register("Context", Context);