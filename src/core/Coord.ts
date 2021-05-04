/**
 * Point - Yea, a interface would do the same thing... so whats the point!
 */
class Point{x:number;y:number}
/**
 * Within - Coordinates of the Parent - to determine if this (child) is partially cut off
 * or goes partially (or completly) out of view
 */
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

    /**
     * Creates an instance of within.
     * @param Arguments 
     */
    constructor(...Arguments: any) {}
    /**
     * Resets within to undefined values
     */
    reset(){this.x = this.y = this.width = this.height = undefined};
    /**
     * To string of within (No Implemented yet)
     */
    toString:Function;
}
/**
 * Coord
 */
class Coord extends Base {
    /**
     * Instances of coord object (Key = label)
     */
    static instances:Coord[] = [];
    /**
     * Active instances of coord (Not Implemented)
     */
    static activeInstances:Coord[] = [];

    /**
     * Defaults of coord
     */
    static defaults = {x : 0, y : 0, width : 0, height: 0, zindex: 0};
    /**
     * Arg map of coord: for example:
     * instance.label = first string argument
     * instance.x , y, width, height, zindex = first though fifth arguments
     * instance.hidewidth = first boolean argument
     */
    static argMap = {
        string : ["label"],
        number : ["x", "y", "width", "height", "zindex"],
        boolean : ["hideWidth"]
    };
    /**
     * Copy arg map of coord
     */
    // static CopyArgMap = {Within : ["Within"],Coord : ["Coord"], boolean:["isRoot"],
    //                      number : ["x", "y", "width", "height", "zindex"]};

    /**
     * Label  of coord
     */
    label:string;
    /**
     * Frozen  of coord
     */
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

    /**
     * Gets x2 (Read Only)
     */
    get x2(){return this.x + this.width}
    /**
     * Gets y2 (Read Only)
     */
    get y2(){return this.y + this.height}
    /**
     * Zindex of coord
     */
    zindex: number;
    /**
     * Within of coord
     */
    within: Within = new Within();
    /**
     * Hide width of coord - if true, 'div' ends at end of text, rather than end of cell size.
     */
    hideWidth: boolean;
    /**
     * Offset  of coord - Used for "Moving" DisplayCells (Not Implemented yet)
     */
    offset: {x:number, y:number, width:number, height:number};

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        
        Coord.makeLabel(this);
    }
    /**
     * Sets offset (x=0, y=0, width=0, height=0)
     */
    setOffset(x=0, y=0, width=0, height=0){
        if (x==0 && y==0 && width ==0 && height == 0) this.offset = undefined;
        else this.offset = {x, y, width, height};
    }
    /**
     * Merges parent Within with this Within (to see if part goes off-screen)
     * @param p Coord Object
     */
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
    /**
     * Applys margins (left:number = 0, right:number = 0, top:number =0, bottom:number =0)
     * @returns  
     */
    applyMargins(left:number = 0, right:number = 0, top:number =0, bottom:number =0){
        this.x += left;
        this.y += top;
        this.width -= (left + right);
        this.height -= (top + bottom);
        return this;
    }
    /**
     * Assigns coord (x, y, width, height, wx, wy, wwidth, wheight, zindex)
     * Used for assigning a "New Coord Root"
     */
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
    /**
     * Copys coord (and uses their 'within', and applies child co-ordinates)
     * @param (fromCoord,  x, y, width, height, zindex)
     * @returns  
     */
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
    /**
     * Logs coord
     */
    log(){
        console.log(`x=${this.x}`, `y=${this.y}`, `width=${this.width}`, `height=${this.height}`);
        console.log(`wx=${this.within.x}`, `wy=${this.within.y}`, `wwidth=${this.within.width}`, `wheight=${this.within.height}`);
    }

    /**
     * Determines whether coord completely outside is
     * if true, de-render, rather than render.
     * @param WITHIN or Coord
     * @returns boolean
     */
    isCoordCompletelyOutside(WITHIN: Coord|Within = this.within){
        return ((WITHIN.x + WITHIN.width < this.x) ||
                (WITHIN.x > this.x + this.width) ||
                (WITHIN.y + WITHIN.height < this.y) ||
                (WITHIN.y > this.y + this.height)) 
    }
    /**
     * Derenders - if was already derender, or completly outside, then derender.
     * @param derender 
     * @returns boolean
     */
    derender(derender:boolean) {return derender || this.isCoordCompletelyOutside()}
    /**
     * Determines whether point is in Coord
     * @param (x, y) 
     * @returns true if point whithin Coord.
     */
    isPointIn(x:number, y:number): boolean {return (this.x <= x && x <= this.x+this.width && this.y <= y && y <= this.y+this.height)}
    /**
     * Red coord - used for de-bugging - Renders a Coord "Red"
     * @param [id] 
     */
    red(id="red"){
        let div = document.getElementById(id);
        if (!div) {
            div = document.createElement("div");
            Element_.setAttrib(div, "id", id);
            Element_.setAttrib(div, "llm", "");
            document.body.appendChild(div);
        }
        div.style.cssText = `background:red;left: ${this.x}px; top: ${this.y}px; width: ${this.width}px; height: ${this.height}px; z-index: 1000;`; //style="left: 559px; top: 25px; width: 300px; height: 829px; z-index: 30;"
    }
}
