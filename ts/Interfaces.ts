interface ArgsObj {
    [type: string]: any[];   
}
interface ArgsFunctions {
    [type: string]: Function[];
}
interface ArgMap {
    [key: string]: string[];
}
interface Offset {x:number;y:number;width:number;height:number}
interface RenderChild{
    child:object,
    derender:boolean
}
interface zindexAndRenderChildren{
    zindex:number,
    children?:RenderChild[];
    siblings?:RenderChild[];
}