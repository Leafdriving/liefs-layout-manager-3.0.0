
class winHolder extends Base {
    static labelNo = 0;
    static instances:winHolder[] = [];
    static activeInstances:winHolder[] = [];
    static defaults = {winModals:[]}
    static argMap = {
        string : ["label"],
    }
    label:string;
    retArgs:ArgsObj;   // <- this will appear
    rootDisplayCell: DisplayCell;
    WinModal:winModal;  // root
    winModals:winModal[]; // children
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);        
        winHolder.makeLabel(this);
        if ("winModal" in this.retArgs) this.winModals = this.retArgs["winModal"];
        for (let index = 0; index < this.winModals.length; index++)
            this.disableWinModal(this.winModals[index]);
        console.log("before Build");
        this.build();
        console.log("after Build");
    }
    build(){
        let maxWidth = 0;
        let height = 0;
        let cellArray:DisplayCell[] = [];
        console.log("Before for")
        for (let index = 0; index < this.winModals.length; index++) {
            let wmodal = this.winModals[index];
            wmodal.parentHolder = this;
            let modal = wmodal.modal
            let displaycell = modal.rootDisplayCell;
            if (modal.coord.x > maxWidth) maxWidth = modal.coord.x;
            displaycell.dim = `${modal.coord.y}px`;
            cellArray.push( displaycell );
            height += pf.pxAsNumber(displaycell.dim);
        }
        console.log("After For")
        this.rootDisplayCell = v(`${this.label}_winHolder`,{cellArray})
        // this.WinModal = new winModal(`${this.label}_winHolder_parent`,
        //                                 {body:this.rootDisplayCell,
        //                                 headerText:"MyGroup"},
        //                                 this.winModals[0].modal.coord.x, this.winModals[0].modal.coord.y,
        //                                 maxWidth, height);
        console.log("Build Over")
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
        console.log("Disabling ", winmodal.label)
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
    static defaults = {headerHeight: 15, buttonsHeight: 50, footerHeight:20,
                        headerText:"Window", bodyText:"Body", highlightHeaderState1:false, highlightHeaderState2:false}
    static argMap = {
        string : ["label", "headerText"],
        DisplayCell : ["body"]
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
    highlightHeaderState1:boolean;
    highlightHeaderState2:boolean;
    static validDropWinModalInstance:winModal;
    static validpageSelectInstance:PageSelect;
    static movingInstance:winModal;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        winModal.makeLabel(this);
        this.build();
        let THIS=this;
        window.addEventListener('ModalDropped', function (e:CustomEvent) {THIS.dropped(e)}, false);
    }
    dropped(e:CustomEvent){
        let modal = <Modal>e.detail;
        if (winModal.validDropWinModalInstance){
            if (winModal.validDropWinModalInstance.label == this.label){
                //console.log("Not Possible", winModal.movingInstance);
                console.log(`${winModal.movingInstance.label} was dropped on ${this.label}`);
            }
            this.hightlightHeader(false);
        }
        if (winModal.validpageSelectInstance) {
            this.hightlightHeader(false);
            // console.log(`Dropped on ${winModal.validpageSelectInstance.label}`)
            winModal.validpageSelectInstance.acceptDrop(this);
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
        let thisheader = this.header.displaygroup.cellArray[0];
        if (Modal.movingInstace && Modal.movingInstace != this.modal) {
            let movingHeader = Modal.movingInstace.rootDisplayCell.displaygroup.cellArray[0];
            
            if(!movingHeader.coord.isCoordCompletelyOutside(thisheader.coord)){
                if (!winModal.validDropWinModalInstance) {
                    winModal.validDropWinModalInstance = this;
                    if (!this.highlightHeaderState1){
                        this.hightlightHeader();
                        this.highlightHeaderState1 = true;
                    }
                }
            }else{
                if (winModal.validDropWinModalInstance == this) {
                    winModal.validDropWinModalInstance = undefined;
                    if (this.highlightHeaderState1){
                        this.hightlightHeader(false)
                        this.highlightHeaderState1 = false;
                    }
                }
            }
        }
        if (Modal.movingInstace && Modal.movingInstace == this.modal) {
            winModal.movingInstance = this;
        }

        for (let index = 0; index < PageSelect.instances.length; index++) {
            const pageSelectInstance = PageSelect.instances[index];
            let item = DisplayCell.byLabel(`${pageSelectInstance.label}_0`);
            if(document.getElementById(`${pageSelectInstance.label}_0`)){
                if(!thisheader.coord.isCoordCompletelyOutside(item.coord)){
                    if (!this.highlightHeaderState2){
                        this.hightlightHeader();
                        winModal.validpageSelectInstance = pageSelectInstance;
                        this.highlightHeaderState2 = true;
                    }
                } else {
                    if (this.highlightHeaderState2){
                        this.hightlightHeader(false)
                        winModal.validpageSelectInstance = undefined;
                        this.highlightHeaderState2 = false;
                    }
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