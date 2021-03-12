class Context extends Base {
    static lastRendered: Context;
    static subOverlapPx = 4;
    static instances:Context[] = [];
    static activeInstances:Context[] = [];

    static defaultMenuBarCss = css("menuBar","background-color:white;color: black;");
    static defaultMenuBarHover = css("menuBar:hover","background-color:black;color: white;");
    static defaultMenuBarNoHoverCss = css("menuBarNoHover","background-color:white;color: black;");
    static defaultObj = {one:function(){console.log("one")},
                         two:function(){console.log("two")},
                         three:function(){console.log("three")},
                        }
    static defaults = {
        width : 100,
        cellheight : 25,
        css: Css.theme.context, //Context.defaultContextCss
    }
    static argMap = {
        string : ["label"],
        number : ["width", "cellheight"]
    }

    label:string;
    menuObj:object;
    x: number;
    y: number;
    width:number;
    cellheight:number;
    height:number;
    displaycell: DisplayCell;
    coord:Coord = new Coord();
    css: Css;
    handler:Handler;
    launchcell:DisplayCell;
    parentContext:Context;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);

        if (!this.menuObj) this.menuObj = Context.defaultObj;
        this.height = Object.keys(this.menuObj).length*this.cellheight;
        Context.makeLabel(this);
        this.buildCell();
    }
    buildCell(){
        let THIS = this;
        let cellArray:DisplayCell[] = [];
        let numKeys = Object.keys(this.menuObj).length;
        let index = 0;
        let newContext: Context;
        this.displaycell = v({cellArray:[/* filled at bottom */]})

        for (let key in this.menuObj) {
            let valueFunctionOrObject = this.menuObj[key];
            if (typeof(valueFunctionOrObject) == "function"){
                cellArray.push(I(   ( (index == numKeys-1)?"100%":`${this.cellheight}px`  ),
                                    {innerHTML: key},
                                    this.css,
                                    events({onclick: function(mouseEvent:MouseEvent){
                                        valueFunctionOrObject(mouseEvent);
                                        THIS.popAll();
                                    }})
                                ));
            } else {
                newContext = new Context({menuObj:valueFunctionOrObject,
                                          width: this.width,
                                          cellheight: this.cellheight,
                                          css: this.css,
                                          parentContext: this
                                        });
                newContext.launchcell=I(( (index == numKeys-1)?"100%":`${this.cellheight}px`),
                        {innerHTML: key},
                        this.css,
                        events({onmouseover: function() {
                                    let coord = THIS.coord;
                                    if (!newContext.handler)
                                        newContext.render(undefined, coord.x + coord.width - Context.subOverlapPx,
                                                        coord.y + THIS.cellheight*(index-2) - Context.subOverlapPx);
                                }
                        })
                );
                cellArray.push(newContext.launchcell);       
            }
            index += 1; 
        }
        this.displaycell.displaygroup.cellArray = cellArray;
    }
    popAll(){
        this.pop();
        if (this.parentContext) this.parentContext.popAll();
        else window.onmousemove = function(){};
    }
    pop(){
        this.handler.pop();
        this.handler = undefined;
        if (this.parentContext) Context.lastRendered = this.parentContext;
    }
    managePop(mouseEvent:MouseEvent) {
        let x = mouseEvent.clientX;
        let y= mouseEvent.clientY;
        let pop = !this.displaycell.coord.isPointIn(x,y)
        if (pop && this.launchcell && this.launchcell.coord.isPointIn(x,y)) pop = false;
        let THIS = this
        if (pop){
            if (this.parentContext)
                window.onmousemove = function(mouseEvent:MouseEvent){THIS.parentContext.managePop(mouseEvent);};
            else
            window.onmousemove = function(){};
            this.pop();
        }
    }
    render(mouseEvent:MouseEvent, x:number=0, y:number=0) {
        if (mouseEvent){
            x=mouseEvent.clientX - Context.subOverlapPx;
            y=mouseEvent.clientY - Context.subOverlapPx;
        }
        this.coord.assign(x, y, this.width, this.height);
        this.handler = H(this.displaycell, this.coord);
        let THIS = this;
        window.onmousemove = function(mouseEvent:MouseEvent){THIS.managePop(mouseEvent);}
        Context.lastRendered = this;
    }
    hMenuBarx(){return this.launchcell.coord.x}
    hMenuBary(){return this.launchcell.coord.y+this.launchcell.coord.height}

    vMenuBarx(){return this.launchcell.coord.x + this.launchcell.coord.width}
    vMenuBary(){return this.launchcell.coord.y}
}
let context = function(...Arguments:any){
    let newcontext=new Context(...Arguments);
    return function(mouseEvent:MouseEvent){newcontext.render(mouseEvent);return false;}
}
let hMenuBar = function(...Arguments:any){ // requires launchcell
    let newcontext=new Context(...Arguments);
    return function(mouseEvent:MouseEvent){
        if (Context.lastRendered && Context.lastRendered.handler){
            Context.lastRendered.popAll();
        }
        newcontext.render(undefined, newcontext.hMenuBarx(), newcontext.hMenuBary());
        return false;
    }
}
let vMenuBar = function(...Arguments:any){ // requires launchcell
    let newcontext=new Context(...Arguments);
    return function(mouseEvent:MouseEvent){newcontext.render(undefined, newcontext.vMenuBarx(), newcontext.vMenuBary());return false;}
}
