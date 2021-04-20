function events(object_:object){return {processEvents:object_}}
class Element_ extends Base {
    static labelNo = 0;
    static instances:{[key: string]: Element_;} = {};
    static activeInstances:{[key: string]: Element_;} = {};
    static defaults:{[key: string]: any;} = {evalInner:(THIS:Element_)=>THIS.innerHTML}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label", "innerHTML", "css_"],
        dim: ["dim_"],
        Css: ["Css"],
        function: ["evalInner"],
    }
    static customEvents:{[type: string]: (newData:any)=>object;} = {};
    // retArgs:objectAny;   // <- this will appear
    ignoreInner:boolean;
    label:string; // id
    el:HTMLDivElement;
    evalInner:(THIS:Element_)=>string;
    innerHTML:string;
    css_:string;
    dim_:string;
    get dim(){return (this.parentDisplayCell) ? this.parentDisplayCell.dim : this.dim_};
    set dim(value) {
        if (this.parentDisplayCell) this.parentDisplayCell.dim = value;
        else this.dim_ = value;
    }
    get css(){
        if (this.Css) return this.Css.classname;
        if (this.css_) return this.css_;
        return undefined;
    }
    set css(value:string){
        this.css_ = value;
        this.attributes.class = value;
    }
    Css:Css;
    events:objectFunction = {};
    processEvents:objectFunction;
    attributes:objectString = {llm:""};
    parentDisplayCell: DisplayCell;
    get coord(){if (this.parentDisplayCell) return this.parentDisplayCell.coord; return undefined}
    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Element_.makeLabel(this); Element_.instances[this.label] = this;
        
        this.attributes.id = this.label;
        if (this.Css) this.css = this.Css.classname;

        let el = Element_.elExists(this.label);
        // console.log(this.label, el)
        if (el) this.loadElement(el);

        if (this.processEvents) {this.addEvents(this.processEvents);}
    }
    loadElement(el:HTMLDivElement) {
        
        this.el = el;
        this.attributes = Element_.getAttribs(el);
        this.attributes["llm"]="";
        this.innerHTML = el.innerHTML;
        console.log("loading Element", el)
        el.remove();
    }
    applyEvents(){for (let key in this.events) this.el[key] = this.events[key];}
    addEvents(eventObject:object){
        for (const key in eventObject) {
            if (key in Element_.customEvents) 
                this.addEvents(Element_.customEvents[key](eventObject[key]));
            else this.events[key] = FunctionStack.push(this.events[key], eventObject[key]);
        }
    }
    renderHtmlAttributes(){for (let key in this.attributes) Element_.setAttrib(this.el, key, this.attributes[key]);}
    onConnect(){
        if (this.dim_) {this.parentDisplayCell.dim = this.dim_;this.dim_ = undefined;}
        if (this.retArgs["number"]) DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"]);
    }
    preRender(){}
    Render(derender: boolean, node:node_){
        let el = Element_.elExists(this.label);
        if (derender || this.coord.width <= 0) {
            if (el) el.remove();
            return [];
        }
        if (!this.el) this.el = document.createElement("div");
        if (!el) document.body.appendChild(this.el);
        if (this.innerHTML && (!this.ignoreInner) && this.innerHTML != this.el.innerHTML) this.el.innerHTML = this.evalInner(this);
        this.renderHtmlAttributes();
        this.applyEvents();
        let styleString = Element_.style(this);
        if (this.el.style.cssText != styleString) this.el.style.cssText = styleString;
        return [];
    }
    setAsSelected(){
        if (!this.attributes.class.endsWith("Selected")) {
            this.attributes.class += "Selected";
            if (this.el) Element_.setAttrib(this.el, "class", this.attributes.class);
        }
    }
    setAsUnSelected(){
        if (this.attributes.class.endsWith("Selected")) {
            this.attributes.class = this.attributes.class.slice(0, -8);
            if (this.el) Element_.setAttrib(this.el, "class", this.attributes.class);
        }
    }
    static clipStyleString(element:Element_) {
        let COORD = element.coord;
        let WITHIN = element.coord.within;
        let returnString:string = "";
        let left = (COORD.x < WITHIN.x) ? (WITHIN.x-COORD.x) : 0;
        let right:number;
        if (COORD.hideWidth) {
            let el = document.getElementById(element.label);
            let bound = el.getBoundingClientRect();
            right = (COORD.x + bound.width > WITHIN.x + WITHIN.width) ? (COORD.x + bound.width - (WITHIN.x + WITHIN.width)) : 0;
        } else
            right = (COORD.x + COORD.width > WITHIN.x + WITHIN.width) ? (COORD.x + COORD.width - (WITHIN.x + WITHIN.width)) : 0;
        let top = (COORD.y < WITHIN.y) ? (WITHIN.y - COORD.y) : 0;
        let bottom = (COORD.y + COORD.height > WITHIN.y + WITHIN.height) ? (COORD.y + COORD.height - (WITHIN.y + WITHIN.height)) : 0;
        if (left + right + top + bottom > 0)
            returnString = `clip-path: inset(${top}px ${right}px ${bottom}px ${left}px);`
        return returnString;
    }
    static style(element:Element_):string {
        let coord = element.coord;
        let clip = Element_.clipStyleString(element);
        let returnString = `left:${coord.x}px;top:${coord.y}px;`
         +`${ (coord.hideWidth || coord.width == undefined) ? "" : "width:" + coord.width + "px;" }`
        +`height:${coord.height}px;z-index:${coord.zindex};${(clip) ? clip + ";" : ""}`
        + ((element.attributes.style) ? element.attributes.style : "");
        return returnString;
    }
    static getAttribs(el:HTMLDivElement, retObj:objectString = {}): objectString {
        for (let i = 0; i < el.attributes.length; i++) 
            if (Element_.attribFilter.indexOf(el.attributes[i].name) == -1)
                retObj[el.attributes[i].name] = el.attributes[i].value;
        return retObj;
    }
    static elExists(id_label:string){return <HTMLDivElement>document.getElementById(id_label)}
    static setAttribs(element:Element_) {
        for (const key in element.attributes) 
            Element_.setAttrib(element.el, key, element.attributes[key]);
    }
    static setAttrib(el:HTMLElement, attrib:string, value:string) {
        let prevAttrib = el.getAttribute(attrib);
        if (prevAttrib != value) {
            let att = document.createAttribute(attrib);
            att.value = value;
            el.setAttributeNode(att);
        }
    }
    static attribFilter = ["id"];
}
function I(...Arguments:any) {
    return new DisplayCell( new Element_(...Arguments) );
}
