class Hold {
    static instances:Hold[] = [];
    static byLabel(label:string):Hold{
        for (let key in Hold.instances)
            if (Hold.instances[key].label == label)
                return Hold.instances[key];
        return undefined;
    }
    static defaults = {
        label : function(){return `Hold_${pf.pad_with_zeroes(Hold.instances.length)}`},
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
        Hold.instances.push(this);
        let retArgs : ArgsObj = pf.sortArgs(Arguments, "Hold");
        mf.applyArguments("Hold", Arguments, Hold.defaults, Hold.argMap, this);
        if ("HTMLDivElement" in retArgs) {
            this.el = retArgs["HTMLDivElement"][0];
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
    }
    static start(THIS:Hold) {
        if (THIS.isDown){
            THIS.event();
            setTimeout(function(){Hold.start(THIS)},THIS.repeatTime);
        }
    }
}
