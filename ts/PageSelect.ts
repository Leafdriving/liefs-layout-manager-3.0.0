class Select extends Base {
    static labelNo = 0;
    static instances:Select[] = [];
    static activeInstances:Select[] = [];
    static defaults = {choices:[], currentSelected:0,lastSelected:0,onSelect:function(mouseEvent:PointerEvent, el:any){console.log(mouseEvent, el)}}
    static argMap = {
        string : ["label"],
        Array: ["choices"],
        function: ["onSelect"],
        dim: ["dim"],
    }
    // retArgs:ArgsObj;   // <- this will appear

    label:string;
    selectDisplayCell: DisplayCell;
    arrowDisplayCell: DisplayCell;
    rootDisplayCell: DisplayCell;
    choices: string[];
    menuObj:object;
    dim:string;
    clickableName:DisplayCell;
    onSelect:(mouseEvent:PointerEvent, el:any)=>void;
    lastSelected:number;
    currentSelected:number;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Select.makeLabel(this);
        this.build();
    }
    changeDisplayNameToIndex(index:number){
        this.clickableName.htmlBlock.innerHTML = this.choices[index];
        Render.update();
    }
    build(){
        let THIS = this;
        // this.pages.evalFunction
        if (!this.menuObj) this.buildMenuObj();

        this.clickableName = I(`${this.label}_0`, this.choices[0], DefaultTheme.context /*,events({onclick:contextObjFunction})*/)
        let downArrow = I(`${this.label}_arrow`,"20px" , DefaultTheme.downArrowSVG("scrollArrows"), DefaultTheme.arrowSVGCss);
        
        this.rootDisplayCell = h(`${this.label}_Select`, this.dim,
            this.clickableName,
            downArrow,
        )
        let contextObjFunction = hMenuBar(`${this.label}_context`, {menuObj: this.menuObj, launchcell:this.rootDisplayCell, css:DefaultTheme.context});
        let fullEvents = events({onclick:contextObjFunction});
        this.clickableName.htmlBlock.events = fullEvents;
        downArrow.htmlBlock.events = events({onclick:contextObjFunction});
    }
    onclick(mouseEvent:PointerEvent, index:number, THIS:Select){
        THIS.lastSelected = THIS.currentSelected;
        THIS.currentSelected = index;
        THIS.changeDisplayNameToIndex(index);
        THIS.onSelect(mouseEvent, THIS.choices[index]);
    }
    buildMenuObj(){
        this.menuObj = {};
        let THIS = this;
        for (let index = 0; index < this.choices.length; index++) {
            this.menuObj[ this.choices[index] ] = function(mouseEvent:PointerEvent){THIS.onclick(mouseEvent, index, THIS)}
        }
        let context = <Context>(Context.byLabel(`${this.label}_context`));
        if (context) context.changeMenuObject(this.menuObj);
    }
}
function select(...Arguments:any){return new Select(...Arguments).rootDisplayCell}


class PageSelect extends Base {
    static labelNo = 0;
    static instances:PageSelect[] = [];
    static activeInstances:PageSelect[] = [];
    static defaults = {cellArray:[], ishor:false}
    static argMap = {
        string : ["label"],
        Pages: ["pages"],
        dim: ["dim"],
        DisplayCell: ["whoops"]
    }
    retArgs:ArgsObj;   // <- this will appear

    renderNode:node_; // render node

    dim:string;
    label:string;
    ishor:boolean;
    rootDisplayCell: DisplayCell;
    pages:Pages;
    cellArray: DisplayCell[];
    menuObj:{[key: string]: any}

    whoops:DisplayCell;
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        PageSelect.makeLabel(this);
        if (this.whoops) this.pages = this.whoops.pages;
        this.build()
    }
    updateContextLabel(THIS:PageSelect=this, index:number = this.pages.currentPage, mouseEvent:PointerEvent=undefined){
        let displaycell = <DisplayCell>(DisplayCell.byLabel(`${this.label}_0`));
        let newLabel = this.pages.displaycells[index].label;
        displaycell.htmlBlock.innerHTML = newLabel;
        THIS.pages.currentPage = index;
        Render.update();
    }
    buildMenuObj(){
        let obj = {};
        let THIS = this;
        for (let index = 0; index < this.pages.displaycells.length; index++) {
            let displaycell = this.pages.displaycells[index];
            obj[displaycell.label] = function(mouseEvent:PointerEvent){THIS.updateContextLabel(THIS, index, mouseEvent);}
        }
        this.menuObj = {menuObj : obj}
        let context = <Context>(Context.byLabel(`${this.label}_context`));
        if (context) context.changeMenuObject(this.menuObj.menuObj);
    }
    build(){
        let THIS = this;
        // this.pages.evalFunction
        if (!this.menuObj) this.buildMenuObj();

        let label = this.pages.displaycells[0].label;
        let clickableName = I(`${this.label}_0`, label, DefaultTheme.context /*,events({onclick:contextObjFunction})*/)
        let downArrow = I(`${this.label}_arrow`,"20px" , DefaultTheme.downArrowSVG("scrollArrows"), DefaultTheme.arrowSVGCss);
        
        this.rootDisplayCell = h(`${this.label}_PageSelect`, 
            clickableName,
            downArrow,
            )
        this.rootDisplayCell.dim = this.dim;

        let contextObjFunction = hMenuBar(`${this.label}_context`, this.menuObj, {launchcell:this.rootDisplayCell, css:DefaultTheme.context});

        let fullEvents = events({ondrag: swipe({left :THIS.breakFree.bind(THIS),
                                                right:THIS.breakFree.bind(THIS),
                                                up:THIS.breakFree.bind(THIS),
                                                down:THIS.breakFree.bind(THIS),
                                            },10),
                                onclick:contextObjFunction,
                                });
        clickableName.htmlBlock.events = fullEvents;
        downArrow.htmlBlock.events = events({onclick:contextObjFunction});
    }
    breakFree(offset:{x:number, y:number}, mouseEvent:MouseEvent){
        //console.log(offset,mouseEvent)
        let index = this.pages.currentPage;
        let displaycell = this.pages.displaycells[ index ];
        this.pages.displaycells.splice(index, 1);
        this.pages.currentPage = 0;
        let x = this.rootDisplayCell.coord.x + offset.x;
        let y = this.rootDisplayCell.coord.y + offset.y;
        let width = displaycell.coord.width;
        let height = displaycell.coord.height;
        let [sw,sh] = pf.viewport()

        let overlay=new Overlay("winModal", {body: displaycell, headerText: displaycell.label}, x,y,width,height);
        let newWinModal = <winModal>overlay.returnObj;
        newWinModal.rootDisplayCell.addOverlay(overlay);
        this.updateContextLabel();
        this.buildMenuObj();
        Render.update();
    }
    acceptDrop(winModalInstance:winModal){
        console.log(`Hey, ${winModalInstance.label} was dropped on me!`)
        winModalInstance.modal.hide();
        let displaycell = winModalInstance.body;
        this.pages.displaycells.push(displaycell);

        Modal.pop( winModalInstance.modal );
        winModal.pop( winModalInstance);

        this.pages.currentPage = this.pages.displaycells.length -1;
        this.updateContextLabel();
        this.buildMenuObj();
        Render.update();
        //this.pages.displaycells[ index ];
    }
}
function pageselect(...Arguments:any) {
    let ps = new PageSelect(...Arguments);
    return ps.rootDisplayCell;
}

