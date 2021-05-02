/**
 * Display cell
 */
class DisplayCell extends Component {
    static labelNo = 0;
    /**
     * Instances  of display cell
     */
    static instances:{[key: string]: DisplayCell;} = {};
    static activeInstances:{[key: string]: DisplayCell;} = {};
    static defaults:{[key: string]: any;} = {getdim:function(){return this.dim_},
                                            setdim:function(value:string){this.dim_ = value}}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
    }
    static objectTypes:Set<string> = new Set();
    // retArgs:objectAny;   // <- this will appear
    coord:Coord;  // =  new Coord();
    children:Component[] = [];
    parentDisplayCell:DisplayCell;
    marginLeft:number;
    marginRight:number;
    marginTop:number;
    marginBottom:number;
    node:node_;
    getdim:Function;
    setdim:Function;
    dim_:string;
    set dim(value:string) {this.setdim(value);}
    get dim(){return this.getdim();}
    min:number; // minimum number of pixels in displayGroup

    /**
     * Creates an instance of display cell.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        if (!this.coord) this.coord = new Coord();
        if (this.retArgs["number"]) DisplayCell.marginAssign(this, this.retArgs["number"]);

        for (let index = 0; index < Arguments.length; index++) {
            const component = <Component>Arguments[index];
            if (typeof(component) == "object" && component.constructor) {
                if (component.constructor.name == "Coord") this.coord = component as unknown as Coord;
                else this.addComponent(component)
            }
        }
        if (!this.label) DisplayCell.makeLabel(this);
        DisplayCell.instances[this.label] = this;
    }
    /**
     * Adds component
     * @param component 
     * @returns component 
     */
    addComponent(component:Component) : DisplayCell {
        DisplayCell.objectTypes.add(component.constructor.name);
        this.children.push(component);
        component.parentDisplayCell = this;
        component.onConnect();
        if (!this.label) this.label = component.label;
        return this;
    }
    /**
     * Gets component
     * @param type 
     * @param [label] 
     * @returns component 
     */
    getComponent(type:string, label:string = undefined) : object {
        for (let index = 0; index < this.children.length; index++) {
            const component = this.children[index];
            if (Arguments_.typeof(component) == type) {
                if (!label) return component;
                if (label == component["label"]) return component;
            }
        }
        return undefined;
    }
    /**
     * Deletes component
     * @param type 
     * @param [label] 
     * @returns true if component 
     */
    deleteComponent(type:string, label:string = undefined): boolean {
        let returnValue = false;
        for (let index = 0; index < this.children.length; index++) {
            const component = this.children[index];
            // console.log(Arguments_.typeof(component), component["label"], label)
            if ((Arguments_.typeof(component) == type) && (!label || label == component["label"])) {
                component["parentDisplayCell"] = undefined;
                this.children.splice(index--, 1);
                returnValue = true;
            }    
        }
        return returnValue;
    }
    /**
     * Pre render
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns  
     */
    preRender(derender:boolean, node:node_, zindex:number){
        let returnArray = [];
        for (let index = 0; index < this.children.length; index++){
            let component = this.children[index];
            let type = Arguments_.typeof(component);
            if (type != "DisplayCell") {
                let temp = component.preRender(derender, node, zindex);
                if (temp) returnArray.concat(temp);
            }
        }
        return returnArray;
    }
    /**
     * Renders display cell
     * @param [derender] 
     * @param node 
     * @param zindex 
     * @returns  
     */
    Render(derender = false, node:node_, zindex:number) {
        this.coord.applyMargins(this.marginLeft, this.marginRight, this.marginTop, this.marginBottom);
        if (this.coord.zindex < 0) this.coord.zindex *=  -1;
        else this.coord.zindex = zindex;
        return this.children;
    }
    /**
     * Adds events
     * @param Argument 
     */
    addEvents(Argument:object){
        let element_ = <Element_>this.getComponent("Element_");
        if (element_) element_.addEvents(Argument)
    }
    /**
     * Margins assign
     * @param cell 
     * @param numberArray 
     */
    static marginAssign(cell:DisplayCell, numberArray:number[]) {
        switch (numberArray.length) {
            case 1:
                cell.marginLeft = cell.marginRight = cell.marginTop = cell.marginBottom = numberArray[0];
                break;
            case 2:
                cell.marginLeft = cell.marginRight = numberArray[0];cell.marginTop = cell.marginBottom = numberArray[1];
                break;
            case 4:
                cell.marginLeft = numberArray[0];cell.marginRight = numberArray[1];
                cell.marginTop = numberArray[2];cell.marginBottom = numberArray[3];
                break;
            default:
                break;
        }
    }
}