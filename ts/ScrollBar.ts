class ScrollBar {
    static instances:ScrollBar[] = [];
    static byLabel(label:string):ScrollBar{
        for (let key in ScrollBar.instances)
            if (ScrollBar.instances[key].label == label)
                return ScrollBar.instances[key];
        return undefined;
    }
    static whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;");
    static blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
    static defaults = {
        label : function(){return `ScrollBar_${pf.pad_with_zeroes(ScrollBar.instances.length)}`},
        offset : 0, displayAtEnd: true, scrollWidth : 20, currentlyRendered: true, arrowOffset: 5,
    }
    static argMap = {
        string : ["label"],
        DisplayGroup: ["displaygroup"],
        number: ["fixedPixels", "viewingPixels", "scroolWidth"],
        boolean: ["displayAtEnd"]
    }
    static scrollWheelMult = 4;

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
    displayedFixedPx: number;
    

    constructor(...Arguments: any) {
        ScrollBar.instances.push(this);
        mf.applyArguments("ScrollBar", Arguments, ScrollBar.defaults, ScrollBar.argMap, this);
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
        this.offset -= this.displayedFixedPx;
        if (this.offset < 0) this.offset = 0;
        Handler.update();
    }
    clickPageRightOrDown(mouseEvent:MouseEvent|WheelEvent){
        this.offset += this.displayedFixedPx;
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
        // console.log(this.label);
        // console.log(this);
        let dgCoord:Coord = this.displaygroup.coord;
        // calculate outer scrollbar dimensions

        let x = (this.ishor) ? dgCoord.within.x : dgCoord.within.x + dgCoord.within.width - this.scrollWidth;
        let width = (this.ishor) ? dgCoord.within.width : this.scrollWidth;
        let y = (this.ishor) ? dgCoord.within.y + dgCoord.within.height - this.scrollWidth : dgCoord.within.y;
        let height = (this.ishor) ? this.scrollWidth : dgCoord.within.height;


        // let x = (this.ishor) ? dgCoord.x : dgCoord.x + dgCoord.width - this.scrollWidth;
        // let width = (this.ishor) ? dgCoord.width : this.scrollWidth;
        // let y = (this.ishor) ? dgCoord.y + dgCoord.height - this.scrollWidth : dgCoord.y;
        // let height = (this.ishor) ? this.scrollWidth : dgCoord.height;

        this.displaycell.coord.replace(x, y, width, height);

        // calculate inner scrollbar dimensions
        let preDisplayCell = this.displaycell.displaygroup.cellArray[1];
        let paddleDisplayCell = this.displaycell.displaygroup.cellArray[2];
        let postDisplayCell = this.displaycell.displaygroup.cellArray[3];
        
        let actualFixedPx = this.displaygroup.totalPx();
        let displayedFixedPx = this.displayedFixedPx = ((this.ishor) ? width : height);
        this.maxOffset = actualFixedPx - displayedFixedPx;
        if (this.offset > this.maxOffset) this.offset = this.maxOffset;
        if (this.offset < 0) this.offset = 0;
        // console.log(this.offset);
        this.offsetPixelRatio = actualFixedPx/displayedFixedPx;

        let prePercent = Math.round((this.offset/actualFixedPx)*100);
        let paddlePercent = Math.round((displayedFixedPx/actualFixedPx)*100);
        let postPercent = 100-paddlePercent-prePercent;

        preDisplayCell.dim = `${prePercent}%`;
        paddleDisplayCell.dim = `${paddlePercent}%`;
        postDisplayCell.dim = `${postPercent}%`;

        Handler.currentZindex += Handler.zindexIncrement*2;
        this.currentlyRendered = !derender;
        // console.log(this.displaycell);
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
                dist = ScrollBar.distOfMouseFromWheel(instance, event);
                if (!selectedInstance || dist < minDist) {
                    minDist = dist;
                    selectedInstance = instance;
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