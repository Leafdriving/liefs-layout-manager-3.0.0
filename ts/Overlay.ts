// // import {DisplayCell} from './DisplayCell';
// // import {DisplayGroup} from './DisplayGroup';
// // import {mf, pf} from './PureFunctions';

// class Overlay {
//     static instances:Overlay[] = [];
//     static byLabel(label:string):Overlay{
//         for (let key in Overlay.instances)
//             if (Overlay.instances[key].label == label)
//                 return Overlay.instances[key];
//         return undefined;
//     }
//     static classes = {
//     //    DragBar,for wxample... filled in when modules load.
//     };

//     label:string;
//     sourceClassName:string;
//     returnObj: object;
//     currentlyRendered: boolean;

//     constructor(...Arguments: any) {
//         Overlay.instances.push(this);
//         this.label= `Overlay_${pf.pad_with_zeroes(Overlay.instances.length)}`;
//         this.sourceClassName = Arguments.shift();
//         if (Overlay.classes[this.sourceClassName])
//             this.returnObj = new (Overlay.classes[this.sourceClassName])(...Arguments);
//         else
//             console.log(`Overlay did not have classes type "${this.sourceClassName}"`);
//         // console.log(this.returnObj);
//         (<DisplayCell>this.returnObj["parentDisplayCell"]).addOverlay(this)
//     }
//     renderOverlay(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
//         this.currentlyRendered = !derender;
//         (this.returnObj["render"])(displaycell, parentDisplaygroup, index, derender);
//     }
//     static new(CLASS:string, ...Arguments:any){
//         let newOverlay = new Overlay(CLASS, ...Arguments);
//         let newClass = newOverlay.returnObj;
//         let displaycell = <DisplayCell>newClass["parentDisplayCell"];
//         return displaycell;
//     }
// }
// // export {Overlay}
