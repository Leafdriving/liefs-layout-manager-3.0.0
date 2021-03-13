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
        Coord: ["coord"]
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
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    showHeader:boolean;
    showClose:boolean;
    showFooter:boolean;
    showOptions:boolean;
    resizeable:boolean;

    handler: Handler;
    coord:Coord;


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
        if (!this.minWidth) this.minWidth = this.coord.width;
        if (!this.minHeight) this.minHeight = this.coord.height;
        if (!this.bodyCell){this.bodyCell = I(this.label, this.innerHTML, Modal.bodyCss);}
        if (this.footerTitle) {this.showFooter = true}
        Modal.makeLabel(this); // see Base.ts
        this.build();
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
                          this.coord, false)
    }
    show(){
        Handler.activate(this.handler);
        Handler.update();
    }
    hide(){
        this.handler.pop();
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
    static defaults = {}
    static argMap = {
        string : ["label"],
        Modal: ["parentModal"],
    }
    // retArgs:ArgsObj;   // <- this will appear
    parentModal: Modal;
    parentDisplaycell: DisplayCell;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        if (!this.parentDisplaycell && this.parentModal) this.parentDisplaycell = this.parentModal.fullCell;
        Stretch.makeLabel(this);
    }
    render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
        console.log("RenderStretch!");
    }
}
function stretch(...Arguments:any) {
    let overlay=new Overlay("Stretch", ...Arguments);
    let newStretch = <Stretch>overlay.returnObj;
    let parentDisplaycell = newStretch.parentDisplaycell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Stretch"] = Stretch;