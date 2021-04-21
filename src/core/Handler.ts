class Handler extends Component {
    static labelNo = 0;
    static instances:{[key: string]: Handler;} = {};
    static activeInstances:{[key: string]: Handler;} = {};
    static defaults:{[key: string]: any;} = {startRendered: true}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        Coord: ["coord"],
        boolean: ["startRendered"],

    }
    static linkHandlerOldList:Handler[] = [];
    static linkHandlerNewList:Handler[] = [];
    static linkHandlers(){
        let links = document.querySelectorAll("[handler]");
        Handler.linkHandlerOldList = Handler.linkHandlerNewList;
        Handler.linkHandlerNewList = [];
        for (let index = 0; index < links.length; index++) {
            const el = links[index];
            let parentEl = el;
            do {parentEl = parentEl.parentElement;}
            while ( !(parentEl.id && Element_.instances[parentEl.id]) && (parentEl));
            let coord = (parentEl) ? Element_.instances[parentEl.id].parentDisplayCell.coord : Handler.ScreenSizeCoord;
            let handlerLabel = el.getAttribute("handler");
            let handler = Handler.instances[handlerLabel];
            if (handler) {
                if (!Handler.activeInstances[handlerLabel]) Handler.activeInstances[handlerLabel] = handler;
                if (Handler.linkHandlerNewList.indexOf(handler) == -1) Handler.linkHandlerNewList.push(handler);
                if (!handler.preRenderCallBack) handler.preRenderCallBack = <any>FunctionStack.push(undefined,
                        function setHandlerCoord(handler:Handler) {
                            let {x, y, width, height} = el.getBoundingClientRect();
                            handler.coord.copy(coord, x, y, width, height);
                        }
                    )
            }
        }
        for (let index = 0; index < Handler.linkHandlerOldList.length; index++) {
            let handler = Handler.linkHandlerOldList[index];
            if (Handler.linkHandlerNewList.indexOf(handler) == -1) {
                Render.update(handler.parentDisplayCell, true);
                delete Handler.activeInstances[handler.label];
            }
        }
    }
    // retArgs:objectAny;   // <- this will appear
    type:string;
    label: string;
    startRendered: boolean
    coord: Coord;
    parentDisplayCell:DisplayCell;
    children:Component[] = [];
    node:node_;
    preRenderCallBack:(handler:Handler)=>void;
    postRenderCallBack:(handler:Handler)=>void;
    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Handler.makeLabel(this); Handler.instances[this.label] = this;
        for (let index = 0; index < Arguments.length; index++) {
            const newChildObject = Arguments[index];
            if (typeof(newChildObject) == "object" && newChildObject.constructor) {
                if (newChildObject.constructor.name == "Coord") this.coord = <Coord>newChildObject;
                else {
                    DisplayCell.objectTypes.add(newChildObject.constructor.name);
                    this.children.push(newChildObject);
                }
            }
        }
        if (!this.coord) this.coord = Handler.ScreenSizeCoord;
        if (this.startRendered) Handler.activeInstances[this.label] = this;
    }
    static ScreenSizeCoord: Coord = new Coord();
    static updateScreenSizeCoord(){
        let win = window, doc = document, docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
        Handler.ScreenSizeCoord.frozen = false;
        Handler.ScreenSizeCoord.assign(0, 0, x, y, 0, 0, x, y);
        Handler.ScreenSizeCoord.frozen = true;
    }
    static getHandlers(): DisplayCell[] {
        let objectArray:DisplayCell[] = [];
        for (const key in Handler.activeInstances) 
            objectArray.push(Handler.activeInstances[key].parentDisplayCell);
        return objectArray;
    }
    onConnect() {
        if (this.retArgs["number"] && this.retArgs["number"].length >= 1) 
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"]);
        if (this.startRendered) Render.scheduleUpdate();
    }
    preRender(derender:boolean, node:node_):void{
        if (this.preRenderCallBack) this.preRenderCallBack(this);
        this.parentDisplayCell.coord.copy(this.coord);
    }
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        for (let index = 0; index < this.children.length; index++) 
            (<DisplayCell>( this.children[index] )).coord.copy(this.parentDisplayCell.coord);
        if (this.postRenderCallBack) this.postRenderCallBack(this);
        return this.children;
    }
    show(){Handler.activeInstances[this.label] = this;Render.scheduleUpdate();}
    hide(){Render.update(this.parentDisplayCell, true);
           delete Handler.activeInstances[this.label]}
}
function H(...Arguments:any){return new DisplayCell( new Handler(...Arguments) )}