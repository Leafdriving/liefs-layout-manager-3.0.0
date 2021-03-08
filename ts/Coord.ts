class Point{x:number;y:number}
class Within{
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(...Arguments: any) {
        mf.applyArguments("Within", Arguments, {}, {number : ["x", "y", "width", "height"]}, this);
    }
    clipStyleString(sub: Coord){
        return Coord.clipStyleString(this, sub);
    }
    reset(){this.x = this.y = this.width = this.height = undefined};
}
interface Offset {x:number;y:number;width:number;height:number}
class Coord {
    static instances:Coord[] = [];
    static byLabel(label:string):Coord{
        for (let key in Coord.instances)
            if (Coord.instances[key].label == label)
                return Coord.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Coord_${pf.pad_with_zeroes(Coord.instances.length)}`},
        x : 0, y : 0, width : 0, height: 0, zindex: 0
    };
    static argMap = {
        string : ["label"],
        number : ["x", "y", "width", "height", "zindex"],
        boolean : ["hideWidth"]
    };
    static CopyArgMap = {Within : ["Within"],Coord : ["Coord"], boolean:["isRoot"],
                         number : ["x", "y", "width", "height", "zindex"]};

    label:string;

    x_: number;
    get x() {return this.x_ + ((this.offset) ? this.offset.x : 0);}
    set x(x) {this.x_ = x}
    y_: number;
    get y() {return this.y_ + ((this.offset) ? this.offset.y : 0);}
    set y(y) {this.y_ = y}
    width_: number;
    get width() {return this.width_ + ((this.offset) ? this.offset.width : 0);}
    set width(width) {this.width_ = width}
    height_: number;
    get height() {return this.height_ + ((this.offset) ? this.offset.height : 0);}
    set height(height) {this.height_ = height}

    zindex: number;
    within: Within = new Within();
    isRoot: boolean;
    hideWidth: boolean;
    offset: Offset;

    constructor(...Arguments: any) {
        Coord.instances.push(this);
        mf.applyArguments("Coord", Arguments, Coord.defaults, Coord.argMap, this);
    }
    setOffset(x=0, y=0, width=0, height=0){
        if (x==0 && y==0 && width ==0 && height == 0) this.offset = undefined;
        else this.offset = {x, y, width, height};
    }
    copyWithin(...Arguments:any){
        let possArgs:{x?:number,y?:number,width?:number,height?:number, isRoot?:boolean, Coord?:Coord} = {};
        mf.applyArguments("Coord.copyWithin", Arguments, {isRoot: false}, Coord.CopyArgMap, possArgs);
        let isRoot = possArgs.isRoot;

        if (possArgs.isRoot) {
            for (let key of ["x", "y", "width", "height"]) {
                this.within[key] = this[key];
            }
        } else {
            if ("Coord" in possArgs) {
                let coord = possArgs.Coord
                for (let key of ["x", "y", "width", "height"]) {
                    this.within[key] = coord.within[key];
                }
                let x=this.x, y=this.y, width=this.width, height=this.height, x2=x+width, y2=y+height;
                let wx=this.within.x, wy=this.within.y, wwidth=this.within.width, wheight=this.within.height, wx2=wx+wwidth, wy2=wy+wheight;
                let bx = (x > wx) ? x : wx;
                let sx2 = (x2 < wx2) ? x2 : wx2;
                let by = (y > wy) ? y : wy;
                let sy2 = (y2 < wy2) ? y2 : wy2;
                this.within.x = bx;
                this.within.width = sx2-bx;
                this.within.y = by;
                this.within.height = sy2-by;
            } else {
                console.log("Boo");
            }
        }
    }
    copy(...Arguments:any){
        // if no object, x, width, y, height, zindex
        // if object left, top, right, bottom, zindex
        let possArgs:{x?:number,y?:number,width?:number,height?:number,zindex?:number,
               left?:number,right?:number,top?:number,bottom?:number,
               Within?:Within,Coord?:Coord} = {};
        let obj:Coord|Within;
        mf.applyArguments("Coord.copy", Arguments, {}, Coord.CopyArgMap, possArgs);

        /*if ("Within" in possArgs) obj = possArgs.Within;
        else*/ if ("Coord" in possArgs) {
            obj = possArgs.Coord;
            this.within = possArgs.Coord.within;
        }
        if (obj) {possArgs.left = (possArgs.x) ? possArgs.x : 0; possArgs.top = (possArgs.y) ? possArgs.y : 0;
                  possArgs.right = (possArgs.width) ? possArgs.width : 0;possArgs.bottom= (possArgs.height) ? possArgs.height : 0
        }
        this.x = (obj) ? obj.x + possArgs.left : (("x" in possArgs) ? possArgs.x : this.x);
        this.y = (obj) ? obj.y + possArgs.top  : (("y" in possArgs) ? possArgs.y : this.y);
        this.width = (obj) ? obj.width - (possArgs.left + possArgs.right)
                           : ( (possArgs.width) ? possArgs.width : this.width );
        this.height = (obj) ? obj.height - (possArgs.top + possArgs.bottom)
                           : ( (possArgs.height) ? possArgs.height : this.height );
        this.zindex = ("zindex" in possArgs) ? possArgs.zindex : Handler.currentZindex;
    }

    replace(x:number, y:number, width:number, height:number, zindex:number = undefined) {
        if (x != undefined) this.x = x;
        if (y != undefined)this.y = y;
        if (width != undefined) this.width = width;
        if (height != undefined) this.height = height;
        if (zindex != undefined) this.zindex = zindex;
    }
    isCoordCompletelyOutside(WITHIN: Coord|Within = this.within){
        return ((WITHIN.x + WITHIN.width < this.x) ||
                (WITHIN.x > this.x + this.width) ||
                (WITHIN.y + WITHIN.height < this.y) ||
                (WITHIN.y > this.y + this.height)) 
    }
    derender(derender:boolean) {return derender || this.isCoordCompletelyOutside()}
    clipStyleString(COORD: Coord) {
        return Coord.clipStyleString(this, COORD);
    }
    newClipStyleString(WITHIN: Coord|Within = this.within) {
        return Coord.clipStyleString(WITHIN, this);
    }
    static clipStyleString(WITHIN:Coord|Within, COORD: Coord) {
        let returnString:string = "";
        let left = (COORD.x < WITHIN.x) ? (WITHIN.x-COORD.x) : 0;
        let right:number;
        if (COORD.hideWidth) {
            let el = document.getElementById(COORD.label);
            let bound = el.getBoundingClientRect();
            right = (COORD.x + bound.width > WITHIN.x + WITHIN.width) ? (COORD.x + bound.width - (WITHIN.x + WITHIN.width)) : 0;
        } else
            right = (COORD.x + COORD.width > WITHIN.x + WITHIN.width) ? (COORD.x + COORD.width - (WITHIN.x + WITHIN.width)) : 0;
        let top = (COORD.y < WITHIN.y) ? (WITHIN.y - COORD.y) : 0;
        let bottom = (COORD.y + COORD.height > WITHIN.y + WITHIN.height) ? (COORD.y + COORD.height - (WITHIN.y + WITHIN.height)) : 0;
        if (left + right + top + bottom > 0)
            returnString = `clip-path: inset(${top}px ${right}px ${bottom}px ${left}px);`
        return returnString;
    }
    isPointIn(x:number, y:number): boolean {return (this.x <= x && x <= this.x+this.width && this.y <= y && y <= this.y+this.height)}
    asAttributeString(){
        return `left: ${this.x}px; top:${this.y}px; width:${this.width}px; height:${this.height}px; ` + 
               `z-index:${this.zindex};`;
    }
    newAsAttributeString(){
        return `left: ${this.x}px; top:${this.y}px;`
         +`${ (this.hideWidth) ? "" : "width:" + this.width + "px; " }`
        +`height:${this.height}px; z-index:${this.zindex + ((this.offset) ? 1 : 0)};${this.newClipStyleString()}`
    }
}
