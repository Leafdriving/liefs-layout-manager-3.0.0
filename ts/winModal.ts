
class winHolder extends Base {
    static labelNo = 0;
    static instances:winHolder[] = [];
    static activeInstances:winHolder[] = [];
    static defaults = {winModals:[]}
    static argMap = {
        string : ["label"],
    }
    retArgs:ArgsObj;   // <- this will appear

    winModals:winModal[];

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);        
        winHolder.makeLabel(this);
        if ("winModal" in this.retArgs) this.winModals = this.retArgs["winModal"];
        for (let index = 0; index < this.winModals.length; index++)
            this.disableWinModal(this.winModals[index]);
    }
    add(winmodal:winModal, index:number = undefined) {
        this.disableWinModal(winmodal);
        if (index != undefined) this.winModals.splice(index, 0, winmodal);
        else this.winModals.push(winmodal);
    }
    pop(winmodal:winModal) {
        this.enableWinModal(winmodal);
        let index = this.winModals.indexOf(winmodal);
        if (index > -1) this.winModals.splice(index, 1);
    }
    disableWinModal(winmodal:winModal){
            winmodal.modal.hide();
            winmodal.modal.rootDisplayCell.popOverlay("winModal");
    }
    enableWinModal(winmodal:winModal){

    }
}





class winModal extends Base {
    // static titleCss = css("modalTitle",`-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
    // border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`)
    static labelNo = 0;
    static instances:winModal[] = [];
    static activeInstances:winModal[] = [];
    static defaults = {headerHeight: 15, buttonsHeight: 50, footerHeight:20, headerText:"Window", bodyText:"Body"}
    static argMap = {
        string : ["label"],
    }
    retArgs:ArgsObj;   // <- this will appear
    label:string;
    parentHolder: winHolder;

    rootDisplayCell: DisplayCell;

    header: DisplayCell;
    headerHeight: number;
    headerText:string;

    body: DisplayCell;
    bodyText: string;

    footer: DisplayCell;
    footerHeight:number;
    footerText:string;
    hiddenCells:DisplayCell[];

