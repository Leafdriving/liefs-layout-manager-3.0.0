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
    scaleFactor:number;
    ishor:boolean;
    coord:Coord;

    parentDisplayCell: DisplayCell;
    scrollbarDisplayCell : DisplayCell;

    preBar:DisplayCell;
    Bar:DisplayCell;
    postBar:DisplayCell;
    lasttime:number;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        this.label = `${this.parentDisplayCell.label}_${this.type}`;
        this.build();
        if (!this.coord) this.coord = this.parentDisplayCell.coord;
        // console.log("scrollbar Created", this.ishor, this.label);
    }
    build(){
        let THIS:ScrollBar = this;
        // console.log("label", this.label)
        let label = this.label + ((this.ishor) ? "_H" : "_V");
        // console.log("label2", label)
        
        this.preBar = I(`${label}_preBar`, DefaultTheme.ScrollBar_whiteBG, events({onclick:THIS.onPreBar.bind(THIS)}));
        this.Bar = I(`${label}_Bar`, DefaultTheme.ScrollBar_blackBG,
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
        ScrollBar.activate(this);
    }
    onBarDown(){ScrollBar.startoffset = this.offset;}
    onBarMove(xmouseDiff:object){
        let dist = (this.ishor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + dist/this.scaleFactor;
        this.validateOffsetAndRender();
     }
    onPreBar(mouseEvent:MouseEvent=undefined){ this.offset -= this.viewPortSize; this.validateOffsetAndRender(); }
    onPostBar(mouseEvent:MouseEvent=undefined){ this.offset += this.viewPortSize; this.validateOffsetAndRender(); }
    onBackArrow(mouseEvent:MouseEvent=undefined, unit=3){ this.offset -= unit/this.scaleFactor; this.validateOffsetAndRender();}
    onForwardArrow(mouseEvent:MouseEvent=undefined, unit=3){ this.offset += unit/this.scaleFactor; this.validateOffsetAndRender();}

    validateOffsetAndRender(){
        if (this.offset <= 0) this.offset = 1;
        let max = this.displaySize-this.viewPortSize-2;
        if (this.offset >= max-10) this.offset = max-10;
        let thisTime = new Date().getTime();
        if (!(this.lasttime && (thisTime - this.lasttime < ScrollBar.debounce))) {
            Render.update();
            this.lasttime = thisTime;
        }
    }
    update(displaySize:number){
        let coord = this.parentDisplayCell.coord;
        let ishor = this.ishor;
        let width = (ishor) ? coord.width : coord.width - this.barSize;
        let height = (ishor) ? coord.height - this.barSize : coord.height;

        let sbx = (ishor) ? coord.x : coord.x + coord.width - this.barSize;
        let sby = (ishor) ? coord.y + coord.height -this.barSize : coord.y;
        let scw = (ishor) ? coord.width : this.barSize;
        let sch = (ishor) ? this.barSize : coord.height;

        this.scrollbarDisplayCell.coord.assign(sbx, sby, scw, sch, sbx, sby, scw, sch, coord.zindex);
        // this.scrollbarDisplayCell.coord.log()

        this.displaySize = displaySize;
        this.viewPortSize = (ishor) ? this.parentDisplayCell.coord.width : this.parentDisplayCell.coord.height;
        let scrollBarSize = this.viewPortSize - this.barSize*2;
        this.scaleFactor = scrollBarSize/this.displaySize;

        this.preBar.dim = `${ Math.round(this.offset * this.scaleFactor) }px`
        this.Bar.dim = `${ Math.round(this.viewPortSize*this.scaleFactor) }px`;
        return this.offset;
    }

    static Render(scrollbar_:ScrollBar, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        let displaycell = scrollbar_.parentDisplayCell;
        let width = displaycell.coord.width - ((scrollbar_.ishor) ? 0 : scrollbar_.barSize);
        let height = displaycell.coord.height - ((scrollbar_.ishor) ? scrollbar_.barSize: 0);
        displaycell.coord.assign(undefined, undefined, undefined, undefined, undefined, undefined, width, height)

        let renderChildren = new RenderChildren;
        renderChildren.RenderSibling(scrollbar_.scrollbarDisplayCell, derender);
        return {zindex,
            siblings: renderChildren.siblings};
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
        let selectedInstance:ScrollBar;
        let minDist:number = 100000;
        let dist:number;
        let scrollbar: ScrollBar;
        for (let instance of ScrollBar.activeInstances) {
            if (instance.scrollbarDisplayCell.coord.isPointIn(event.clientX, event.clientY))
                scrollbar = instance;
            else 
                if (instance.parentDisplayCell.coord.isPointIn(event.clientX, event.clientY))
                    scrollbar = instance;
        }
        if (scrollbar) scrollbar.onWheel(event)
    }
    static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
        let ishor = THIS.ishor;
        let displaycell = THIS.parentDisplayCell;
        let coord = displaycell.coord;
        let x = event.clientX;
        let y = event.clientY;
        let dist:number = 0;
        // console.log(ishor, x, y, coord)
        if (!ishor) {
            if (x < coord.x) dist = coord.x -x;
            if (x > coord.x + coord.width) dist = x - (coord.x + coord.width)
        } else {
            if (y < coord.y) dist = coord.y -y;
            if (y > coord.y + coord.height) dist = y - (coord.y + coord.height)
        }
        return dist;
    }
}
Render.register("ScrollBar", ScrollBar);
function scrollbar(...Arguments:any): DisplayCell {return Overlay.new("ScrollBar", ...Arguments);}
Overlay.classes["ScrollBar"] = ScrollBar;

