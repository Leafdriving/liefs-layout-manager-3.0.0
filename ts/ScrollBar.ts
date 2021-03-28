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
        DisplayCell : ["parentDisplaycell"],
        number: ["barSize"],
        boolean: ["ishor"],
        // Coord: ["coord"]
    }
    static startoffset:number; /// used during move bar
    // retArgs:ArgsObj;   // <- this will appear

    label:string;
    type:string // DisplayGroup

    displaySize:number;
    viewPortSize:number;
    barSize:number;
    offset:number;
    scaleFactor:number;
    ishor:boolean;
    coord:Coord;

    parentDisplaycell: DisplayCell;
    scrollbarDisplayCell : DisplayCell;

    preBar:DisplayCell;
    Bar:DisplayCell;
    postBar:DisplayCell;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        // console.log("scrollbar Created");
        this.label = `${this.parentDisplaycell.label}_${this.type}`;
        this.build()
        if (!this.coord) this.coord = this.parentDisplaycell.coord;
        
        if (!this.parentDisplaycell.preRenderCallback) {
            this.parentDisplaycell.preRenderCallback = FunctionStack.function(this.label);
        }
        let THIS = this;
        
        FunctionStack.push(this.label,
                    function(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
                        let width = (THIS.ishor) ? THIS.coord.width : THIS.coord.width - THIS.barSize;
                        let height = (THIS.ishor) ? THIS.coord.height - THIS.barSize : THIS.coord.height;
                        THIS.coord.assign( undefined, undefined, width, height, undefined, undefined, width, height);
                    },
              ((this.ishor) ? "ishorTrue" : "ishorFalse"));
        // Handler.update();
    }
    build(){
        let THIS:ScrollBar = this
        //let ishor = this.displaygroup.ishor;

        this.preBar = I(`${this.label}_preBar`, DefaultTheme.ScrollBar_whiteBG, events({onclick:THIS.onPreBar.bind(THIS)}));
        this.Bar = I(`${this.label}_Bar`, DefaultTheme.ScrollBar_blackBG,
                        events({ondrag: {onDown :THIS.onBarDown.bind(THIS), onMove :THIS.onBarMove.bind(THIS)}}));
        this.postBar = I(`${this.label}_postBar`, "100%",DefaultTheme.ScrollBar_whiteBG, events({onclick:THIS.onPostBar.bind(THIS)}));
        this.scrollbarDisplayCell =
        h(`${this.label}_h`, `${this.barSize}px`,
            I(`${this.label}_backArrow`,`${this.barSize}px`, 
                 (this.ishor) ? DefaultTheme.leftArrowSVG("scrollArrows") : DefaultTheme.upArrowSVG("scrollArrows"),
                 events({ onhold:{event:function(mouseEvent:MouseEvent){THIS.onBackArrow(mouseEvent)} }}),
            ),
            this.preBar,
            this.Bar,
            this.postBar,
            I(`${this.label}_forwardArrow`,`${this.barSize}px`, 
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
    onBackArrow(mouseEvent:MouseEvent=undefined){ this.offset -= 3/this.scaleFactor; this.validateOffsetAndRender();}
    onForwardArrow(mouseEvent:MouseEvent=undefined){ this.offset += 3/this.scaleFactor; this.validateOffsetAndRender();}

    validateOffsetAndRender(){
        if (this.offset < 0) this.offset = 0;
        let max = this.displaySize-this.viewPortSize;
        if (this.offset > max) this.offset = max;
        Render.update();
    }

    update(displaySize:number){
        //let coord = this.displaygroup.coord;
        let ishor = this.ishor;
        let width = (ishor) ? this.coord.width : this.coord.width - this.barSize;
        let height = (ishor) ? this.coord.height - this.barSize : this.coord.height;

        let sbx = (ishor) ? this.coord.x : this.coord.x + this.coord.width;
        let sby = (ishor) ? this.coord.y + this.coord.height : this.coord.y;
        let scw = (ishor) ? this.coord.width : this.barSize;
        let sch = (ishor) ? this.barSize : this.coord.height;

        this.scrollbarDisplayCell.coord.assign(sbx, sby, scw, sch, sbx, sby, scw, sch, this.coord.zindex);
        // this.coord.assign( undefined, undefined, width, height, undefined, undefined, width, height);

        this.displaySize = displaySize;
        this.viewPortSize = (ishor) ? this.parentDisplaycell.coord.width : this.parentDisplaycell.coord.height;
        let scrollBarSize = this.viewPortSize - this.barSize*2;
        this.scaleFactor = scrollBarSize/this.displaySize;

        this.preBar.dim = `${ Math.round(this.offset * this.scaleFactor) }px`
        this.Bar.dim = `${ Math.round(this.viewPortSize*this.scaleFactor) }px`;
        return this.offset;
    }
    // render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
    //     // console.log("render In Scrollbar")
    //     Render.update(this.scrollbarDisplayCell, derender);
    //     //Handler.renderDisplayCell(this.scrollbarDisplayCell, undefined, undefined, derender);
    // }

    static Render(scrollbar_:ScrollBar, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        // Render.update(scrollbar_.scrollbarDisplayCell, derender);
        let renderChildren = new RenderChildren;
        renderChildren.RenderSibling(scrollbar_.scrollbarDisplayCell, derender);
        return {zindex,
            siblings: renderChildren.siblings};
    }
    delete(){
        // console.log(`ScrollBar :${this.label} destroyed`);
        FunctionStack.pop(this.label, ((this.ishor) ? "ishorTrue" : "ishorFalse"))
        Render.update(this.scrollbarDisplayCell, true);
        //Handler.renderDisplayCell(this.scrollbarDisplayCell, undefined, undefined, true);
        ScrollBar.pop(this);
    }
    onWheel(event:WheelEvent) {
        //console.log("Wheel Event", event.deltaY);
        if (event.deltaY > 0) this.onForwardArrow();
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
                if (instance.parentDisplaycell.coord.isPointIn(event.clientX, event.clientY))
                    scrollbar = instance;
        }
        if (scrollbar) scrollbar.onWheel(event)
    }
    static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
        let ishor = THIS.ishor;
        let displaycell = THIS.parentDisplaycell;
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
function scrollbar(...Arguments:any) {
    let overlay=new Overlay("ScrollBar", ...Arguments);
    let newScrollBar = <ScrollBar>overlay.returnObj;
    let parentDisplaycell = newScrollBar.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["ScrollBar"] = ScrollBar;





// class ScrollBar extends Base {
//     static instances:ScrollBar[] = [];
//     static activeInstances:ScrollBar[] = [];
    
//     // static whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;");
//     // static blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
//     static defaults = {
//         offset : 0, displayAtEnd: true, scrollWidth : 15, currentlyRendered: true, arrowOffset: 2,
//     }
//     static argMap = {
//         string : ["label"],
//         DisplayGroup: ["displaygroup"],
//         number: ["fixedPixels", "viewingPixels", "scroolWidth"],
//         boolean: ["displayAtEnd"]
//     }
//     static scrollWheelMult = 4;
//     static triggerDistance = 40;

//     label:string;
//     currentlyRendered: boolean;
//     ishor: boolean;

//     arrowOffset:number;
//     scrollWidth: number;
//     displayAtEnd:boolean;
//     fixedPixels: number;
//     viewingPixels: number;
//     offset: number;
//     maxOffset: number;
//     offsetAtDrag: number;
//     offsetPixelRatio: number;

//     parentDisplaygroup: DisplayGroup;
//     displaygroup: DisplayGroup;

//     displaycell: DisplayCell;
//     leftArrow: DisplayCell;
//     upArrow: DisplayCell;
//     prePaddle: DisplayCell;
//     paddle: DisplayCell;
//     postPaddle: DisplayCell;
//     rightArrow: DisplayCell;
//     downArrow: DisplayCell;
//     paddleSizePx:number;
//     clickPageSize: number;
//     // displayedFixedPx: number;
    

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
        
//         ScrollBar.makeLabel(this);
//         this.build();
//     }
//     build(){
//         let THIS = this;
//         let off = this.arrowOffset;
//         let ss = this.scrollWidth;
//         let w = ss-off;
//         let mid = ss/2;

//         this.leftArrow = I(this.label+"_Left", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${mid} ${w},${off} ${w},${w} ${off},${mid}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
//                                                   })
//             );


//         this.upArrow = I(this.label+"_Up", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${w} ${mid},${off} ${w},${w} ${off},${w}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
//                                                   })
//         );

//         this.prePaddle = I(this.label+"_Pre", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageLeftorUp(mouseEvent)}}));
//         this.paddle = I(this.label+"_Paddle", "","blackBG", events({ondrag: { onDown :function(){THIS.offsetAtDrag = THIS.offset},
//                                                                               onMove :function(output:object){THIS.dragging(output)},
//                                                            /* onUp: function(output:object){console.log("mouseup");console.log(output)}*/
//                                                           }
//                         }));
//         this.postPaddle = I(this.label+"_Post", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageRightOrDown(mouseEvent)}}));
            
//         this.rightArrow = I(this.label+"_Right", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${off} ${w},${mid} ${off},${w} ${off},${off}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
//                                                   })
//         );

//         this.downArrow = I(this.label+"_down", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${off} ${w},${off} ${mid},${w} ${off},${off}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
//                                                   })
//         );            

//         this.ishor = this.displaygroup.ishor;
//         this.displaycell = h(   this.ishor, // note even though I'm using H - id chooses here.
//                                 (this.ishor) ? this.leftArrow : this.upArrow,
//                                 this.prePaddle,
//                                 this.paddle,
//                                 this.postPaddle,
//                                 (this.ishor) ? this.rightArrow : this.downArrow,
//                                 this.label,
//                             );
//     }
//     clickLeftorUp(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
//         this.offset -= (this.offsetPixelRatio*10)*noTimes;
//         if (this.offset < 0) this.offset = 0;
//         Handler.update();
//     }
//     clickRightOrDown(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
//         this.offset += (this.offsetPixelRatio*10)*noTimes;
//         if (this.offset > this.maxOffset) this.offset = this.maxOffset;
//         Handler.update();
//     }
//     clickPageLeftorUp(mouseEvent:MouseEvent|WheelEvent){
//         this.offset -= this.clickPageSize;
//         if (this.offset < 0) this.offset = 0;
//         Handler.update();
//     }
//     clickPageRightOrDown(mouseEvent:MouseEvent|WheelEvent){
//         this.offset += this.clickPageSize;
//         if (this.offset > this.maxOffset) this.offset = this.maxOffset;
//         Handler.update();
//     }
//     dragging(output:object){
//         let diff = (this.ishor) ? output["x"]:output["y"];
//         // console.log(diff, diff*this.offsetPixelRatio);
//         let newoffset = this.offsetAtDrag + diff*this.offsetPixelRatio;
//         if (newoffset < 0) newoffset = 0;
//         if (newoffset > this.maxOffset) newoffset = this.maxOffset;
//         this.offset = newoffset;
//         Handler.update();
//     }
//     render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
//         if (!this.parentDisplaygroup) this.parentDisplaygroup = parentDisplaygroup;
//         let dgCoord:Coord = this.displaygroup.coord;
//         // calculate outer scrollbar dimensions

//         // console.log( JSON.stringify(parentDisplaygroup.coord.within, null, 4) )

//         let x = (this.ishor) ? dgCoord.within.x : dgCoord.within.x + dgCoord.within.width - this.scrollWidth;
//         let width = (this.ishor) ? dgCoord.within.width : this.scrollWidth;
//         let y = (this.ishor) ? dgCoord.within.y + dgCoord.within.height - this.scrollWidth : dgCoord.within.y;
//         let height = (this.ishor) ? this.scrollWidth : dgCoord.within.height;

//         // console.log( JSON.stringify({x,y,width,height}, null, 4) )

//         this.displaycell.coord.assign(x, y, width, height);

//         // calculate inner scrollbar dimensions
//         let preDisplayCell = this.displaycell.displaygroup.cellArray[1];
//         let paddleDisplayCell = this.displaycell.displaygroup.cellArray[2];
//         let postDisplayCell = this.displaycell.displaygroup.cellArray[3];
        
//         // "fixedPixels", "viewingPixels"

//         let overflow = this.fixedPixels - this.viewingPixels;
//         if (this.offset > overflow) this.offset = overflow;
//         let viewingPixels = (this.ishor) ? dgCoord.width : dgCoord.height;
//         let fixedPixels = parentDisplaygroup.dimArrayTotal;

//         let paddlePercent = Math.round(viewingPixels/fixedPixels*100);
//         let percentAfterPaddle = Math.round(100 - (viewingPixels/fixedPixels*100));
//         let prePercent = Math.round(percentAfterPaddle*(this.offset/overflow));
//         let postPercent = 100 - paddlePercent - prePercent;

//         preDisplayCell.dim = `${prePercent}%`;
//         paddleDisplayCell.dim = `${paddlePercent}%`;
//         postDisplayCell.dim = `${postPercent}%`;

//         let screenPixelsNotShown = fixedPixels-viewingPixels;
//         let scrollbarPixelsNotShown = viewingPixels-this.scrollWidth*2;
//         this.offsetPixelRatio = screenPixelsNotShown/scrollbarPixelsNotShown; // so bigger than 1:
//         this.clickPageSize = (paddlePercent/100)*fixedPixels

//         // let pixelForStretch = fixedPixels*percentAfterPaddle/100
//         //this.offsetPixelRatio = 
//         //this.clickPageSize = 
//         // console.log(this.clickPageSize)

//         Handler.currentZindex += Handler.zindexIncrement*2;
//         this.currentlyRendered = !derender;
//         // console.log(this.displaycell, this.offset);
//         Handler.renderDisplayCell(this.displaycell, undefined, undefined, derender);
//         Handler.currentZindex -= Handler.zindexIncrement*2;
//     }
//     static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
//         let ishor = THIS.displaygroup.ishor;
//         let displaycell = THIS.displaycell;
//         let coord = displaycell.coord;
//         let x = event.clientX;
//         let y = event.clientY;
//         let dist:number = 0;
//         // console.log(ishor, x, y, coord)
//         if (!ishor) {
//             if (x < coord.x) dist = coord.x -x;
//             if (x > coord.x + coord.width) dist = x - (coord.x + coord.width)
//         } else {
//             if (y < coord.y) dist = coord.y -y;
//             if (y > coord.y + coord.height) dist = y - (coord.y + coord.height)
//         }
//         return dist;
//     }
//     static onWheel(event:WheelEvent) {
//         let selectedInstance:ScrollBar;
//         let minDist:number = 100000;
//         let dist:number;
//         for (let instance of ScrollBar.instances) {
//             if (instance.currentlyRendered) {
//                 if (instance.parentDisplaygroup.coord.isPointIn(event.clientX, event.clientY)
//                     ||instance.displaycell.coord.isPointIn(event.clientX, event.clientY)) {
//                     dist = ScrollBar.distOfMouseFromWheel(instance, event);
//                     if (!selectedInstance || dist < minDist) {
//                         minDist = dist;
//                         selectedInstance = instance;
//                     }
//                 }
//             }
//         }
//         if (selectedInstance) {
//             if (event.deltaY > 0) selectedInstance.clickRightOrDown(event, ScrollBar.scrollWheelMult*event.deltaY/100);
//             if (event.deltaY < 0) selectedInstance.clickLeftorUp(event, -ScrollBar.scrollWheelMult*event.deltaY/100)
//         }
//     }
// }
// Overlay.classes["ScrollBar"] = ScrollBar;
// // export {ScrollBar}