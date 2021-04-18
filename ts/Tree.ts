// const defaultArgMap:ArgMap = {
//     string : ["label"],
//     other: ["hello"]
// }

// class Tree_ extends Base {
//     static labelNo = 0;
//     static instances:Tree_[] = [];
//     static activeInstances:Tree_[] = [];
//     static toggleCollapse(el:HTMLElement, node:node_, mouseEvent:MouseEvent){
//         if (!node.collapsed) node.ParentNodeTree.derenderChildren(node);
//         node.collapsed = !node.collapsed;
//         let iconDisplayCell:DisplayCell = DisplayCell.byLabel(`${node.label}_icon`);
//         iconDisplayCell.htmlBlock.innerHTML = (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon;
//         Render.update();
//     }
//     static onNodeCreation(node:node_){
//         // console.log("node:", node.label, node.displaycell)
//         let nodeLabel:DisplayCell
//         if (node.displaycell) {
//             nodeLabel = node.displaycell;
//             if (nodeLabel.htmlBlock.css.trim() == "") nodeLabel.htmlBlock.css = node.ParentNodeTree.css;
//             nodeLabel.htmlBlock.events = node.ParentNodeTree.events;
//         } else nodeLabel = I(`${node.label}_node`, `${node.label}`,
//                             node.ParentNodeTree.css,
//                             node.ParentNodeTree.events);
//         nodeLabel.coord.hideWidth = true;                            
//         node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
//                                 (node.children.length) ?
//                                     I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`,
//                                         (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon,
//                                         node.ParentNodeTree.iconClass,
//                                         events({onclick:function(mouseEvent:MouseEvent){ Tree_.toggleCollapse(this, node,mouseEvent) }})
//                                     )
//                                 :   I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`),
//                                 nodeLabel
//                             );
//                         }
//     static defaults = {height:20, indent:6, onNodeCreation:Tree_.onNodeCreation, topMargin:2, sideMargin:0, tabSize:8,
//                         collapsedIcon:DefaultTheme.rightArrowSVG("arrowIcon"), expandedIcon:DefaultTheme.downArrowSVG("arrowIcon"),
//                         iconClass: DefaultTheme.arrowSVGCss.classname, offsetx:0, offsety:0}
//     static argMap = {
//         string : ["label", "css"],
//         DisplayCell: ["parentDisplayCell"],
//         function: ["onNodeCreation"],
//         number: ["height", "indent"],
//         Css: ["Css"],
//         Events: ["events"],
//         node_: ["rootNode"], 
//     }
//     Arguments:any;
//     retArgs:ArgsObj;   // <- this will appear

//     renderNode:node_; // render node

//     label:string;
//     collapsedIcon: string;
//     expandedIcon: string;
//     iconClass: string;
//     offsetx:number;
//     offsety:number;

//     rootNode: node_; // = new node("Root");
//     height:number;
//     css:string;
//     Css:Css;
//     indent:number;

//     parentDisplayCell:DisplayCell;
//     events: Events;
//     offset:number;
//     finalParentDisplayCellWidth:number;
//     node_arg_map:ArgMap;
//     topMargin:number;
//     sideMargin:number;
//     tabSize:number;
//     preRenderCallback:Function;

//     scrollbarh:ScrollBar;
//     scrollbarv:ScrollBar;
//     onNodeCreation:(node: node_) => void;

