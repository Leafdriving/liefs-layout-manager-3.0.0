class node_ extends Base {
    // static Proxy(THIS:node_){
    //     return new Proxy(THIS, {
    //         get: function(target:node_, name:string) {
    //             if (name in target) {
    //                 return target[name];
    //             } else {
    //                 if (name == "$" || name == "node")
    //                     return target;
    //                 let siblingObject = target.siblingObject();
    //                 if (name in siblingObject)
    //                     return siblingObject[name];
    //             }
    //         }
    //       })
    // }
    static labelNo = 0;
    static instances:Tree_[] = [];
    static activeInstances:Tree_[] = [];
    static defaults = {collapsed:false}
    static argMap:ArgMap = {
        string : ["label"],
    }
    static newNode(THIS:node_, ...Arguments:any){
        let newnode = new node_(...Arguments);
        newnode.ParentNodeTree = THIS.ParentNodeTree;
        if (THIS.ParentNodeTree) THIS.ParentNodeTree.onNodeCreation(newnode);
        return newnode;
    }
    renderx:number;
    rendery:number;
    retArgs:ArgsObj;   // <- this will appear
    label:string;
    Arguments:any;

    ParentNodeTree: Tree_ = undefined;
    ParentNode:node_ = undefined;
    PreviousSibling:node_ = undefined;
    NextSibling:node_ = undefined;
    collapsed: boolean;

    displaycell:DisplayCell;

    children:node_[] = [];
    // get $(){return node_.Proxy(this)}
    // get node(){return node_.Proxy(this)}
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        this.Arguments = Arguments;
    }
    depth(node:node_ = this, deep=0){while(node){deep += 1;node = node.parent()};return deep;}
    siblingObject(top:node_ = this, returnObject = {}){
        while (top.PreviousSibling) {top = top.PreviousSibling}
        do {
            returnObject[top.label] = top
            top = top.NextSibling
        } while (top);
        return returnObject;
    }
    newChild(...Arguments:any): node_{
        let newNode:node_;
        if (typeof(Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            newNode = <node_>(Arguments[0]);
        else 
            newNode = node_.newNode(this, ...Arguments);
        newNode.ParentNodeTree = this.ParentNodeTree;
        newNode.ParentNode = this;
        if (this.children.length) {
            this.children[this.children.length-1].NextSibling = newNode
            newNode.PreviousSibling = this.children[this.children.length-1];
        }
        this.children.push(newNode);
        return newNode;
        
    }
    newSibling(...Arguments:any): node_ { 
        let previousNextSibling = this.NextSibling;
        if (typeof(Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            this.NextSibling = <node_>(Arguments[0]);
        else
            this.NextSibling = node_.newNode(this, ...Arguments);
        this.NextSibling.ParentNodeTree = this.ParentNodeTree;
        this.NextSibling.PreviousSibling = this;
        this.NextSibling.ParentNode = this.ParentNode;

        this.NextSibling.NextSibling = previousNextSibling;
        return this.NextSibling;
    }
    topSibling(){
        let returnNode:node_ = this;
        while (returnNode.previousSibling()) returnNode = returnNode.previousSibling()
        return returnNode;
    }
    bottomSibling(){
        let returnNode:node_ = this;
        while (returnNode.nextSibling()) returnNode = returnNode.nextSibling()
        return returnNode;        
    }
    pop(){
        let index = this.ParentNode.children.indexOf(this);
        this.ParentNode.children.splice(index, 1);
        if (this.PreviousSibling) {
            this.PreviousSibling.NextSibling = this.NextSibling;
            if (this.NextSibling)
                this.NextSibling.PreviousSibling = this.PreviousSibling;
        } else if (this.NextSibling) this.NextSibling.PreviousSibling = undefined;
        this.PreviousSibling = this.NextSibling = this.ParentNode = undefined;
        return this;
    }
    nextSibling(){return this.NextSibling}
    previousSibling(){return this.PreviousSibling}
    firstChild(){return this.children[0]}
    done(){return this.ParentNodeTree}
    root(){
        let node:node_ = this;
        while(node.parent()){node = node.parent()}
        return node
    }
    parent(){return this.ParentNode}
    // collapse(value:boolean = true){this.collapsed = value;}
    log(){
        if (this.children.length) {
            console.group(this.label);
            for (let index = 0; index < this.children.length; index++) 
                this.children[index].log();
            console.groupEnd();
        } else console.log(this.label);
        if (this.NextSibling) this.NextSibling.log();
    }
    byLabel(label:string){return node_.byLabel(label);}
}

function sample(){
    let sampleTree = new Tree_("SampleTree", /*function(node:node_){}*/);
    let node = sampleTree.rootNode;
    node.newChild("One")
            .newChild("One-A")
                .newChild("One-A-1")
                .newSibling("One-A-2")
            .parent()
            .newSibling("One-B")
                .newChild("One-B-1")
                .newSibling("One-B-2")
                    .newChild("One-B-2-1")
                .parent()
            .parent()
            .newSibling("One-C")
        .parent()
        .newSibling("Two")
            .newChild("Two-A")
                .newChild("Two-A-1")
            .parent()
            .newSibling("Two-B")
        .parent()
        .newSibling("Three")
    return sampleTree;
}

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
        //node.displaycell.coord.hideWidth = true;
                        }
    static defaults = {height:20, indent:6, onNodeCreation:Tree_.onNodeCreation, topMargin:2, sideMargin:0, tabSize:8,
                        collapsedIcon:DefaultTheme.rightArrowSVG, expandedIcon:DefaultTheme.downArrowSVG,
                        iconClass: DefaultTheme.arrowSVGCss.classname}
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
    onNodeCreation:(node: node_) => void;

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
        let THIS:Tree_ = this;
        let PDScoord = THIS.parentDisplayCell.coord;
        let x_=PDScoord.x + THIS.sideMargin
        let y_=PDScoord.y + THIS.topMargin;

        this.traverse(
            function traverseFunction(node:node_){
                let x = x_ + (node.depth()-1)*THIS.tabSize;
                let y = y_;
                let width = PDScoord.width - x;
                let height = THIS.height;
                node.displaycell.coord.assign(x, y, width, height,
                                            PDScoord.x, PDScoord.y, PDScoord.width, PDScoord.height,
                                            Handler.currentZindex + Handler.zindexIncrement);
                y_ += THIS.height;
                Handler.renderDisplayCell(node.displaycell, undefined, undefined, derender)
            },
            THIS.rootNode,
            function traverseChildren(node: node_) {
                console.log("TraverseChildrenCalled returning", !node.collapsed)
                return (!node.collapsed)
            },
            // function traverseNode(node: node_) {return true}

        );
        //console.log(THIS.rootNode.displaycell)
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



/*
let newTree = nodeTree("TreeName")
            .sibling("ONE")
                .child("Child of One")
            .parent()
            .sibling("TWO")
            .sibling("Three")
                .child("Child of Three")
                .sibling("2nd Child of Three")
            .parent()
            .sibling("Four")
*/

// class TreeNode extends Base {
//     static instances:TreeNode[] = [];
//     static activeInstances:TreeNode[] = [];
//     static defaults = {
//     }
//     static argMap = {
//         DisplayCell : ["labelCell"],
//         string : ["label"],
//         Array: ["children"],
//         boolean: ["collapsed"]
//     }
//     label:string;
//     collapsed:boolean = false;
//     labelCell: DisplayCell;
//     children:TreeNode[];
    
//     horizontalDisplayCell: DisplayCell;
//     nodeCellArray : DisplayCell[] = [];

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);

//         if (this.labelCell.htmlBlock)
//             this.labelCell.htmlBlock.hideWidth = this.labelCell.coord.hideWidth = true;
//         if (this.labelCell && !this.label) this.label = this.labelCell.label;
//     }
//     visibleChildren(noChildren = 0):number {
//         if (!this.collapsed && this.children)
//             for (let child of this.children) 
//                 noChildren += child.visibleChildren(1);
//         return noChildren;
//     }
//     addDisplayCells(newCellArray: DisplayCell[] = [], isFirst: boolean = true) : DisplayCell[]{
//         if (!isFirst) newCellArray.push( this.horizontalDisplayCell );
//         if (!this.collapsed && this.children) {
//             for (let childNode of this.children) {
//                 newCellArray = childNode.addDisplayCells(newCellArray, false)
//             }
//         }
//         return newCellArray;
//     }
//     static parentTree(node:TreeNode) {return Tree.byLabel(node.label.split("_")[0]);}
//     // static path(node:TreeNode) {
//     //     let tree:Tree = TreeNode.parentTree(node);
//     //     let returnArray:any[] = [tree]
//     //     let labelArray = node.label.split("_");
//     //     labelArray.shift();                         // we already have tree, so remove that!
//     //     let loopnode = tree.rootTreeNode
//     //     while (labelArray.length) {                 // loop indexes in name to get children
//     //         returnArray.push(loopnode);
//     //         loopnode = loopnode.children[ parseInt( labelArray[0] )-1 ];
//     //         labelArray.shift();
//     //     }
//     //     return returnArray;
//     // }
// }
// function T(...Arguments:any){return new TreeNode(...Arguments)}

// class Tree extends Base {
//     static instances:Tree[] = [];
//     static activeInstances:Tree[] = [];
//     static defaultObj = T("Tree",
//         I("Tree_TopDisplay", "Top Display"),
//         [ T( "Tree_child1", I("Tree_Child1ofTop","Child1ofTop"), // true,       
//             [ T("Tree_child1_1", I("Tree_Child1ofChild1","Child1ofChild1") ),
//               T("Tree_child1_2", I("Tree_Child2ofChild1","Child2ofChild1") )
//             ]
//           ),
//           T( "Tree_child2", I("Tree_Child2ofTop","Child2ofTop") )]
//     )
//     static defaults = {
//         cellHeight:20, SVGColor:"white", startIndent: 0, indent : 10, collapsePad: 4, collapseSize: 16,
//         margin: 2,
//     }
//     static argMap = {
//         string : ["label"],
//         number : ["cellHeight", "margin"],
//         TreeNode : ["rootTreeNode"],
//         DisplayCell : ["parentDisplayCell"],
//         Events : ["events"],
//         t_ : ["t_instance"],
//     }
//     collapseSize: number;
//     collapsePad: number;
//     startIndent: number;
//     indent: number;
//     label:string;
//     parentDisplayCell : DisplayCell;
//     rootTreeNode:TreeNode;
//     cellHeight:number;
//     SVGColor:string;
//     coord: Coord;
//     t_instance: t_;
//     margin: number;

//     css:string = ""; // default class(es) for tree items.
//     events: Events; // default events for tree items.

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);

