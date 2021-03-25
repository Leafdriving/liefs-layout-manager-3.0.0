// import { Base } from './Base';

class Drag extends Base {
    static instances:Drag[] = [];
    static activeInstances:Drag[] = [];
    static defaults = {}
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
        super();this.buildBase(...Arguments);

        if ("Array" in this.retArgs) {
            let array=this.retArgs["Array"][0];
            this.onDown = array[0]; this.onMove = array[1];this.onUp = array[2];
        }
        if ("HTMLDivElement" in this.retArgs) {
            this.el = this.retArgs["HTMLDivElement"][0];
        }
        let THIS = this;
        this.el.onmousedown = function(e:any){
            THIS.onDown();
            THIS.isDown = true;
            THIS.mousePos = { x: e.clientX, y: e.clientY };
            window.addEventListener('selectstart', Drag.disableSelect);

            window.onmousemove = function(e:any){
                THIS.mouseDiff = {x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"]}
                THIS.onMove(THIS.mouseDiff, e);
            }

            window.onmouseup = function(e:any){
                THIS.reset()
                THIS.onUp(THIS.mouseDiff, e);
            }
        }
        Drag.makeLabel(this);
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

class Swipe extends Base {
    static swipeDistance = 50;
    static elementId="llmSwipe";
    static instances:Swipe[] = [];
    static activeInstances:Swipe[] = [];
    static defaults = {
        swipeDistance : Swipe.swipeDistance
    }
    static argMap = {
        string : ["label"],
        number : ["swipeDistance"]
    }
    label:string;
    swipeDistance: number;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        Swipe.makeLabel(this);
    }
}
function swipe(...Arguments:any){
    let swipeObj=new Swipe(...Arguments);
    let retObj: object = {onMove :function(offset:object, e:MouseEvent){let dragObj = this;
                            if (swipeObj["left"] && (offset["x"] < -swipeObj.swipeDistance)){
                                swipeObj["left"](offset, e);dragObj.reset();}
                            if (swipeObj["right"] && (offset["x"] > swipeObj.swipeDistance)){
                                swipeObj["right"](offset, e);dragObj.reset();}
                            if (swipeObj["up"] && (offset["y"] < -swipeObj.swipeDistance)){
                                swipeObj["up"](offset, e);dragObj.reset();}
                            if (swipeObj["down"] && (offset["y"] > swipeObj.swipeDistance)){
                                swipeObj["down"](offset, e);dragObj.reset();}                                                                                      
                            }}
    return retObj;
}
// export {swipe, Swipe, Drag}