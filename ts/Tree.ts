class TreeNode {
    static instances:TreeNode[] = [];
    static byLabel(label:string):TreeNode{
        for (let key in TreeNode.instances)
            if (TreeNode.instances[key].label == label)
                return TreeNode.instances[key];
        return undefined;
    }
    static defaults = {
        // label : function(){return `TreeNode_${pf.pad_with_zeroes(TreeNode.instances.length)}`},
    }
    static argMap = {
        DisplayCell : ["labelCell"],
        string : ["label"],
        Array: ["children"],
        boolean: ["collapsed"]
    }
    label:string;
    collapsed:boolean = false;
    labelCell: DisplayCell;
    children:TreeNode[];
    
    horizontalDisplayCell: DisplayCell;
    nodeCellArray : DisplayCell[] = [];

    constructor(...Arguments: any) {
        TreeNode.instances.push(this);
        mf.applyArguments("TreeNode", Arguments, TreeNode.defaults, TreeNode.argMap, this);
        if (this.labelCell.htmlBlock)
            this.labelCell.htmlBlock.hideWidth = this.labelCell.coord.hideWidth = true;
        if (this.labelCell && !this.label) this.label = this.labelCell.label;
    }
    visibleChildren(noChildren = 0):number {
        if (!this.collapsed && this.children)
            for (let child of this.children) 
                noChildren += child.visibleChildren(1);
        return noChildren;
    }
    addDisplayCells(newCellArray: DisplayCell[] = [], isFirst: boolean = true) : DisplayCell[]{
        if (!isFirst) newCellArray.push( this.horizontalDisplayCell );
        if (!this.collapsed && this.children) {
            for (let childNode of this.children) {
                newCellArray = childNode.addDisplayCells(newCellArray, false)
            }
        }
        return newCellArray;
    }
}
function T(...Arguments:any){return new TreeNode(...Arguments)}

