class winModal extends Base {
    static labelNo = 0;
    static instances:winModal[] = [];
    static activeInstances:winModal[] = [];
    static defaults = {headerHeight: 15, buttonsHeight: 50, footerHeight:20, showOnStart:true,
                        headerText:"Window", bodyText:"Body", highlightHeaderState1:false, highlightHeaderState2:false}
    static argMap = {
        string : ["label", "headerText"],
        DisplayCell : ["body"],
        function: ["closeCallback"],
        boolean: ["showOnStart"]
    }
    retArgs:ArgsObj;   // <- this will appear
    label:string;

    renderNode:node_; // render node

    parentDisplayCell: DisplayCell;

    header: DisplayCell;
    headerHeight: number;
    headerText:string;

    body: DisplayCell;
    bodyText: string;
    showOnStart:boolean;

    footer: DisplayCell;
    footerHeight:number;
    footerText:string;
    hiddenCells:DisplayCell[];
    closeCallback:Function;

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
        if (this.parentDisplayCell.displaygroup.cellArray.length > 1)
            this.toggleClose();
        else
            this.toggleOpen();
    }
    toggleClose(){
        for (let index = 1; index < this.parentDisplayCell.displaygroup.cellArray.length; index++)
            Render.update(this.parentDisplayCell.displaygroup.cellArray[index], true);
            //Handler.renderDisplayCell(this.rootDisplayCell.displaygroup.cellArray[index], undefined, undefined, true);
        this.hiddenCells = this.parentDisplayCell.displaygroup.cellArray
        this.parentDisplayCell.displaygroup.cellArray = [this.parentDisplayCell.displaygroup.cellArray[0]];
        let coord = this.modal.coord;
        this.previousModalHeight = coord.height;
        this.modal.setSize(coord.x, coord.y, coord.width, this.headerHeight);
        this.parentDisplayCell.dim = `${this.headerHeight}px`;
        Render.update();
    }
    toggleOpen(){
        this.parentDisplayCell.displaygroup.cellArray = this.hiddenCells;
        let coord = this.modal.coord;
        this.parentDisplayCell.dim = `${this.previousModalHeight}px`;
        this.modal.setSize(coord.x, coord.y, coord.width, this.previousModalHeight);
        Render.update();
    }
    build(){
        this.buildHeader();
        if (!this.body) this.buildBody();
        if (this.footerText) this.buildFooter();
        
        let cells:DisplayCell[] = [this.header, this.body];
        if (this.footer) cells.push(this.footer);
        
        this.parentDisplayCell = v(`${this.label}_V`, ...cells);
        let numbers = this.retArgs["number"];
        
        if (!numbers) numbers = [];
        this.modal = new Modal(`${this.label}_modal`, this.parentDisplayCell, ...numbers, {type: HandlerType.winModal});
        this.modal.dragWith(`${this.label}_title`);
        this.modal.closeWith(`${this.label}_close`, this.closeCallback);
        if (this.showOnStart) this.modal.show();
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
    static Render(winmodal_:winModal, zindex:number, derender = false, node:node_):zindexAndRenderChildren{
        //console.log(this.label)
        let thisheader = winmodal_.header.displaygroup.cellArray[0];
        if (Modal.movingInstace && Modal.movingInstace != winmodal_.modal) {
            let movingHeader = Modal.movingInstace.rootDisplayCell.displaygroup.cellArray[0];
            
            if(!movingHeader.coord.isCoordCompletelyOutside(thisheader.coord)){
                if (!winModal.validDropWinModalInstance) {
                    winModal.validDropWinModalInstance = winmodal_;
                    if (!winmodal_.highlightHeaderState1){
                        winmodal_.hightlightHeader();
                        winmodal_.highlightHeaderState1 = true;
                    }
                }
            }else{
                if (winModal.validDropWinModalInstance == winmodal_) {
                    winModal.validDropWinModalInstance = undefined;
                    if (winmodal_.highlightHeaderState1){
                        winmodal_.hightlightHeader(false)
                        winmodal_.highlightHeaderState1 = false;
                    }
                }
            }
        }
        if (Modal.movingInstace && Modal.movingInstace == winmodal_.modal) {
            winModal.movingInstance = winmodal_;
        }

        for (let index = 0; index < PageSelect.instances.length; index++) {
            const pageSelectInstance = PageSelect.instances[index];
            let item = DisplayCell.byLabel(`${pageSelectInstance.label}_0`);
            if(document.getElementById(`${pageSelectInstance.label}_0`)){
                if(!thisheader.coord.isCoordCompletelyOutside(item.coord)){
                    if (!winmodal_.highlightHeaderState2){
                        winmodal_.hightlightHeader();
                        winModal.validpageSelectInstance = pageSelectInstance;
                        winmodal_.highlightHeaderState2 = true;
                    }
                } else {
                    if (winmodal_.highlightHeaderState2){
                        winmodal_.hightlightHeader(false)
                        winModal.validpageSelectInstance = undefined;
                        winmodal_.highlightHeaderState2 = false;
                    }
                }
            }
        }

        return {zindex}
    }
    hightlightHeader(highlight:boolean=true) {
        let thisheader = this.header.displaygroup.cellArray[0];
        let isHighlighted = thisheader.htmlBlock.css.endsWith("Selected")
        if (highlight && !isHighlighted) thisheader.htmlBlock.css +="Selected";
        if (!highlight && isHighlighted) thisheader.htmlBlock.css = thisheader.htmlBlock.css.slice(0, -8);
    }
    
}
Render.register("winModal", winModal);
// function winmodal(...Arguments:any):winModal {
//     let overlay=new Overlay("winModal", ...Arguments);
//     let newWinModal = <winModal>overlay.returnObj;
//     let parentDisplaycell = newWinModal.rootDisplayCell;
//     // parentDisplaycell.overlay = overlay; // remove this line soon
//     parentDisplaycell.addOverlay(overlay);
//     return newWinModal;
// }
function winmodal(...Arguments:any): DisplayCell {return Overlay.new("winModal", ...Arguments)};
Overlay.classes["winModal"] = winModal;