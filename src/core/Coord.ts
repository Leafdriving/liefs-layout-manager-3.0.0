class Point{x:number;y:number}
class Within{
    lockedToScreenSize:boolean;
    x_: number;
    get x(){return (this.lockedToScreenSize) ? 0 : this.x_}
    set x(x:number){this.x_=x}
    y_: number;
    get y(){return (this.lockedToScreenSize) ? 0 : this.y_}
    set y(y:number){this.y_=y}
    width_: number;
    get width(){return (this.lockedToScreenSize) ? Handler.ScreenSizeCoord.width : this.width_}
    set width(width:number){this.width_=width}
    height_: number;
    get height(){return (this.lockedToScreenSize) ? Handler.ScreenSizeCoord.height : this.height_}
    set height(height:number){this.height_=height}

    constructor(...Arguments: any) {}
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
    frozen:boolean;

    #x_: number;
    get x() {return this.#x_ + ((this.offset) ? this.offset.x : 0);}
    set x(x) {if (!this.frozen) this.#x_ = x}
    #y_: number;
    get y() {return this.#y_ + ((this.offset) ? this.offset.y : 0);}
    set y(y) {if (!this.frozen) this.#y_ = y}
    #width_: number;
    get width() {return this.#width_ + ((this.offset) ? this.offset.width : 0);}
    set width(width) {if (!this.frozen) this.#width_ = width}
    #height_: number;
    get height() {return this.#height_ + ((this.offset) ? this.offset.height : 0);}
    set height(height) {if (!this.frozen) this.#height_ = height}

    get x2(){return this.x + this.width}
    get y2(){return this.y + this.height}

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
    mergeWithin(p:Coord /* parent Coord */){
        if (!this.frozen) {
            let ax1=p.x, ax2=p.x+p.width, ay1=p.y, ay2=p.y+p.height;
            let bx1=p.within.x, bx2=bx1+p.within.width, by1=p.within.y, by2=by1+p.within.height;
            this.within.x = (ax1 > bx1) ? ax1 : bx1;
            this.within.width = (ax2 < bx2) ? ax2-this.within.x : bx2-this.within.x;
            this.within.y = (ay1 > by1) ? ay1 : by1;
            this.within.height = (ay2 < by2) ? ay2-this.within.y : by2-this.within.y;
        }
        return this;
    }
    applyMargins(left:number = 0, right:number = 0, top:number =0, bottom:number =0){
        this.x += left;
        this.y += top;
        this.width -= (left + right);
        this.height -= (top + bottom);
        return this;
    }
    assign(x=undefined, y=undefined, width=undefined, height=undefined,
            wx=undefined, wy=undefined, wwidth=undefined, wheight=undefined, zindex=undefined){
        if (!this.frozen) {
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
        return this;
    }
    copy(fromCoord:Coord,
        x:number=undefined, y:number=undefined, width:number=undefined, height:number=undefined,
        zindex:number=undefined){
        if (!this.frozen) {
            let noX = (x == undefined);
            this.zindex = (zindex == undefined) ? fromCoord.zindex : zindex;
            this.x = noX ? fromCoord.x : x;
            this.y = noX ? fromCoord.y: y;
            this.width = noX ? fromCoord.width : width;
            this.height = noX ? fromCoord.height : height;
            if (noX) {
                this.within.x = fromCoord.within.x;
                this.within.y = fromCoord.within.y;
                this.within.width = fromCoord.within.width;
                this.within.height = fromCoord.within.height;
            } else this.mergeWithin(fromCoord);
            
        }
        return this;
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