//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         let THIS = this;
//         if (this.Css && !this.css) {
//             //console.log("Here", this.Css)
//             this.css = this.Css.classname;
//         }
//         if (this.rootNode)
//             node_.traverse( this.rootNode, function(node:node_){
//                                 node.ParentNodeTree = THIS;
//                                 THIS.onNodeCreation(node);
//                             });
//         else {
//             this.rootNode = new node_(...Arguments)
//             this.rootNode.ParentNodeTree = this;
//             this.onNodeCreation(this.rootNode);
//             this.rootNode.ParentNodeTree = THIS;
//         }
//         if (this.node_arg_map) node_.argMap = this.node_arg_map;
//     }
//     newRoot(node:node_){
//         let THIS = this;
//         this.derender(this.rootNode);
//         this.rootNode = node;
//         node_.traverse(this.rootNode, function(node:node_){
//             node.ParentNodeTree = THIS;
//             THIS.onNodeCreation(node);
//         } );
//     }
//     root(...Arguments:any){
//         this.rootNode = new node_(...Arguments)
//         return this.rootNode;
//     }
//     log() {
//         this.rootNode.log()
//     }
//     derender(node:node_) {
//         node_.traverse( node, function traverseFunction(node:node_){Render.update(node.displaycell, true);})        
//     }
//     derenderChildren(node:node_){
//         for (let index = 0; index < node.children.length; index++)
//             this.derender(node.children[index]);
//     }    

//     static Render(thisTree:Tree_, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
//         if (thisTree.preRenderCallback) {
//             console.log("Tree Prerender Callback Called");
//             thisTree.preRenderCallback();
//         }

//         let THIS:Tree_ = thisTree;
//         let PDScoord = THIS.parentDisplayCell.coord;
//         let x_= PDScoord.x + THIS.sideMargin ;//- thisTree.offsetx;
//         let y_= PDScoord.y + THIS.topMargin ;
//         let max_x2:number = 0;
//         let renderChildren = new RenderChildren;
//         zindex += Render.zIncrement;

//         node_.traverse( THIS.rootNode,
//             function traverseFunction(node:node_){
//                 let x = x_ + (node.depth()-1)*THIS.tabSize - thisTree.offsetx;
//                 let y = y_- thisTree.offsety;
//                 let width = PDScoord.width
//                 let height = THIS.height;
//                 node.displaycell.coord.assign(x, y, width, height,
//                                             PDScoord.x, PDScoord.y, PDScoord.width, PDScoord.height,
//                                             Handler.currentZindex + Handler.zindexIncrement);
//                 node.displaycell.coord.within = THIS.parentDisplayCell.coord.within
//                 y_ += THIS.height;

//                 renderChildren.RenderSibling(node.displaycell, derender);
                
//                 let cellArray = node.displaycell.displaygroup.cellArray;
//                 let el = cellArray[ cellArray.length-1 ].htmlBlock.el;
//                 if (el) {
//                     let bounding = el.getBoundingClientRect();
//                     let x2 = bounding["x"] + bounding["width"];
//                     if (x2 > max_x2) max_x2 = x2;
//                 }                
//             },
//             function traverseChildren(node: node_) {
//                 return (!node.collapsed)
//             },
//         );
//         if (y_ + THIS.height > PDScoord.y + PDScoord.height) {
//             PDScoord.width = PDScoord.width - ScrollBar.defaults.barSize;
//             PDScoord.within.width = PDScoord.width;
//             if (!thisTree.scrollbarv) {
//                 thisTree.scrollbarv = new ScrollBar(`${thisTree.label}_scrollbarv`, false);
//                 // console.log(thisTree.scrollbarv);
//             }
//             thisTree.offsety = thisTree.scrollbarv.update(y_ + THIS.height, PDScoord.y + PDScoord.height,
//                 PDScoord.x + PDScoord.width,
//                 PDScoord.y,
//                 thisTree.scrollbarv.barSize,
//                 PDScoord.height)
            
//             renderChildren.RenderSibling(thisTree.scrollbarv.scrollbarDisplayCell, derender);
//         } else {
//             if (thisTree.scrollbarv) {
//                 thisTree.scrollbarv.delete();
//                 thisTree.offsety = 0;
//             }
//         }
//         if (max_x2 >= PDScoord.x + PDScoord.width) {
//             PDScoord.height = PDScoord.height - ScrollBar.defaults.barSize;
//             PDScoord.within.height = PDScoord.height;
//             if (!thisTree.scrollbarh) {
//                 thisTree.scrollbarh = new ScrollBar(`${thisTree.label}_scrollbarh`, true);
//             }
//             thisTree.offsetx = thisTree.scrollbarh.update(max_x2, PDScoord.x + PDScoord.width,
//                 PDScoord.x,
//                 PDScoord.y + PDScoord.height,
//                 PDScoord.width,
//                 thisTree.scrollbarh.barSize,
//                 )
            
