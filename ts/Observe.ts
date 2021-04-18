// // import {Base} from './Base';
// // import {DisplayCell} from './DisplayCell';
// // import {Handler} from './Handler';
// // import {Coord} from './Coord';
// // import {FunctionStack} from './FunctionStack';
// // import {DisplayGroup} from './DisplayGroup';
// // import {mf, pf} from './PureFunctions';

// class Observe extends Base {
//     static instances:Observe[] = [];
//     static activeInstances:Observe[] = [];
//     static defaults = {
//     }
//     static argMap = {
//         string : ["label"],
//         HTMLDivElement : ["el"],
//         DisplayCell: ["parentDisplayCell"],
//     }
//     static Os_ScrollbarSize = 15;
//     label:string;
//     el: HTMLDivElement;
//     parentDisplayCell: DisplayCell;
//     // derendering: boolean = false;

//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);

//         let observerInstance = this;
//         let handler = <Handler>Handler.byLabel(observerInstance.label);
//         if (!handler.coord) handler.coord = new Coord();
//         // put handler in stack if not there already (push Handler)
//         if (Handler.activeInstances.indexOf(handler) == -1){
//             Handler.activeInstances.push(handler);
//         }
//         handler.preRenderCallback = function(handler:Handler){
//             let bound = observerInstance.el.getBoundingClientRect();
//                 handler.coord.assign(bound.x, bound.y, bound.width, bound.height, bound.x, bound.y, bound.width, bound.height);
//         }
//         this.parentDisplayCell.htmlBlock.el.onscroll = function(event:WheelEvent){Render.update();};
//         Observe.makeLabel(this);
//         Render.update();
//     }
//     static derender(displaycell:DisplayCell){
//         let handler:Handler;
//         // 
//         for (let index = 0; index < Observe.instances.length; index++) {
//             let observeInstance = Observe.instances[index];
//             if (observeInstance.parentDisplayCell == displaycell){
//                 handler = Handler.byLabel(observeInstance.label);
//                 let Hindex = Handler.activeInstances.indexOf(handler)
//                 if (Hindex > -1) {
//                     Handler.activeInstances.splice(Hindex,1);
//                 }
//                 let Oindex = Observe.instances.indexOf(observeInstance);
//                 Observe.instances.splice(Oindex, 1);
//                 Render.update(handler.rootCell, true)
//                 index -= 1;
//             }
//         }
//         FunctionStack.pop(displaycell.label);
//     }
//     static update(){
//         let els:NodeListOf<Element> =  document.querySelectorAll("[parentof]");
//         let activeLabels:string[] = [];
//         for (let index = 0; index < els.length; index++) { // loop elements in dom with parentof attribute...
//             let el = <HTMLElement>els[index];
//             let attribObj = pf.getAttribs(el);
//             let handlerLabel = attribObj["parentof"];
//             let handlerInstance = Handler.byLabel(handlerLabel);
//             if (handlerInstance) {                                  // if matching handler exists,
//                 activeLabels.push(handlerLabel);
//                 if (!Observe.byLabel(handlerLabel)) {               // if not matching Observe instance exists
//                     let parentEl = el.parentElement;
//                     let parentDisplayCell: DisplayCell;
//                     while (parentEl && !parentDisplayCell) {        // loop until parent matching displaycell found
//                         parentDisplayCell = DisplayCell.byLabel(parentEl.id);
//                         parentEl = parentEl.parentElement;
//                     }
//                     new Observe(handlerLabel, el, parentDisplayCell);// Create Observe Object!
//                     // console.log("Created Observe Instance")
//                 }
//             } else console.log(`Warning: Observe Reports: Handler "${handlerLabel}" not found`);
//         }
//         for (let index = 0; index < Observe.instances.length; index++) {  // now pop any Observers no longer needed
//             const observeInstance = Observe.instances[index];
//             if (activeLabels.indexOf(observeInstance.label) == -1) {
//                 // console.log("Popping Instance", observeInstance.label)
//                 Observe.pop(observeInstance);
//             }
//         }
//     }
// }
// // export {Observe}
