class Modal extends Base {
    static instances:Modal[] = [];
    static activeInstances:Modal[] = [];

    static headerCss:Css = css("HeaderTitle","background-color:blue;color:white;text-align: center;border: 1px solid black;cursor: -webkit-grab; cursor: grab;")
    static footerCss:Css = css("FooterTitle","background-color:white;color:black;border: 1px solid black;");
    static closeCss:Css = css("Close","background-color:white;color:black;border: 1px solid black;font-size: 20px;");
    static closeCssHover:Css = css("Close:hover","background-color:red;color:white;border: 1px solid black;font-size: 20px;");
    static bodyCss:Css = css("ModalBody","background-color:white;border: 1px solid black;");
    static optionsCss:Css = css("ModalOptions","background-color:white;border: 1px solid black;display: flex;justify-content: center;align-items: center;");
    static defaults = {
        showHeader : true, showFooter: false, resizeable : true, showClose: true, showOptions: true,
        headerHeight: 20, footerHeight : 20, headerTitle:"",footerTitle:"" ,  innerHTML:"", optionsHeight: 30,
    }
    static argMap = {
        string : ["label", "innerHTML", "headerTitle", "footerTitle"],
        DisplayCell: ["bodyCell", "optionsCell", "footerCell", "headerCell"],
        Coord: ["coord", "withinCoord"]
    }
    static x:number; // used during move Modal
    static y:number; // used during move Modal
    label:string;
    headerTitle:string;
    footerTitle:string;
    innerHTML:string;

    fullCell:DisplayCell;
    headerCell:DisplayCell;
    bodyCell:DisplayCell;
    optionsCell:DisplayCell;
    footerCell:DisplayCell;

    headerHeight: number;
    optionsHeight: number;
    footerHeight: number;

    showHeader:boolean;
    showClose:boolean;
    showFooter:boolean;
    showOptions:boolean;
    resizeable:boolean;

    handler: Handler;
    coord:Coord;
    withinCoord: Coord;


    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        if ("number" in this.retArgs){
            this.setSize(...this.retArgs["number"]);
        } 
        if (!this.coord) {
            let [vpX, vpY] = pf.viewport();
            this.coord = new Coord( Math.round(vpX/4), Math.round(vpY/4), Math.round(vpX/2), Math.round(vpY/2));
            this.coord.within.x = this.coord.within.y = 0;
            this.coord.within.width = vpX;
            this.coord.within.height = vpY;
        }
        if (!this.withinCoord) {this.withinCoord = Handler.activeInstances[0].rootCell.coord;}

