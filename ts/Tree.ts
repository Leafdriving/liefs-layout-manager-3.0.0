const defaultArgMap:ArgMap = {
    string : ["label"],
    other: ["hello"]
}

class Tree_ extends Base {
    static labelNo = 0;
    static instances:Tree_[] = [];
    static activeInstances:Tree_[] = [];
    static toggleCollapse(el:HTMLElement, node:node_, mouseEvent:MouseEvent){
        if (!node.collapsed) node.ParentNodeTree.derenderChildren(node);
        node.collapsed = !node.collapsed;
        let iconDisplayCell:DisplayCell = DisplayCell.byLabel(`${node.label}_icon`);
        iconDisplayCell.htmlBlock.innerHTML = (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon;
        Render.update();
    }
    static onNodeCreation(node:node_){
        let nodeLabel = I(`${node.label}_node`, `${node.label}`,
                            node.ParentNodeTree.css,
                            node.ParentNodeTree.events);
        nodeLabel.coord.hideWidth = true;                            
        node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
                                (node.children.length) ?
                                    I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`,
                                        (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon,
                                        node.ParentNodeTree.iconClass,
                                        events({onclick:function(mouseEvent:MouseEvent){ Tree_.toggleCollapse(this, node,mouseEvent) }})
                                    )
                                :   I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`),
                                nodeLabel
                            );
                        }
    static defaults = {height:20, indent:6, onNodeCreation:Tree_.onNodeCreation, topMargin:2, sideMargin:0, tabSize:8,
                        collapsedIcon:DefaultTheme.rightArrowSVG("arrowIcon"), expandedIcon:DefaultTheme.downArrowSVG("arrowIcon"),
                        iconClass: DefaultTheme.arrowSVGCss.classname, offsetx:0, offsety:0}
    static argMap = {
        string : ["label", "css"],
        DisplayCell: ["parentDisplayCell"],
        function: ["onNodeCreation"],
        number: ["height", "indent"],
        Css: ["Css"],
        Events: ["events"],
        node_: ["rootNode"], 
    }
    Arguments:any;
    retArgs:ArgsObj;   // <- this will appear

    renderNode:node_; // render node

    label:string;
    collapsedIcon: string;
    expandedIcon: string;
    iconClass: string;
    offsetx:number;
    offsety:number;

    rootNode: node_; // = new node("Root");
    height:number;
    css:string;
    Css:Css;
    indent:number;

    parentDisplayCell:DisplayCell;
    events: Events;
    offset:number;
    finalParentDisplayCellWidth:number;
    node_arg_map:ArgMap;
    topMargin:number;
    sideMargin:number;
    tabSize:number;
    preRenderCallback:Function;

    scrollbarh:ScrollBar;
    scrollbarv:ScrollBar;
    onNodeCreation:(node: node_) => void;

    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        let THIS = this;
        if (this.Css && !this.css) {
            //console.log("Here", this.Css)
            this.css = this.Css.classname;
        }
        if (this.rootNode)
            node_.traverse( this.rootNode, function(node:node_){
                                node.ParentNodeTree = THIS;
                                THIS.onNodeCreation(node);
                            });
        else {
            this.rootNode = new node_(...Arguments)
            this.rootNode.ParentNodeTree = this;
            this.onNodeCreation(this.rootNode);
            this.rootNode.ParentNodeTree = THIS;
        }
        if (this.node_arg_map) node_.argMap = this.node_arg_map;
    }

    newRoot(node:node_){
        let THIS = this;
        this.derender(this.rootNode);
        this.rootNode = node;
        node_.traverse(this.rootNode, function(node:node_){
            node.ParentNodeTree = THIS;
            THIS.onNodeCreation(node);
        } );
    }
    root(...Arguments:any){
        this.rootNode = new node_(...Arguments)
        return this.rootNode;
    }
    log() {
        this.rootNode.log()
    }
    derender(node:node_) {
        node_.traverse( node, function traverseFunction(node:node_){Render.update(node.displaycell, true);})        
    }
    derenderChildren(node:node_){
        for (let index = 0; index < node.children.length; index++)
            this.derender(node.children[index]);
    }
    static Render(thisTree:Tree_, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        if (thisTree.preRenderCallback) thisTree.preRenderCallback();
        // console.log("render Tree")
        let THIS:Tree_ = thisTree;
        let PDScoord = THIS.parentDisplayCell.coord;
        let x_= PDScoord.x + THIS.sideMargin - thisTree.offsetx;
        let y_= PDScoord.y + THIS.topMargin;
        let max_x2:number = 0;
        let renderChildren = new RenderChildren;
        zindex += Render.zIncrement;
        //node.log();

        node_.traverse( THIS.rootNode,
            function traverseFunction(node:node_){
                let x = x_ + (node.depth()-1)*THIS.tabSize;
                let y = y_;
                let width = PDScoord.width// - x;
                let height = THIS.height;
                node.displaycell.coord.assign(x, y, width, height,
                                            //undefined, undefined, undefined, undefined,
                                            PDScoord.x, PDScoord.y, PDScoord.width, PDScoord.height,
                                            Handler.currentZindex + Handler.zindexIncrement);
                y_ += THIS.height;

                renderChildren.RenderSibling(node.displaycell, derender);
                
                let cellArray = node.displaycell.displaygroup.cellArray;
                let el = cellArray[ cellArray.length-1 ].htmlBlock.el;
                if (el) {
                    let bounding = el.getBoundingClientRect();
                    let x2 = bounding["x"] + bounding["width"];
                    if (x2 > max_x2) max_x2 = x2;
                }
                
            },
            function traverseChildren(node: node_) {
                return (!node.collapsed)
            },
        );
        // let [scrollbarh,scrollbarv] = this.getScrollBarsFromOverlays()
        // check horizontal first
        if (max_x2 > (PDScoord.x + PDScoord.width) + 2) { 
            if (!thisTree.scrollbarh) {
                let overlay=new Overlay("ScrollBar", thisTree.parentDisplayCell, true);
                thisTree.scrollbarh = <ScrollBar>overlay.returnObj;
                let parentDisplaycell = thisTree.scrollbarh.parentDisplaycell;
                parentDisplaycell.addOverlay(overlay);
            }
            thisTree.offsetx = thisTree.scrollbarh.update(max_x2);
        } else {
            if (thisTree.scrollbarh) {
                thisTree.scrollbarh.delete();
                thisTree.popOverlay(true);
                thisTree.offsetx = 0;
            }
        }

        return {zindex,
            siblings: renderChildren.siblings};
    }
    popOverlay(ishor:boolean){
        let overlays = this.parentDisplayCell.overlays;
        for (let index = 0; index < overlays.length; index++)
            if (overlays[index].sourceClassName == "ScrollBar")
                if ( (<ScrollBar>overlays[index].returnObj).ishor == ishor)
                    overlays.splice(index, 1)
    }
    getScrollBarsFromOverlays(){
        // console.log("getscrollbars");
        let scrollbarh:ScrollBar, scrollbarv:ScrollBar;
        let scrollbarOverlays:Overlay[] = this.parentDisplayCell.getOverlays("ScrollBar");
        for (let index = 0; index < scrollbarOverlays.length; index++) {
            let scrollbar_ = <ScrollBar>(scrollbarOverlays[index].returnObj);
            if (scrollbar_.ishor) scrollbarh = scrollbar_;
            else scrollbarv = scrollbar_;
        }
        return [scrollbarh, scrollbarv]
    }
}
Render.register("Tree_", Tree_);
function tree(...Arguments:any) {
    let overlay=new Overlay("Tree_", ...Arguments);
    let newTree_ = <Tree_>overlay.returnObj;
    let parentDisplaycell = newTree_.parentDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Tree_"] = Tree_;