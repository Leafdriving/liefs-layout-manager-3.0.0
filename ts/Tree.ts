class TreeNode {
    static instances:TreeNode[] = [];
    static byLabel(label:string):TreeNode{
        for (let key in TreeNode.instances)
            if (TreeNode.instances[key].label == label)
                return TreeNode.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `TreeNode_${pf.pad_with_zeroes(TreeNode.instances.length)}`},
    }
    static argMap = {
        DisplayCell : ["labelCell"],
        string : ["label"],
        Props: ["props"],
        Array: ["children"],
        boolean: ["collapsed"]
    }
    label:string;
    collapsed:boolean = false;
    labelCell: DisplayCell;
    props: Props;
    children:TreeNode[];
    horizontalDisplayCell: DisplayCell;
    nodeCellArray : DisplayCell[] = [];

    constructor(...Arguments: any) {
        TreeNode.instances.push(this);
        mf.applyArguments("TreeNode", Arguments, TreeNode.defaults, TreeNode.argMap, this);
        if (this.labelCell.htmlBlock)
            this.labelCell.htmlBlock.hideWidth = this.labelCell.coord.hideWidth = true;
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
        DisplayCell : ["parentDisplayCell"]
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

    constructor(...Arguments: any) {
        Tree.instances.push(this);
        mf.applyArguments("Tree", Arguments, Tree.defaults, Tree.argMap, this);

        if (!this.rootTreeNode){ this.rootTreeNode = Tree.defaultObj;}
        if (!this.parentDisplayCell) {
            this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`)
        }
        this.parentDisplayCell.displaygroup = new DisplayGroup(`${this.label}_rootV`, false);
        // this.parentDisplayCell.preRenderCallback = function(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
        //     if (!Handler.firstRun) {
        //         let bounding:object;
        //         let max=0;
        //         let x2:number;
        //         let elements = document.querySelectorAll("[treenode]");
        //         for (let element of elements) {
        //             bounding = element.getBoundingClientRect();
        //             x2 = bounding["x"] + bounding["width"]
        //             if (x2>max) max=x2;
        //         }
        //         // let within = displaycell.coord.within;
        //         // if (max > (within.x + within.width)){
        //         //     // console.log(true);
        //         //     displaycell.coord.within.width = max - within.x;
        //         // }
                    

        //         console.log(max, displaycell.coord.x+displaycell.coord.width);
        //     }
        // }
        this.buildTreeNode(this.rootTreeNode, this.parentDisplayCell.displaygroup.cellArray);
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
        let cellArray = this.parentDisplayCell.displaygroup.cellArray;
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
    // static temp(cellArray: DisplayCell[]){
    //     for(let cell of cellArray){
    //         console.log(cell.displaygroup.cellArray[2].htmlBlock.innerHTML);
    //     }
    // }
    // buildCallback(node:TreeNode){
        // console.log(this, node);
        // console.log(node.horizontalDisplayCell.displaygroup.cellArray[2].htmlBlock.el);

        // let el=node.horizontalDisplayCell.displaygroup.cellArray[2].htmlBlock.el;
        // let box = el.getBoundingClientRect();
        // let x=box.x, width=box.width, x2=x+width;
        // console.log("");
        // console.log(x, width, x2, node.horizontalDisplayCell.displaygroup.cellArray[2].coord);

    // }
    buildTreeNode(node:TreeNode = this.rootTreeNode, cellArray: DisplayCell[], indent:number = this.startIndent){
        let THIS = this;
        let hasChildren = (node.children) ? ( (node.children.length) ? true : false) : false;
        // node.labelCell.postRenderCallback = function(){THIS.buildCallback(node)}
        node.labelCell.htmlBlock.attributes["treenode"] = "";
        node.horizontalDisplayCell = h(                                 // Horizontal DisplayGroup Containing:
            I(node.label+"_spacer","",`${indent}px`),                                     // spacer First
            I(node.label+"_svg",                                                       // This is the SVG
                (hasChildren) ? this.drawSVG(node.collapsed) : "",
                `${this.collapseSize}px`,
                events({onclick:function(mouseEvent:MouseEvent){        // Event Handler for clicking the SVG
                    THIS.toggleCollapse(node, mouseEvent, this);
                }})
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

    // svgCollapsed() : string{
    //     let X = this.collapsePad;
    //     let Y = (this.cellHeight - this.collapseSize)/2 + this.collapsePad;
    //     let XX = this.collapseSize - X;
    //     let YY = Y + this.collapseSize - 2*this.collapsePad;
    //     let XMID = this.collapseSize/2;
    //     let YMID = this.cellHeight/2;
    //     let C = this.SVGColor;
    //     return `<svg height="${this.cellHeight}" width="${this.collapseSize}">
    //         <polygon points="${X},${Y} ${XX},${YMID} ${X},${YY} ${X},${Y}"
    //         style="fill:${C};stroke:${C};stroke-width:1" />
    //         </svg>`;  
    // }
    // svgExpanded() : string{
    //     let X = this.collapsePad;
    //     let Y = (this.cellHeight - this.collapseSize)/2 + this.collapsePad;
    //     let XX = this.collapseSize - X;
    //     let YY = Y + this.collapseSize - 2*this.collapsePad;
    //     let XMID = this.collapseSize/2;
    //     let YMID = this.cellHeight/2;
    //     let C = this.SVGColor;
    //     return `<svg height="${this.cellHeight}" width="${this.collapseSize}">
    //         <polygon points="${X},${Y} ${XX},${Y} ${XMID},${YY} ${X},${Y}"
    //         style="fill:${C};stroke:${C};stroke-width:1" />
    //         </svg>`;  
    // }




        // let CW = this.checkWidth;
        // let CM = this.checkMargin;
        // let CH = this.cellHeight;
        // let X = CM;
        // let Y = (CH-CW)/2 + CM;
        // let XMAX = CW - CM;
        // let YMAX = CH - (CH-CW)/2 - CM;
        // let XMID = CW/2;
        // let YMID = CH/2;
        // let XX = CW;
        // let YY = CH;
        // let C = this.SVGColor;
        // let NodeClosedRoot = `<svg height="${CH}" width="${CW}">
        //     <polygon points="${X},${Y} ${XMAX},${YMID} ${X},${YMAX} ${X},${Y}"
        //     style="fill:${C};stroke:${C};stroke-width:1" />
        //     </svg>`;
        // let NodeClosed = `<svg height="${CH}" width="${CW-CM}">
        //     <polygon points="${X-CM},${Y} ${XMAX-CM},${YMID} ${X-CM},${YMAX} ${X-CM},${Y}"
        //     style="fill:${C};stroke:${C};stroke-width:1" />
        //     </svg>`;            
        // let openSVG = `<svg height="${CH}" width="${CW}">
        //     <polygon points="${X},${Y} ${XMAX},${Y} ${XMID},${YMAX} ${X},${Y}"
        //     style="fill:${C};stroke:${C};stroke-width:1" />
        //     <line x1="${XMID}" y1="${YMAX}" x2="${XMID}" y2="${YY}" style="stroke:${C};stroke-width:2" />
        //     </svg>`;
        // let midSVGn = `<svg height="${CH}" width="${CW}">
        //     <line x1="${XMID}" y1="0" x2="${XMID}" y2="${YY}" style="stroke:${this.SVGColor};stroke-width:2" />
        //     <line x1="${XMID}" y1="${YMID}" x2="${XX}" y2="${YMID}" style="stroke:${this.SVGColor};stroke-width:2" />
        //     </svg>`;
        // let endSVG = `<svg height="${CH}" width="${CW}">
        //     <line x1="${XMID}" y1="0" x2="${XMID}" y2="${YMID}" style="stroke:${this.SVGColor};stroke-width:2" />
        //     <line x1="${XMID}" y1="${YMID}" x2="${XX}" y2="${YMID}" style="stroke:${this.SVGColor};stroke-width:2" />
        //     </svg>`;

        // let dim = `${this.cellHeight}px`;
        // this.parentDisplayCell.displaygroup = new DisplayGroup(false,
        //     // I("tree1","TreeOne", dim),
        //     h( I("",NodeClosedRoot, `${CW}px`), I("tree1","TreeOne"), dim),
        //     h( I("",openSVG, `${CW}px`), I("tree2","TreeTwo"), dim),
        //     h( I("",midSVGn, `${CW}px`), I("",NodeClosed, `${CW-CM}px`), I("tree3","TreeThree"), dim),
        //     h( I("",endSVG, `${CW}px`), I("tree4","TreeFour"), dim),
        //     I("tree5","TreeFive", dim),
        //     I("tree6","TreeSix", dim),
        // );
        // // this.parentDisplayCell = v(this.label);