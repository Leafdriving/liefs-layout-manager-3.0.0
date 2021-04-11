// // import {Base} from './Base';
// // import {Css, css} from './Css';
// // import {DisplayCell, I} from './DisplayCell';
// // import {DisplayGroup, v, h} from './DisplayGroup';
// // import {Events, events} from './Events';
// // import {Coord} from './Coord';
// // import {Handler} from './Handler';
// // import {Overlay} from './Overlay';

class ScrollBar extends Base {
    static labelNo = 0;
    static instances:ScrollBar[] = [];
    static activeInstances:ScrollBar[] = [];
    static defaults = {barSize:15, offset:0, type:"Unknown"}
    static argMap = {
        string : ["label"],
        DisplayCell : ["parentDisplayCell"],
        number: ["barSize"],
        boolean: ["ishor"],
    }
    static debounce = 75; //
    static startoffset:number; /// used during move bar
    // retArgs:ArgsObj;   // <- this will appear

    renderNode:node_; // render node

    label:string;
    type:string // DisplayGroup

    displaySize:number;
    viewPortSize:number;
    barSize:number;
    offset:number;
    ratioOffset:number;
    ratio:number;
    max_offset:number;
    ishor:boolean;
    coord:Coord;

    scrollbarDisplayCell : DisplayCell;

    preBar:DisplayCell;
    Bar:DisplayCell;
    postBar:DisplayCell;
    lasttime:number;
    BarPixels:number;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        ScrollBar.makeLabel(this);
        this.build();
    }
    build(){
        // this.scrollbarDisplayCell = I("allblack","",css("allblack","background:black"));
        let THIS:ScrollBar = this;
        let label = this.label + ((this.ishor) ? "_H" : "_V");
        this.preBar = I(`${label}_preBar`, "20px", DefaultTheme.ScrollBar_whiteBG, events({onclick:THIS.onPreBar.bind(THIS)}));
        this.Bar = I(`${label}_Bar`, DefaultTheme.ScrollBar_blackBG, "20px",
                         events({ondrag: {onDown :THIS.onBarDown.bind(THIS), onMove :THIS.onBarMove.bind(THIS)}}));
        this.postBar = I(`${label}_postBar`, "100%",DefaultTheme.ScrollBar_whiteBG, events({onclick:THIS.onPostBar.bind(THIS)}));
        this.scrollbarDisplayCell =
        h(`${label}_h`, `${this.barSize}px`, ((this.ishor) ? undefined : false ),
            I(`${label}_backArrow`,`${this.barSize}px`,
                 (this.ishor) ? DefaultTheme.leftArrowSVG("scrollArrows") : DefaultTheme.upArrowSVG("scrollArrows"),
                 events({ onhold:{event:function(mouseEvent:MouseEvent){THIS.onBackArrow(mouseEvent)} }}),
            ),
            this.preBar,
            this.Bar,
            this.postBar,
            I(`${label}_forwardArrow`,`${this.barSize}px`,
                 (this.ishor) ? DefaultTheme.rightArrowSVG("scrollArrows") : DefaultTheme.downArrowSVG("scrollArrows"),
                 events({ onhold:{event:function(mouseEvent:MouseEvent){THIS.onForwardArrow(mouseEvent)} }}),
            ),

        );
        // ScrollBar.activate(this);
    }
    onBarDown(){ScrollBar.startoffset = this.offset;}
    onBarMove(xmouseDiff:object){
        let dist = (this.ishor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + Math.round(dist/this.ratio);
        this.validateOffsetAndRender();
     }
    onPreBar(mouseEvent:MouseEvent=undefined){this.offset -= 30;  this.validateOffsetAndRender(); }
    onPostBar(mouseEvent:MouseEvent=undefined){this.offset += 30;  this.validateOffsetAndRender(); }
    onBackArrow(mouseEvent:MouseEvent=undefined, unit=3){this.offset -= unit; this.validateOffsetAndRender();}
    onForwardArrow(mouseEvent:MouseEvent=undefined, unit=3){this.offset += unit; this.validateOffsetAndRender();}

    validateOffsetAndRender(){
        if (this.offset <= 0) this.offset = 0;
        if (this.offset/this.ratio > this.max_offset) this.offset = this.max_offset*this.ratio;
        let thisTime = new Date().getTime();
        if (!(this.lasttime && (thisTime - this.lasttime < ScrollBar.debounce))) {
            Render.update();
            this.lasttime = thisTime;
        }
    }
    update(displaySize:number, viewportSize:number, x:number, y:number, width:number, height:number){
        // console.log(displaySize, viewportSize)
        this.scrollbarDisplayCell.coord.assign(x, y, width, height, x, y, width, height);
        this.max_offset = displaySize - viewportSize - 1;
        let scrollbarTotalPixels = (this.ishor) ? width : height;
        let scrollbarPixels = scrollbarTotalPixels - this.barSize*2;
        this.BarPixels = Math.round(scrollbarPixels * (viewportSize/displaySize));
        let pixelsForOffset = scrollbarPixels - this.BarPixels;
        this.ratio = pixelsForOffset/(displaySize - viewportSize);
        this.preBar.dim = `${this.offset}px`;
        this.Bar.dim = `${this.BarPixels}px`;
        //console.log(this.offset/this.ratio, displaySize - viewportSize -1)
        return Math.round(this.offset/this.ratio);
    }

    delete(){
        ScrollBar.pop(this);
        setTimeout(() => {
            Render.update(this.scrollbarDisplayCell, true);
        }, 0);
    }
    onWheel(event:WheelEvent) {
        if (event.deltaY > 0) this.onForwardArrow(undefined, 6);
        else this.onBackArrow();
    }
    static onWheel(event:WheelEvent) {
    // //     let selectedInstance:ScrollBar;
    // //     let minDist:number = 100000;
    // //     let dist:number;
    // //     let scrollbar: ScrollBar;
    // //     for (let instance of ScrollBar.activeInstances) {
    // //         if (instance.scrollbarDisplayCell.coord.isPointIn(event.clientX, event.clientY))
    // //             scrollbar = instance;
    // //         else
    // //             if (instance.parentDisplayCell.coord.isPointIn(event.clientX, event.clientY))
    // //                 scrollbar = instance;
    // //     }
    // //     if (scrollbar) scrollbar.onWheel(event)
    }
    // // static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
    // //     let ishor = THIS.ishor;
    // //     let displaycell = THIS.parentDisplayCell;
    // //     let coord = displaycell.coord;
    // //     let x = event.clientX;
    // //     let y = event.clientY;
    // //     let dist:number = 0;
    // //     // console.log(ishor, x, y, coord)
    // //     if (!ishor) {
    // //         if (x < coord.x) dist = coord.x -x;
    // //         if (x > coord.x + coord.width) dist = x - (coord.x + coord.width)
    // //     } else {
    // //         if (y < coord.y) dist = coord.y -y;
    // //         if (y > coord.y + coord.height) dist = y - (coord.y + coord.height)
    // //     }
    // //     return dist;
    // // }
}
Render.register("ScrollBar", ScrollBar);
function scrollbar(...Arguments:any): DisplayCell {return Overlay.new("ScrollBar", ...Arguments);}
Overlay.classes["ScrollBar"] = ScrollBar;