//         if (!this.parentDisplayCell) {
//             this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`)
//         }

//         if ("Css" in this.retArgs) // duplicated!!!!!
//             for (let css of this.retArgs["Css"]) 
//                 this.css = (this.css + " "+  (<Css>css).classname).trim();
//         if ("string" in this.retArgs && this.retArgs.string.length > 1)
//             this.css += " " + this.retArgs.string.splice(1).join(' ');
//         // console.log(this.parentDisplayCell)
//         let V = v(`${this.label}_rootV`, this.parentDisplayCell.dim, this.margin, this.margin);  ////////////////////////////////////// check this again!
//         let cellArray = V.displaygroup.cellArray;
//         this.parentDisplayCell.displaygroup = new DisplayGroup(`${this.label}_rootH`, V);

//         if (this.t_instance && !this.rootTreeNode){
//             // console.log("Froud t_!");
//             this.rootTreeNode = Tree.autoLabelTreenodes(this.label, this.t_instance)
//         }
//         if (!this.rootTreeNode){ this.rootTreeNode = Tree.defaultObj;}

//         this.parentDisplayCell.preRenderCallback = function(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
//             if (!Handler.firstRun) {
//                 let bounding:object;
//                 let max=0;
//                 let x2:number;
//                 let elements = document.querySelectorAll("[treenode]");
//                 for (let element of elements) {
//                     bounding = element.getBoundingClientRect();
//                     x2 = bounding["x"] + bounding["width"]
//                     if (x2>max) max=x2;
//                 }
//                 let current = displaycell.coord.x + displaycell.coord.width;
//                 let dx = displaycell.coord.x;

