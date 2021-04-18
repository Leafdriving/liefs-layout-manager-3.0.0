
// class Selected extends Base {
//     static labelNo = 0;
//     static instances:Selected[] = [];
//     static activeInstances:Selected[] = [];
//     static defaults = {indexer:[], onSelect:Selected.onSelect, onUnselect:Selected.onUnselect }
//     static argMap = {
//         string : ["label"],
//         function: ["onSelect", "onUnselect"],
//     }
//     retArgs:ArgsObj;   // <- this will appear
//     label:string;

//     indexer:DisplayCell[];
//     onSelect:(displaycell:DisplayCell)=>void
//     onUnselect:(displaycell:DisplayCell)=>void;

//     currentButtonIndex:number;

//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         Selected.makeLabel(this);

//         if ("DisplayCell" in this.retArgs) this.indexer = this.retArgs["DisplayCell"]
//         this.build()
//     }
//     build(){
//         let THIS = this;
//         for (let index = 0; index < this.indexer.length; index++) {

//             let displaycell = this.indexer[index];
//             let htmlblock = displaycell.htmlBlock
//             if (!htmlblock.events) htmlblock.events = events({});
//             let oldOnclick = htmlblock.events.actions["onclick"];
//             if (oldOnclick) FunctionStack.push(`${this.label}_${index}`, oldOnclick)
//             FunctionStack.push(`${this.label}_${index}`, function(event:PointerEvent){ THIS.select(event, displaycell) })
//             htmlblock.events.actions["onclick"] = FunctionStack.function(`${this.label}_${index}`);
        
//         }
//     }
//     select(event:PointerEvent, displaycell:DisplayCell) {
//         let newIndex = this.indexer.indexOf(displaycell);     
//         if (this.currentButtonIndex != newIndex){
//             if (this.currentButtonIndex != undefined) 
//                 this.onUnselect( this.indexer[this.currentButtonIndex] );
//             this.currentButtonIndex = newIndex;
//             this.onSelect( displaycell );
//         }
//     }
//     static onSelect(displaycell:DisplayCell){
//         let htmlblock = displaycell.htmlBlock;
//         let el=htmlblock.el;
//         if (el) {
//             let oldClassName = el.className;
//             if (!oldClassName.endsWith("Selected"))
//                 el.className = oldClassName + "Selected";
//         }
//         htmlblock.css += "Selected";
//     }
//     static onUnselect(displaycell:DisplayCell){
//         let htmlblock = displaycell.htmlBlock;
//         let el=htmlblock.el;
//         let oldClassName = el.className;
//         if (oldClassName.endsWith("Selected"))
//             el.className = oldClassName.slice(0, -8);
//         htmlblock.css = htmlblock.css.slice(0, -8);
//     }
// }

