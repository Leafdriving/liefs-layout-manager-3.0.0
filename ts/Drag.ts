class Drag {
    static instances:Drag[] = [];
    static byLabel(label:string):Drag{
        for (let key in Drag.instances)
            if (Drag.instances[key].label == label)
                return Drag.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Drag_${pf.pad_with_zeroes(Drag.instances.length)}`},
    }
    static argMap = {
        string : ["label"],
    }
    label:string;
    el: HTMLDivElement;
    onDown: Function = function(){};
    onMove: Function = function(){};
    onUp: Function = function(){};
    isDown:boolean = false;
    mousePos:object;
    mouseDiff:object;

    constructor(...Arguments: any) {
        Drag.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Drag");
        mf.applyArguments("Drag", Arguments, Drag.defaults, Drag.argMap, this);

        if ("Array" in retArgs) {
            let array=retArgs["Array"][0];
            this.onDown = array[0]; this.onMove = array[1];this.onUp = array[2];
        }
        if ("HTMLDivElement" in retArgs) {
            this.el = retArgs["HTMLDivElement"][0];
        }
        let THIS = this;
        this.el.onmousedown = function(e:any){
            THIS.onDown();
            THIS.isDown = true;
            THIS.mousePos = { x: e.clientX, y: e.clientY };
            window.addEventListener('selectstart', Drag.disableSelect);

            window.onmousemove = function(e:any){
                THIS.mouseDiff = {x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"]}
                THIS.onMove(THIS.mouseDiff);
            }

            window.onmouseup = function(e:any){
                THIS.reset()
                THIS.onUp(THIS.mouseDiff);
            }
        }
    }
    reset(){
        window.onmousemove = function(){};
        window.onmouseup = function(){};
        window.removeEventListener('selectstart', Drag.disableSelect);
        this.isDown = false;
    }
    static disableSelect(event:MouseEvent) {
        event.preventDefault();
    }
}

class Swipe {
    static swipeDistance = 50;
    static elementId="llmSwipe";
    static instances:Swipe[] = [];
    static defaults = {
        label : function(){return `Swipe_Instance_${pf.pad_with_zeroes(Swipe.instances.length)}`},
        swipeDistance : Swipe.swipeDistance
    }
    static argMap = {
        string : ["label"],
        number : ["swipeDistance"]
    }
    label:string;
    swipeDistance: number;

    constructor(...Arguments: any) {
        Swipe.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Swipe");
        let updatedDefaults : Object = pf.ifObjectMergeWithDefaults(retArgs, Swipe.defaults);
        let retArgsMapped : Object = pf.retArgsMapped(retArgs, updatedDefaults, Swipe.argMap);
        mf.modifyClassProperties(retArgsMapped, this);
    }
}
function swipe(...Arguments:any){
    let swipeObj=new Swipe(...Arguments);
    let retObj: object = {onMove :function(offset:object){let dragObj = this;
                            if (swipeObj["left"] && (offset["x"] < -swipeObj.swipeDistance)){
                                swipeObj["left"]();dragObj.reset();}
                            if (swipeObj["right"] && (offset["x"] > swipeObj.swipeDistance)){
                                swipeObj["right"]();dragObj.reset();}
                            if (swipeObj["up"] && (offset["y"] < -swipeObj.swipeDistance)){
                                swipeObj["up"]();dragObj.reset();}
                            if (swipeObj["down"] && (offset["y"] > swipeObj.swipeDistance)){
                                swipeObj["down"]();dragObj.reset();}                                                                                      
                            }}
    return retObj;
}