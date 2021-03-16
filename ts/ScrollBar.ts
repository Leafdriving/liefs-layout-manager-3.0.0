// import {Base} from './Base';
// import {Css, css} from './Css';
// import {DisplayCell, I} from './DisplayCell';
// import {DisplayGroup, v, h} from './DisplayGroup';
// import {Events, events} from './Events';
// import {Coord} from './Coord';
// import {Handler} from './Handler';
// import {Overlay} from './Overlay';

class ScrollBar extends Base {
    static instances:ScrollBar[] = [];
    static activeInstances:ScrollBar[] = [];
    
    static whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;");
    static blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
    static defaults = {
        offset : 0, displayAtEnd: true, scrollWidth : 15, currentlyRendered: true, arrowOffset: 2,
    }
    static argMap = {
        string : ["label"],
        DisplayGroup: ["displaygroup"],
        number: ["fixedPixels", "viewingPixels", "scroolWidth"],
        boolean: ["displayAtEnd"]
    }
    static scrollWheelMult = 4;
    static triggerDistance = 40;

    label:string;
    currentlyRendered: boolean;
    ishor: boolean;

    arrowOffset:number;
    scrollWidth: number;
    displayAtEnd:boolean;
    fixedPixels: number;
    viewingPixels: number;
    offset: number;
    maxOffset: number;
    offsetAtDrag: number;
    offsetPixelRatio: number;

    parentDisplaygroup: DisplayGroup;
    displaygroup: DisplayGroup;

