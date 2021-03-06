/**
 * Drag bar
 */
class DragBar extends Component {
    /**
     * Creates an instance of drag bar.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        DragBar.makeLabel(this);
        DragBar.instances[this.label] = this;
        DragBar.instances[this.label] = this;
    }
    /**
     * Parents display group
     * @param THIS
     * @returns display group
     */
    static parentDisplayGroup(THIS) {
        let node = THIS.parentDisplayCell.node;
        let prev;
        do {
            prev = node;
            node = node.ParentNode;
        } while (node != undefined && Arguments_.typeof(node.Arguments[1]) != "DisplayGroup");
        THIS.parentDisplayGroupChild = prev.Arguments[1];
        let displaygroup = node.Arguments[1];
        return (node) ? [node.Arguments[1], (displaygroup.children.indexOf(THIS.parentDisplayCell) == displaygroup.children.length - 1)]
            : [undefined, undefined];
    }
    /**
     * Determines whether down on
     * @param e
     */
    static onDown(e) {
        let THIS = this;
        DragBar.dragStartDim = pf.pxAsNumber(THIS.parentDisplayGroupChild.dim);
    }
    /**
     * Determines whether move on
     * @param e
     * @param offset
     */
    static onMove(e, offset) {
        let THIS = this;
        let newdim = DragBar.dragStartDim + (((THIS.isHor) ? offset.x : offset.y) * ((THIS.isLast) ? -1 : 1));
        if (newdim > THIS.max)
            newdim = THIS.max;
        if (newdim < THIS.min)
            newdim = THIS.min;
        THIS.parentDisplayGroupChild.dim = `${newdim}px`;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether up on
     * @param e
     * @param offset
     */
    static onUp(e, offset) { DragBar.dragStartDim = undefined; }
    get isHor() { return this.parentDisplayGroup.isHor; }
    /**
     * Renders drag bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        if (!this.parentDisplayGroup) {
            [this.parentDisplayGroup, this.isLast] = DragBar.parentDisplayGroup(this);
            // console.log(this.label, this.isLast)
            if (this.parentDisplayGroup.margin > 2)
                this.width = this.parentDisplayGroup.margin;
        }
        if (!this.dragbarDisplayCell)
            this.dragbarDisplayCell = I(`${this.label}_Dragbar`, (this.isHor) ? DragBar.horCss : DragBar.verCss);
        this.dragbarDisplayCell.addEvents({ ondrag: [DragBar.onDown.bind(this), DragBar.onMove.bind(this), DragBar.onUp.bind(this)] });
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
    }
    ;
}
DragBar.labelNo = 0;
DragBar.instances = {};
DragBar.activeInstances = {};
DragBar.defaults = { width: 5 };
DragBar.argMap = {
    string: ["label"],
    number: ["min", "max", "width"],
};
DragBar.horCss = css("db_hor", "background-color:black;cursor: ew-resize;");
DragBar.verCss = css("db_ver", "background-color:black;cursor: ns-resize;");
let dragbar = function (...Arguments) { return new DragBar(...Arguments); };
Render.register("DragBar", DragBar);
