// // import { Base } from './Base';
// // import {Css, css} from './Css';
// // import {I, DisplayCell} from './DisplayCell';
// // import {DisplayGroup, h, v} from './DisplayGroup';
// // import {Coord} from './Coord';
// // import {Events, events} from './Events';
// // import {Handler} from './Handler';
// // import {Overlay} from './Overlay';
// // import {mf, pf} from './PureFunctions';

// class DragBar extends Base {
//     // static horCss = css("db_hor","background-color:black;cursor: ew-resize;");
//     // static verCss = css("db_ver","background-color:black;cursor: ns-resize;");
//     static instances:DragBar[] = [];
//     static activeInstances:DragBar[] = [];
//     static defaults = {
//         horcss : DefaultTheme.horCss,
//         vercss : DefaultTheme.verCss
//     }
//     static argMap = {
//         string : ["label"],
//         DisplayCell : ["parentDisplayCell"],
//         number: ["min", "max", "pxsize"],
//         Css: ["horcss", "vercss"]
//     }
//     static debounce = 200;

//     renderNode:node_; // render node

//     label:string;
//     parentDisplayCell: DisplayCell;
//     parentDisplaygroup: DisplayGroup;
//     displaycell: DisplayCell;
//     startpos:number;
//     min:number;
//     max:number;
//     pxsize:number;
//     horcss:Css;
//     vercss:Css;
//     ishor:boolean;
//     isLast:boolean;
//     lasttime:number;
//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         let dragbar=this;
        
//         if (!this.label && this.parentDisplayCell) this.label = this.parentDisplayCell.label + "_DragBar";
//         else DragBar.makeLabel(this);
        
//         this.displaycell = I(`${this.label}_dragbar`,"",
//             events({ondrag: {onDown :function(xmouseDiff:object){
//                                 if (pf.isTypePercent(dragbar.parentDisplayCell.dim)) {
//                                     dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplayCell);
//                                 }
//                                 dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplayCell.dim);
//                             },
//                             onMove :function(xmouseDiff:object){
//                                 let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"]: xmouseDiff["y"])*((dragbar.isLast) ? -1 :1);
//                                 if (newdim > dragbar.max) newdim = dragbar.max;
//                                 if (newdim < dragbar.min) newdim = dragbar.min;
//                                 dragbar.parentDisplayCell.dim = `${newdim}px`;

//                                 let thisTime = new Date().getTime();
//                                 if (!(this.lasttime && (thisTime - this.lasttime < DragBar.debounce))) {
//                                     Render.update();
//                                     this.lasttime = thisTime;
//                                 }
//                             },
//                             // onUp: function(ouxmouseDifftput:object){}
//                      } }),
//         );
        
//     }
//     delete(){
//         this.parentDisplayCell.popOverlay("DragBar");
//         DragBar.pop(this);

//         setTimeout(() => {
//             Render.update(this.displaycell, true);
//         }, 0);
//     }

//     static Render(dragbar_:DragBar, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
//         let displaycell = <DisplayCell>(node.parent().Arguments[1])
//         let parentDisplaygroup = node.parent().parent().Arguments[1];
//         if (BaseF.typeof(parentDisplaygroup) != "DisplayGroup"){
//             parentDisplaygroup = node.parent().parent().parent().Arguments[1];
//             if (BaseF.typeof(parentDisplaygroup) != "DisplayGroup") {
//                 console.log("Can Not Find Parent Display Group!");
//                 return {zindex};
//             }
//         }
//         let index = parentDisplaygroup.cellArray.indexOf(displaycell);
//         zindex += Render.zIncrement;

//         // console.log(parentDisplaygroup);
//         if (!dragbar_.parentDisplaygroup) dragbar_.parentDisplaygroup = parentDisplaygroup;
//         let dragbar:DragBar = dragbar_;
//         let dragcell:DisplayCell = dragbar.displaycell;
//         let ishor:boolean = parentDisplaygroup.ishor;
//         dragbar.ishor = ishor;
//         let pxsize:number = (dragbar.pxsize) ? dragbar.pxsize : ((ishor) ? parentDisplaygroup.marginHor : parentDisplaygroup.marginVer)
//         let isLast:boolean = (index == parentDisplaygroup.cellArray.length-1) ? true : false;
//         dragbar.isLast = isLast;
//         let pcoord:Coord = displaycell.coord;
//         let x:number= (ishor) ? ((isLast)? pcoord.x-pxsize:pcoord.x+pcoord.width) : pcoord.x;
//         let y:number= (ishor) ? pcoord.y : ((isLast)? pcoord.y-pxsize:pcoord.y+pcoord.height);
//         let width:number = (ishor) ? pxsize : pcoord.width;
//         let height:number = (ishor) ? pcoord.height : pxsize;
//         dragcell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, zindex);
//         dragcell.htmlBlock.css = (ishor) ? dragbar.horcss.classname : dragbar.vercss.classname;
//         if (parentDisplaygroup.coord.isCoordCompletelyOutside( dragcell.coord )) derender = true;

//         let renderChildren = new RenderChildren;
//         renderChildren.RenderSibling(dragcell, derender);
//         // Handler.renderDisplayCell(dragcell, parentDisplaygroup, undefined, derender)

//         return {zindex,
//             siblings: renderChildren.siblings};
//     }
// }
// Render.register("DragBar", DragBar);
// function dragbar(...Arguments:any): DisplayCell {return Overlay.new("DragBar", ...Arguments);}
// Overlay.classes["DragBar"] = DragBar;
// // function dragbar(...Arguments:any) {
// //     let overlay=new Overlay("DragBar", ...Arguments);
// //     let newDragBar = <DragBar>overlay.returnObj;
// //     let parentDisplaycell = newDragBar.parentDisplaycell;
// //     // parentDisplaycell.overlay = overlay; // remove this line soon
// //     parentDisplaycell.addOverlay(overlay);
// //     return parentDisplaycell;
// // }