    displaycell: DisplayCell;
    leftArrow: DisplayCell;
    upArrow: DisplayCell;
    prePaddle: DisplayCell;
    paddle: DisplayCell;
    postPaddle: DisplayCell;
    rightArrow: DisplayCell;
    downArrow: DisplayCell;
    paddleSizePx:number;
    clickPageSize: number;
    // displayedFixedPx: number;
    

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        
        ScrollBar.makeLabel(this);
        this.build();
    }
    build(){
        let THIS = this;
        let off = this.arrowOffset;
        let ss = this.scrollWidth;
        let w = ss-off;
        let mid = ss/2;

        this.leftArrow = I(this.label+"_Left", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${mid} ${w},${off} ${w},${w} ${off},${mid}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
                                                  })
            );


        this.upArrow = I(this.label+"_Up", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${w} ${mid},${off} ${w},${w} ${off},${w}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
                                                  })
        );

        this.prePaddle = I(this.label+"_Pre", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageLeftorUp(mouseEvent)}}));
        this.paddle = I(this.label+"_Paddle", "","blackBG", events({ondrag: { onDown :function(){THIS.offsetAtDrag = THIS.offset},
                                                                              onMove :function(output:object){THIS.dragging(output)},
                                                           /* onUp: function(output:object){console.log("mouseup");console.log(output)}*/
                                                          }
                        }));
        this.postPaddle = I(this.label+"_Post", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageRightOrDown(mouseEvent)}}));
            
        this.rightArrow = I(this.label+"_Right", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${off} ${w},${mid} ${off},${w} ${off},${off}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
                                                  })
        );

        this.downArrow = I(this.label+"_down", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${off} ${w},${off} ${mid},${w} ${off},${off}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
                                                  })
        );            

        this.ishor = this.displaygroup.ishor;
        this.displaycell = h(   this.ishor, // note even though I'm using H - id chooses here.
                                (this.ishor) ? this.leftArrow : this.upArrow,
                                this.prePaddle,
                                this.paddle,
                                this.postPaddle,
                                (this.ishor) ? this.rightArrow : this.downArrow,
                                this.label,
                            );
    }
    clickLeftorUp(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
        this.offset -= this.offsetPixelRatio*noTimes;
        if (this.offset < 0) this.offset = 0;
        Handler.update();
    }
    clickRightOrDown(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
        this.offset += this.offsetPixelRatio*noTimes;
        if (this.offset > this.maxOffset) this.offset = this.maxOffset;
        Handler.update();
    }
    clickPageLeftorUp(mouseEvent:MouseEvent|WheelEvent){
        this.offset -= this.clickPageSize;
        if (this.offset < 0) this.offset = 0;
        Handler.update();
    }
    clickPageRightOrDown(mouseEvent:MouseEvent|WheelEvent){
        this.offset += this.clickPageSize;
        if (this.offset > this.maxOffset) this.offset = this.maxOffset;
        Handler.update();
    }
    dragging(output:object){
        let diff = (this.ishor) ? output["x"]:output["y"];
        // console.log(diff, diff*this.offsetPixelRatio);
        let newoffset = this.offsetAtDrag + diff*this.offsetPixelRatio;
        if (newoffset < 0) newoffset = 0;
        if (newoffset > this.maxOffset) newoffset = this.maxOffset;
        this.offset = newoffset;
        Handler.update();
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (!this.parentDisplaygroup) this.parentDisplaygroup = parentDisplaygroup;
        let dgCoord:Coord = this.displaygroup.coord;
        // calculate outer scrollbar dimensions

        // console.log( JSON.stringify(parentDisplaygroup.coord.within, null, 4) )

        let x = (this.ishor) ? dgCoord.within.x : dgCoord.within.x + dgCoord.within.width - this.scrollWidth;
        let width = (this.ishor) ? dgCoord.within.width : this.scrollWidth;
        let y = (this.ishor) ? dgCoord.within.y + dgCoord.within.height - this.scrollWidth : dgCoord.within.y;
        let height = (this.ishor) ? this.scrollWidth : dgCoord.within.height;

        // console.log( JSON.stringify({x,y,width,height}, null, 4) )

        this.displaycell.coord.assign(x, y, width, height);

        // calculate inner scrollbar dimensions
        let preDisplayCell = this.displaycell.displaygroup.cellArray[1];
        let paddleDisplayCell = this.displaycell.displaygroup.cellArray[2];
        let postDisplayCell = this.displaycell.displaygroup.cellArray[3];
        
        // "fixedPixels", "viewingPixels"

        let overflow = this.fixedPixels - this.viewingPixels;
        if (this.offset > overflow) this.offset = overflow;
        let viewingPixels = (this.ishor) ? dgCoord.width : dgCoord.height;
        let fixedPixels = parentDisplaygroup.dimArrayTotal;

        let paddlePercent = Math.round(viewingPixels/fixedPixels*100);
        let percentAfterPaddle = Math.round(100 - (viewingPixels/fixedPixels*100));
        let prePercent = Math.round(percentAfterPaddle*(this.offset/overflow));
        let postPercent = 100 - paddlePercent - prePercent;

        preDisplayCell.dim = `${prePercent}%`;
        paddleDisplayCell.dim = `${paddlePercent}%`;
        postDisplayCell.dim = `${postPercent}%`;

        let pixelForStretch = fixedPixels*percentAfterPaddle/100
        this.offsetPixelRatio = (fixedPixels-viewingPixels)/pixelForStretch;
        this.clickPageSize = ((paddlePercent)/100)*(fixedPixels - viewingPixels)
        // console.log(this.clickPageSize)

        Handler.currentZindex += Handler.zindexIncrement*2;
        this.currentlyRendered = !derender;
        // console.log(this.displaycell, this.offset);
        Handler.renderDisplayCell(this.displaycell, undefined, undefined, derender);
        Handler.currentZindex -= Handler.zindexIncrement*2;
    }
    static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
        let ishor = THIS.displaygroup.ishor;
        let displaycell = THIS.displaycell;
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
    static onWheel(event:WheelEvent) {
        let selectedInstance:ScrollBar;
        let minDist:number = 100000;
        let dist:number;
        for (let instance of ScrollBar.instances) {
            if (instance.currentlyRendered) {
                if (instance.parentDisplaygroup.coord.isPointIn(event.clientX, event.clientY)
                    ||instance.displaycell.coord.isPointIn(event.clientX, event.clientY)) {
                    dist = ScrollBar.distOfMouseFromWheel(instance, event);
                    if (!selectedInstance || dist < minDist) {
                        minDist = dist;
                        selectedInstance = instance;
                    }
                }
            }
        }
        if (selectedInstance) {
            if (event.deltaY > 0) selectedInstance.clickRightOrDown(event, ScrollBar.scrollWheelMult*event.deltaY/100);
            if (event.deltaY < 0) selectedInstance.clickLeftorUp(event, -ScrollBar.scrollWheelMult*event.deltaY/100)
        }
    }
}
Overlay.classes["ScrollBar"] = ScrollBar;
// export {ScrollBar}