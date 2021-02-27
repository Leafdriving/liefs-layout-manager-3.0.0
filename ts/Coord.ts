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
    }
    static argMap = {
        string : ["label"],
        number : ["x", "y", "width", "height", "zindex"]
    }

    label:string;
    x: number;
    y: number;
    width: number;
    height: number;
    zindex: number;
    parent: Coord;

    constructor(...Arguments: any) {
        Coord.instances.push(this);
        mf.applyArguments("Coord", Arguments, Coord.defaults, Coord.argMap, this);

    }
    // clippedBy(clipCoord:Coord, childName:string="", parentName:string=""): void{
    //     // console.log(`child: ${childName}, parent: ${parentName}`);
    // }
    copy(fromCoord: Coord, left:number=0, top:number=0, right:number=0, bottom:number=0) {
        this.x = fromCoord.x +left;
        this.y = fromCoord.y + top;
        this.width = fromCoord.width - (left + right);
        this.height = fromCoord.height - (top + bottom);
        this.zindex = fromCoord.zindex + ((left==0 && right==0 && top==0 && bottom==0) ? 0 : Handler.handlerZindexIncrement);
        this.parent = fromCoord.parent;
    }
    replace(x:number, y:number, width:number, height:number, zindex:number = undefined, clip:Coord = undefined) {
        if (x != undefined) this.x = x;
        if (y != undefined)this.y = y;
        if (width != undefined) this.width = width;
        if (height != undefined) this.height = height;
        if (zindex != undefined) this.zindex = zindex;
        if (clip != undefined) this.parent = clip;
    }
    isCoordCompletelyOutside(sub: Coord){
        return ((sub.x + sub.width < this.x) ||
                (sub.x > this.x + this.width) ||
                (sub.y + sub.height < this.y) ||
                (sub.y > this.y + this.height)) 
    }
    clipStyleString(sub: Coord) {
        let returnString:string = "";
        let left = (sub.x < this.x) ? (this.x-sub.x) : 0;
        let right = (sub.x + sub.width > this.x + this.width) ? (sub.x + sub.width - (this.x + this.width)) : 0;
        let top = (sub.y < this.y) ? (this.y - sub.y) : 0;
        let bottom = (sub.y + sub.height > this.y + this.height) ? (sub.y + sub.height - (this.y + this.height)) : 0;
        if (left + right + top + bottom > 0)
            returnString = `clip-path: inset(${top}px ${right}px ${bottom}px ${left}px);`
        return returnString;
    }
    isPointIn(x:number, y:number): boolean {return (this.x <= x && x <= this.x+this.width && this.y <= y && y <= this.y+this.height)}
    asAttributeString(){return `left: ${this.x}px; top:${this.y}px; width:${this.width}px; height:${this.height}px; z-index:${this.zindex};`}
}
