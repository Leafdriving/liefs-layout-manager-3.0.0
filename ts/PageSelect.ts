
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
        this.pages.evalFunction
        if (!this.menuObj)this.buildMenuObj();

        let label = this.pages.displaycells[0].label;
        let clickableName = I(`${this.label}_0`, label, DefaultTheme.context /*,events({onclick:contextObjFunction})*/)
        let downArrow = I(`${this.label}_arrow`,"20px" , DefaultTheme.downArrowSVG("scrollArrows"));
        
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