        if (!this.fullCell) {
            if (!this.bodyCell){this.bodyCell = I(this.label, this.innerHTML, Modal.bodyCss);}
            if (this.footerTitle) {this.showFooter = true}
            Modal.makeLabel(this); // see Base.ts
            this.build();
        }
    }
    setSize(...numbers:number[]) {
        let [vpX, vpY] = pf.viewport();
        let numberOfArgs = numbers.length;
        let x:number, y:number, width:number, height:number;
        if (numberOfArgs >= 2 && numberOfArgs < 4) {
            if (!this.coord) this.coord = new Coord();
            width=numbers[0];
            height=numbers[1];
            x = (vpX - width)/2;
            y = (vpY - height)/2;
            this.coord.assign(x, y, width, height);
        } else if (numberOfArgs >= 4) {
            if (!this.coord) this.coord = new Coord();
            this.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3]);
            this.coord.within.x = this.coord.within.y = 0;
            this.coord.within.width = vpX;
            this.coord.within.height = vpY;
        }
    }
    setContent(html:string){this.bodyCell.htmlBlock.innerHTML = html;Handler.update();}
    setTitle(html:string) {this.headerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html;Handler.update();}
    setFooter(html:string) {this.footerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html;Handler.update();}
    buildClose(): DisplayCell {
        let THIS = this;
        return I({innerHTML:`<svg viewPort="0 0 ${this.headerHeight} ${this.headerHeight}" version="1.1"
        xmlns="http://www.w3.org/2000/svg" style="width: ${this.headerHeight}px; height: ${this.headerHeight}px;">
        <line x1="3" y1="${this.headerHeight-3}" x2="${this.headerHeight-3}" y2="3" 
          stroke="black" stroke-width="2"/>
        <line x1="3" y1="3" x2="${this.headerHeight-3}" y2="${this.headerHeight-3}" 
          stroke="black" stroke-width="2"/></svg>`
        },
        Modal.closeCss,
        `${this.headerHeight}px`,
        events({onclick:function(){ THIS.hide() }}))
    }
    buildHeader(){
        let THIS = this;
        if (!this.headerCell){
            this.headerCell = h(`${this.label}_header`, `${this.headerHeight}px`,
                                I(`${this.label}_headerTitle`,
                                    this.headerTitle,
                                    Modal.headerCss,
                                    events({ondrag: {onDown : function(){return Modal.startMoveModal(THIS.handler)},
                                                     onMove : function(offset:object) {return Modal.moveModal(THIS.handler, offset)},
                                                    }}),
                                ));
            if (this.showClose) {this.headerCell.displaygroup.cellArray.push(this.buildClose())}
        }
    }
    buildFooter(){
        if (!this.footerCell)
            this.footerCell = h(`${this.label}_footer`, `${this.footerHeight}px`,
                                I(`${this.label}_footerTitle`,this.footerTitle, Modal.footerCss)
                                );
    }
    buildOptions(){
        let THIS = this;
        if (!this.optionsCell)
            this.optionsCell = h(`${this.label}_options`, `${this.optionsHeight}px`,
                                I(`${this.label}_okButton`,
                                    `<button>OK</button>`,
                                    Modal.optionsCss,
                                    events({onclick:function(){ THIS.hide() }}))
                                );
    }
    buildFull(){
        this.fullCell = v(this.bodyCell)
        if (this.showHeader){
            this.fullCell.displaygroup.cellArray.unshift(this.headerCell)
        }
        if (this.showOptions) {
            this.fullCell.displaygroup.cellArray.push(this.optionsCell);
        }
        if (this.showFooter) {
            this.fullCell.displaygroup.cellArray.push(this.footerCell);
        }
    }
    build() {
        this.buildHeader();
        this.buildFooter();
        this.buildOptions();
        this.buildFull();
        this.handler = H(`${this.label}_h`,v(this.fullCell),
                          this.coord, false, this.preRenderCallback.bind(this))
    }
    show(){
        Handler.activate(this.handler);
        Handler.update();
    }
    hide(){
        this.handler.pop();
    }
    preRenderCallback(handler:Handler){
        let within = this.withinCoord.within;
        let x = within.x, y=within.y, x2 = within.x + within.width, y2 = within.y + within.height;
        let coord = handler.coord;
        if (coord.x + coord.width > x2) coord.x = x2 - coord.width;  // something
        if (coord.x < x) {coord.width += coord.x;coord.x = x;}       // is off here - make outer margin huge to see!
        if (coord.y + coord.height > y2) coord.y = y2 - coord.height;
        if (coord.y < y) {coord.height += coord.y;coord.y = y;}
    }
    static startMoveModal(handler:Handler){
        handler.toTop()
        Modal.x = handler.coord.x;
        Modal.y = handler.coord.y;
    }
    static moveModal(handler:Handler, offset:object){
        let vp=pf.viewport()
        let x=Modal.x + offset["x"];
        if (x < 0) x = 0;
        if (x+handler.coord.width > vp[0]) x = vp[0] - handler.coord.width;
        handler.coord.x = x;

        let y=Modal.y + offset["y"]
        if (y < 0) y = 0;
        if (y+handler.coord.height > vp[1]) y = vp[1] - handler.coord.height;
        handler.coord.y = y;
        Handler.update();
    }
}

class Stretch extends Base {
    static labelNo = 0;
    static instances:Stretch[] = [];
    static activeInstances:Stretch[] = [];
    static defaults = {
        pxSize:10, minWidth:200, minHeight:200,onUpCallBack:function(){},
    }
    static argMap = {
        string : ["label"],
        Modal: ["parentModal"],
    }
    static NWcss = new Css("NWcss",`cursor: nw-resize;`);
    static NEcss = new Css("NEcss",`cursor: ne-resize;`);
    static startCoord = new Coord();
    static corner:string;
    // retArgs:ArgsObj;   // <- this will appear
    label: string;

    parentModal: Modal;
    parentDisplaycell: DisplayCell;
    pxSize: number;

    UL: DisplayCell;
    UR: DisplayCell;
    LL: DisplayCell;
    LR: DisplayCell;

    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    onUpCallBack: Function;