//             renderChildren.RenderSibling(thisTree.scrollbarh.scrollbarDisplayCell, derender);
//         } else {
//             if (thisTree.scrollbarh) {
//                 thisTree.scrollbarh.delete();
//                 thisTree.offsetx = 0;
//             }
//         }

//         return {zindex,
//             siblings: renderChildren.siblings};
//     }

// }
// Render.register("Tree_", Tree_);
// function tree(...Arguments:any): DisplayCell {return Overlay.new("Tree_", ...Arguments)};
// Overlay.classes["Tree_"] = Tree_;





// //let scrollbarh = thisTree.parentDisplayCell.getOverlays("ScrollBar")
//         // max_x2 += ((scrollbarv) ? scrollbarv.barSize:0)
//         // // check horizontal first
//         // if (max_x2 > (PDScoord.x + PDScoord.width) + 2) { 
//         //      if (!thisTree.scrollbarh) {
//         //          //console.log("no way")
//         //          let newOverlay = new Overlay("ScrollBar", "scrollbarh",thisTree.parentDisplayCell, true);
//         //          thisTree.scrollbarh = <ScrollBar>newOverlay.returnObj;
//         //          //console.log("herereere", thisTree.scrollbarh)
//         //      }
//         //     thisTree.offsetx = thisTree.scrollbarh.update(max_x2);
//         // } else {
//         //     if (thisTree.scrollbarh) {
//         //         thisTree.parentDisplayCell.popOverlay("ScrollBar", function (overlay:Overlay){
//         //             return (<ScrollBar>overlay.returnObj).ishor;
//         //         });
//         //         thisTree.scrollbarh.delete();
//         //         thisTree.offsetx = 0;
//         //         thisTree.scrollbarh = undefined;
//         //     }
//         // }
//         // // check vertical second
//         // if (y_ + THIS.height + 100 > boundHeight){
//         //     if (!thisTree.scrollbarv) {
//         //         let newOverlay = new Overlay("ScrollBar", "scrollbarh", thisTree.parentDisplayCell, false);
//         //         thisTree.scrollbarv = <ScrollBar>newOverlay.returnObj;
//         //         // console.log(thisTree.scrollbarv)
//         //     }
//         //     thisTree.offsety = thisTree.scrollbarv.update(y_ + THIS.height + 100);
//         // } else {
//         //     if (thisTree.scrollbarv) {
//         //         thisTree.parentDisplayCell.popOverlay("ScrollBar", function (overlay:Overlay){
//         //             return !((<ScrollBar>overlay.returnObj).ishor)
//         //         });
//         //         thisTree.scrollbarv.delete();
//         //         thisTree.offsety = 0;
//         //         thisTree.scrollbarv = undefined;
//         //     }
//         // }



//             // static getOverlays(thisTree:Tree_){
//     //     let overlayArray = thisTree.parentDisplayCell.getOverlays("ScrollBar");
//     //     let scrollbarh:ScrollBar
//     //     let scrollbarv:ScrollBar
//     //     for (let index = 0; index < overlayArray.length; index++) {
//     //         let overlay = <Overlay>overlayArray[index];
//     //         let scrollbar = <ScrollBar>overlay.returnObj
//     //         if (scrollbar.ishor) {
//     //             if (scrollbarh) console.log("Duplicate Horizontal Scrollbars Found!");
//     //             scrollbarh = scrollbar;
//     //         }
//     //         else {
//     //             if (scrollbarv) console.log("Duplicate Vertical Scrollbars Found!");
//     //             scrollbarv = scrollbar;
//     //         }
//     //     }
//     //     return [scrollbarh, scrollbarv];
//     // }