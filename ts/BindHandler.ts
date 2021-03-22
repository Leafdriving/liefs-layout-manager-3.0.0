class BindHandler extends Base {
    static labelNo = 0;
    static instances:BindHandler[] = [];
    static activeInstances:BindHandler[] = [];
    static defaults = {}
    static argMap = {
        string : ["label"],
        DisplayCell: ["parentDisplaycell"],
        Handler: ["handler"]
    }
    // retArgs:ArgsObj;   // <- this will appear
    parentDisplaycell: DisplayCell;
    handler: Handler;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        BindHandler.makeLabel(this);
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (!this.handler.coord) this.handler.coord = new Coord();
        this.handler.coord.copy( this.parentDisplaycell.coord );
    }

}
function bindHandler(...Arguments:any) {
    let overlay=new Overlay("BindHandler", ...Arguments);
    let newBindHandler = <BindHandler>overlay.returnObj;
    let parentDisplaycell = newBindHandler.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["BindHandler"] = BindHandler;