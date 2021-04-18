interface objectStringArray {
    [key: string]: Array<string>;
}
interface objectAny {
    [type: string]: any[];
}
interface objectFunction {
    [type: string]: Function;
}
interface objectString {
    [type: string]: string;
}
// interface ArgsObj {
//     [type: string]: any[];   
// }
// interface ArgsFunctions {
//     [type: string]: Function[];
// }
// interface ArgMap {
//     [key: string]: string[];
// }
// interface Offset {x:number;y:number;width:number;height:number}
// interface RenderChild{
//     child:object,
//     derender:boolean
// }
// interface zindexAndRenderChildren{
//     zindex:number,
//     children?:RenderChild[];
//     siblings?:RenderChild[];
// }