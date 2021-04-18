class Point{x:number;y:number}
class Within{
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(...Arguments: any) {
        // [this.x, this.y, this.width, this.height] = Arguments_.argumentsByType(Arguments).string
    }
    reset(){this.x = this.y = this.width = this.height = undefined};
    toString:Function;
}
class Coord extends Base {
    static instances:Coord[] = [];
    static activeInstances:Coord[] = [];

    static defaults = {x : 0, y : 0, width : 0, height: 0, zindex: 0};
    static argMap = {
        string : ["label"],
        number : ["x", "y", "width", "height", "zindex"],
        boolean : ["hideWidth"]
    };
    static CopyArgMap = {Within : ["Within"],Coord : ["Coord"], boolean:["isRoot"],
                         number : ["x", "y", "width", "height", "zindex"]};

    label:string;

    #x_: number;
    get x() {return this.#x_ + ((this.offset) ? this.offset.x : 0);}
    set x(x) {this.#x_ = x}
    #y_: number;
    get y() {return this.#y_ + ((this.offset) ? this.offset.y : 0);}
    set y(y) {this.#y_ = y}
    #width_: number;
    get width() {return this.#width_ + ((this.offset) ? this.offset.width : 0);}
    set width(width) {this.#width_ = width}
    #height_: number;
    get height() {return this.#height_ + ((this.offset) ? this.offset.height : 0);}
    set height(height) {this.#height_ = height}

    zindex: number;
    within: Within = new Within();
    hideWidth: boolean;
    offset: {x:number, y:number, width:number, height:number};

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        
        Coord.makeLabel(this);
    }
    setOffset(x=0, y=0, width=0, height=0){
        if (x==0 && y==0 && width ==0 && height == 0) this.offset = undefined;
        else this.offset = {x, y, width, height};
    }
    cropWithin(within:Coord|Within = this.within){
        let x=this.x, y=this.y, width=this.width, height=this.height, x2=x+width, y2=y+height;
        let wx=within.x, wy=within.y, wwidth=within.width, wheight=within.height, wx2=wx+wwidth, wy2=wy+wheight;
        let bx = (x > wx) ? x : wx;
        let sx2 = (x2 < wx2) ? x2 : wx2;
        let by = (y > wy) ? y : wy;
        let sy2 = (y2 < wy2) ? y2 : wy2;
        this.within.x = bx;
        this.within.width = sx2-bx;
        this.within.y = by;
        this.within.height = sy2-by;
    }
    applyMargins(left:number = 0, right:number = 0, top:number =0, bottom:number =0){
        this.x += left; this.within.x += left;
        this.y += top; this.within.y += top;
        this.width -= (left + right); this.within.width -= (left + right);
        this.height -= (top + bottom); this.within.height -= (top + bottom);
    }
    assign(x=undefined, y=undefined, width=undefined, height=undefined,
            wx=undefined, wy=undefined, wwidth=undefined, wheight=undefined, zindex=undefined){
        if (x != undefined) this.x = x;
        if (y != undefined) this.y = y;
        if (width != undefined) this.width = width;
        if (height != undefined) this.height = height;

        if (wx != undefined) this.within.x = wx;
        if (wy != undefined) this.within.y = wy;
        if (wwidth != undefined) this.within.width = wwidth;
        if (wheight != undefined) this.within.height = wheight;

        if (zindex != undefined) this.zindex = zindex;
    }
    copy(fromCoord:Coord){
        this.x = fromCoord.x;
        this.y = fromCoord.y;
        this.width = fromCoord.width;
        this.height = fromCoord.height;
        this.zindex = fromCoord.zindex;
        this.within.x = fromCoord.within.x;
        this.within.y = fromCoord.within.y;
        this.within.width = fromCoord.within.width;
        this.within.height = fromCoord.within.height;
    }
    log(){
        console.log(`x=${this.x}`, `y=${this.y}`, `width=${this.width}`, `height=${this.height}`);
        console.log(`wx=${this.within.x}`, `wy=${this.within.y}`, `wwidth=${this.within.width}`, `wheight=${this.within.height}`);
    }

    isCoordCompletelyOutside(WITHIN: Coord|Within = this.within){
        return ((WITHIN.x + WITHIN.width < this.x) ||
                (WITHIN.x > this.x + this.width) ||
                (WITHIN.y + WITHIN.height < this.y) ||
                (WITHIN.y > this.y + this.height)) 
    }
    derender(derender:boolean) {return derender || this.isCoordCompletelyOutside()}
    isPointIn(x:number, y:number): boolean {return (this.x <= x && x <= this.x+this.width && this.y <= y && y <= this.y+this.height)}

}
// export {Point, Within, Coord}
