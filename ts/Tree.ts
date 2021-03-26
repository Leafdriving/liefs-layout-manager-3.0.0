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
        Handler.update();
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
    onNodeCreation:(node: node_) => void;

    
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        let THIS = this;
        if (this.Css && !this.css) {
            //console.log("Here", this.Css)
            this.css = this.Css.classname;
        }
        if (this.rootNode)
            this.traverse( function(node:node_){
                                node.ParentNodeTree = THIS;
                                THIS.onNodeCreation(node);
                            } );
        else {
            this.rootNode = new node_(...Arguments)
            this.rootNode.ParentNodeTree = this;
            this.onNodeCreation(this.rootNode);
            this.rootNode.ParentNodeTree = THIS;
        }
        if (this.node_arg_map) node_.argMap = this.node_arg_map;
    }

    traverse(traverseFunction:(node: node_) => void,
            node:node_ = this.rootNode,
            traverseChildren:(node: node_)=>boolean = function(){return true},
            traverseNode:(node: node_)=>boolean = function(){return true}
            ) {  // 
        if (traverseNode(node)) {
            traverseFunction(node);                
            if (traverseChildren(node)) {    
                if (node.children)
                    for (let index = 0; index < node.children.length; index++)
                        this.traverse(traverseFunction,
                                        node.children[index],
                                        traverseChildren,
                                        traverseNode);
            }
        }
        if (node.NextSibling) this.traverse(traverseFunction,
                                            node.NextSibling,
                                            traverseChildren,
                                            traverseNode);
    }

    newRoot(node:node_){
        let THIS = this;
        this.derender(this.rootNode);
        this.rootNode = node;
        this.traverse( function(node:node_){
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
        this.traverse(
            function traverseFunction(node:node_){
                Handler.renderDisplayCell(node.displaycell, undefined, undefined, true)
            },
            node
        )        
    }
    derenderChildren(node:node_){
        for (let index = 0; index < node.children.length; index++)
            this.derender(node.children[index]);
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (this.preRenderCallback) this.preRenderCallback();
        // console.log("render Tree")
        let THIS:Tree_ = this;
        let PDScoord = THIS.parentDisplayCell.coord;
        let x_= PDScoord.x + THIS.sideMargin - this.offsetx;
        let y_= PDScoord.y + THIS.topMargin;
        let max_x2:number = 0;
        // let [sx, sy]=pf.viewport()
        //console.log("parentDisplayCell", THIS.parentDisplayCell.label);
        //PDScoord.log();

        this.traverse(
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
                Handler.renderDisplayCell(node.displaycell, undefined, undefined, derender)
                
                let cellArray = node.displaycell.displaygroup.cellArray;
                let el = cellArray[ cellArray.length-1 ].htmlBlock.el;
                // console.log(el)
                let bounding = el.getBoundingClientRect();
                // console.log(bounding)
                let x2 = bounding["x"] + bounding["width"];
                if (x2 > max_x2) max_x2 = x2;
            },
            THIS.rootNode,
            function traverseChildren(node: node_) {
                return (!node.collapsed)
            },
        );
        let [scrollbarh,scrollbarv] = this.getScrollBarsFromOverlays()
        // console.log(max_x2, PDScoord.x + PDScoord.width)
        // check horizontal first
        if (max_x2 > (PDScoord.x + PDScoord.width) + 2) { 
            if (!scrollbarh) {
                scrollbar(this.parentDisplayCell, true);
                [scrollbarh,scrollbarv] = this.getScrollBarsFromOverlays(); // defines scrollbarh
            }
            this.offsetx = scrollbarh.update(max_x2); ////
        } else {
            if (scrollbarh) {
                scrollbarh.delete();
                this.popOverlay(true);
                this.offsetx = 0;
            }
        }
    }
    popOverlay(ishor:boolean){
        let overlays = this.parentDisplayCell.overlays;
        for (let index = 0; index < overlays.length; index++)
            if (overlays[index].sourceClassName == "ScrollBar")
                if ( (<ScrollBar>overlays[index].returnObj).ishor == ishor)
                    overlays.splice(index, 1)
    }
    getScrollBarsFromOverlays(){
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
function tree(...Arguments:any) {
    let overlay=new Overlay("Tree_", ...Arguments);
    let newTree_ = <Tree_>overlay.returnObj;
    let parentDisplaycell = newTree_.parentDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Tree_"] = Tree_;