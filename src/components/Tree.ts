/**
 * Tree 
 */
class Tree_ extends Component {
    static labelNo = 0;
    static instances:{[key: string]: Tree_;} = {};
    static activeInstances:{[key: string]: Tree_;} = {};
    static defaults:{[key: string]: any;} = {collapsedIcon: Tree_.collapsedSVG(), expandedIcon: Tree_.expandedSVG(),
                                            indent:10, topMargin:0, sideMargin:0, height:20, offsetx:0, offsety:0,
                                            useSelected:true, selectedStartIndex:0, selectParents:true, cascadeCollapse:true}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        node_:["parentTreeNode"],
        DisplayCell:["parentDislayCell"],
        boolean: ["useSelected"],
    }
    static scrollArrowsSVGCss = css(`scrollArrows`,`stroke: black;`,`fill: white;`, {type:"llm"});
    static collapsedSVG(classname:string = "scrollArrows"){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;}
    static expandedSVG(classname:string = "scrollArrows"){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;}
    static extension = "_TreeNode";
    static toggleCollapse(el:HTMLElement, node:node_, mouseEvent:PointerEvent){
        // console.log(node)
        if (!node.collapsed) Tree_.deRenderChildren(node);
        node.collapsed = !node.collapsed;
        Render.scheduleUpdate();
    }
    static deRenderChildren(parentNode:node_) {
        for (let index = 0; index < parentNode.children.length; index++) {
            let node = parentNode.children[index];
            node_.traverse(node, function(node:node_){
                Render.update( node["rendercell"], true );
            });
        }
    }
    static pointerCss = css("justpointer","cursor:pointer");
    label:string;

    offsetx:number;
    offsety:number;
    
    css:string;
    Css:Css;
    indent:number;
    events: object;
    topMargin:number;
    sideMargin:number;
    height:number;

    displayWidth:number;
    displayHeight:number;

    scrollbarh:ScrollBar;
    scrollbarv:ScrollBar;

    node:node_;
    parentTreeNode:node_;

    parentDisplayCell:DisplayCell;
    children: Component[];

    useSelected: boolean;
    selected:Selected;
    selectedNode: node_;
    selectedStartIndex:number;
    selectParents:boolean;

    cascadeCollapse:boolean;

    /**
     * Creates an instance of tree .
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        let THIS = this;
        Tree_.makeLabel(this); Tree_.instances[this.label] = this;
        if (this.Css) this.css = this.Css.classname;
        if (!this.parentTreeNode) this.parentTreeNode = sample();
        this.newNode(this.parentTreeNode);
        if (this.useSelected && this.selected == undefined) {
            let getIndexerArray = function(selectedInstance:Selected):any{
                return node_.asArray(THIS.parentTreeNode, function(node){return [node["displaycell"]];}
);
            };
            let onselect = function(index:number, displaycell:DisplayCell):any {
                let node = <node_>(node_.asArray(THIS.parentTreeNode)[index]);
                if (THIS.selectParents) {
                    while (node.ParentNode) {
                        node = node.ParentNode;
                        let displaycell = <DisplayCell>node["displaycell"]
                        let element = <Element_>(displaycell.getComponent("Element_"));
                        if (element) element.setAsSelected();
                    }
                }
            };
            let onunselect = function(index:number, displaycell:DisplayCell){
                if (THIS.selectParents) {
                    let node = <node_>(node_.asArray(THIS.parentTreeNode)[index]);
                    while (node.ParentNode) {
                        node = node.ParentNode;
                        let displaycell = <DisplayCell>node["displaycell"]
                        let element = <Element_>(displaycell.getComponent("Element_"));
                        if (element) element.setAsUnSelected();
                    }
                }
            };
            this.selected = new Selected(`${this.label}`, this.selectedStartIndex,{getIndexerArray,onselect,onunselect});
        }
    }

    /**
     * Icons tree 
     * @param node 
     * @returns  
     */
    static icon(node:node_){
        return (node.children.length) ? ((node.collapsed) ? Tree_.collapsedSVG() : Tree_.expandedSVG()) : ""
    }

    /**
     * News node
     * @param node 
     */
    newNode(node:node_) {
        let THIS = this;
        let argMap = {
            string:["label"],
            DisplayCell:["displaycell"],
        }
        node_.traverse(node, function(node:node_){
            node.retArgs = Arguments_.argumentsByType(node.Arguments);
            Arguments_.modifyClassProperties(Arguments_.retArgsMapped({}, node, {argMap}), node);
            // if (node["DisplayCell"]) alert("told ya so!");
            if (!node["displaycell"]) node["displaycell"] = I(node.label+Tree_.extension, node.label);
            let displaycell = <DisplayCell>(node["displaycell"]);
            let element = <Element_>displaycell.getComponent("Element_");
            if (!element.css && THIS.css) element.css = THIS.css;
            if (THIS.events) element.addEvents(THIS.events);
            displaycell.coord.hideWidth = true;
            let icon = I(`${node.label}_icon`, `${THIS.height}px`, Tree_.pointerCss,
                                Tree_.icon(node),
                                events({onclick:function(e:PointerEvent){Tree_.toggleCollapse(this.parentElement, node, e)}}),
                                (el:Element_)=>Tree_.icon(node),
                            );
            node["iconElement_"] = icon.getComponent("Element_");
            node["rendercell"] = h(`${THIS.label}_rendercell`,
                icon,
                displaycell
            )
        })
        this.parentTreeNode = node;
    }
    /**
     * Pre render
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    preRender(derender:boolean, node:node_, zindex:number):Component[]|void{
        this.displayHeight = (this.topMargin + this.parentTreeNode.length()*this.height)-this.parentDisplayCell.coord.y;
        return undefined;
    };
    /**
     * Renders tree 
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        let THIS = this;
        let returnDisplayCellArray:DisplayCell[] = [];
        let PDCoord = this.parentDisplayCell.coord;
        let xWithoutIndent = PDCoord.x + this.sideMargin - this.offsetx;
        let y = PDCoord.y + this.topMargin- this.offsety;
        let scheduleUpdate = true;
        this.displayWidth = 0;
        node_.traverse(this.parentTreeNode, function(node:node_){
            if (node != THIS.parentTreeNode){
                let rendercell = node["rendercell"];
                if (rendercell) {
                    let x = xWithoutIndent + node.depth(-2)*THIS.indent;
                    rendercell.coord.copy(PDCoord, x, y, PDCoord.x+PDCoord.width-x, THIS.height, zindex);
                    returnDisplayCellArray.push( rendercell );
                }
                y += THIS.height;
                let el = Element_.elExists(node.label+Tree_.extension);
                if (el) {
                    scheduleUpdate = false;
                    let bound = el.getBoundingClientRect();
                    if (bound.x + bound.width - PDCoord.x > THIS.displayWidth) THIS.displayWidth = bound.x + bound.width - PDCoord.x;
                }
            }
        }, (node:node_)=>!node.collapsed,
        )
        
        if (("ScrollBar" in Render.classes)) {
            // vertical first
            if (y > PDCoord.y + PDCoord.height) {                
                if (!this.scrollbarv) {
                    this.scrollbarv = scrollbar(this.label+"_ScrollBarV", false);
                    this.parentDisplayCell.addComponent(this.scrollbarv);
                }
                this.offsety = this.scrollbarv.update(y, PDCoord.y + PDCoord.height);
            } else {
                if (this.scrollbarv) {
                    this.scrollbarv.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar",this.label+"_ScrollBarV");
                    this.scrollbarv = undefined;
                }
            }
            // horizontal first
            if (this.displayWidth > this.parentDisplayCell.coord.width) {                
                if (!this.scrollbarh) {
                    this.scrollbarh = scrollbar(this.label+"_ScrollBarH", true);
                    this.parentDisplayCell.addComponent(this.scrollbarh);
                }
                this.offsetx = this.scrollbarh.update(this.displayWidth, this.parentDisplayCell.coord.width);
            } else {
                if (this.scrollbarh) {
                    this.scrollbarh.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar",this.label+"_ScrollBarH");
                    this.scrollbarh = undefined;
                }
            }
        }
        if (scheduleUpdate) Render.scheduleUpdate();
        return returnDisplayCellArray;
    };
    delete(){}
}
Render.register("Tree_", Tree_);