//                 displaycell.displaygroup.cellArray[0].dim = `${ (current > max) ? current - dx : max - dx}px`;

//                 // displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current-2 : max}px`;  ///// BINGO!!!!!!!!!

//                 // console.log(displaycell.label, displaycell.coord);
//                 // console.log(displaycell.displaygroup.cellArray[0].dim)
//             }
//         }
//         Tree.makeLabel(this);
//         this.buildTreeNode(this.rootTreeNode, cellArray);
//     }

//     drawSVG(collapsed: boolean) : string{
//         let X = this.collapsePad;
//         let Y = (this.cellHeight - this.collapseSize)/2 + this.collapsePad;
//         let XX = this.collapseSize - X;
//         let YY = Y + this.collapseSize - 2*this.collapsePad;
//         let XMID = this.collapseSize/2;
//         let YMID = this.cellHeight/2;
//         let C = this.SVGColor;
//         return `<svg height="${this.cellHeight}" width="${this.collapseSize}">` + 
//             ( (collapsed) ? `<polygon points="${X},${Y} ${XX},${YMID} ${X},${YY} ${X},${Y}"`
//                           : `<polygon points="${X},${Y} ${XX},${Y} ${XMID},${YY} ${X},${Y}"`) +
//             `style="fill:${C};stroke:${C};stroke-width:1" />
//             </svg>`;  
//     }
//     toggleCollapse(node:TreeNode, mouseEvent:MouseEvent, el:any) {
//         node.collapsed = !node.collapsed;
//         node.horizontalDisplayCell.displaygroup.cellArray[1].htmlBlock.innerHTML = this.drawSVG(node.collapsed);
//         let cellArray = this.parentDisplayCell.displaygroup.cellArray[0].displaygroup.cellArray;
//         let index = cellArray.indexOf(node.horizontalDisplayCell);
//         // remove from Dom if collapsed
//         if (node.collapsed) {
//             for (let displaycell of node.nodeCellArray) {
//                 Handler.renderDisplayCell(displaycell, undefined, undefined, true);
//              }
//              node.collapsed = !node.collapsed;
//              let noVisibleChildren =  node.visibleChildren();
//              node.collapsed = !node.collapsed;

