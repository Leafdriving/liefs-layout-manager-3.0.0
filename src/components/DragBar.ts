/**
 * Drag bar
 */
class DragBar extends Component {
    static labelNo = 0;
    static instances:{[key: string]: DragBar;} = {};
    static activeInstances:{[key: string]: DragBar;} = {};
    static defaults:{[key: string]: any;} = {width:5}
    static argMap:{[key: string]: Array<string>;} = {
        string : ["label"],
        number : ["min","max","width"],
    }
    static horCss = css("db_hor","background-color:black;cursor: ew-resize;");
    static verCss = css("db_ver","background-color:black;cursor: ns-resize;");
    /**
     * Parents display group
     * @param THIS 
     * @returns display group 
     */
    static parentDisplayGroup(THIS:DragBar) : [DisplayGroup, boolean]{
        let node = THIS.parentDisplayCell.node;
        let prev:node_;
        do {
            prev = node;
            node = node.ParentNode;
        }
        while (node != undefined && Arguments_.typeof(node.Arguments[1]) != "DisplayGroup" );
        THIS.parentDisplayGroupChild = prev.Arguments[1];
        let displaygroup = <DisplayGroup>node.Arguments[1];

        return (node) ? [node.Arguments[1], (displaygroup.children.indexOf(THIS.parentDisplayCell) == displaygroup.children.length-1)]
                      : [undefined, undefined];
    }
    /**
     * Drag start dim of drag bar
     */
    static dragStartDim:number;
    /**
     * Determines whether down on
     * @param e 
     */
    static onDown(e:MouseEvent|PointerEvent){
        let THIS = this as unknown as DragBar;
        DragBar.dragStartDim = pf.pxAsNumber(THIS.parentDisplayGroupChild.dim);
    }
    /**
     * Determines whether move on
     * @param e 
     * @param offset 
     */
    static onMove(e:MouseEvent|PointerEvent, offset:{x:number, y:number}){
        let THIS = this as unknown as DragBar;
        let newdim = DragBar.dragStartDim + (((THIS.isHor) ? offset.x : offset.y) * ((THIS.isLast) ? -1 : 1));
        if (newdim > THIS.max) newdim = THIS.max;
        if (newdim < THIS.min) newdim = THIS.min;
        THIS.parentDisplayGroupChild.dim = `${newdim}px`;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether up on
     * @param e 
     * @param offset 
     */
    static onUp(e:MouseEvent|PointerEvent, offset:{x:number, y:number}){DragBar.dragStartDim = undefined;}
    node:node_;
    parentDisplayCell:DisplayCell;
    parentDisplayGroup:DisplayGroup;
    parentDisplayGroupChild:DisplayCell;
    children: Component[];
    min:number;
    max:number;
    width:number;
    dragbarDisplayCell:DisplayCell;
    get isHor(){return this.parentDisplayGroup.isHor}
    isLast:boolean;
    /**
     * Creates an instance of drag bar.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        DragBar.makeLabel(this); DragBar.instances[this.label] = this;
        DragBar.instances[this.label] = this;
    }
    /**
     * Renders drag bar
     * @param derender 
     * @param node 
     * @param zindex 
     * @returns render 
     */
    Render(derender:boolean, node:node_, zindex:number):Component[]{
        if (!this.parentDisplayGroup) {
            [this.parentDisplayGroup, this.isLast] = DragBar.parentDisplayGroup(this);
            // console.log(this.label, this.isLast)
            if (this.parentDisplayGroup.margin > 2) this.width = this.parentDisplayGroup.margin;
        }
        if (!this.dragbarDisplayCell)
            this.dragbarDisplayCell = I(`${this.label}_Dragbar`,(this.isHor) ? DragBar.horCss : DragBar.verCss);
        this.dragbarDisplayCell.addEvents({ondrag:[DragBar.onDown.bind(this), DragBar.onMove.bind(this), DragBar.onUp.bind(this)]})
        this.children = [this.dragbarDisplayCell];
       
        let PDcoord = this.parentDisplayCell.coord;
        let PDG = this.parentDisplayGroup;
        let x = (this.isHor) ? ((this.isLast) ? PDcoord.x - PDG.margin
                                              : PDcoord.x2 + PDG.margin - this.width)
                             : PDcoord.x;
        let y = (this.isHor) ? PDcoord.y 
                             : ((this.isLast) ? PDcoord.y - PDG.margin
                                              : PDcoord.y2 + PDG.margin - this.width);
        let width = (this.isHor) ? this.width : PDcoord.width;
        let height = (this.isHor) ? PDcoord.height : this.width;
        this.dragbarDisplayCell.coord.copy(PDG.parentDisplayCell.coord, x, y, width, height);
        return [this.dragbarDisplayCell];
    };
}
let dragbar = function(...Arguments:any){return new DragBar(...Arguments)}
Render.register("DragBar", DragBar);