// import { Base } from './Base';
// import {Css, css} from './Css';
// import {I, DisplayCell} from './DisplayCell';
// import {DisplayGroup, h, v} from './DisplayGroup';
// import {Coord} from './Coord';
// import {Events, events} from './Events';
// import {Handler} from './Handler';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';

class DragBar extends Base {
    // static horCss = css("db_hor","background-color:black;cursor: ew-resize;");
    // static verCss = css("db_ver","background-color:black;cursor: ns-resize;");
    static instances:DragBar[] = [];
    static activeInstances:DragBar[] = [];
    static defaults = {
        horcss : DefaultTheme.horCss,
        vercss : DefaultTheme.verCss
    }
    static argMap = {
        string : ["label"],
        DisplayCell : ["parentDisplaycell"],
        number: ["min", "max", "pxsize"],
        Css: ["horcss", "vercss"]
    }
    label:string;
    parentDisplaycell: DisplayCell;
    parentDisplaygroup: DisplayGroup;
    displaycell: DisplayCell;
    startpos:number;
    min:number;
    max:number;
    pxsize:number;
    horcss:Css;
    vercss:Css;
    ishor:boolean;
    isLast:boolean;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        let dragbar=this;
        DragBar.makeLabel(this);
        this.displaycell = I(`${this.label}_dragbar`,"",
            events({ondrag: {onDown :function(xmouseDiff:object){
                                if (pf.isTypePercent(dragbar.parentDisplaycell.dim)) {
                                    dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplaycell);
                                }
                                dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplaycell.dim);
                            },
                            onMove :function(xmouseDiff:object){
                                let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"]: xmouseDiff["y"])*((dragbar.isLast) ? -1 :1);
                                if (newdim > dragbar.max) newdim = dragbar.max;
                                if (newdim < dragbar.min) newdim = dragbar.min;
                                dragbar.parentDisplaycell.dim = `${newdim}px`;
                                Handler.update();
                            },
                            // onUp: function(ouxmouseDifftput:object){}
                     } }),
        );
        
    }
    // render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
    //     // console.log(parentDisplaygroup);
    //     if (!this.parentDisplaygroup) this.parentDisplaygroup = parentDisplaygroup;
    //     let dragbar:DragBar = this;
    //     let dragcell:DisplayCell = dragbar.displaycell;
    //     let ishor:boolean = parentDisplaygroup.ishor;
    //     dragbar.ishor = ishor;
    //     let pxsize:number = (dragbar.pxsize) ? dragbar.pxsize : ((ishor) ? parentDisplaygroup.marginHor : parentDisplaygroup.marginVer)
    //     let isLast:boolean = (index == parentDisplaygroup.cellArray.length-1) ? true : false;
    //     dragbar.isLast = isLast;
    //     let pcoord:Coord = displaycell.coord;
    //     let x:number= (ishor) ? ((isLast)? pcoord.x-pxsize:pcoord.x+pcoord.width) : pcoord.x;
    //     let y:number= (ishor) ? pcoord.y : ((isLast)? pcoord.y-pxsize:pcoord.y+pcoord.height);
    //     let width:number = (ishor) ? pxsize : pcoord.width;
    //     let height:number = (ishor) ? pcoord.height : pxsize;
    //     dragcell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex + Handler.zindexIncrement);
    //     dragcell.htmlBlock.css = (ishor) ? dragbar.horcss.classname : dragbar.vercss.classname;
    //     if (parentDisplaygroup.coord.isCoordCompletelyOutside( dragcell.coord )) derender = true;
    //     Handler.renderDisplayCell(dragcell, parentDisplaygroup, undefined, derender)
    // }
    static Render(dragbar_:DragBar, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        let displaycell = <DisplayCell>(node.parent().Arguments[1])
        let parentDisplaygroup = node.parent().parent().Arguments[1];
        let index = parentDisplaygroup.cellArray.indexOf(displaycell);
        zindex += Render.zIncrement;

        // console.log(parentDisplaygroup);
        if (!dragbar_.parentDisplaygroup) dragbar_.parentDisplaygroup = parentDisplaygroup;
        let dragbar:DragBar = dragbar_;
        let dragcell:DisplayCell = dragbar.displaycell;
        let ishor:boolean = parentDisplaygroup.ishor;
        dragbar.ishor = ishor;
        let pxsize:number = (dragbar.pxsize) ? dragbar.pxsize : ((ishor) ? parentDisplaygroup.marginHor : parentDisplaygroup.marginVer)
        let isLast:boolean = (index == parentDisplaygroup.cellArray.length-1) ? true : false;
        dragbar.isLast = isLast;
        let pcoord:Coord = displaycell.coord;
        let x:number= (ishor) ? ((isLast)? pcoord.x-pxsize:pcoord.x+pcoord.width) : pcoord.x;
        let y:number= (ishor) ? pcoord.y : ((isLast)? pcoord.y-pxsize:pcoord.y+pcoord.height);
        let width:number = (ishor) ? pxsize : pcoord.width;
        let height:number = (ishor) ? pcoord.height : pxsize;
        dragcell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, zindex);
        dragcell.htmlBlock.css = (ishor) ? dragbar.horcss.classname : dragbar.vercss.classname;
        if (parentDisplaygroup.coord.isCoordCompletelyOutside( dragcell.coord )) derender = true;

        let renderChildren = new RenderChildren;
        renderChildren.RenderSibling(dragcell, derender);
        // Handler.renderDisplayCell(dragcell, parentDisplaygroup, undefined, derender)

        return {zindex,
            siblings: renderChildren.siblings};
    }
}
Render.register("DragBar", DragBar);
function dragbar(...Arguments:any) {
    let overlay=new Overlay("DragBar", ...Arguments);
    let newDragBar = <DragBar>overlay.returnObj;
    let parentDisplaycell = newDragBar.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["DragBar"] = DragBar;
// export {dragbar, DragBar}