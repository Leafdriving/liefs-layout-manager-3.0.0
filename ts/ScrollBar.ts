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

        this.leftArrow = I("", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${mid} ${w},${off} ${w},${w} ${off},${mid}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
                                                  })
            );


        this.upArrow = I("", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${w} ${mid},${off} ${w},${w} ${off},${w}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
                                                  })
        );

        this.prePaddle = I("", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageLeftorUp(mouseEvent)}}));
        this.paddle = I("", "","blackBG", events({ondrag: { onDown :function(){THIS.offsetAtDrag = THIS.offset},
                                                            onMove :function(output:object){THIS.dragging(output)},
                                                           /* onUp: function(output:object){console.log("mouseup");console.log(output)}*/
                                                          }
                        }));
        this.postPaddle = I("", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageRightOrDown(mouseEvent)}}));
            
        this.rightArrow = I("", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${off} ${w},${mid} ${off},${w} ${off},${off}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
                                                  })
        );

        this.downArrow = I("", `<svg height="${ss}" width="${ss}">
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
                            );
    }
    clickLeftorUp(mouseEvent:MouseEvent){
        this.offset -= this.offsetPixelRatio;
        if (this.offset < 0) this.offset = 0;
        Handler.update();
    }
    clickRightOrDown(mouseEvent:MouseEvent){
        this.offset += this.offsetPixelRatio;
        if (this.offset > this.maxOffset) this.offset = this.maxOffset;
        Handler.update();
    }
    clickPageLeftorUp(mouseEvent:MouseEvent){
        this.offset -= this.displayedFixedPx;
        if (this.offset < 0) this.offset = 0;
        Handler.update();
    }
    clickPageRightOrDown(mouseEvent:MouseEvent){
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
        let dgCoord:Coord = this.displaygroup.coord;
        // calculate outer scrollbar dimensions
        let x = (this.ishor) ? dgCoord.x : dgCoord.x + dgCoord.width - this.scrollWidth;
        let width = (this.ishor) ? dgCoord.width : this.scrollWidth;
        let y = (this.ishor) ? dgCoord.y + dgCoord.height - this.scrollWidth : dgCoord.y;
        let height = (this.ishor) ? this.scrollWidth : dgCoord.height;

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
        Handler.renderDisplayCell(this.displaycell, undefined, undefined, derender);
        Handler.currentZindex -= Handler.zindexIncrement*2;
    }
}
Overlay.classes["ScrollBar"] = ScrollBar;