    modal: Modal;
    previousModalHeight:number;
    static validDropWinModalInstance:winModal;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        winModal.makeLabel(this);
        this.build();
        let THIS=this;
        window.addEventListener('ModalDropped', function (e:CustomEvent) {THIS.dropped(e)}, false);
    }
    dropped(e:CustomEvent){
        let modal = <Modal>e.detail;
        if (winModal.validDropWinModalInstance == this){
            winModal.validDropWinModalInstance = undefined;
            console.log("I Was Dropped On");
            
            this.hightlightHeader(false);

            //modal.hide();
            //modal.rootDisplayCell.popOverlay("winModal");
            

            // this.modal.coord.height += modal.coord.height;
            // this.modal.rootDisplayCell = v(
            //     this.modal.rootDisplayCell,
            //     modal.rootDisplayCell,
            // )
            // console.log(this.modal.rootDisplayCell);
            //modal.rootDisplayCell.dim = `${modal.coord.height}px`;
            // this.modal.rootDisplayCell.displaygroup.cellArray.push(
            //     modal.rootDisplayCell
            // );
            //Handler.update();
            
            //console.log(this.modal.label, modal.label)
            // let displaygroup = this.modal.rootDisplayCell.displaygroup;
            // modal.rootDisplayCell.dim = `${modal.coord.height}px`;
            
            // displaygroup.cellArray.push( modal.rootDisplayCell )
            
        }
    }
    buildClose(): DisplayCell {
        return I(`${this.label}_close`, DefaultTheme.closeSVG, DefaultTheme.closeCss, `${this.headerHeight}px`);
    }
    buildHeader(){
        let THIS:winModal = this;
        this.header =  h(`${this.label}_header`, `${this.headerHeight}px`,
            I(`${this.label}_title`, this.headerText, DefaultTheme.titleCss, events({ondblclick: THIS.toggleCollapse.bind(THIS) })),
            this.buildClose(),
        )
        return this.header;
    }
    buildBody(){
        this.body = I(`${this.label}_body`, this.bodyText, DefaultTheme.closeCss)
        return this.body;
    }
    buildFooter(){
        this.footer = I(`${this.label}_footer`, this.footerText, `${this.footerHeight}px`);
        return this.footer;
    }
    toggleCollapse(mouseEvent:MouseEvent){
        // console.log("ArrayLength", this.rootDisplayCell.displaygroup.cellArray.length);
        if (this.rootDisplayCell.displaygroup.cellArray.length > 1)
            this.toggleClose();
        else
            this.toggleOpen();
    }
    toggleClose(){
        for (let index = 1; index < this.rootDisplayCell.displaygroup.cellArray.length; index++)
            Handler.renderDisplayCell(this.rootDisplayCell.displaygroup.cellArray[index], undefined, undefined, true);
        this.hiddenCells = this.rootDisplayCell.displaygroup.cellArray
        this.rootDisplayCell.displaygroup.cellArray = [this.rootDisplayCell.displaygroup.cellArray[0]];
        let coord = this.modal.coord;
        this.previousModalHeight = coord.height;
        this.modal.setSize(coord.x, coord.y, coord.width, this.headerHeight);
        this.rootDisplayCell.dim = `${this.headerHeight}px`;
        Handler.update();
    }
    toggleOpen(){
        this.rootDisplayCell.displaygroup.cellArray = this.hiddenCells;
        let coord = this.modal.coord;
        this.rootDisplayCell.dim = `${this.previousModalHeight}px`;
        this.modal.setSize(coord.x, coord.y, coord.width, this.previousModalHeight);
        Handler.update();
    }
    build(){
        this.buildHeader();
        if (!this.body) this.buildBody();
        if (this.footerText) this.buildFooter();
        
        let cells:DisplayCell[] = [this.header, this.body];
        if (this.footer) cells.push(this.footer);
        
        this.rootDisplayCell = v(`${this.label}_V`, ...cells);
        let numbers = this.retArgs["number"];
        
        if (!numbers) numbers = [];
        this.modal = new Modal(`${this.label}_modal`, this.rootDisplayCell, ...numbers, {type: ModalType.winModal});
        this.modal.dragWith(`${this.label}_title`);
        this.modal.closeWith(`${this.label}_close`);
        this.modal.show();
    }
    render(displaycell:DisplayCell, displayGroup: DisplayGroup, index:number, derender:boolean) {
        //console.log(this.label)
        if (Modal.movingInstace && Modal.movingInstace != this.modal) {
            let movingHeader = Modal.movingInstace.rootDisplayCell.displaygroup.cellArray[0];
            let thisheader = this.header.displaygroup.cellArray[0];
            if(!movingHeader.coord.isCoordCompletelyOutside(thisheader.coord)){
                if (!winModal.validDropWinModalInstance) {
                    winModal.validDropWinModalInstance = this;
                    this.hightlightHeader()
                }
            }else{
                if (winModal.validDropWinModalInstance == this) {
                    winModal.validDropWinModalInstance = undefined;
                    this.hightlightHeader(false)
                }
            }
        }
    }
    hightlightHeader(highlight:boolean=true) {
        let thisheader = this.header.displaygroup.cellArray[0];
        let isHighlighted = thisheader.htmlBlock.css.endsWith("Selected")
        if (highlight && !isHighlighted) thisheader.htmlBlock.css +="Selected";
        if (!highlight && isHighlighted) thisheader.htmlBlock.css = thisheader.htmlBlock.css.slice(0, -8);
    }
}
function winmodal(...Arguments:any) {
    let overlay=new Overlay("winModal", ...Arguments);
    let newWinModal = <winModal>overlay.returnObj;
    let parentDisplaycell = newWinModal.rootDisplayCell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["winModal"] = winModal;