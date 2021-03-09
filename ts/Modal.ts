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
    static bodyCss:Css = css("ModalBody","background-color:white;border: 1px solid black;");
    static optionsCss:Css = css("ModalOptions","background-color:white;border: 1px solid black;display: flex;justify-content: center;align-items: center;");
    static defaults = {
        label : function(){return `Modal_${pf.pad_with_zeroes(Modal.instances.length)}`},
        showHeader : true, showFooter: false, resizeable : true, showClose: true, showOptions: true,
        headerHeight: 20, footerHeight : 20, headerTitle:"", innerHTML:"", optionsHeight: 30,
    }
    static argMap = {
        string : ["label", "headerTitle", "footerTitle", ["innerHTML"]],
        DisplayCell: ["bodyCell", "headerCell", "footerCell", "optionsCell"],
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
    optionsCell:DisplayCell;
    coord:Coord;

    headerHeight: number;
    footerHeight: number;
    optionsHeight: number;

    showHeader:boolean;
    showClose:boolean;
    showFooter:boolean;
    showOptions:boolean;
    resizeable:boolean;

    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    handler: Handler;
    innerHTML:string;

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
                this.coord.assign(x, y, width, height);
            } else if (numberOfArgs == 4) {
                this.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3]);
                // console.log(pf.viewport())
                let vp = pf.viewport();
                // this.coord.copyWithin(0, 0, vp[0], vp[1], true)
                this.coord.within.x = 0;
                this.coord.within.y = 0;
                this.coord.within.width = vp[0];
                this.coord.within.height = vp[1];
                // console.log(this.coord)
            }
        } else {
            if (!this.coord) {
                let vp= pf.viewport();
                this.coord = new Coord( Math.round(vp[0]/4), Math.round(vp[1]/4), Math.round(vp[0]/2), Math.round(vp[1]/2));
                this.coord.within.x = 0;
                this.coord.within.y = 0;
                this.coord.within.width = vp[0];
                this.coord.within.height = vp[1];
            }
        }
        if (!this.minWidth) this.minWidth = this.coord.width;
        if (!this.minHeight) this.minHeight = this.coord.height;
        if (!this.bodyCell){
            this.bodyCell = I(this.label, this.innerHTML, Modal.bodyCss);
        }
        if (this.footerTitle){this.showFooter = true}
        this.build();
    }
    setContent(html:string){
        this.bodyCell.htmlBlock.innerHTML = html;
        Handler.update();
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
                                                     // onUp: function(offset:object){/*console.log(offset,"up")*/}
                                                     // onclick : function(){console.log("clicked")}
                                                    }}),

                                    )
                                );
            if (this.showClose) {this.headerCell.displaygroup.cellArray.push(
                I({innerHTML:`<svg viewPort="0 0 ${this.headerHeight} ${this.headerHeight}" version="1.1"
                              xmlns="http://www.w3.org/2000/svg" style="width: ${this.headerHeight}px; height: ${this.headerHeight}px;">
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
    buildOptions(){
        if (!this.optionsCell)
            this.optionsCell = h(`${this.label}_options`, `${this.optionsHeight}px`,
                                I(`${this.label}_okButton`,`<button onclick="Modal.byLabel('${this.label}').hide()" >OK</button>`, Modal.optionsCss)
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
        // console.log(JSON.stringify(this.coord));
        this.handler = H(`${this.label}_h`,v(this.fullCell),
                          this.coord, false)
        // this.handler.pop();
    }
    show(){
        Handler.activeHandlers.push(this.handler);
        Handler.update();
    }
    hide(){
        this.handler.pop();
    }
    static startMoveModal(handler:Handler){
        //console.log("clicked");
        handler.toTop()
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
