// // import {ArgsObj} from './Interfaces';
// // import {Base, BaseF} from './Base';
// // import {HtmlBlock} from './htmlBlock';
// // import {Drag} from './Drag';
// // import {Hold} from './Hold';

// class Events extends Base {
//     static elementId="llmEvents";
//     static instances:Events[] = [];
//     static activeInstances:Events[] = [];
//     static history:string[] = [];
//     static defaults = {
//     }
//     static argMap = {
//         string : ["label"]
//     }
//     label:string;
//     actions: object;

//     constructor(...Arguments: any) {
//         super();
//         let retArgs : ArgsObj = BaseF.argumentsByType(Arguments);
//         if ("object" in retArgs) {
//             this.actions = retArgs["object"][0];
//             delete retArgs["object"];
//         }
//         this.buildBase(...Arguments);
//         Events.makeLabel(this);
//     }
//     applyToHtmlBlock(htmlblock:HtmlBlock){
//         let el:HTMLElement = htmlblock.el;
//         this.label = htmlblock.label;
//         for (let key in this.actions) {
//             if (key=="onhold") {
//                 new Hold(el, this.actions[key])
//             } else if (key=="ondrag") {
//                 new Drag(el, this.actions[key])
//             } else {
//                 let value_Function = this.actions[key];
//                 Events.history.push(`document.getElementById("${htmlblock.label}").${key} = ${value_Function}`);
//                 el[key] = value_Function;
//             }
//         }
//     }
//     static mergeEvents(label:string, events1:Events, events2:Events, name=undefined){
//         for (const key in events1.actions) 
//             if (key in events2.actions){
//                 // console.log("MERGE!!!!")
//                 let events1Function = events1.actions[key];
//                 let events2Function = events2.actions[key];
//                 if (events1Function.name == "functionStack")
//                     FunctionStack.push(label+"_"+key, events2Function, name);
//                 else {
//                     events1.actions[key] = FunctionStack.function(label+"_"+key);
//                     FunctionStack.push(label+"_"+key, events2Function, name);
//                     FunctionStack.push(label+"_"+key, events1Function, name);
//                 }
//             }
//         for (const key in events2.actions) 
//             if (!(key in events1.actions)) 
//                 events1.actions[key] = events2.actions[key];
//         return undefined;
//     }
// }
// function events(...Arguments:any) {return new Events(...Arguments);}
// // export {events, Events}
