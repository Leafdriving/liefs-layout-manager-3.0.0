// interface FStack {
//     [key: string]: [Function, string][];
// }

// class FunctionStack {
//     static instanceObj:FStack = {};
//     static push(label: string, function_: Function, name = undefined){
//         if (!(label in FunctionStack.instanceObj))
//             FunctionStack.instanceObj[label] = [];
//         FunctionStack.instanceObj[label].push( [function_, name] );
//     }
//     static function(label:string) {
//         return function functionStack (...Arguments:any) {
//             let THIS = this;
//             let list = FunctionStack.instanceObj[label];
//             if (list && list.length)
//                 for (let index = 0; index < list.length; index++){
//                     list[index][0].bind(THIS)(...Arguments);
//                 }
//         }
//     }
//     static pop(label:string, name = undefined) {
//         let functionStack = FunctionStack.instanceObj[label];
//         if (name) {
//             for (let index = 0; index < functionStack.length; index++) {
//                 let [function_, name_] = functionStack[index];
//                 if (name == name_) {
//                     functionStack.splice(index, 1);
//                     index -=1;
//                 }
//             }
//         } else FunctionStack.instanceObj[label] = [];
//     }
//     static exists(label:string, name:string) {
//         let functionStack = FunctionStack.instanceObj[label];
//         if (functionStack) 
//             for (let index = 0; index < functionStack.length; index++) {
//                 let [function_, name_] = functionStack[index];
//                 if (name == name_) return true;
//             }
//         return false;
//     }
// }
// // export {FunctionStack}