// import {Base} from './Base';
// import {DisplayCell, I} from './DisplayCell';
// import {Coord} from './Coord';
// import {events, Events} from './Events';
// import {Css, css} from './Css';
// import {DisplayGroup, h, v} from './DisplayGroup';
// import {Handler} from './Handler';
// import {Drag} from './Drag';
// import {Pages, P} from './Pages';
// import {HtmlBlock} from './htmlBlock';
// import {Overlay} from './Overlay';
// import {pf} from './PureFunctions';


class TreeNode extends Base {
    static instances:TreeNode[] = [];
    static activeInstances:TreeNode[] = [];
    static defaults = {
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
        super();this.buildBase(...Arguments);

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
    static parentTree(node:TreeNode) {return Tree.byLabel(node.label.split("_")[0]);}
    // static path(node:TreeNode) {
    //     let tree:Tree = TreeNode.parentTree(node);
    //     let returnArray:any[] = [tree]
    //     let labelArray = node.label.split("_");
    //     labelArray.shift();                         // we already have tree, so remove that!
    //     let loopnode = tree.rootTreeNode
    //     while (labelArray.length) {                 // loop indexes in name to get children
    //         returnArray.push(loopnode);
    //         loopnode = loopnode.children[ parseInt( labelArray[0] )-1 ];
    //         labelArray.shift();
    //     }
    //     return returnArray;
    // }
}
function T(...Arguments:any){return new TreeNode(...Arguments)}

class Tree extends Base {
    static instances:Tree[] = [];
    static activeInstances:Tree[] = [];
    static defaultObj = T("Tree",
        I("Tree_TopDisplay", "Top Display"),
        [ T( "Tree_child1", I("Tree_Child1ofTop","Child1ofTop"), // true,       
            [ T("Tree_child1_1", I("Tree_Child1ofChild1","Child1ofChild1") ),
              T("Tree_child1_2", I("Tree_Child2ofChild1","Child2ofChild1") )
            ]
          ),
          T( "Tree_child2", I("Tree_Child2ofTop","Child2ofTop") )]
    )
    static defaults = {
        cellHeight:20, SVGColor:"white", startIndent: 0, indent : 10, collapsePad: 4, collapseSize: 16,
        margin: 2,
    }
    static argMap = {
        string : ["label"],
        number : ["cellHeight", "margin"],
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
    margin: number;

    css:string = ""; // default class(es) for tree items.
    events: Events; // default events for tree items.

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        if (!this.parentDisplayCell) {
            this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`)
        }

        if ("Css" in this.retArgs) // duplicated!!!!!
            for (let css of this.retArgs["Css"]) 
                this.css = (this.css + " "+  (<Css>css).classname).trim();
        if ("string" in this.retArgs && this.retArgs.string.length > 1)
            this.css += " " + this.retArgs.string.splice(1).join(' ');
        // console.log(this.parentDisplayCell)
        let V = v(`${this.label}_rootV`, this.parentDisplayCell.dim, this.margin, this.margin);  ////////////////////////////////////// check this again!
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
                let dx = displaycell.coord.x;

                displaycell.displaygroup.cellArray[0].dim = `${ (current > max) ? current - dx : max - dx}px`;

                // displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current-2 : max}px`;  ///// BINGO!!!!!!!!!

                // console.log(displaycell.label, displaycell.coord);
                // console.log(displaycell.displaygroup.cellArray[0].dim)
            }
        }
        Tree.makeLabel(this);
        this.buildTreeNode(this.rootTreeNode, cellArray);
    }

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
            if (!node.collapsed) DisplayCell.concatArray(cellArray, node.nodeCellArray);     
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
        // if (node.TreeNodeArguments.length > 1){
            arrayOft_ = node.TreeNodeArguments[1];
            for (const singlet_ of arrayOft_) {
                returnArray.push( Tree.makeTreeNodes(singlet_) );
            }
            returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments), returnArray, node.TreeNodeArguments[2])
        // } else {
        //     returnTreeNode = T(node.label,  I(ii.label, ...ii.Arguments) )
        // }
        return returnTreeNode
    }
    static t(...Arguments:any){return new t_(...Arguments)}
    static i(...Arguments:any){return new i_(...Arguments)}
    static onclick(event:MouseEvent){           //Tree.onclick.bind(this)(event)
        let el=this as unknown as HTMLElement;  // this onclick function is called BOUND to element.
        let value = el.getAttribute("pagebutton");
        let valueArray = value.split("|");
        let pagename = valueArray[0];
        let pageNo:string|number = valueArray[1];
        let page = Pages.byLabel(pagename);
        if (page.byLabel(pageNo) == -1) pageNo = parseInt(pageNo)

        Pages.setPage( pagename, pageNo );
        if (HtmlBlock.byLabel(el.id).events && HtmlBlock.byLabel(el.id).events.actions["onclick"]) {
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
    let arrayInArgs:TreeNode[] = [];
    let newT:t_;
    let collapsed:boolean = false;
    if (typeof(Arguments[0]) == "boolean" &&  Arguments[0] == true){
        collapsed = true;
        Arguments.shift();
    }
    for (let index = 0; index < Arguments.length; index++) { // pull array from Arguments
        arg = Arguments[index];
        if (pf.isArray(arg)) {
            arrayInArgs = arg;
            Arguments.splice(index, 1);
            index -= 1;
        }
    }
    let newI:i_ = Tree.i(/* "auto", */...Arguments); // name auto picked up in Tree Constructor.
    newT = Tree.t(newI, arrayInArgs, collapsed)
    // if (arrayInArgs) newT = Tree.t(newI, arrayInArgs);
    // else newT = Tree.t(newI);
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
// export {t_, i_, TI, tree, TreeNode, Tree}