class BindHandler extends Base {
    static labelNo = 0;
    static instances:BindHandler[] = [];
    static activeInstances:BindHandler[] = [];
    static defaults = {}
    static argMap = {
        string : ["label"],
        DisplayCell: ["parentDisplayCell"],
        Handler: ["handler"]
    }
    // retArgs:ArgsObj;   // <- this will appear
    parentDisplayCell: DisplayCell;
    handler: Handler;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        BindHandler.makeLabel(this);
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (!this.handler.coord) this.handler.coord = new Coord();
        this.handler.coord.copy( this.parentDisplayCell.coord );
    }
    static Render(bindHandler:BindHandler, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        if (!bindHandler.handler.coord) bindHandler.handler.coord = new Coord();
        bindHandler.handler.coord.copy( bindHandler.parentDisplayCell.coord );
        return {zindex}
    }
}
Render.register("BindHandler", BindHandler);
// function bindHandler(...Arguments:any) {
//     let overlay=new Overlay("BindHandler", ...Arguments);
//     let newBindHandler = <BindHandler>overlay.returnObj;
//     let parentDisplaycell = newBindHandler.parentDisplaycell;
//     // parentDisplaycell.overlay = overlay; // remove this line soon
//     parentDisplaycell.addOverlay(overlay);
//     return parentDisplaycell;
// }
function bindHandler(...Arguments:any): DisplayCell {return Overlay.new("BindHandler", ...Arguments);}
Overlay.classes["BindHandler"] = BindHandler;