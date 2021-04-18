class Handler extends Component {
    static labelNo = 0;
    static instances:{[key: string]: Handler;} = {};
    static activeInstances:{[key: string]: Handler;} = {};
    static defaults:{[key: string]: any;} = {isRendered: true}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        Coord: ["coord"],
        boolean: ["isRendered"],
    }
    // retArgs:objectAny;   // <- this will appear
    label: string;
    isRendered: boolean
    coord: Coord;
    parentDisplayCell:DisplayCell;
    children:Component[] = [];
    node:node_;
    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Handler.makeLabel(this); Handler.instances[this.label] = this;
        for (let index = 0; index < Arguments.length; index++) {
            const argument = Arguments[index];
            if (typeof(argument) == "object" && argument.constructor) {
                if (argument.constructor.name == "Coord") this.coord = <Coord>argument;
                else {
                    DisplayCell.objectTypes.add(argument.constructor.name);
                    this.children.push(argument);
                }
            }
        }
        if (!this.coord) this.coord = Handler.ScreenSizeCoord;
        if (this.isRendered) Handler.activeInstances[this.label] = this;
    }
    static ScreenSizeCoord: Coord = new Coord();
    static updateScreenSizeCoord(){
        let win = window, doc = document, docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
        Handler.ScreenSizeCoord.assign(0, 0, x, y, 0, 0, x, y);
    }
    static getHandlers(): DisplayCell[] {
        let objectArray:DisplayCell[] = [];
        for (const key in Handler.activeInstances) 
            objectArray.push(Handler.activeInstances[key].parentDisplayCell);
        return objectArray;
    }
    onConnect() {
        // console.log("OnConnect Handler", this.label, this.retArgs);
        if (this.retArgs["number"] && this.retArgs["number"].length >= 1) {
            // console.log("Found Margins");
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"]);
        }
        if (this.isRendered) Render.scheduleUpdate();
    }
    preRender(derender:boolean, node:node_):void{
        this.parentDisplayCell.coord.copy(this.coord);
    }
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        for (let index = 0; index < this.children.length; index++) 
            (<DisplayCell>( this.children[index] )).coord.copy(this.parentDisplayCell.coord);
        return this.children;
    }
}
function H(...Arguments:any){return new DisplayCell( new Handler(...Arguments) )}