class Props {
    static instances:Props[] = [];
    static byLabel(label:string):Props{
        for (let key in Props.instances)
            if (Props.instances[key].label == label)
                return Props.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Prop_${pf.pad_with_zeroes(Props.instances.length)}`},
    }
    static argMap = {
        string : ["label"],
    }
    label:string;
    cellArray: DisplayCell[];
    constructor(...Arguments: any) {
        Props.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Prop");
        mf.applyArguments("Prop", Arguments, Props.defaults, Props.argMap, this);
        if ("DisplayCell" in retArgs) this.cellArray = retArgs["DisplayCell"];
    }
}
function props(...Arguments:any) {return new Props(...Arguments);}


class Tree {
    static instances:Tree[] = [];
    static byLabel(label:string):Tree{
        for (let key in Tree.instances)
            if (Tree.instances[key].label == label)
                return Tree.instances[key];
        return undefined;
    }
    static defaultObj = T("Tree",
        I("Tree_TopDisplay", "Top Display"),
        props(I("Tree_TopDisplay_prop1", "prop1"), I("Tree_TopDisplay_prop2", "prop2")),
        [ T( "Tree_child1", I("Tree_Child1ofTop","Child1ofTop"), // true,       
            [ T("Tree_child1_1", I("Tree_Child1ofChild1","Child1ofChild1") ),
              T("Tree_child1_2", I("Tree_Child2ofChild1","Child2ofChild1") )
            ]
          ),
          T( "Tree_child2", I("Tree_Child2ofTop","Child2ofTop") )]
    )
    static defaults = {
        label : function(){return `Tree_${pf.pad_with_zeroes(Tree.instances.length)}`},
        cellHeight:20, SVGColor:"white", startIndent: 0, indent : 10, collapsePad: 4, collapseSize: 16,
    }
    static argMap = {
        string : ["label"],
        number : ["cellHeight"],
        TreeNode : ["rootTreeNode"],
        DisplayCell : ["parentDisplayCell"],
        Events : ["events"],
        t_ : ["t_instance"],
    }
    collapseSize: number;
    collapsePad: number;
    startIndent: number;
    indent: number;
    label:string;
    parentDisplayCell : DisplayCell;
    rootTreeNode:TreeNode;
    cellHeight:number;
    SVGColor:string;
    coord: Coord;
    t_instance: t_;

    css:string = ""; // default class(es) for tree items.
    events: Events; // default events for tree items.

    constructor(...Arguments: any) {
        Tree.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Tree");
        mf.applyArguments("Tree", Arguments, Tree.defaults, Tree.argMap, this);


        if (!this.parentDisplayCell) {
            this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`)
        }

        if ("Css" in retArgs) // duplicated!!!!!
            for (let css of retArgs["Css"]) 
                this.css = (this.css + " "+  (<Css>css).classname).trim();
        if ("string" in retArgs && retArgs.string.length > 1)
            this.css += " " + retArgs.string.splice(1).join(' ');

        let V = v(`${this.label}_rootV`, this.parentDisplayCell.dim, 2, 2);
        let cellArray = V.displaygroup.cellArray;
        this.parentDisplayCell.displaygroup = new DisplayGroup(`${this.label}_rootH`, V);

        if (this.t_instance && !this.rootTreeNode){
            // console.log("Froud t_!");
            this.rootTreeNode = Tree.autoLabelTreenodes(this.label, this.t_instance)
        }
        if (!this.rootTreeNode){ this.rootTreeNode = Tree.defaultObj;}

        this.parentDisplayCell.preRenderCallback = function(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
            if (!Handler.firstRun) {
                let bounding:object;
                let max=0;
                let x2:number;
                let elements = document.querySelectorAll("[treenode]");
                for (let element of elements) {
                    bounding = element.getBoundingClientRect();
                    x2 = bounding["x"] + bounding["width"]
                    if (x2>max) max=x2;
                }
                let current = displaycell.coord.x + displaycell.coord.width;
                displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current-2 : max}px`;
            }
        }
        this.buildTreeNode(this.rootTreeNode, cellArray);
    }
    // autoLabel(node = this.rootTreeNode, newLabel=`${this.label}`){
    //     // node.label = node.labelCell.label = node.labelCell.htmlBlock.label = newLabel;
    //     node.label = newLabel;
    //     if (node.labelCell) {
    //         node.labelCell.label = newLabel;
    //         if (node.labelCell.htmlBlock)
    //             node.labelCell.htmlBlock.label = newLabel;
    //     }
        
    //     for (const key in node.children)
    //         this.autoLabel(node.children[key], `${newLabel}_${key}`);
    // }
    drawSVG(collapsed: boolean) : string{
        let X = this.collapsePad;
        let Y = (this.cellHeight - this.collapseSize)/2 + this.collapsePad;
        let XX = this.collapseSize - X;
        let YY = Y + this.collapseSize - 2*this.collapsePad;
        let XMID = this.collapseSize/2;
        let YMID = this.cellHeight/2;
        let C = this.SVGColor;
        return `<svg height="${this.cellHeight}" width="${this.collapseSize}">` + 
            ( (collapsed) ? `<polygon points="${X},${Y} ${XX},${YMID} ${X},${YY} ${X},${Y}"`
                          : `<polygon points="${X},${Y} ${XX},${Y} ${XMID},${YY} ${X},${Y}"`) +
            `style="fill:${C};stroke:${C};stroke-width:1" />
            </svg>`;  
    }
    toggleCollapse(node:TreeNode, mouseEvent:MouseEvent, el:any) {
        node.collapsed = !node.collapsed;
        node.horizontalDisplayCell.displaygroup.cellArray[1].htmlBlock.innerHTML = this.drawSVG(node.collapsed);
        let cellArray = this.parentDisplayCell.displaygroup.cellArray[0].displaygroup.cellArray;
        let index = cellArray.indexOf(node.horizontalDisplayCell);
        // remove from Dom if collapsed
        if (node.collapsed) {
            for (let displaycell of node.nodeCellArray) {
                Handler.renderDisplayCell(displaycell, undefined, undefined, true);
             }
             node.collapsed = !node.collapsed;
             let noVisibleChildren =  node.visibleChildren();
             node.collapsed = !node.collapsed;

             cellArray.splice(index + 1, noVisibleChildren);
        } else { // Add DisplayCells if Toggled Open
            cellArray.splice( index+1, 0, ...node.addDisplayCells() );
        }
        Handler.update();

    }

    buildTreeNode(node:TreeNode = this.rootTreeNode, cellArray: DisplayCell[], indent:number = this.startIndent){
        let THIS = this;
        let hasChildren = (node.children) ? ( (node.children.length) ? true : false) : false;

        node.labelCell.htmlBlock.attributes["treenode"] = "";
        if (!node.labelCell.htmlBlock.css && this.css.trim()) node.labelCell.htmlBlock.css = this.css.trim();
        if (!node.labelCell.htmlBlock.events && this.events) node.labelCell.htmlBlock.events = this.events;
        node.horizontalDisplayCell = h(                                 // Horizontal DisplayGroup Containing:
            I(node.label+"_spacer","",`${indent}px`),                                     // spacer First
            I(node.label+"_svg",                                                       // This is the SVG
                (hasChildren) ? this.drawSVG(node.collapsed) : "",
                `${this.collapseSize}px`,
                events({onclick:function(mouseEvent:MouseEvent){        // Event Handler for clicking the SVG
                            mouseEvent.preventDefault();
                            THIS.toggleCollapse(node, mouseEvent, this);},
                        onmousedown:function(mouseEvent:MouseEvent){
                            window.addEventListener('selectstart', Drag.disableSelect);
                        },
                        onmouseup:function(mouseEvent:MouseEvent){
                            window.removeEventListener('selectstart', Drag.disableSelect);
                        }
            })
            ),
            node.labelCell,                                             // This is the TreeNode Label
            `${this.cellHeight}px`                                      // Height in pixels of TreeNode
        )
        cellArray.push( node.horizontalDisplayCell );
        if (node.children) {
            for (let childNode of node.children)
                this.buildTreeNode(childNode, node.nodeCellArray, indent + this.indent);
            if (!node.collapsed) pf.concatArray(cellArray, node.nodeCellArray);     
        }
    }
    render(displaycell:DisplayCell){ /* Do Nothing! YAY! */}
    static autoLabelTreenodes(label:string, rootNode:t_ ): TreeNode {
        Tree.autoLabel(rootNode, label);
        // console.log(rootNode);
        return Tree.makeTreeNodes(rootNode);
    }
    static autoLabel(tObj:t_, postfix:string /*="autoTree"*/){
        tObj.label = postfix;
        (<i_>(tObj.TreeNodeArguments[0])).label = postfix;
        if (tObj.TreeNodeArguments.length > 1) {
            let ta:t_[] = <t_[]>(tObj.TreeNodeArguments[1])
            for (let index = 0; index < ta.length; index++) {
                const t = ta[index];
                Tree.autoLabel(t, postfix+"_"+index);
            }
        }
    }
    static makeTreeNodes(node:t_): TreeNode {
        let arrayOft_:t_[];
        let returnArray:TreeNode[] = [];
        let returnTreeNode: TreeNode;
        let ii: i_ = node.TreeNodeArguments[0];
        if (node.TreeNodeArguments.length > 1){
            arrayOft_ = node.TreeNodeArguments[1];
            for (const singlet_ of arrayOft_) {
                returnArray.push( Tree.makeTreeNodes(singlet_) );
            }
            returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments), returnArray)
        } else {
            returnTreeNode = T(node.label,  I(ii.label, ...ii.Arguments) )
        }
        return returnTreeNode
    }
    static t(...Arguments:any){return new t_(...Arguments)}
    static i(...Arguments:any){return new i_(...Arguments)}
    static onclick(event:MouseEvent){           //Tree.onclick.bind(this)(event)
        let el=this as unknown as HTMLElement;  // this onclick function is called BOUND to element.
        let value = el.getAttribute("pagebutton");
        let valueArray = value.split("|");
        let pagename = valueArray[0];
        let pageNo = valueArray[1];

        Pages.setPage( pagename, parseInt(pageNo) );
        if (HtmlBlock.byLabel(el.id).events) {
            var doit = HtmlBlock.byLabel(el.id).events.actions["onclick"].bind(el);
            doit(event);
        }
    }
}
function tree(...Arguments:any){
    let overlay=new Overlay("Tree", ...Arguments);
    let newTree = <Tree>overlay.returnObj;
    let displaycell = newTree.parentDisplayCell;
    // displaycell.overlay = overlay; // remove this one soon
    displaycell.addOverlay(overlay);
    return displaycell;
}
Overlay.classes["Tree"] = Tree;
// this is a messy way to solve a problem...
function TI(...Arguments:any) : t_ /*: TreeNode*/ {
    let arg:any;
    let arrayInArgs:TreeNode[];
    let newT:t_;
    for (let index = 0; index < Arguments.length; index++) { // pull array from Arguments
        arg = Arguments[index];
        if (pf.isArray(arg)) {
            arrayInArgs = arg;
            Arguments.splice(index, 1);
            index -= 1;
        }
    }
    let newI:i_ = Tree.i(/* "auto", */...Arguments); // name auto picked up in Tree Constructor.
    if (arrayInArgs) newT = Tree.t(newI, arrayInArgs);
    else newT = Tree.t(newI);
    return newT
}
class i_{
    label:string;
    Arguments:any[];
    constructor(...Arguments:any){this.Arguments = Arguments}
}
class t_{
    label:string;
    TreeNodeArguments:any[];
    ItemArguments:any[];
    constructor(...Arguments:any){this.TreeNodeArguments = Arguments}
}