    events(corner:string) {
        let THIS = this;
        return events({ondrag: {onDown :
            function(mouseDiff:object){
                let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
                Stretch.startCoord.copy(coord); Stretch.corner = corner;
            },                      onMove :
            function(diff:{x:number, y:number}) {
                let [vpX, vpY] = pf.viewport();
                let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
                let ssc = Stretch.startCoord;
                let x:number,y:number,width:number,height:number
                switch (Stretch.corner) {
                    case "UL":
                        width = ssc.width - diff.x;
                        if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
                        height = ssc.height - diff.y;
                        if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
                        x = ssc.x + diff.x;
                        if (x < 0) {width += x;x = 0;}
                        y = ssc.y + diff.y;
                        if (y < 0) {height += y;y = 0;}
                        break;
                    case "UR":
                        x= ssc.x;
                        width = ssc.width + diff.x;
                        if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
                        if (x + width > vpX) {width += (vpX - (x+width));}
                        height = ssc.height - diff.y;
                        if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
                        y = ssc.y + diff.y;
                        if (y < 0) {height += y;y = 0;}
                        break;
                    case "LL":
                        width = ssc.width - diff.x;
                        if (width < THIS.minWidth) {diff.x -= (THIS.minWidth - width);width = THIS.minWidth;}
                        x = ssc.x + diff.x;
                        if (x < 0) {width += x;x = 0;}
                        y = ssc.y; 
                        height = ssc.height + diff.y;
                        if (height < THIS.minHeight) {diff.y -= (THIS.minHeight - height);height = THIS.minHeight;}
                        if (height + y > vpY) {height = vpY - y;}
                        break;
                    case "LR":
                        x=ssc.x; y=ssc.y;
                        width = ssc.width + diff.x;
                        if (width < THIS.minWidth) width = THIS.maxWidth;
                        if (width + x > vpX) width = vpX - x;
                        height = ssc.height + diff.y;
                        if (height < THIS.minHeight) height = THIS.maxHeight;
                        if (height + y > vpY ) height = vpY - y;
                        break;
                    default:
                        break;
                }
                coord.assign(x, y, width, height);
                Handler.update();
            },
            onUp : this.onUpCallBack
        }})
    };

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        if (!this.parentDisplaycell && this.parentModal) this.parentDisplaycell = this.parentModal.fullCell;
        this.UL = I(`${this.label}_UL`, Stretch.NWcss, this.events("UL"));
        this.UR = I(`${this.label}_UR`, Stretch.NEcss, this.events("UR"));
        this.LL = I(`${this.label}_LL`, Stretch.NEcss, this.events("LL"));
        this.LR = I(`${this.label}_LR`, Stretch.NWcss, this.events("LR"));
        Stretch.makeLabel(this);
    }

    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        if (!derender) {
            let coord = this.parentDisplaycell.coord;
            this.UL.coord.assign(coord.x, coord.y, this.pxSize, this.pxSize,
                                    coord.within.x, coord.within.y, coord.within.width, coord.within.height,
                                    coord.zindex + Handler.zindexIncrement);

            this.UR.coord.assign(coord.x+coord.width-this.pxSize+1 , coord.y, this.pxSize, this.pxSize,
                coord.within.x, coord.within.y, coord.within.width, coord.within.height,
                coord.zindex + Handler.zindexIncrement);

            this.LL.coord.assign(coord.x, coord.y+coord.height-this.pxSize+1, this.pxSize, this.pxSize,
                coord.within.x, coord.within.y, coord.within.width, coord.within.height,
                coord.zindex + Handler.zindexIncrement);

            this.LR.coord.assign(coord.x+coord.width-this.pxSize+1, coord.y+coord.height-this.pxSize+1, this.pxSize, this.pxSize,
                coord.within.x, coord.within.y, coord.within.width, coord.within.height,
                coord.zindex + Handler.zindexIncrement);                
        }
        let array = [this.UL, this.UR, this.LL, this.LR];
        for (let index = 0; index < array.length; index++) 
            Handler.renderDisplayCell(array[index], undefined, undefined, derender);
    }
}
function stretch(...Arguments:any) {
    let overlay=new Overlay("Stretch", ...Arguments);
    let newStretch = <Stretch>overlay.returnObj;
    let parentDisplaycell = newStretch.parentDisplaycell;
    parentDisplaycell.addOverlay(overlay);
    return (newStretch.parentModal) ? newStretch.parentModal : parentDisplaycell;
}
Overlay.classes["Stretch"] = Stretch;




// events({ondrag: {onDown :function(xmouseDiff:object){
//     if (pf.isTypePercent(dragbar.parentDisplaycell.dim)) {
//         dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplaycell);
//     }
//     dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplaycell.dim);
// },
// onMove :function(xmouseDiff:object){
//     let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"]: xmouseDiff["y"])*((dragbar.isLast) ? -1 :1);
//     if (newdim > dragbar.max) newdim = dragbar.max;
//     if (newdim < dragbar.min) newdim = dragbar.min;
//     dragbar.parentDisplaycell.dim = `${newdim}px`;
//     Handler.update();
// },
// // onUp: function(ouxmouseDifftput:object){}
// } })