//              cellArray.splice(index + 1, noVisibleChildren);
//         } else { // Add DisplayCells if Toggled Open
//             cellArray.splice( index+1, 0, ...node.addDisplayCells() );
//         }
//         Handler.update();

//     }

//     buildTreeNode(node:TreeNode = this.rootTreeNode, cellArray: DisplayCell[], indent:number = this.startIndent){
//         let THIS = this;
//         let hasChildren = (node.children) ? ( (node.children.length) ? true : false) : false;

//         node.labelCell.htmlBlock.attributes["treenode"] = "";
//         if (!node.labelCell.htmlBlock.css && this.css.trim()) node.labelCell.htmlBlock.css = this.css.trim();
//         if (!node.labelCell.htmlBlock.events && this.events) node.labelCell.htmlBlock.events = this.events;
//         node.horizontalDisplayCell = h(                                 // Horizontal DisplayGroup Containing:
//             I(node.label+"_spacer","",`${indent}px`),                                     // spacer First
//             I(node.label+"_svg",                                                       // This is the SVG
//                 (hasChildren) ? this.drawSVG(node.collapsed) : "",
//                 `${this.collapseSize}px`,
//                 events({onclick:function(mouseEvent:MouseEvent){        // Event Handler for clicking the SVG
//                             mouseEvent.preventDefault();
//                             THIS.toggleCollapse(node, mouseEvent, this);},
//                         onmousedown:function(mouseEvent:MouseEvent){
//                             window.addEventListener('selectstart', Drag.disableSelect);
//                         },
//                         onmouseup:function(mouseEvent:MouseEvent){
//                             window.removeEventListener('selectstart', Drag.disableSelect);
//                         }
//             })
//             ),
//             node.labelCell,                                             // This is the TreeNode Label
//             `${this.cellHeight}px`                                      // Height in pixels of TreeNode
//         )
//         cellArray.push( node.horizontalDisplayCell );
//         if (node.children) {
//             for (let childNode of node.children)
//                 this.buildTreeNode(childNode, node.nodeCellArray, indent + this.indent);
//             if (!node.collapsed) DisplayCell.concatArray(cellArray, node.nodeCellArray);     
//         }
//     }
//     render(displaycell:DisplayCell){ /* Do Nothing! YAY! */}
//     static autoLabelTreenodes(label:string, rootNode:t_ ): TreeNode {
//         Tree.autoLabel(rootNode, label);
//         // console.log(rootNode);
//         return Tree.makeTreeNodes(rootNode);
//     }
//     static autoLabel(tObj:t_, postfix:string /*="autoTree"*/){
//         tObj.label = postfix;
//         (<i_>(tObj.TreeNodeArguments[0])).label = postfix;
//         if (tObj.TreeNodeArguments.length > 1) {
//             let ta:t_[] = <t_[]>(tObj.TreeNodeArguments[1])
//             for (let index = 0; index < ta.length; index++) {
//                 const t = ta[index];
//                 Tree.autoLabel(t, postfix+"_"+index);
//             }
//         }
//     }
//     static makeTreeNodes(node:t_): TreeNode {
//         let arrayOft_:t_[];
//         let returnArray:TreeNode[] = [];
//         let returnTreeNode: TreeNode;
//         let ii: i_ = node.TreeNodeArguments[0];
//         // if (node.TreeNodeArguments.length > 1){
//             arrayOft_ = node.TreeNodeArguments[1];
//             for (const singlet_ of arrayOft_) {
//                 returnArray.push( Tree.makeTreeNodes(singlet_) );
//             }
//             returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments), returnArray, node.TreeNodeArguments[2])
//         // } else {
//         //     returnTreeNode = T(node.label,  I(ii.label, ...ii.Arguments) )
//         // }
//         return returnTreeNode
//     }
//     static t(...Arguments:any){return new t_(...Arguments)}
//     static i(...Arguments:any){return new i_(...Arguments)}
//     static onclick(event:MouseEvent){           //Tree.onclick.bind(this)(event)
//         let el=this as unknown as HTMLElement;  // this onclick function is called BOUND to element.
//         let value = el.getAttribute("pagebutton");
//         let valueArray = value.split("|");
//         let pagename = valueArray[0];
//         let pageNo:string|number = valueArray[1];
//         let page = Pages.byLabel(pagename);
//         if (page.byLabel(pageNo) == -1) pageNo = parseInt(pageNo)

