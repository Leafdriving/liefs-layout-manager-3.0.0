/**
 * Selected
 */
class Selected extends Base {
    static labelNo = 0;
    static instances:{[key: string]: Selected;} = {};
    static activeInstances:{[key: string]: Selected;} = {};
    static defaults = {indexer:[],getIndexerArray:function(selectedInstance:Selected){return selectedInstance.indexer_}}
    static argMap = {
        string : ["label"],
        function: ["onselect", "onunselect"],
        Array : ["indexer_"],
        number :["startValue"],
        Pages: ["pages"],
    }
    label:string;
    indexer_:(DisplayCell|DisplayCell[])[];
    get indexer(){return this.getIndexerArray(this)}
    set indexer(value){this.indexer_ = value;}
    getIndexerArray:(selectedInstance:Selected)=>(DisplayCell|DisplayCell[])[];
    onselect:(index:number, displaycell:DisplayCell)=>void;
    onunselect:(index:number, displaycell:DisplayCell)=>void;

    startValue:number;
    currentButtonIndex:number;

    /**
     * Creates an instance of selected.
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        Selected.makeLabel(this);
        this.updateEvents()
        if (this.startValue != undefined) this.select(this.startValue);
        Selected.instances[this.label] = this;
    }
    /**
     * Updates events
     */
    updateEvents(){
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {
            let displayCells:DisplayCell[];
            let type = Arguments_.typeof( this.indexer[index] );
            if ( type == "DisplayCell" ) displayCells = this.indexer[index] = [ <DisplayCell>(this.indexer[index]) ];
            else if ( type == "Array" ) displayCells = <DisplayCell[]>( this.indexer[index] );
            for (let index = 0; index < displayCells.length; index++) 
                displayCells[index].addEvents( {onclick:function selected(e:PointerEvent){ THIS.select(displayCells[index]) }} );
        }
    }
    /**
     * Selects selected
     * @param displaycellOrNumber 
     */
    select(displaycellOrNumber:DisplayCell|number) {
        let newIndex:number;
        let type = Arguments_.typeof(displaycellOrNumber);
        if (type == "number") newIndex = <number>displaycellOrNumber;
        else if (type == "DisplayCell") newIndex = this.indexOf(<DisplayCell>displaycellOrNumber);
        if (newIndex != undefined) {
            if (this.currentButtonIndex != newIndex){
                if (this.currentButtonIndex != undefined) this.onUnselect( this.currentButtonIndex );
                this.currentButtonIndex = newIndex;
                this.onSelect( this.currentButtonIndex );
            }
        }
    }
    /**
     * Clears selected
     */
    clear(){this.onUnselect( this.currentButtonIndex );this.currentButtonIndex = undefined}
    /**
     * Indexs of
     * @param displaycell 
     * @returns of 
     */
    indexOf(displaycell:DisplayCell): number {
        for (let index = 0; index < this.indexer.length; index++) 
            if ((<DisplayCell[]>this.indexer[index]).indexOf(displaycell) > -1) return index;
        return undefined;
    }
    /**
     * Determines whether select on
     * @param index 
     */
    onSelect(index:number){
        // console.log("onSelectCalled", this.indexer)

        let selectArray = (<DisplayCell[]>(this.indexer[index]));
        for (let i = 0; i < selectArray.length; i++) {
            const displaycell = selectArray[i];
            let element = <Element_>displaycell.getComponent("Element_");
            if (element) element.setAsSelected();
            if (this.onselect) this.onselect(index, displaycell);
        }
    }
    /**
     * Determines whether unselect on
     * @param index 
     */
    onUnselect(index:number){
        let unSelectArray = (<DisplayCell[]>(this.indexer[index]));
        for (let i = 0; i < unSelectArray.length; i++) {
            const displaycell = unSelectArray[i];
            let element = <Element_>displaycell.getComponent("Element_");
            if (element) element.setAsUnSelected();
            if (this.onunselect) this.onunselect(index, displaycell);
        }
    }
}