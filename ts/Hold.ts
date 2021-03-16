// import {Base} from './Base';

class Hold extends Base {
    static instances:Hold[] = [];
    static activeInstances:Hold[] = [];
    static defaults = {
        startTime : 1000, repeatTime: 100, doOnclick:true
    }
    static argMap = {
        string : ["label"],
    }

    doOnclick:boolean;
    label:string;
    el: HTMLDivElement;
    onDown: Function = function(){};
    event: Function = function(){};
    onUp: Function = function(){};
    isDown:boolean = false;
    startTime:number;
    repeatTime:number;

    constructor(...Arguments: any) {
        super();this.buildBase(...Arguments);
        if ("HTMLDivElement" in this.retArgs) {
            this.el = this.retArgs["HTMLDivElement"][0];
        }
        let THIS = this;
        this.el.onmousedown = function(e:any){
            THIS.onDown();
            // console.log(THIS.doOnclick);
            THIS.isDown = true;
            if (THIS.doOnclick) THIS.event();
            setTimeout(function(){Hold.start(THIS)},THIS.startTime);

            window.onmouseup = function(e:any){
                THIS.onUp();
                THIS.isDown = false;
            }
        }
        Hold.makeLabel(this);
    }
    static start(THIS:Hold) {
        if (THIS.isDown){
            THIS.event();
            setTimeout(function(){Hold.start(THIS)},THIS.repeatTime);
        }
    }
}
// export {Hold}