//         Pages.setPage( pagename, pageNo );
//         if (HtmlBlock.byLabel(el.id).events && HtmlBlock.byLabel(el.id).events.actions["onclick"]) {
//             var doit = HtmlBlock.byLabel(el.id).events.actions["onclick"].bind(el);
//             doit(event);
//         }
//     }
// }
// function tree(...Arguments:any){
//     let overlay=new Overlay("Tree", ...Arguments);
//     let newTree = <Tree>overlay.returnObj;
//     let displaycell = newTree.parentDisplayCell;
//     // displaycell.overlay = overlay; // remove this one soon
//     displaycell.addOverlay(overlay);
//     return displaycell;
// }
// Overlay.classes["Tree"] = Tree;
// // this is a messy way to solve a problem...
// function TI(...Arguments:any) : t_ /*: TreeNode*/ {
//     let arg:any;
//     let arrayInArgs:TreeNode[] = [];
//     let newT:t_;
//     let collapsed:boolean = false;
//     if (typeof(Arguments[0]) == "boolean" &&  Arguments[0] == true){
//         collapsed = true;
//         Arguments.shift();
//     }
//     for (let index = 0; index < Arguments.length; index++) { // pull array from Arguments
//         arg = Arguments[index];
//         if (pf.isArray(arg)) {
//             arrayInArgs = arg;
//             Arguments.splice(index, 1);
//             index -= 1;
//         }
//     }
//     let newI:i_ = Tree.i(/* "auto", */...Arguments); // name auto picked up in Tree Constructor.
//     newT = Tree.t(newI, arrayInArgs, collapsed)
//     // if (arrayInArgs) newT = Tree.t(newI, arrayInArgs);
//     // else newT = Tree.t(newI);
//     return newT
// }
// class i_{
//     label:string;
//     Arguments:any[];
//     constructor(...Arguments:any){this.Arguments = Arguments}
// }
// class t_{
//     label:string;
//     TreeNodeArguments:any[];
//     ItemArguments:any[];
//     constructor(...Arguments:any){this.TreeNodeArguments = Arguments}
// }
// export {t_, i_, TI, tree, TreeNode, Tree}