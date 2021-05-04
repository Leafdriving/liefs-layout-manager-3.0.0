/**
 * Display cell houses all the Componenets within a Coord (div)
 * It can have multiple children.  All Components must be withing a DisplayCell
 */
class DisplayCell extends Component {
    static labelNo = 0;
    /**
     * Instances of display cell as object key=label of DisplayCell
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
     * Arguments are first string = label, and object to become children.
     * usually, you will use displaycellInstance.addComponent()
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
     * Adds component to children of DisplayCell, and runs onConnect()
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
     * Gets component from the Children of DisplayCell
     * @param type ie Element_, DisplayGroup
     * @param label of above type, in cases of multiple similar types in children
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
     * Deletes component from DisplayCell Children
     */
    deleteComponent(type:string, label:string = undefined): boolean {
        let returnValue = false;
        for (let index = 0; index < this.children.length; index++) {
            const component = this.children[index];
            if ((Arguments_.typeof(component) == type) && (!label || label == component["label"])) {
                component["parentDisplayCell"] = undefined;
                this.children.splice(index--, 1);
                returnValue = true;
            }    
        }
        return returnValue;
    }
    /**
     * Pre render phase is identical to Render, but gives you an oppotunity
     * to change the parent DisplayCells, before they are rendered
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
     * Renders objects and expects a return array of children of this object to be rendered.
     * It is at this point that the co-ordinates of the children are set.
     */
    Render(derender = false, node:node_, zindex:number) {
        this.coord.applyMargins(this.marginLeft, this.marginRight, this.marginTop, this.marginBottom);
        if (this.coord.zindex < 0) this.coord.zindex *=  -1;
        else this.coord.zindex = zindex;
        return this.children;
    }
    /**
     * Adds events to expected child Element_
     */
    addEvents(Argument:object){
        let element_ = <Element_>this.getComponent("Element_");
        if (element_) element_.addEvents(Argument)
    }
    /**
     * Sets Margins, in different ways depending on number of arguments.
     * if one, all set to that value, if two, left and right to first, top and bottom to second,
     * if 4, left, right, top, bottom set to those values
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