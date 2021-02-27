class Modal {
    static instances:Modal[] = [];
    static byLabel(label:string):Modal{
        for (let key in Modal.instances)
            if (Modal.instances[key].label == label)
                return Modal.instances[key];
        return undefined;
    }
    static headerCss:Css = css("HeaderTitle","background-color:blue;color:white;text-align: center;border: 1px solid black;cursor: -webkit-grab; cursor: grab;")
    static footerCss:Css = css("FooterTitle","background-color:white;color:black;border: 1px solid black;");
    static closeCss:Css = css("Close","background-color:white;color:black;border: 1px solid black;font-size: 20px;");
    static closeCssHover:Css = css("Close:hover","background-color:red;color:white;border: 1px solid black;font-size: 20px;");
    static defaults = {
        label : function(){return `Modal_${pf.pad_with_zeroes(Modal.instances.length)}`},
        showHeader : true, showFooter: true, resizeable : true, showClose: true,
        headerHeight: 20, footerHeight : 20, headerTitle:""
    }
    static argMap = {
        string : ["label", "headerTitle", "footerTitle"],
        DisplayCell: ["bodyCell", "headerCell", "footerCell"],
        Coord: ["coord"]
    }
    static x:number; // used during move Modal
    static y:number; // used during move Modal
    label:string;

    fullCell:DisplayCell;
    headerTitle:string;
    footerTitle:string;
    headerCell:DisplayCell;
    bodyCell:DisplayCell;
    footerCell:DisplayCell;
    coord:Coord;

    headerHeight: number;
    footerHeight: number;

    showHeader:boolean;
    showClose:boolean;
    showFooter:boolean;
    resizeable:boolean;

    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    handler: Handler;

    constructor(...Arguments: any) {
        Modal.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Modal");
        mf.applyArguments("Modal", Arguments, Modal.defaults, Modal.argMap, this);
        
        if ("number" in retArgs){
            if (!this.coord) this.coord = new Coord();
            let numbers = retArgs["number"]
            let numberOfArgs = numbers.length;
            let x:number, y:number, width:number, height:number;
            if (numberOfArgs == 2) {
                let vp= pf.viewport();
                width=numbers[0];
                height=numbers[1];
                x = (vp[0] - width)/2;
                y = (vp[1] - height)/2;
                this.coord.replace(x, y, width, height);
            } else if (numberOfArgs == 4) {
                this.coord.replace(numbers[0], numbers[1], numbers[2], numbers[3])
            }
        } else {
            if (!this.coord) {
                let vp= pf.viewport();
                this.coord = new Coord( Math.round(vp[0]/4), Math.round(vp[1]/4), Math.round(vp[0]/2), Math.round(vp[1]/2));
            }
        }
        if (!this.minWidth) this.minWidth = this.coord.width;
        if (!this.minHeight) this.minHeight = this.coord.height;
        this.build();
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
                                                     onUp: function(offset:object){console.log(offset,"up")}
                                                    }}),

                                    )
                                );
            if (this.showClose) {this.headerCell.displaygroup.cellArray.push(
                I({innerHTML:`<svg viewPort="0 0 ${this.headerHeight} ${this.headerHeight}" version="1.1"
                              xmlns="http://www.w3.org/2000/svg">
                              <line x1="3" y1="${this.headerHeight-3}" 
                                x2="${this.headerHeight-3}" y2="3" 
                                stroke="black" 
                                stroke-width="2"/>
                              <line x1="3" y1="3" 
                                x2="${this.headerHeight-3}" y2="${this.headerHeight-3}" 
                                stroke="black" 
                                stroke-width="2"/>
                              </svg>`
                    },
                    Modal.closeCss,
                    `${this.headerHeight}px`,
                    events({onclick:function(){ THIS.hide() }}))
            )}
        }
    }
    buildFooter(){
        if (!this.footerCell)
            this.footerCell = h(`${this.label}_footer`, `${this.footerHeight}px`,
                                I(`${this.label}_footerTitle`,this.footerTitle, Modal.footerCss)
                                );
    }
    buildFull(){
        this.fullCell = v(this.bodyCell)
        if (this.showHeader){
            this.fullCell.displaygroup.cellArray.unshift(this.headerCell)
        }
        if (this.showFooter) {
            this.fullCell.displaygroup.cellArray.push(this.footerCell);
        }
    }
    build() {
        this.buildHeader();
        this.buildFooter();
        this.buildFull();
        this.handler = H( v(this.fullCell),
                          this.coord )
        this.handler.pop();
    }
    show(){
        Handler.instances.push(this.handler);
        Handler.update();
    }
    hide(){
        this.handler.pop();
    }
    static startMoveModal(handler:Handler){
        Modal.x = handler.coord.x;
        Modal.y = handler.coord.y;
        // handler.toTop();
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
