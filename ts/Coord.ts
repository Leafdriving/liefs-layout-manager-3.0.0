class Point{x:number;y:number}
class Within{
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(...Arguments: any) {
        mf.applyArguments("Within", Arguments, {}, {number : ["x", "y", "width", "height"]}, this);
    }
}
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
        number : ["x", "y", "width", "height", "zindex"]
    };
    static CopyArgMap = {Within : ["Within"],Coord : ["Coord"],number : ["x", "y", "width", "height", "zindex"]};

    label:string;
    x: number;
    y: number;
    width: number;
    height: number;
    zindex: number;
    within: Within = new Within();

    constructor(...Arguments: any) {
        Coord.instances.push(this);
        mf.applyArguments("Coord", Arguments, Coord.defaults, Coord.argMap, this);
    }
    copyWithin(...Arguments:any){
        let possArgs:{x?:number,y?:number,width?:number,height?:number} = {};
        let obj:Coord|Within;
        mf.applyArguments("Coord.copyWithin", Arguments, {}, Coord.CopyArgMap, possArgs);
        if ("Within" in possArgs) obj = possArgs["Within"];
        if ("Coord" in possArgs) obj = possArgs["Coord"];
        this.within.x = (obj) ? obj.x : ( ("x" in possArgs) ? possArgs.x : this.x);
        this.within.y = (obj) ? obj.y : ( ("y" in possArgs) ? possArgs.y : this.y);
        this.within.width = (obj) ? obj.width : ( ("width" in possArgs) ? possArgs.width : this.width);
        this.within.height = (obj) ? obj.height : ( ("height" in possArgs) ? possArgs.height : this.height);
        console.log("CopyWithin");
        console.log(this);
    }
    copy(...Arguments:any){
        // if no object, x, width, y, height, zindex
        // if object left, top, right, bottom, zindex
        let possArgs:{x?:number,y?:number,width?:number,height?:number,zindex?:number,
               left?:number,right?:number,top?:number,bottom?:number,
               Within?:Within,Coord?:Coord} = {};
        let obj:Coord|Within;
        mf.applyArguments("Coord.copy", Arguments, {}, Coord.CopyArgMap, possArgs);
        // console.log("Copy",possArgs); //////////////////
        if ("Within" in possArgs) obj = possArgs.Within;
        else if ("Coord" in possArgs) {
            obj = possArgs.Coord;
            this.within = possArgs.Coord.within;
        }
        // if (this.within.x == undefined) this.copyWithin();
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
        // this.zindex = ("Coord" in possArgs) 
        //             ? possArgs.Coord.zindex + ( (possArgs.left==0 && possArgs.right==0 && possArgs.top==0 && possArgs.bottom==0) 
        //                                   ? 0 : Handler.handlerZindexIncrement )
        //             : ( (possArgs.zindex) ? possArgs.zindex : this.zindex);
        console.log("Copy");
        console.log(this); ////////////////////////////
    }
    // copy(fromCoord: Coord, left:number=0, top:number=0, right:number=0, bottom:number=0) {
    //     this.x = fromCoord.x +left;
    //     this.y = fromCoord.y + top;
    //     this.width = fromCoord.width - (left + right);
    //     this.height = fromCoord.height - (top + bottom);
    //     this.zindex = fromCoord.zindex + ((left==0 && right==0 && top==0 && bottom==0) ? 0 : Handler.handlerZindexIncrement);
    //     if (this.within.x == undefined) this.copyWithin();
    // }
    replace(x:number, y:number, width:number, height:number, zindex:number = undefined) {
        if (x != undefined) this.x = x;
        if (y != undefined)this.y = y;
        if (width != undefined) this.width = width;
        if (height != undefined) this.height = height;
        if (zindex != undefined) this.zindex = zindex;
        // if (clip != undefined) this.parent = clip;
    }
    isCoordCompletelyOutside(sub: Coord|Within){
        return ((sub.x + sub.width < this.x) ||
                (sub.x > this.x + this.width) ||
                (sub.y + sub.height < this.y) ||
                (sub.y > this.y + this.height)) 
    }
    clipStyleString(sub: Coord|Within) {
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
