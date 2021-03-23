var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
// export {ArgsObj, ArgsFunctions, Offset}
// import {ArgsObj} from './Interfaces';
class BaseF {
    static ifObjectMergeWithDefaults(THIS, CLASS) {
        if ("object" in THIS.retArgs) {
            let returnObj = CLASS.defaults; // mergeObjects doens't overwrite this!
            for (let key in THIS.retArgs["object"])
                returnObj = BaseF.mergeObjects(returnObj, THIS.retArgs["object"][key]);
            return returnObj;
        }
        return CLASS.defaults;
    }
    static retArgsMapped(updatedDefaults, THIS, CLASS) {
        let returnObject = {};
        let indexNo;
        for (let i in updatedDefaults)
            returnObject[i] = updatedDefaults[i];
        for (let typeName in THIS.retArgs) {
            if (typeName in CLASS.argMap) {
                indexNo = 0;
                while (indexNo < THIS.retArgs[typeName].length &&
                    indexNo < CLASS.argMap[typeName].length) {
                    returnObject[CLASS.argMap[typeName][indexNo]] = THIS.retArgs[typeName][indexNo];
                    indexNo++;
                }
            }
        }
        return returnObject;
    }
    static argumentsByType(Args, // 1st argument is a list of args.
    customTypes = []) {
        customTypes = customTypes.concat(Base.defaultIsChecks); // assumed these are included.
        let returnArray = {};
        let valueType;
        let returnValue;
        for (let value of Args) {
            valueType = typeof (value); // evaluate type
            for (let checkFunction of customTypes) { // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue)
                    valueType = returnValue;
            }
            if (!(valueType in returnArray))
                returnArray[valueType] = []; // If type doesn't exist, add empty array
            returnArray[valueType].push(value); // Assign Type Value
        }
        return returnArray;
    }
    static modifyClassProperties(argobj, targetobject) {
        for (let key of Object.keys(argobj))
            targetobject[key] = argobj[key];
    }
}
BaseF.mergeObjects = function (startObj, AddObj) {
    let returnObject = {};
    for (let i in startObj)
        returnObject[i] = startObj[i];
    for (let j in AddObj)
        returnObject[j] = AddObj[j];
    return returnObject;
};
class Base {
    constructor() {
    }
    // static instances:any[] = [];
    // static activeInstances:any[] = [];
    static byLabel(label) {
        let CLASS = this;
        for (let key in CLASS["instances"])
            if (CLASS["instances"][key].label == label)
                return CLASS["instances"][key];
        return undefined;
    }
    static pop(instance = undefined) {
        let CLASS = this;
        instance = CLASS.stringOrObject(instance);
        if (instance == undefined)
            instance = CLASS["instances"][CLASS["instances"].length - 1];
        CLASS.deactivate(instance);
        let index = CLASS["instances"].indexOf(instance);
        if (index != -1)
            CLASS["instances"].splice(index, 1);
    }
    static push(instance, toActive = false) {
        let CLASS = this;
        instance = CLASS.stringOrObject(instance);
        CLASS.pop(instance); // if pushing same, remove previous
        CLASS["instances"].push(instance);
        if (toActive)
            CLASS.activate(instance);
    }
    static deactivate(instance) {
        let CLASS = this;
        instance = CLASS.stringOrObject(instance);
        let index = CLASS["activeInstances"].indexOf(instance);
        if (index != -1)
            CLASS["activeInstances"].splice(index, 1);
    }
    static activate(instance) {
        let CLASS = this;
        instance = CLASS.stringOrObject(instance);
        CLASS.deactivate(instance);
        CLASS["activeInstances"].push(instance);
    }
    static isActive(instance) {
        let CLASS = this;
        instance = CLASS.stringOrObject(instance);
        return (CLASS["activeInstances"].indexOf(instance) > -1);
    }
    static stringOrObject(instance) {
        if (typeof (instance) == "string")
            instance = this.byLabel(instance);
        return instance;
    }
    buildBase(...Arguments) { this.constructor["buildBase"](this, ...Arguments); }
    static buildBase(THIS, ...Arguments) {
        let CLASS = this;
        if (CLASS["labelNo"] == undefined)
            CLASS["labelNo"] = 0;
        if (CLASS["defaults"] == undefined)
            CLASS["defaults"] = {};
        if (CLASS["argMap"] == undefined)
            CLASS["argMap"] = {};
        if (CLASS["instances"] == undefined)
            CLASS["instances"] = [];
        if (CLASS["activeInstances"] == undefined)
            CLASS["activeInstances"] = [];
        CLASS.push(THIS);
        THIS.retArgs = BaseF.argumentsByType(Arguments);
        let updatedDefaults = BaseF.ifObjectMergeWithDefaults(THIS, CLASS);
        let retArgsMapped = BaseF.retArgsMapped(updatedDefaults, THIS, CLASS);
        BaseF.modifyClassProperties(retArgsMapped, THIS);
    }
    static makeLabel(instance) {
        let CLASS = this;
        if (instance["label"] == undefined || instance["label"].trim() == "") {
            CLASS["labelNo"] += 1;
            instance["label"] = `${CLASS["name"]}_${CLASS["labelNo"]}`;
        }
    }
}
// export {BaseF, Base};
// class Test extends Base {
//     static labelNo = 0;
//     static instances:Test[] = [];
//     static activeInstances:Test[] = [];
//     static defaults = {
//         tag: "DIV",
//     }
//     static argMap = {
//         string : ["label", "innerHTML", "css"],
//         number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
//     }
//     // retArgs:ArgsObj;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         Test.makeLabel(this);
//     }
// }
class FunctionStack {
    static push(label, function_, name = undefined) {
        if (!(label in FunctionStack.instanceObj))
            FunctionStack.instanceObj[label] = [];
        FunctionStack.instanceObj[label].push([function_, name]);
    }
    static function(label) {
        return function (...Arguments) {
            let list = FunctionStack.instanceObj[label];
            if (list && list.length)
                for (let index = 0; index < list.length; index++)
                    list[index][0](...Arguments);
        };
    }
    static pop(label, name = undefined) {
        let functionStack = FunctionStack.instanceObj[label];
        if (name) {
            for (let index = 0; index < functionStack.length; index++) {
                let [function_, name_] = functionStack[index];
                if (name == name_) {
                    functionStack.splice(index, 1);
                    index -= 1;
                }
            }
        }
        else
            FunctionStack.instanceObj[label] = [];
    }
}
FunctionStack.instanceObj = {};
// export {FunctionStack}
// import {Base} from './Base';
// import {ArgsObj} from './Interfaces';
class mf {
    /**
    * Sample Comment
    * argobj is blah blah
    * @returns blah blah
    */
    static modifyClassProperties(argobj, targetobject) {
        for (let key of Object.keys(argobj)) {
            if (typeof (argobj[key]) == "function" && key == "label") {
                targetobject[key] = argobj[key]();
            }
            else
                targetobject[key] = argobj[key];
        }
    }
    static applyArguments(callLabel, Arguments, classDefaults, classArgmap, THIS, customtypes = []) {
        let retArgs = pf.sortArgs(Arguments, callLabel, customtypes);
        let updatedDefaults = pf.ifObjectMergeWithDefaults(retArgs, classDefaults);
        let retArgsMapped = pf.retArgsMapped(retArgs, updatedDefaults, classArgmap);
        mf.modifyClassProperties(retArgsMapped, THIS);
    }
}
class pf {
    /**
    * 'message' is the string outputed to the viewer
    * @returns nothing
    */
    static errorHandling(message) {
        console.log(`Error Handeling Called\n${message}`);
    }
    static commonKeys(obj1, obj2) {
        let returnStringArray = [];
        for (let index in obj1)
            if (index in obj2)
                returnStringArray.push(index);
        return returnStringArray;
    }
    static retArgsMapped(retArgs, defaults, argsMap) {
        let returnObject = {};
        let propertyName;
        let indexNo;
        for (let i in defaults)
            returnObject[i] = defaults[i];
        for (let typeName in retArgs) {
            if (typeName in argsMap) {
                indexNo = 0;
                while (indexNo < retArgs[typeName].length &&
                    indexNo < argsMap[typeName].length) {
                    returnObject[argsMap[typeName][indexNo]] = retArgs[typeName][indexNo];
                    indexNo++;
                }
            }
        }
        return returnObject;
    }
    static ifObjectMergeWithDefaults(retArgs, defaults) {
        if ("object" in retArgs) {
            let returnObj = defaults;
            for (let key in retArgs["object"]) {
                returnObj = pf.mergeObjects(returnObj, retArgs["object"][key]);
            }
            return returnObj;
        }
        return defaults;
        // return ("object" in retArgs) ? pf.mergeObjects(defaults, retArgs["object"][0]) : defaults;
    }
    static sortArgs(Args, // 1st argument is a list of args.
    label = "unlabeled", // 2nd argument is a debug label
    customTypes = []) {
        customTypes = customTypes.concat(pf.defaultIsChecks); // assumed these are included.
        let returnArray = {};
        let valueType;
        let returnValue;
        for (let value of Args) {
            valueType = typeof (value); // evaluate type
            for (let checkFunction of customTypes) { // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue) {
                    valueType = returnValue;
                }
            }
            if (!(valueType in returnArray)) { // If type doesn't exist, add empty array
                returnArray[valueType] = [];
            }
            returnArray[valueType].push(value); // Assign Type Value
        }
        ;
        return returnArray;
    }
    static setAttrib(el, attrib, value) {
        let prevAttrib = el.getAttribute(attrib);
        if (prevAttrib != value) {
            let att = document.createAttribute(attrib);
            att.value = value;
            el.setAttributeNode(att);
        }
    }
    static getAttribs(el, retObj = {}) {
        for (let i = 0; i < el.attributes.length; i++) {
            retObj[el.attributes[i].name] = el.attributes[i].value;
        }
        return retObj;
    }
    static elExists(id_label) { return document.getElementById(id_label); }
    static viewport() {
        var width = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;
        return [width, height];
    }
    static errorReporting(errString) {
        console.log("Error Reporting");
        console.log(errString);
    }
    static uis0(num) { return (num == undefined) ? 0 : num; }
    // static concatArray(main:DisplayCell[], added:DisplayCell[]){for (let displaycell of added) main.push(displaycell)}
    static parseURLParams(url = window.location.href) {
        let queryStart = url.indexOf("?") + 1, queryEnd = url.indexOf("#") + 1 || url.length + 1, query = url.slice(queryStart, queryEnd - 1), pairs = query.replace(/\+/g, " ").split("&"), parms = {}, i, n, v, nv;
        if (query === url || query === "")
            return;
        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);
            if (!parms.hasOwnProperty(n))
                parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
}
pf.isTypePx = function (it) { if (typeof (it) == "string" && it.substr(-2) == "px")
    return true; return false; };
pf.pxAsNumber = function (dim) { return +(dim.slice(0, -2)); };
pf.isTypePercent = function (it) { if (typeof (it) == "string" && it.substr(-1) == "%")
    return true; return false; };
pf.percentAsNumber = function (dim) { return +(dim.slice(0, -1)); };
pf.isDim = function (it) { if ((typeof (it) == "string") && (it.substr(-2) == "px" || it.substr(-1) == "%"))
    return "dim"; };
pf.isArray = function (it) { if (typeof (it) == "object" && Array.isArray(it))
    return "Array"; };
pf.isObjectAClass = function (it) { if (typeof (it) == "object" && it.constructor.name != "Object")
    return it.constructor.name; };
pf.defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim];
pf.classProperties = function (a) { return Object.getOwnPropertyNames(a); };
pf.pad_with_zeroes = function (Number, length = 3) {
    let returnString = '' + Number;
    while (returnString.length < length)
        returnString = '0' + returnString;
    return returnString;
};
pf.mergeObjects = function (startObj, AddObj) {
    let returnObject = {};
    for (let i in startObj)
        returnObject[i] = startObj[i];
    for (let j in AddObj)
        returnObject[j] = AddObj[j];
    return returnObject;
};
Base.defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim];
// export {mf, pf}
// import {BaseF, Base} from './Base';
// import {ArgsObj, ArgsFunctions, Offset} from './Interfaces';
// import {Handler} from './Handler';
// import {mf, pf} from './PureFunctions';
var _x_, _y_, _width_, _height_;
class Point {
}
class Within {
    constructor(...Arguments) {
        mf.applyArguments("Within", Arguments, {}, { number: ["x", "y", "width", "height"] }, this);
    }
    clipStyleString(sub) {
        return Coord.clipStyleString(this, sub);
    }
    reset() { this.x = this.y = this.width = this.height = undefined; }
    ;
}
class Coord extends Base {
    constructor(...Arguments) {
        super();
        _x_.set(this, void 0);
        _y_.set(this, void 0);
        _width_.set(this, void 0);
        _height_.set(this, void 0);
        this.within = new Within();
        this.buildBase(...Arguments);
        Coord.makeLabel(this);
    }
    get x() { return __classPrivateFieldGet(this, _x_) + ((this.offset) ? this.offset.x : 0); }
    set x(x) { __classPrivateFieldSet(this, _x_, x); }
    get y() { return __classPrivateFieldGet(this, _y_) + ((this.offset) ? this.offset.y : 0); }
    set y(y) { __classPrivateFieldSet(this, _y_, y); }
    get width() { return __classPrivateFieldGet(this, _width_) + ((this.offset) ? this.offset.width : 0); }
    set width(width) { __classPrivateFieldSet(this, _width_, width); }
    get height() { return __classPrivateFieldGet(this, _height_) + ((this.offset) ? this.offset.height : 0); }
    set height(height) { __classPrivateFieldSet(this, _height_, height); }
    setOffset(x = 0, y = 0, width = 0, height = 0) {
        if (x == 0 && y == 0 && width == 0 && height == 0)
            this.offset = undefined;
        else
            this.offset = { x, y, width, height };
    }
    cropWithin(within = this.within) {
        let x = this.x, y = this.y, width = this.width, height = this.height, x2 = x + width, y2 = y + height;
        let wx = within.x, wy = within.y, wwidth = within.width, wheight = within.height, wx2 = wx + wwidth, wy2 = wy + wheight;
        let bx = (x > wx) ? x : wx;
        let sx2 = (x2 < wx2) ? x2 : wx2;
        let by = (y > wy) ? y : wy;
        let sy2 = (y2 < wy2) ? y2 : wy2;
        this.within.x = bx;
        this.within.width = sx2 - bx;
        this.within.y = by;
        this.within.height = sy2 - by;
    }
    // copyWithin(...Arguments:any){
    //     let possArgs:{x?:number,y?:number,width?:number,height?:number, isRoot?:boolean, Coord?:Coord} = {};
    //     mf.applyArguments("Coord.copyWithin", Arguments, {isRoot: false}, Coord.CopyArgMap, possArgs);
    //     let isRoot = possArgs.isRoot;
    //     if (possArgs.isRoot) {
    //         for (let key of ["x", "y", "width", "height"]) {
    //             this.within[key] = this[key];
    //         }
    //     } else {
    //         if ("Coord" in possArgs) {
    //             let coord = possArgs.Coord
    //             for (let key of ["x", "y", "width", "height"]) {
    //                 this.within[key] = coord.within[key];
    //             }
    //             let x=this.x, y=this.y, width=this.width, height=this.height, x2=x+width, y2=y+height;
    //             let wx=this.within.x, wy=this.within.y, wwidth=this.within.width, wheight=this.within.height, wx2=wx+wwidth, wy2=wy+wheight;
    //             let bx = (x > wx) ? x : wx;
    //             let sx2 = (x2 < wx2) ? x2 : wx2;
    //             let by = (y > wy) ? y : wy;
    //             let sy2 = (y2 < wy2) ? y2 : wy2;
    //             this.within.x = bx;
    //             this.within.width = sx2-bx;
    //             this.within.y = by;
    //             this.within.height = sy2-by;
    //         } else {
    //             console.log("Boo");
    //         }
    //     }
    // }
    applyMargins(left, top, right, bottom) {
        this.x += left;
        this.within.x += left;
        this.y += top;
        this.within.y += top;
        this.width -= (left + right);
        this.within.width -= (left + right);
        this.height -= (top + bottom);
        this.within.height -= (top + bottom);
    }
    assign(x = undefined, y = undefined, width = undefined, height = undefined, wx = undefined, wy = undefined, wwidth = undefined, wheight = undefined, zindex = undefined) {
        if (x != undefined)
            this.x = x;
        if (y != undefined)
            this.y = y;
        if (width != undefined)
            this.width = width;
        if (height != undefined)
            this.height = height;
        if (wx != undefined)
            this.within.x = wx;
        if (wy != undefined)
            this.within.y = wy;
        if (wwidth != undefined)
            this.within.width = wwidth;
        if (wheight != undefined)
            this.within.height = wheight;
        if (zindex != undefined)
            this.zindex = zindex;
    }
    copy(fromCoord) {
        this.x = fromCoord.x;
        this.y = fromCoord.y;
        this.width = fromCoord.width;
        this.height = fromCoord.height;
        this.zindex = fromCoord.zindex;
        this.within.x = fromCoord.within.x;
        this.within.y = fromCoord.within.y;
        this.within.width = fromCoord.within.width;
        this.within.height = fromCoord.within.height;
    }
    log() {
        console.log(`x=${this.x}`, `y=${this.y}`, `width=${this.width}`, `height=${this.height}`);
        console.log(`wx=${this.within.x}`, `wy=${this.within.y}`, `wwidth=${this.within.width}`, `wheight=${this.within.height}`);
    }
    // // if no object, x, width, y, height, zindex
    // // if object left, top, right, bottom, zindex
    // let possArgs:{x?:number,y?:number,width?:number,height?:number,zindex?:number,
    //        left?:number,right?:number,top?:number,bottom?:number,
    //        Within?:Within,Coord?:Coord} = {};
    // let obj:Coord;
    // mf.applyArguments("Coord.copy", Arguments, {}, Coord.CopyArgMap, possArgs);
    // /*if ("Within" in possArgs) obj = possArgs.Within;
    // else*/ if ("Coord" in possArgs) {
    //     obj = possArgs.Coord;
    //     this.within = possArgs.Coord.within;
    // }
    // if (obj) {possArgs.left = (possArgs.x) ? possArgs.x : 0; possArgs.top = (possArgs.y) ? possArgs.y : 0;
    //           possArgs.right = (possArgs.width) ? possArgs.width : 0;possArgs.bottom= (possArgs.height) ? possArgs.height : 0
    // }
    // this.x = (obj) ? obj.x + possArgs.left : (("x" in possArgs) ? possArgs.x : this.x);
    // this.y = (obj) ? obj.y + possArgs.top  : (("y" in possArgs) ? possArgs.y : this.y);
    // this.width = (obj) ? obj.width - (possArgs.left + possArgs.right)
    //                    : ( (possArgs.width) ? possArgs.width : this.width );
    // this.height = (obj) ? obj.height - (possArgs.top + possArgs.bottom)
    //                    : ( (possArgs.height) ? possArgs.height : this.height );
    // this.zindex = ("zindex" in possArgs) ? possArgs.zindex : Handler.currentZindex;
    // replace(x:number, y:number, width:number, height:number, zindex:number = undefined) {
    //     if (x != undefined) this.x = x;
    //     if (y != undefined)this.y = y;
    //     if (width != undefined) this.width = width;
    //     if (height != undefined) this.height = height;
    //     if (zindex != undefined) this.zindex = zindex;
    // }
    isCoordCompletelyOutside(WITHIN = this.within) {
        return ((WITHIN.x + WITHIN.width < this.x) ||
            (WITHIN.x > this.x + this.width) ||
            (WITHIN.y + WITHIN.height < this.y) ||
            (WITHIN.y > this.y + this.height));
    }
    derender(derender) { return derender || this.isCoordCompletelyOutside(); }
    clipStyleString(COORD) {
        return Coord.clipStyleString(this, COORD);
    }
    newClipStyleString(WITHIN = this.within) {
        return Coord.clipStyleString(WITHIN, this);
    }
    static clipStyleString(WITHIN, COORD) {
        let returnString = "";
        let left = (COORD.x < WITHIN.x) ? (WITHIN.x - COORD.x) : 0;
        let right;
        if (COORD.hideWidth) {
            let el = document.getElementById(COORD.label);
            let bound = el.getBoundingClientRect();
            right = (COORD.x + bound.width > WITHIN.x + WITHIN.width) ? (COORD.x + bound.width - (WITHIN.x + WITHIN.width)) : 0;
        }
        else
            right = (COORD.x + COORD.width > WITHIN.x + WITHIN.width) ? (COORD.x + COORD.width - (WITHIN.x + WITHIN.width)) : 0;
        let top = (COORD.y < WITHIN.y) ? (WITHIN.y - COORD.y) : 0;
        let bottom = (COORD.y + COORD.height > WITHIN.y + WITHIN.height) ? (COORD.y + COORD.height - (WITHIN.y + WITHIN.height)) : 0;
        if (left + right + top + bottom > 0)
            returnString = `clip-path: inset(${top}px ${right}px ${bottom}px ${left}px);`;
        return returnString;
    }
    isPointIn(x, y) { return (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height); }
    asAttributeString() {
        return `left: ${this.x}px; top:${this.y}px; width:${this.width}px; height:${this.height}px; ` +
            `z-index:${this.zindex};`;
    }
    newAsAttributeString() {
        return `left: ${this.x}px; top:${this.y}px;`
            + `${(this.hideWidth) ? "" : "width:" + this.width + "px; "}`
            + `height:${this.height}px; z-index:${this.zindex + ((Handler.activeOffset) ? Handler.zindexIncrement * 3 : 0)};${this.newClipStyleString()}`;
    }
}
_x_ = new WeakMap(), _y_ = new WeakMap(), _width_ = new WeakMap(), _height_ = new WeakMap();
Coord.instances = [];
Coord.activeInstances = [];
Coord.defaults = {
    x: 0, y: 0, width: 0, height: 0, zindex: 0
};
Coord.argMap = {
    string: ["label"],
    number: ["x", "y", "width", "height", "zindex"],
    boolean: ["hideWidth"]
};
Coord.CopyArgMap = { Within: ["Within"], Coord: ["Coord"], boolean: ["isRoot"],
    number: ["x", "y", "width", "height", "zindex"] };
// export {Point, Within, Coord}
// import {ArgsObj, ArgsFunctions} from './Interfaces'
// import {BaseF, Base} from './Base';
// import {events, Events} from './Events';
// import {Css, css} from './Css';
// import {mf, pf} from './PureFunctions';
/**
 * This Class Holds the HTMLElement
 */
class HtmlBlock extends Base {
    constructor(...Arguments) {
        super();
        this.attributes = {};
        this.buildBase(...Arguments);
        let elementWithIdAsLabel = document.getElementById(this.label);
        if (elementWithIdAsLabel) {
            this.innerHTML = elementWithIdAsLabel.innerHTML;
            this.attributes = pf.getAttribs(elementWithIdAsLabel, this.attributes);
            elementWithIdAsLabel.remove();
        }
        if ("Css" in this.retArgs)
            for (let css of this.retArgs["Css"])
                this.css = (this.css + " " + css.classname).trim();
        if ("string" in this.retArgs && this.retArgs.string.length > 3)
            this.css += " " + this.retArgs.string.splice(3).join(' ');
        if ("number" in this.retArgs) {
            let length = this.retArgs["number"].length;
            if (length == 1) {
                this.marginRight = this.marginTop = this.marginBottom = this.marginLeft;
            }
            else if (length == 2) {
                this.marginRight = this.marginLeft;
                this.marginBottom = this.marginTop;
            }
        }
        HtmlBlock.makeLabel(this);
    }
}
HtmlBlock.instances = [];
HtmlBlock.activeInstances = [];
HtmlBlock.defaults = {
    innerHTML: " ",
    tag: "DIV",
    css: "",
    dim: ""
};
HtmlBlock.argMap = {
    string: ["label", "innerHTML", "css"],
    dim: ["dim"],
    Events: ["events"],
    number: ["marginLeft", "marginTop", "marginRight", "marginBottom"],
    // Tree: ["tree"],
    boolean: ["hideWidth"],
};
function html(...Arguments) {
    let htmlblock = new HtmlBlock(...Arguments);
    // htmlblock.label = HtmlBlock.defaults["label"]();
    return htmlblock;
}
// export {html, HtmlBlock}
// import {ArgsObj} from './Interfaces';
// import {Base, BaseF} from './Base';
// import {HtmlBlock} from './htmlBlock';
// import {Drag} from './Drag';
// import {Hold} from './Hold';
class Events extends Base {
    constructor(...Arguments) {
        super();
        let retArgs = BaseF.argumentsByType(Arguments);
        if ("object" in retArgs) {
            this.actions = retArgs["object"][0];
            delete retArgs["object"];
        }
        this.buildBase(...Arguments);
        Events.makeLabel(this);
    }
    applyToHtmlBlock(htmlblock) {
        let el = htmlblock.el;
        this.label = htmlblock.label;
        for (let key in this.actions) {
            if (key == "onhold") {
                new Hold(el, this.actions[key]);
            }
            else if (key == "ondrag") {
                new Drag(el, this.actions[key]);
            }
            else {
                let value_Function = this.actions[key];
                Events.history.push(`document.getElementById("${htmlblock.label}").${key} = ${value_Function}`);
                el[key] = value_Function;
            }
        }
    }
    static do(event) {
        console.log(event);
        console.log(this);
    }
}
Events.elementId = "llmEvents";
Events.instances = [];
Events.activeInstances = [];
Events.history = [];
Events.defaults = {};
Events.argMap = {
    string: ["label"]
};
function events(...Arguments) { return new Events(...Arguments); }
// export {events, Events}
// import {Base} from './Base';
// import {Coord} from './Coord';
// import {HtmlBlock} from './htmlBlock';
// import {DisplayGroup} from './DisplayGroup';
// import {events, Events} from './Events';
// import {Overlay} from './Overlay';
// import {Pages} from './Pages';
// import {vMenuBar, hMenuBar, context, Context} from './Context';
var _htmlBlock_, _displaygroup_;
class DisplayCell extends Base {
    constructor(...Arguments) {
        super();
        _htmlBlock_.set(this, undefined);
        _displaygroup_.set(this, undefined);
        this.overlays = [];
        this.isRendered = false;
        this.buildBase(...Arguments);
        if (this.displaygroup && this.displaygroup.htmlBlock) {
            this.htmlBlock = this.displaygroup.htmlBlock;
        }
        if (this.htmlBlock)
            this.label = `${this.htmlBlock.label}`;
        if (!this.label)
            this.label = (this.htmlBlock) ? this.htmlBlock.label + "_DisplayCell"
                : (this.displaygroup) ? this.displaygroup.label + "_DisplayCell"
                    : (this.pages) ? this.pages.label + "_DisplayCell" : undefined;
        if (this.htmlBlock && this.htmlBlock.hideWidth)
            this.coord = new Coord(this.label, true);
        else
            this.coord = new Coord(this.label);
        DisplayCell.makeLabel(this);
    }
    get htmlBlock() { return __classPrivateFieldGet(this, _htmlBlock_); }
    set htmlBlock(htmlblock) {
        __classPrivateFieldSet(this, _htmlBlock_, htmlblock);
        if (__classPrivateFieldGet(this, _htmlBlock_).dim)
            this.dim = __classPrivateFieldGet(this, _htmlBlock_).dim;
        if (__classPrivateFieldGet(this, _htmlBlock_).minDisplayGroupSize)
            this.minDisplayGroupSize = __classPrivateFieldGet(this, _htmlBlock_).minDisplayGroupSize;
    }
    get displaygroup() { return __classPrivateFieldGet(this, _displaygroup_); }
    set displaygroup(displaygroup) {
        __classPrivateFieldSet(this, _displaygroup_, displaygroup);
        if (__classPrivateFieldGet(this, _displaygroup_).dim)
            this.dim = __classPrivateFieldGet(this, _displaygroup_).dim;
    }
    get minDisplayGroupSize() { return (this.minDisplayGroupSize_) ? this.minDisplayGroupSize_ : DisplayCell.minDisplayGroupSize; }
    set minDisplayGroupSize(size) { this.minDisplayGroupSize_ = size; }
    addOverlay(overlay) { this.overlays.push(overlay); }
    getOverlay(label) {
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                return this.overlays[index];
        return undefined;
    }
    getOverlays(label) {
        let returnList = [];
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                returnList.push(this.overlays[index]);
        return returnList;
    }
    popOverlay(label) {
        for (let index = 0; index < this.overlays.length; index++)
            if (this.overlays[index].sourceClassName == label)
                this.overlays.splice(index, 1);
    }
    hMenuBar(menuObj) {
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({ onmouseover: hMenuBar(menuObj) }); //////////////// COME BACK HERE!!!!
    }
    vMenuBar(menuObj) {
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({ onmouseover: vMenuBar(menuObj) }); //////////////// COME BACK HERE!!!!
    }
    static concatArray(main, added) { for (let displaycell of added)
        main.push(displaycell); }
}
_htmlBlock_ = new WeakMap(), _displaygroup_ = new WeakMap();
DisplayCell.instances = [];
DisplayCell.activeInstances = [];
DisplayCell.minDisplayGroupSize = 1; // copied from htmlblock
DisplayCell.defaults = {
    dim: ""
};
DisplayCell.argMap = {
    string: ["label"],
    HtmlBlock: ["htmlBlock"],
    DisplayGroup: ["displaygroup"],
    dim: ["dim"],
    Pages: ["pages"],
    function: ["preRenderCallback", "postRenderCallback"],
};
function I(...Arguments) {
    return new DisplayCell(new HtmlBlock(...Arguments));
    // let newblock = new HtmlBlock(...Arguments);
    // return (newblock.dim) ? new DisplayCell(newblock, newblock.dim) : new DisplayCell(newblock);
}
// export {I, DisplayCell}
// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Coord} from './Coord';
// import {HtmlBlock} from './htmlBlock';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';
class DisplayGroup extends Base {
    // minimumCellSize:number;
    // renderStartIndex:number;
    // renderEndIndex:number;
    constructor(...Arguments) {
        super();
        this.cellArray = [];
        this.htmlBlock = undefined;
        this.buildBase(...Arguments);
        if ("DisplayCell" in this.retArgs)
            this.cellArray = this.retArgs["DisplayCell"];
        if ("HtmlBlock" in this.retArgs) {
            this.htmlBlock = this.retArgs["HtmlBlock"][0];
        }
        if ("Array" in this.retArgs)
            this.cellArray = this.retArgs["Array"][0];
        if (("number" in this.retArgs) && this.retArgs["number"].length == 1)
            this.marginVer = this.marginHor = this.retArgs["number"][0];
        this.coord = new Coord(this.label);
        // Fill In Dim Values
        let percentsum = 0;
        let numOfEmptydims = 0;
        for (let displaycell of this.cellArray) {
            let dim = displaycell.dim;
            if (dim == "")
                numOfEmptydims++;
            else if (pf.isTypePercent(dim))
                percentsum += pf.percentAsNumber(dim);
        }
        let percentRamaining = 100 - percentsum;
        if (numOfEmptydims) {
            let newDimValue = String(percentRamaining / numOfEmptydims) + "%";
            for (let displaycell of this.cellArray)
                if (displaycell.dim == "")
                    displaycell.dim = newDimValue;
        }
        DisplayGroup.makeLabel(this);
    }
    //addOverlay(overlay:Overlay){this.overlays.push(overlay)}
    percentToPx(displaycell /* child in cellarray */) {
        let percentAsNumber = pf.percentAsNumber(displaycell.dim);
        let percentLeft = 100 - percentAsNumber;
        displaycell.dim = `${(this.ishor) ? displaycell.coord.width : displaycell.coord.height}px`;
        // loop cellarray to add percent where you can
        for (let index = 0; index < this.cellArray.length; index++) {
            let cellOfArray = this.cellArray[index];
            if (pf.isTypePercent(cellOfArray.dim)) {
                let thisPercent = pf.percentAsNumber(cellOfArray.dim);
                thisPercent += (thisPercent / percentLeft) * percentAsNumber;
                cellOfArray.dim = `${thisPercent}%`;
            }
        }
    }
    totalPx(addMin = false) {
        let cellArray = this.cellArray;
        let totalFixedpx = 0;
        for (let displaycell of cellArray) {
            if (displaycell.pages && (!displaycell.dim)) {
                displaycell.dim = displaycell.pages.evalCell().dim; // only covers one loop!
            }
            if (pf.isTypePx(displaycell.dim))
                totalFixedpx += pf.pxAsNumber(displaycell.dim);
            else if (addMin)
                totalFixedpx += displaycell.minDisplayGroupSize;
        }
        return totalFixedpx;
    }
}
DisplayGroup.defaultMargins = 0;
DisplayGroup.instances = [];
DisplayGroup.activeInstances = [];
DisplayGroup.defaults = {
    ishor: true,
    marginHor: DisplayGroup.defaultMargins,
    marginVer: DisplayGroup.defaultMargins,
};
DisplayGroup.argMap = {
    string: ["label"],
    boolean: ["ishor"],
    number: ["marginHor", "marginVer"],
    dim: ["dim"],
    //Overlay: ["overlay"]
};
DisplayGroup.argCustomTypes = [];
function h(...Arguments) {
    return new DisplayCell(new DisplayGroup(...Arguments));
}
function v(...Arguments) {
    return new DisplayCell(new DisplayGroup(false, ...Arguments));
}
// export {v, h, DisplayGroup}
// import {Base} from './Base';
// import {Coord} from './Coord';
// import {DisplayCell} from './DisplayCell';
// import {Css} from './Css';
// import {DisplayGroup} from './DisplayGroup';
// import {HtmlBlock} from './htmlBlock';
// import {Observe} from './Observe'
// import {Overlay} from './Overlay';
// import {Pages} from './Pages';
// import {mf, pf} from './PureFunctions';
// import {ScrollBar} from './ScrollBar';
class Handler extends Base {
    constructor(...Arguments) {
        super();
        this.rootCell = undefined;
        this.buildBase(...Arguments);
        Handler.updateScreenSize();
        if ("DisplayCell" in this.retArgs)
            this.rootCell = this.retArgs["DisplayCell"][0];
        else
            pf.errorHandling(`Handler "${this.label}" requires a DisplayCell`);
        if (this.handlerMargin == undefined)
            this.handlerMargin = Handler.handlerMarginDefault;
        if (Handler.firstRun) {
            setTimeout(Handler.update);
            // setTimeout(Handler.update,200);
            Handler.firstRun = false;
            for (let element of document.querySelectorAll(Css.deleteOnFirstRunClassname))
                element.remove();
            window.onresize = function () { Handler.update(); };
            window.onwheel = function (event) { ScrollBar.onWheel(event); };
            window.addEventListener("popstate", function (event) { Pages.popstate(event); });
            Pages.parseURL();
        }
        if (this.addThisHandlerToStack) {
            Handler.activeInstances.push(this);
        }
        Handler.makeLabel(this);
        Handler.update( /* [this] */);
        Css.update();
    }
    pop() { return Handler.pop(this); }
    toTop() {
        let index = Handler.activeInstances.indexOf(this);
        if (index > -1 && index != Handler.activeInstances.length - 1) {
            Handler.activeInstances.splice(index, 1);
            Handler.activeInstances.push(this);
            Handler.update();
        }
    }
    static pop(handlerInstance = Handler.activeInstances[Handler.activeInstances.length - 1]) {
        let index = Handler.activeInstances.indexOf(handlerInstance);
        let poppedInstance = undefined;
        if (index != -1) {
            poppedInstance = Handler.activeInstances[index];
            Handler.update([handlerInstance], index, true);
            Handler.activeInstances.splice(index, 1);
        }
        return poppedInstance;
    }
    static screensizeToCoord(dislaycell, handlerMargin) {
        let viewport = pf.viewport();
        dislaycell.coord.assign(handlerMargin, handlerMargin, viewport[0] - handlerMargin * 2, viewport[1] - handlerMargin * 2, handlerMargin, handlerMargin, viewport[0] - handlerMargin * 2, viewport[1] - handlerMargin * 2, Handler.currentZindex);
        //dislaycell.coord.copy(handlerMargin, handlerMargin, viewport[0]-handlerMargin*2, viewport[1]-handlerMargin*2, Handler.currentZindex);
    }
    static updateScreenSize() {
        let [width, height] = pf.viewport();
        Handler.screenSizeCoord.assign(0, 0, width, height, 0, 0, width, height, 0);
    }
    static update(ArrayofHandlerInstances = Handler.activeInstances, instanceNo = 0, derender = false) {
        // console.log("Update Fired");
        Handler.updateScreenSize();
        Handler.renderAgain = false;
        Pages.activePages = [];
        Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement) * instanceNo;
        for (let index = 0; index < ArrayofHandlerInstances.length; index++) {
            let handlerInstance = ArrayofHandlerInstances[index];
            if (handlerInstance.preRenderCallback)
                handlerInstance.preRenderCallback(handlerInstance);
            if (handlerInstance.coord) {
                handlerInstance.rootCell.coord.copy(handlerInstance.coord);
                handlerInstance.rootCell.coord.assign(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, Handler.currentZindex);
            }
            else {
                Handler.screensizeToCoord(handlerInstance.rootCell, handlerInstance.handlerMargin);
            }
            Handler.renderDisplayCell(handlerInstance.rootCell, undefined, undefined, derender);
            instanceNo += 1;
            Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement) * instanceNo;
            if (handlerInstance.postRenderCallback)
                handlerInstance.postRenderCallback(handlerInstance);
        }
        if (Pages.activePages.length)
            Pages.applyOnclick();
        Observe.update();
        if (Handler.renderAgain)
            console.log("REDNDER AGAIN!");
    }
    static renderDisplayCell(displaycell, parentDisplaygroup /*= undefined*/, index /*= undefined*/, derender) {
        if (displaycell.coord.offset)
            Handler.activeOffset = true;
        if (displaycell.preRenderCallback)
            displaycell.preRenderCallback(displaycell, parentDisplaygroup, index, derender);
        if (derender)
            Observe.derender(displaycell);
        let pages = displaycell.pages;
        if (pages) {
            if (!derender)
                Pages.activePages.push(pages);
            let evalCurrentPage = pages.eval();
            if (evalCurrentPage != pages.previousPage) { // derender old page here
                // console.log("pages.previousPage", pages.previousPage)
                // console.log(pages.displaycells[pages.previousPage])
                pages.displaycells[pages.previousPage].coord.copy(displaycell.coord);
                Handler.renderDisplayCell(pages.displaycells[pages.previousPage], parentDisplaygroup, index, true);
                pages.currentPage = pages.previousPage = evalCurrentPage;
                Pages.pushHistory();
            }
            // console.log("evalCurrentPage",evalCurrentPage);
            pages.displaycells[evalCurrentPage].coord.copy(displaycell.coord);
            /// new trial
            // pages.dim = pages.displaycells[evalCurrentPage].dim
            // new trial
            Handler.renderDisplayCell(pages.displaycells[evalCurrentPage], parentDisplaygroup, index, derender);
            pages.currentPage = evalCurrentPage;
            pages.addSelected();
        }
        else {
            let htmlBlock = displaycell.htmlBlock;
            let displaygroup = displaycell.displaygroup;
            // let overlays = displaycell.overlays;
            if (htmlBlock) {
                Handler.renderHtmlBlock(displaycell, derender, parentDisplaygroup);
            }
            if (displaygroup) {
                displaygroup.coord.copy(displaycell.coord);
                if (displaygroup && htmlBlock) {
                    Handler.currentZindex += Handler.zindexIncrement;
                    displaycell.coord.applyMargins(pf.uis0(htmlBlock.marginLeft), pf.uis0(htmlBlock.marginTop), pf.uis0(htmlBlock.marginRight), pf.uis0(htmlBlock.marginBottom));
                }
                Handler.renderDisplayGroup(displaycell, derender);
            }
        }
        if (displaycell.overlays.length) {
            for (let ovlay of displaycell.overlays) {
                // console.log("rendering",displaycell.label)
                ovlay.renderOverlay(displaycell, parentDisplaygroup, index, derender);
            }
        }
        // if (derender) displaycell.coord.within.reset();
        if (displaycell.postRenderCallback)
            displaycell.postRenderCallback(displaycell, parentDisplaygroup, index, derender);
        if (displaycell.coord.offset)
            Handler.activeOffset = false;
    }
    static renderDisplayGroup(parentDisplaycell, derender) {
        let displaygroup = parentDisplaycell.displaygroup;
        let ishor = displaygroup.ishor;
        let coord = displaygroup.coord;
        let cellArraylength = displaygroup.cellArray.length;
        // let overlay = displaygroup.overlay;
        let marginpx = (ishor) ? displaygroup.marginHor * (cellArraylength - 1) : displaygroup.marginVer * (cellArraylength - 1);
        let maxpx = (ishor) ? coord.width - marginpx : coord.height - marginpx;
        let totalFixedpx = displaygroup.totalPx();
        let pxForPercent = maxpx - totalFixedpx;
        let dimArray = [];
        // create dim array - Initialize.
        for (let index = 0; index < cellArraylength; index++) {
            let displaycell = displaygroup.cellArray[index];
            let dim = displaycell.dim;
            let min = ((pf.isTypePx(displaycell.dim)) ? pf.pxAsNumber(displaycell.dim) : displaycell.minDisplayGroupSize);
            let px = (pf.isTypePx(displaycell.dim) ? pf.pxAsNumber(displaycell.dim) : pf.percentAsNumber(displaycell.dim) * pxForPercent / 100);
            // dimArrayTotal += px;            
            dimArray.push({ dim, min, px });
        }
        // loop until all % are worked out
        let percentReballancingRequired;
        let dimArrayTotal;
        do {
            // If % less than min... assign it min
            percentReballancingRequired = false;
            let fixedPixels = 0;
            dimArrayTotal = 0;
            for (let index = 0; index < dimArray.length; index++) {
                let dimObj = dimArray[index];
                if (dimObj.px < dimObj.min) {
                    dimObj.px = dimObj.min;
                    dimObj.dim = `${dimObj.px}px`;
                    percentReballancingRequired = true;
                }
                fixedPixels += (pf.isTypePx(dimObj.dim) ? dimObj.px : 0);
                dimArrayTotal += dimObj.px;
            }
            let px4Percent = maxpx - fixedPixels; // key
            //console.log(`maxpx: ${maxpx} fixedPixels: ${fixedPixels} px4Percent:${px4Percent}`)
            // console.log(maxpx, fixedPixels, px4Percent)
            // if min was assigned - rebalance
            if (percentReballancingRequired) {
                let currentPercent = 0;
                // calculate total percent (so less than 100)
                for (let index = 0; index < dimArray.length; index++) {
                    let dimObj = dimArray[index];
                    if (pf.isTypePercent(dimObj.dim)) {
                        currentPercent += pf.percentAsNumber(dimObj.dim);
                    }
                }
                let mult = 100 / currentPercent;
                // and apply the difference over this code.
                dimArrayTotal = 0;
                for (let index = 0; index < dimArray.length; index++) {
                    let dimObj = dimArray[index];
                    if (pf.isTypePercent(dimObj.dim)) {
                        dimObj.dim = `${pf.percentAsNumber(dimObj.dim) * mult}%`;
                        dimObj.px = pf.percentAsNumber(dimObj.dim) * px4Percent / 100;
                        //console.log(`percent ${pf.percentAsNumber(dimObj.dim)} * ${px4Percent}/100 = ${dimObj.px}`)
                    }
                    dimArrayTotal += dimObj.px;
                }
            }
        } while (percentReballancingRequired);
        displaygroup.dimArrayTotal = dimArrayTotal;
        // console.log(`Final dimarrayTotal ${dimArrayTotal} of ${maxpx}`, JSON.stringify(dimArray, null, 3));
        let scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
        if (dimArrayTotal > maxpx + 2) {
            if (!scrollbarOverlay) {
                scrollbar(parentDisplaycell, displaygroup.ishor);
                scrollbarOverlay = parentDisplaycell.getOverlay("ScrollBar");
            }
            /* this.offset = */
            displaygroup.offset = (scrollbarOverlay.returnObj).update(dimArrayTotal); ////
            /* this.offset = */
        }
        else {
            if (scrollbarOverlay)
                (scrollbarOverlay.returnObj).delete();
            parentDisplaycell.popOverlay("ScrollBar");
            displaygroup.offset = 0;
        }
        let x = displaygroup.coord.x - ((ishor) ? displaygroup.offset : 0);
        let y = displaygroup.coord.y - ((ishor) ? 0 : displaygroup.offset);
        let width;
        let height;
        for (let index = 0; index < cellArraylength; index++) {
            let displaycell = displaygroup.cellArray[index];
            let cellsizepx = dimArray[index].px;
            width = (ishor) ? cellsizepx : coord.width;
            height = (ishor) ? coord.height : cellsizepx;
            displaycell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex);
            displaycell.coord.cropWithin(displaygroup.coord.within);
            Handler.renderDisplayCell(displaycell, displaygroup, index, derender);
            x += (ishor) ? width + displaygroup.marginHor : 0;
            y += (ishor) ? 0 : height + displaygroup.marginVer;
        }
    }
    static renderHtmlBlock(displaycell, derender = false, parentDisplaygroup) {
        let htmlBlock = displaycell.htmlBlock;
        let el = pf.elExists(displaycell.label);
        let alreadyexists = (el) ? true : false;
        derender = displaycell.coord.derender(derender);
        let isNulDiv = (htmlBlock.css.trim() == "" &&
            htmlBlock.innerHTML.trim() == "" &&
            Object.keys(htmlBlock.attributes).length == 0 &&
            !Handler.renderNullObjects);
        if (derender || isNulDiv) {
            if (alreadyexists)
                el.remove();
        }
        else {
            if (!alreadyexists)
                el = document.createElement(htmlBlock.tag);
            pf.setAttrib(el, "id", displaycell.label);
            if (htmlBlock.css.trim())
                pf.setAttrib(el, "class", htmlBlock.css);
            Handler.renderHtmlAttributes(el, htmlBlock, displaycell.label);
            if (el.innerHTML != htmlBlock.innerHTML)
                el.innerHTML = htmlBlock.innerHTML;
            if (!alreadyexists) {
                document.body.appendChild(el);
                htmlBlock.el = el;
                if (htmlBlock.events)
                    htmlBlock.events.applyToHtmlBlock(htmlBlock);
            }
            let attrstring = displaycell.coord.newAsAttributeString(); // + clipString;
            if (el.style.cssText != attrstring)
                el.style.cssText = attrstring;
        }
    }
    static renderHtmlAttributes(el, htmlblock, id) {
        for (let key in htmlblock.attributes) {
            let value = htmlblock.attributes[key];
            if (key == "class")
                value += " " + htmlblock.css;
            if (key == "id")
                value = id;
            pf.setAttrib(el, key, value);
        }
        pf.setAttrib(el, "llm", "");
    }
}
Handler.handlerMarginDefault = 0;
Handler.firstRun = true;
Handler.instances = [];
Handler.activeInstances = [];
Handler.defaults = {
    cssString: " ",
    addThisHandlerToStack: true,
    controlledBySomething: false,
    activeOffset: false,
};
Handler.argMap = {
    string: ["label"],
    number: ["handlerMargin"],
    Coord: ["coord"],
    function: ["preRenderCallback", "postRenderCallback"],
    boolean: ["addThisHandlerToStack"]
};
Handler.screenSizeCoord = new Coord();
Handler.renderNullObjects = false;
Handler.argCustomTypes = [];
Handler.handlerZindexStart = 1;
Handler.zindexIncrement = 1;
Handler.handlerZindexIncrement = 100;
function H(...Arguments) {
    return new Handler(...Arguments);
}
// export {H, Handler}
// import {BaseF, Base} from './Base';
// import {mf, pf} from './PureFunctions';
class Css extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        if (this.cssObj == undefined) {
            this.cssObj = this.makeObj();
            this.css = this.makeString();
        }
        if (this.cssHover) {
            this.cssHoverObj = this.makeObj(this.cssHover);
            this.cssHover = this.makeString(this.cssHoverObj, "hover");
        }
        if (this.cssSelect) {
            this.cssSelectObj = this.makeObj(this.cssSelect);
            this.cssSelect = this.makeString(this.cssSelectObj, "", "Selected");
        }
    }
    static byLabel(classname) {
        for (let key in Css.instances)
            if (Css.instances[key].classname == classname)
                return Css.instances[key];
        return undefined;
    }
    makeString(obj = this.cssObj, postfix = "", addToClassName = "") {
        let returnString = `${(this.isClassname) ? "." : ""}${this.classname}${addToClassName}${(postfix) ? ":" + postfix : ""} {\n`;
        for (let key in obj)
            returnString += `  ${key}:${obj[key]};\n`;
        returnString += "}";
        return returnString;
    }
    makeObj(str = this.css) {
        //let str = this.asString;
        let obj = {};
        if (str.indexOf('{') > -1) {
            str = str.split('{')[1];
            str = str.split('}')[0];
        }
        let strArray = str.split(';');
        let index;
        let arr;
        for (let ele of strArray) {
            index = ele.indexOf(':');
            if (index > -1) {
                arr = ele.split(':');
                obj[arr[0].trim()] = arr[1].trim();
            }
        }
        return obj;
    }
    static byname(css) {
        for (let cssInstance of Css.instances)
            if (cssInstance.css == css)
                return cssInstance;
        return undefined;
    }
    static update() {
        let style = document.getElementById(Css.elementId);
        let alreadyexists = true;
        if (!style) {
            alreadyexists = false;
            style = document.createElement('style');
        }
        pf.setAttrib(style, "id", Css.elementId);
        let outstring = "\n";
        for (let instance of Css.instances) {
            if (instance.css) {
                outstring += instance.css + "\n";
            }
            if (instance.cssHover) {
                outstring += instance.cssHover + "\n";
            }
            if (instance.cssSelect) {
                outstring += instance.cssSelect + "\n";
            }
        }
        style.innerHTML = outstring;
        if (!alreadyexists)
            document.getElementsByTagName('head')[0].appendChild(style);
    }
}
Css.elementId = "llmStyle";
Css.instances = [];
Css.activeInstances = [];
Css.defaults = {
    css: function () { return `Css_${pf.pad_with_zeroes(Css.instances.length)}`; },
    isClassname: true
};
Css.argMap = {
    string: ["classname", "css", "cssHover", "cssSelect", "cssSelectHover"],
    boolean: ["isClassname"]
};
Css.deleteOnFirstRunClassname = ".remove";
function css(...Arguments) { return new Css(...Arguments); }
// export {Css, css}
// import {Css, css} from './Css'
class DefaultTheme {
    static leftArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(182.31 12.399 12.341)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
    static rightArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
    static upArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(-87.663 12.607 12.106)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
    static downArrowSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
}
DefaultTheme.advisedDiv = new Css("div[llm]", "position:absolute;", false);
DefaultTheme.advisedBody = new Css("body", "overflow: hidden;", false);
// WinModal
DefaultTheme.titleCss = css("modalTitle", `-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
    border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`);
// ScrollBar
DefaultTheme.ScrollBar_whiteBG = css("whiteBG", "background-color:white;outline: 1px solid black;outline-offset: -1px;");
DefaultTheme.ScrollBar_blackBG = css("blackBG", "background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
// arrows  //scrollArrows
DefaultTheme.scrollArrowsSVGCss = css(`scrollArrows`, `stroke: black;`, `fill: white;`);
DefaultTheme.arrowSVGCss = css(`arrowIcon`, `stroke: black;`, `fill: white;`);
// Modal
DefaultTheme.closeCss = css("closeCss", `-moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      border: 1px solid black;background:white;`);
DefaultTheme.closeSVGCss = css(`closeIcon`, `stroke: black;background:white`, `stroke: white;background:red`);
DefaultTheme.closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
      </svg>`;
// Dragbar
DefaultTheme.horCss = css("db_hor", "background-color:black;cursor: ew-resize;");
DefaultTheme.verCss = css("db_ver", "background-color:black;cursor: ns-resize;");
// context
DefaultTheme.context = css("contxt", "background-color:white;color: black;outline-style: solid;outline-width: 1px;", "contxt:hover", "background-color:black;color: white;outline-style: solid;outline-width: 1px;");
// static defaultMenuBarCss = css("menuBar","background-color:white;color: black;");
// static defaultMenuBarHover = css("menuBar:hover","background-color:black;color: white;");
// static defaultMenuBarNoHoverCss = css("menuBarNoHover","background-color:white;color: black;");                         
// Toolbar
DefaultTheme.llm_checker = css("llm_checker", `cursor:pointer;
    --checkerSize: 2px; /* edit me */
    background-image:
      linear-gradient(45deg, lightgrey 25%, transparent 25%), 
      linear-gradient(135deg, lightgrey 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, lightgrey 75%),
      linear-gradient(135deg, transparent 75%, lightgrey 75%);
    background-size: 
      calc(2 * var(--checkerSize)) 
      calc(2 * var(--checkerSize));
    background-position: 
      0 0, 
      var(--checkerSize) 0, 
      var(--checkerSize) calc(-1 * var(--checkerSize)), 
      0px var(--checkerSize);
    /* for fun */
    transition-property: background-position, background-size;
    transition-duration: 2s;`);
Css.theme = DefaultTheme;
// export {DefaultTheme}
// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Handler} from './Handler';
// import {Css, css} from './Css';
// import {mf, pf} from './PureFunctions';
// import {Tree, tree} from './Tree';
class Pages extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Pages.pop(this); // pages must be added
        Pages.instances.unshift(this); // in reverse order!
        if (this.retArgs["DisplayCell"])
            this.displaycells = this.retArgs["DisplayCell"];
        else
            this.displaycells = [];
        Pages.makeLabel(this);
    }
    // dim:string;
    get dim() { return this.evalCell().dim; }
    set dim(value) { console.log(`Do Not Set 'Dim' value in Pages("${this.label}").  It is inherited.`); }
    eval() { return this.evalFunction(this); }
    evalCell() { return this.displaycells[this.eval()]; }
    setPage(pageNumber) {
        if (typeof (pageNumber) == "string")
            pageNumber = this.byLabel(pageNumber);
        if (pageNumber != this.currentPage) {
            // this.previousPage = this.currentPage;
            this.currentPage = pageNumber;
            Handler.update();
        }
    }
    byLabel(label) {
        for (let index = 0; index < this.displaycells.length; index++) {
            let displaycell = this.displaycells[index];
            let dslabel = displaycell.label;
            if (dslabel.endsWith("_DisplayCell")) { /////////////////////////////////////// double check!
                dslabel = dslabel.slice(0, -12);
            }
            if (dslabel == label)
                return index;
        }
        return -1;
    }
    static byLabel(label) {
        for (let index = 0; index < Pages.instances.length; index++) {
            const page = Pages.instances[index];
            if (page.label == label)
                return page;
        }
        return undefined;
    }
    addSelected(pageNumber = this.currentPage) {
        let labelOfPageNumber = this.displaycells[pageNumber].label;
        if (labelOfPageNumber.endsWith("_DisplayCell")) { /////////////////////////////////////// double check!
            labelOfPageNumber = labelOfPageNumber.slice(0, -12);
        }
        let querry = document.querySelectorAll(`[pagebutton='${this.label}|${pageNumber}'], [pagebutton='${this.label}|${labelOfPageNumber}']`); // ".classA, .classB"
        let el;
        let select;
        for (let i = 0; i < querry.length; i++) {
            el = querry[i];
            select = el.getAttribute("select");
            if (select)
                pf.setAttrib(el, "class", select);
            else {
                let currentClass = el.getAttribute("class");
                if (Css.byLabel(currentClass).cssSelect) {
                    pf.setAttrib(el, "class", currentClass + "Selected");
                }
            }
        }
        // console.log(el);
    }
    static setPage(label, pageNumber) { Pages.byLabel(label).setPage(pageNumber); }
    static applyOnclick() {
        let querry = document.querySelectorAll(`[pagebutton]`);
        let el;
        for (let i = 0; i < querry.length; i++) {
            el = (querry[i]);
            // el.onclick = function(event) {Tree.onclick.bind(this)(event);}
            ///////////////////////
            ///////////////////////
            //////////////////////
            //////////////////////// re-link HERE!!!!
        }
    }
    static button(pagename, index, keepAsNumber = false) {
        let page = Pages.byLabel(pagename);
        if (!keepAsNumber && page && typeof (index) == "number") {
            index = page.displaycells[index].label;
            if (index.endsWith("_DisplayCell")) { /////////////////////////////////////// double check!
                index = index.slice(0, -12);
            }
        }
        return { attributes: { pagebutton: `${pagename}|${index}` } };
    }
    static parseURL(url = window.location.href) {
        let argsObj = pf.parseURLParams(url);
        if (argsObj)
            for (let key in argsObj) {
                let pageInstance = Pages.byLabel(key);
                if (pageInstance)
                    pageInstance.currentPage = argsObj[key];
            }
    }
    static pushHistory() {
        let newUrl = window.location.href.split("?")[0];
        let prefix = "?";
        for (const page of Pages.activePages) {
            if (page.currentPage) {
                newUrl += `${prefix}${page.label}=${page.currentPage}`;
                prefix = "&";
            }
        }
        history.pushState(null, null, newUrl);
        //console.log(newUrl);
    }
    static popstate(event) {
        // history.back();
        for (let index = 0; index < Pages.activePages.length; index++) {
            const page = Pages.activePages[index];
            page.currentPage = 0;
        }
        Pages.parseURL();
        Handler.update();
    }
}
Pages.activePages = [];
Pages.instances = [];
Pages.activeInstances = [];
Pages.defaults = {
    currentPage: 0, previousPage: 0,
    evalFunction: function (thisPages) { return thisPages.currentPage; }
};
Pages.argMap = {
    string: ["label"],
    number: ["currentPage"],
    function: ["evalFunction"],
    dim: ["dim"],
    // DisplayCell: ["displaycells"] <- but the whole array done in constructor
};
function P(...Arguments) {
    let displaycell = new DisplayCell(new Pages(...Arguments));
    if (displaycell.pages.dim)
        displaycell.dim = displaycell.pages.dim;
    return displaycell;
}
// export {P, Pages}
// import { Base } from './Base';
class Drag extends Base {
    constructor(...Arguments) {
        super();
        this.onDown = function () { };
        this.onMove = function () { };
        this.onUp = function () { };
        this.isDown = false;
        this.buildBase(...Arguments);
        if ("Array" in this.retArgs) {
            let array = this.retArgs["Array"][0];
            this.onDown = array[0];
            this.onMove = array[1];
            this.onUp = array[2];
        }
        if ("HTMLDivElement" in this.retArgs) {
            this.el = this.retArgs["HTMLDivElement"][0];
        }
        let THIS = this;
        this.el.onmousedown = function (e) {
            THIS.onDown();
            THIS.isDown = true;
            THIS.mousePos = { x: e.clientX, y: e.clientY };
            window.addEventListener('selectstart', Drag.disableSelect);
            window.onmousemove = function (e) {
                THIS.mouseDiff = { x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"] };
                THIS.onMove(THIS.mouseDiff);
            };
            window.onmouseup = function (e) {
                THIS.reset();
                THIS.onUp(THIS.mouseDiff);
            };
        };
        Drag.makeLabel(this);
    }
    reset() {
        window.onmousemove = function () { };
        window.onmouseup = function () { };
        window.removeEventListener('selectstart', Drag.disableSelect);
        this.isDown = false;
    }
    static disableSelect(event) {
        event.preventDefault();
    }
}
Drag.instances = [];
Drag.activeInstances = [];
Drag.defaults = {};
Drag.argMap = {
    string: ["label"],
};
class Swipe extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Swipe.makeLabel(this);
    }
}
Swipe.swipeDistance = 50;
Swipe.elementId = "llmSwipe";
Swipe.instances = [];
Swipe.activeInstances = [];
Swipe.defaults = {
    swipeDistance: Swipe.swipeDistance
};
Swipe.argMap = {
    string: ["label"],
    number: ["swipeDistance"]
};
function swipe(...Arguments) {
    let swipeObj = new Swipe(...Arguments);
    let retObj = { onMove: function (offset) {
            let dragObj = this;
            if (swipeObj["left"] && (offset["x"] < -swipeObj.swipeDistance)) {
                swipeObj["left"]();
                dragObj.reset();
            }
            if (swipeObj["right"] && (offset["x"] > swipeObj.swipeDistance)) {
                swipeObj["right"]();
                dragObj.reset();
            }
            if (swipeObj["up"] && (offset["y"] < -swipeObj.swipeDistance)) {
                swipeObj["up"]();
                dragObj.reset();
            }
            if (swipeObj["down"] && (offset["y"] > swipeObj.swipeDistance)) {
                swipeObj["down"]();
                dragObj.reset();
            }
        } };
    return retObj;
}
// export {swipe, Swipe, Drag}
// import {Base} from './Base';
class Hold extends Base {
    constructor(...Arguments) {
        super();
        this.onDown = function () { };
        this.event = function () { };
        this.onUp = function () { };
        this.isDown = false;
        this.buildBase(...Arguments);
        if ("HTMLDivElement" in this.retArgs) {
            this.el = this.retArgs["HTMLDivElement"][0];
        }
        let THIS = this;
        this.el.onmousedown = function (e) {
            THIS.onDown();
            // console.log(THIS.doOnclick);
            THIS.isDown = true;
            if (THIS.doOnclick)
                THIS.event();
            setTimeout(function () { Hold.start(THIS); }, THIS.startTime);
            window.onmouseup = function (e) {
                THIS.onUp();
                THIS.isDown = false;
            };
        };
        Hold.makeLabel(this);
    }
    static start(THIS) {
        if (THIS.isDown) {
            THIS.event();
            setTimeout(function () { Hold.start(THIS); }, THIS.repeatTime);
        }
    }
}
Hold.instances = [];
Hold.activeInstances = [];
Hold.defaults = {
    startTime: 1000, repeatTime: 100, doOnclick: true
};
Hold.argMap = {
    string: ["label"],
};
// export {Hold}
// import {DisplayCell} from './DisplayCell';
// import {DisplayGroup} from './DisplayGroup';
// import {mf, pf} from './PureFunctions';
class Overlay {
    constructor(...Arguments) {
        Overlay.instances.push(this);
        // console.log("New Overlay!");
        this.label = `Overlay_${pf.pad_with_zeroes(Overlay.instances.length)}`;
        this.sourceClassName = Arguments.shift();
        this.returnObj = new (Overlay.classes[this.sourceClassName])(...Arguments);
    }
    static byLabel(label) {
        for (let key in Overlay.instances)
            if (Overlay.instances[key].label == label)
                return Overlay.instances[key];
        return undefined;
    }
    renderOverlay(displaycell, parentDisplaygroup, index, derender) {
        this.currentlyRendered = !derender;
        // console.log("render",this.returnObj["label"]);
        (this.returnObj["render"])(displaycell, parentDisplaygroup, index, derender);
    }
}
Overlay.instances = [];
Overlay.classes = {
//    DragBar,for wxample... filled in when modules load.
};
// export {Overlay}
// import { Base } from './Base';
// import {Css, css} from './Css';
// import {I, DisplayCell} from './DisplayCell';
// import {DisplayGroup, h, v} from './DisplayGroup';
// import {Coord} from './Coord';
// import {Events, events} from './Events';
// import {Handler} from './Handler';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';
class DragBar extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let dragbar = this;
        this.displaycell = I(`${this.label}_dragbar`, "", events({ ondrag: { onDown: function (xmouseDiff) {
                    if (pf.isTypePercent(dragbar.parentDisplaycell.dim)) {
                        dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplaycell);
                    }
                    dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplaycell.dim);
                },
                onMove: function (xmouseDiff) {
                    let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"] : xmouseDiff["y"]) * ((dragbar.isLast) ? -1 : 1);
                    if (newdim > dragbar.max)
                        newdim = dragbar.max;
                    if (newdim < dragbar.min)
                        newdim = dragbar.min;
                    dragbar.parentDisplaycell.dim = `${newdim}px`;
                    Handler.update();
                },
                // onUp: function(ouxmouseDifftput:object){}
            } }));
        DragBar.makeLabel(this);
    }
    render(displaycell, parentDisplaygroup, index, derender) {
        // console.log(parentDisplaygroup);
        if (!this.parentDisplaygroup)
            this.parentDisplaygroup = parentDisplaygroup;
        let dragbar = this;
        let dragcell = dragbar.displaycell;
        let ishor = parentDisplaygroup.ishor;
        dragbar.ishor = ishor;
        let pxsize = (dragbar.pxsize) ? dragbar.pxsize : ((ishor) ? parentDisplaygroup.marginHor : parentDisplaygroup.marginVer);
        let isLast = (index == parentDisplaygroup.cellArray.length - 1) ? true : false;
        dragbar.isLast = isLast;
        let pcoord = displaycell.coord;
        let x = (ishor) ? ((isLast) ? pcoord.x - pxsize : pcoord.x + pcoord.width) : pcoord.x;
        let y = (ishor) ? pcoord.y : ((isLast) ? pcoord.y - pxsize : pcoord.y + pcoord.height);
        let width = (ishor) ? pxsize : pcoord.width;
        let height = (ishor) ? pcoord.height : pxsize;
        dragcell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex + Handler.zindexIncrement);
        dragcell.htmlBlock.css = (ishor) ? dragbar.horcss.classname : dragbar.vercss.classname;
        if (parentDisplaygroup.coord.isCoordCompletelyOutside(dragcell.coord))
            derender = true;
        Handler.renderDisplayCell(dragcell, parentDisplaygroup, undefined, derender);
    }
}
// static horCss = css("db_hor","background-color:black;cursor: ew-resize;");
// static verCss = css("db_ver","background-color:black;cursor: ns-resize;");
DragBar.instances = [];
DragBar.activeInstances = [];
DragBar.defaults = {
    horcss: DefaultTheme.horCss,
    vercss: DefaultTheme.verCss
};
DragBar.argMap = {
    string: ["label"],
    DisplayCell: ["parentDisplaycell"],
    number: ["min", "max", "pxsize"],
    Css: ["horcss", "vercss"]
};
function dragbar(...Arguments) {
    let overlay = new Overlay("DragBar", ...Arguments);
    let newDragBar = overlay.returnObj;
    let parentDisplaycell = newDragBar.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["DragBar"] = DragBar;
// export {dragbar, DragBar}
// // import {Base} from './Base';
// // import {Css, css} from './Css';
// // import {DisplayCell, I} from './DisplayCell';
// // import {DisplayGroup, v, h} from './DisplayGroup';
// // import {Events, events} from './Events';
// // import {Coord} from './Coord';
// // import {Handler} from './Handler';
// // import {Overlay} from './Overlay';
class ScrollBar extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        //ScrollBar.makeLabel(this);
        this.label = `${this.parentDisplaycell.label}_${this.type}`;
        this.build();
        if (!this.coord)
            this.coord = this.parentDisplaycell.coord;
        if (!this.parentDisplaycell.preRenderCallback) {
            this.parentDisplaycell.preRenderCallback = FunctionStack.function(this.label);
        }
        let THIS = this;
        FunctionStack.push(this.label, function (displaycell, parentDisplaygroup /*= undefined*/, index /*= undefined*/, derender) {
            let width = (THIS.ishor) ? THIS.coord.width : THIS.coord.width - THIS.barSize;
            let height = (THIS.ishor) ? THIS.coord.height - THIS.barSize : THIS.coord.height;
            THIS.coord.assign(undefined, undefined, width, height, undefined, undefined, width, height);
        }, ((this.ishor) ? "ishorTrue" : "ishorFalse"));
        // Handler.update();
    }
    build() {
        let THIS = this;
        //let ishor = this.displaygroup.ishor;
        this.preBar = I(`${this.label}_preBar`, DefaultTheme.ScrollBar_whiteBG, events({ onclick: THIS.onPreBar.bind(THIS) }));
        this.Bar = I(`${this.label}_Bar`, DefaultTheme.ScrollBar_blackBG, events({ ondrag: { onDown: THIS.onBarDown.bind(THIS), onMove: THIS.onBarMove.bind(THIS) } }));
        this.postBar = I(`${this.label}_postBar`, "100%", DefaultTheme.ScrollBar_whiteBG, events({ onclick: THIS.onPostBar.bind(THIS) }));
        this.scrollbarDisplayCell =
            h(`${this.label}_h`, `${this.barSize}px`, I(`${this.label}_backArrow`, `${this.barSize}px`, (this.ishor) ? DefaultTheme.leftArrowSVG("scrollArrows") : DefaultTheme.upArrowSVG("scrollArrows"), events({ onhold: { event: function (mouseEvent) { THIS.onBackArrow(mouseEvent); } } })), this.preBar, this.Bar, this.postBar, I(`${this.label}_forwardArrow`, `${this.barSize}px`, (this.ishor) ? DefaultTheme.rightArrowSVG("scrollArrows") : DefaultTheme.downArrowSVG("scrollArrows"), events({ onhold: { event: function (mouseEvent) { THIS.onForwardArrow(mouseEvent); } } })));
        ScrollBar.activate(this);
    }
    onBarDown() { ScrollBar.startoffset = this.offset; }
    onBarMove(xmouseDiff) {
        let dist = (this.ishor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + dist / this.scaleFactor;
        this.validateOffsetAndRender();
    }
    onPreBar(mouseEvent = undefined) { this.offset -= this.viewPortSize; this.validateOffsetAndRender(); }
    onPostBar(mouseEvent = undefined) { this.offset += this.viewPortSize; this.validateOffsetAndRender(); }
    onBackArrow(mouseEvent = undefined) { this.offset -= 3 / this.scaleFactor; this.validateOffsetAndRender(); }
    onForwardArrow(mouseEvent = undefined) { this.offset += 3 / this.scaleFactor; this.validateOffsetAndRender(); }
    validateOffsetAndRender() {
        if (this.offset < 0)
            this.offset = 0;
        let max = this.displaySize - this.viewPortSize;
        if (this.offset > max)
            this.offset = max;
        Handler.update();
    }
    update(displaySize) {
        //let coord = this.displaygroup.coord;
        let ishor = this.ishor;
        let width = (ishor) ? this.coord.width : this.coord.width - this.barSize;
        let height = (ishor) ? this.coord.height - this.barSize : this.coord.height;
        let sbx = (ishor) ? this.coord.x : this.coord.x + this.coord.width;
        let sby = (ishor) ? this.coord.y + this.coord.height : this.coord.y;
        let scw = (ishor) ? this.coord.width : this.barSize;
        let sch = (ishor) ? this.barSize : this.coord.height;
        this.scrollbarDisplayCell.coord.assign(sbx, sby, scw, sch, sbx, sby, scw, sch, this.coord.zindex);
        // this.coord.assign( undefined, undefined, width, height, undefined, undefined, width, height);
        this.displaySize = displaySize;
        this.viewPortSize = (ishor) ? this.parentDisplaycell.coord.width : this.parentDisplaycell.coord.height;
        let scrollBarSize = this.viewPortSize - this.barSize * 2;
        this.scaleFactor = scrollBarSize / this.displaySize;
        this.preBar.dim = `${Math.round(this.offset * this.scaleFactor)}px`;
        this.Bar.dim = `${Math.round(this.viewPortSize * this.scaleFactor)}px`;
        return this.offset;
    }
    render(displaycell, parentDisplaygroup, index, derender) {
        Handler.renderDisplayCell(this.scrollbarDisplayCell, undefined, undefined, derender);
    }
    delete() {
        // console.log(`ScrollBar :${this.label} destroyed`);
        FunctionStack.pop(this.label, ((this.ishor) ? "ishorTrue" : "ishorFalse"));
        Handler.renderDisplayCell(this.scrollbarDisplayCell, undefined, undefined, true);
        ScrollBar.deactivate(this);
    }
    onWheel(event) {
        //console.log("Wheel Event", event.deltaY);
        if (event.deltaY > 0)
            this.onForwardArrow();
        else
            this.onBackArrow();
    }
    static onWheel(event) {
        let selectedInstance;
        let minDist = 100000;
        let dist;
        let scrollbar;
        for (let instance of ScrollBar.activeInstances) {
            if (instance.scrollbarDisplayCell.coord.isPointIn(event.clientX, event.clientY))
                scrollbar = instance;
            else if (instance.parentDisplaycell.coord.isPointIn(event.clientX, event.clientY))
                scrollbar = instance;
        }
        if (scrollbar)
            scrollbar.onWheel(event);
    }
    static distOfMouseFromWheel(THIS, event) {
        let ishor = THIS.ishor;
        let displaycell = THIS.parentDisplaycell;
        let coord = displaycell.coord;
        let x = event.clientX;
        let y = event.clientY;
        let dist = 0;
        // console.log(ishor, x, y, coord)
        if (!ishor) {
            if (x < coord.x)
                dist = coord.x - x;
            if (x > coord.x + coord.width)
                dist = x - (coord.x + coord.width);
        }
        else {
            if (y < coord.y)
                dist = coord.y - y;
            if (y > coord.y + coord.height)
                dist = y - (coord.y + coord.height);
        }
        return dist;
    }
}
ScrollBar.labelNo = 0;
ScrollBar.instances = [];
ScrollBar.activeInstances = [];
ScrollBar.defaults = { barSize: 15, offset: 0, type: "Unknown" };
ScrollBar.argMap = {
    string: ["label"],
    DisplayCell: ["parentDisplaycell"],
    number: ["barSize"],
    boolean: ["ishor"],
    // Coord: ["coord"]
};
function scrollbar(...Arguments) {
    let overlay = new Overlay("ScrollBar", ...Arguments);
    let newScrollBar = overlay.returnObj;
    let parentDisplaycell = newScrollBar.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["ScrollBar"] = ScrollBar;
// class ScrollBar extends Base {
//     static instances:ScrollBar[] = [];
//     static activeInstances:ScrollBar[] = [];
//     // static whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;");
//     // static blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
//     static defaults = {
//         offset : 0, displayAtEnd: true, scrollWidth : 15, currentlyRendered: true, arrowOffset: 2,
//     }
//     static argMap = {
//         string : ["label"],
//         DisplayGroup: ["displaygroup"],
//         number: ["fixedPixels", "viewingPixels", "scroolWidth"],
//         boolean: ["displayAtEnd"]
//     }
//     static scrollWheelMult = 4;
//     static triggerDistance = 40;
//     label:string;
//     currentlyRendered: boolean;
//     ishor: boolean;
//     arrowOffset:number;
//     scrollWidth: number;
//     displayAtEnd:boolean;
//     fixedPixels: number;
//     viewingPixels: number;
//     offset: number;
//     maxOffset: number;
//     offsetAtDrag: number;
//     offsetPixelRatio: number;
//     parentDisplaygroup: DisplayGroup;
//     displaygroup: DisplayGroup;
//     displaycell: DisplayCell;
//     leftArrow: DisplayCell;
//     upArrow: DisplayCell;
//     prePaddle: DisplayCell;
//     paddle: DisplayCell;
//     postPaddle: DisplayCell;
//     rightArrow: DisplayCell;
//     downArrow: DisplayCell;
//     paddleSizePx:number;
//     clickPageSize: number;
//     // displayedFixedPx: number;
//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         ScrollBar.makeLabel(this);
//         this.build();
//     }
//     build(){
//         let THIS = this;
//         let off = this.arrowOffset;
//         let ss = this.scrollWidth;
//         let w = ss-off;
//         let mid = ss/2;
//         this.leftArrow = I(this.label+"_Left", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${mid} ${w},${off} ${w},${w} ${off},${mid}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
//                                                   })
//             );
//         this.upArrow = I(this.label+"_Up", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${w} ${mid},${off} ${w},${w} ${off},${w}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickLeftorUp(mouseEvent)} } 
//                                                   })
//         );
//         this.prePaddle = I(this.label+"_Pre", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageLeftorUp(mouseEvent)}}));
//         this.paddle = I(this.label+"_Paddle", "","blackBG", events({ondrag: { onDown :function(){THIS.offsetAtDrag = THIS.offset},
//                                                                               onMove :function(output:object){THIS.dragging(output)},
//                                                            /* onUp: function(output:object){console.log("mouseup");console.log(output)}*/
//                                                           }
//                         }));
//         this.postPaddle = I(this.label+"_Post", "","whiteBG", events({onclick:function(mouseEvent:MouseEvent){THIS.clickPageRightOrDown(mouseEvent)}}));
//         this.rightArrow = I(this.label+"_Right", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${off} ${w},${mid} ${off},${w} ${off},${off}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
//                                                   })
//         );
//         this.downArrow = I(this.label+"_down", `<svg height="${ss}" width="${ss}">
//             <polygon points="${off},${off} ${w},${off} ${mid},${w} ${off},${off}"
//             style="fill:black;stroke:black;stroke-width:1" />
//             </svg>`, `${ss}px`, "whiteBG", events({onhold:{event:function(mouseEvent:MouseEvent){THIS.clickRightOrDown(mouseEvent)} } 
//                                                   })
//         );            
//         this.ishor = this.displaygroup.ishor;
//         this.displaycell = h(   this.ishor, // note even though I'm using H - id chooses here.
//                                 (this.ishor) ? this.leftArrow : this.upArrow,
//                                 this.prePaddle,
//                                 this.paddle,
//                                 this.postPaddle,
//                                 (this.ishor) ? this.rightArrow : this.downArrow,
//                                 this.label,
//                             );
//     }
//     clickLeftorUp(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
//         this.offset -= (this.offsetPixelRatio*10)*noTimes;
//         if (this.offset < 0) this.offset = 0;
//         Handler.update();
//     }
//     clickRightOrDown(mouseEvent:MouseEvent|WheelEvent, noTimes:number=1){
//         this.offset += (this.offsetPixelRatio*10)*noTimes;
//         if (this.offset > this.maxOffset) this.offset = this.maxOffset;
//         Handler.update();
//     }
//     clickPageLeftorUp(mouseEvent:MouseEvent|WheelEvent){
//         this.offset -= this.clickPageSize;
//         if (this.offset < 0) this.offset = 0;
//         Handler.update();
//     }
//     clickPageRightOrDown(mouseEvent:MouseEvent|WheelEvent){
//         this.offset += this.clickPageSize;
//         if (this.offset > this.maxOffset) this.offset = this.maxOffset;
//         Handler.update();
//     }
//     dragging(output:object){
//         let diff = (this.ishor) ? output["x"]:output["y"];
//         // console.log(diff, diff*this.offsetPixelRatio);
//         let newoffset = this.offsetAtDrag + diff*this.offsetPixelRatio;
//         if (newoffset < 0) newoffset = 0;
//         if (newoffset > this.maxOffset) newoffset = this.maxOffset;
//         this.offset = newoffset;
//         Handler.update();
//     }
//     render(displaycell:DisplayCell, parentDisplaygroup: DisplayGroup, index:number, derender:boolean){
//         if (!this.parentDisplaygroup) this.parentDisplaygroup = parentDisplaygroup;
//         let dgCoord:Coord = this.displaygroup.coord;
//         // calculate outer scrollbar dimensions
//         // console.log( JSON.stringify(parentDisplaygroup.coord.within, null, 4) )
//         let x = (this.ishor) ? dgCoord.within.x : dgCoord.within.x + dgCoord.within.width - this.scrollWidth;
//         let width = (this.ishor) ? dgCoord.within.width : this.scrollWidth;
//         let y = (this.ishor) ? dgCoord.within.y + dgCoord.within.height - this.scrollWidth : dgCoord.within.y;
//         let height = (this.ishor) ? this.scrollWidth : dgCoord.within.height;
//         // console.log( JSON.stringify({x,y,width,height}, null, 4) )
//         this.displaycell.coord.assign(x, y, width, height);
//         // calculate inner scrollbar dimensions
//         let preDisplayCell = this.displaycell.displaygroup.cellArray[1];
//         let paddleDisplayCell = this.displaycell.displaygroup.cellArray[2];
//         let postDisplayCell = this.displaycell.displaygroup.cellArray[3];
//         // "fixedPixels", "viewingPixels"
//         let overflow = this.fixedPixels - this.viewingPixels;
//         if (this.offset > overflow) this.offset = overflow;
//         let viewingPixels = (this.ishor) ? dgCoord.width : dgCoord.height;
//         let fixedPixels = parentDisplaygroup.dimArrayTotal;
//         let paddlePercent = Math.round(viewingPixels/fixedPixels*100);
//         let percentAfterPaddle = Math.round(100 - (viewingPixels/fixedPixels*100));
//         let prePercent = Math.round(percentAfterPaddle*(this.offset/overflow));
//         let postPercent = 100 - paddlePercent - prePercent;
//         preDisplayCell.dim = `${prePercent}%`;
//         paddleDisplayCell.dim = `${paddlePercent}%`;
//         postDisplayCell.dim = `${postPercent}%`;
//         let screenPixelsNotShown = fixedPixels-viewingPixels;
//         let scrollbarPixelsNotShown = viewingPixels-this.scrollWidth*2;
//         this.offsetPixelRatio = screenPixelsNotShown/scrollbarPixelsNotShown; // so bigger than 1:
//         this.clickPageSize = (paddlePercent/100)*fixedPixels
//         // let pixelForStretch = fixedPixels*percentAfterPaddle/100
//         //this.offsetPixelRatio = 
//         //this.clickPageSize = 
//         // console.log(this.clickPageSize)
//         Handler.currentZindex += Handler.zindexIncrement*2;
//         this.currentlyRendered = !derender;
//         // console.log(this.displaycell, this.offset);
//         Handler.renderDisplayCell(this.displaycell, undefined, undefined, derender);
//         Handler.currentZindex -= Handler.zindexIncrement*2;
//     }
//     static distOfMouseFromWheel(THIS:ScrollBar, event:WheelEvent) {
//         let ishor = THIS.displaygroup.ishor;
//         let displaycell = THIS.displaycell;
//         let coord = displaycell.coord;
//         let x = event.clientX;
//         let y = event.clientY;
//         let dist:number = 0;
//         // console.log(ishor, x, y, coord)
//         if (!ishor) {
//             if (x < coord.x) dist = coord.x -x;
//             if (x > coord.x + coord.width) dist = x - (coord.x + coord.width)
//         } else {
//             if (y < coord.y) dist = coord.y -y;
//             if (y > coord.y + coord.height) dist = y - (coord.y + coord.height)
//         }
//         return dist;
//     }
//     static onWheel(event:WheelEvent) {
//         let selectedInstance:ScrollBar;
//         let minDist:number = 100000;
//         let dist:number;
//         for (let instance of ScrollBar.instances) {
//             if (instance.currentlyRendered) {
//                 if (instance.parentDisplaygroup.coord.isPointIn(event.clientX, event.clientY)
//                     ||instance.displaycell.coord.isPointIn(event.clientX, event.clientY)) {
//                     dist = ScrollBar.distOfMouseFromWheel(instance, event);
//                     if (!selectedInstance || dist < minDist) {
//                         minDist = dist;
//                         selectedInstance = instance;
//                     }
//                 }
//             }
//         }
//         if (selectedInstance) {
//             if (event.deltaY > 0) selectedInstance.clickRightOrDown(event, ScrollBar.scrollWheelMult*event.deltaY/100);
//             if (event.deltaY < 0) selectedInstance.clickLeftorUp(event, -ScrollBar.scrollWheelMult*event.deltaY/100)
//         }
//     }
// }
// Overlay.classes["ScrollBar"] = ScrollBar;
// // export {ScrollBar}
// import {/*BaseF,*/ Base} from './Base';
// import {/*Point, Within,*/ Coord} from './Coord';
// import {Css, css} from './Css';
// import {DisplayCell, I} from './DisplayCell';
// import {/*DisplayGroup, h,*/ v} from './DisplayGroup';
// import {events, Events} from './Events';
// import {Handler, H} from './Handler';
class Context extends Base {
    constructor(...Arguments) {
        super();
        this.coord = new Coord();
        this.buildBase(...Arguments);
        if (!this.menuObj)
            this.menuObj = Context.defaultObj;
        this.height = Object.keys(this.menuObj).length * this.cellheight;
        Context.makeLabel(this);
        this.buildCell();
    }
    buildCell() {
        let THIS = this;
        let cellArray = [];
        let numKeys = Object.keys(this.menuObj).length;
        let index = 0;
        let newContext;
        this.displaycell = v({ cellArray: [ /* filled at bottom */] });
        for (let key in this.menuObj) {
            let valueFunctionOrObject = this.menuObj[key];
            if (typeof (valueFunctionOrObject) == "function") {
                cellArray.push(I(((index == numKeys - 1) ? "100%" : `${this.cellheight}px`), { innerHTML: key }, this.css, events({ onclick: function (mouseEvent) {
                        valueFunctionOrObject(mouseEvent);
                        THIS.popAll();
                    } })));
            }
            else {
                newContext = new Context({ menuObj: valueFunctionOrObject,
                    width: this.width,
                    cellheight: this.cellheight,
                    css: this.css,
                    parentContext: this
                });
                newContext.launchcell = I(((index == numKeys - 1) ? "100%" : `${this.cellheight}px`), { innerHTML: key }, this.css, events({ onmouseover: function () {
                        let coord = THIS.coord;
                        if (!newContext.handler)
                            newContext.render(undefined, coord.x + coord.width - Context.subOverlapPx, coord.y + THIS.cellheight * (index - 2) - Context.subOverlapPx);
                    }
                }));
                cellArray.push(newContext.launchcell);
            }
            index += 1;
        }
        this.displaycell.displaygroup.cellArray = cellArray;
    }
    popAll() {
        this.pop();
        if (this.parentContext)
            this.parentContext.popAll();
        else
            window.onmousemove = function () { };
    }
    pop() {
        this.handler.pop();
        this.handler = undefined;
        if (this.parentContext)
            Context.lastRendered = this.parentContext;
    }
    managePop(mouseEvent) {
        let x = mouseEvent.clientX;
        let y = mouseEvent.clientY;
        let pop = !this.displaycell.coord.isPointIn(x, y);
        if (pop && this.launchcell && this.launchcell.coord.isPointIn(x, y))
            pop = false;
        let THIS = this;
        if (pop) {
            if (this.parentContext)
                window.onmousemove = function (mouseEvent) { THIS.parentContext.managePop(mouseEvent); };
            else
                window.onmousemove = function () { };
            this.pop();
        }
    }
    render(mouseEvent, x = 0, y = 0) {
        if (mouseEvent) {
            x = mouseEvent.clientX - Context.subOverlapPx;
            y = mouseEvent.clientY - Context.subOverlapPx;
        }
        this.coord.assign(x, y, this.width, this.height);
        this.handler = H(this.displaycell, this.coord);
        let THIS = this;
        window.onmousemove = function (mouseEvent) { THIS.managePop(mouseEvent); };
        Context.lastRendered = this;
    }
    hMenuBarx() { return this.launchcell.coord.x; }
    hMenuBary() { return this.launchcell.coord.y + this.launchcell.coord.height; }
    vMenuBarx() { return this.launchcell.coord.x + this.launchcell.coord.width; }
    vMenuBary() { return this.launchcell.coord.y; }
}
Context.subOverlapPx = 4;
Context.instances = [];
Context.activeInstances = [];
// static defaultMenuBarCss = css("menuBar","background-color:white;color: black;");
// static defaultMenuBarHover = css("menuBar:hover","background-color:black;color: white;");
// static defaultMenuBarNoHoverCss = css("menuBarNoHover","background-color:white;color: black;");
Context.defaultObj = { one: function () { console.log("one"); },
    two: function () { console.log("two"); },
    three: function () { console.log("three"); },
};
Context.defaults = {
    width: 100,
    cellheight: 25,
    css: Css.theme.context, //Context.defaultContextCss
};
Context.argMap = {
    string: ["label"],
    number: ["width", "cellheight"]
};
let context = function (...Arguments) {
    let newcontext = new Context(...Arguments);
    return function (mouseEvent) { newcontext.render(mouseEvent); return false; };
};
let hMenuBar = function (...Arguments) {
    let newcontext = new Context(...Arguments);
    return function (mouseEvent) {
        if (Context.lastRendered && Context.lastRendered.handler) {
            Context.lastRendered.popAll();
        }
        newcontext.render(undefined, newcontext.hMenuBarx(), newcontext.hMenuBary());
        return false;
    };
};
let vMenuBar = function (...Arguments) {
    let newcontext = new Context(...Arguments);
    return function (mouseEvent) { newcontext.render(undefined, newcontext.vMenuBarx(), newcontext.vMenuBary()); return false; };
};
// export {vMenuBar, hMenuBar, context, Context}
// import {Base} from './Base';
// import {Css, css} from './Css';
// import {DisplayCell, I} from './DisplayCell';
// import {Handler, H} from './Handler';
// import {Coord} from './Coord';
// import {DisplayGroup, v, h} from './DisplayGroup';
// import {events, Events} from './Events';
// import {Overlay} from './Overlay';
// import {mf, pf} from './PureFunctions';
var ModalType;
(function (ModalType) {
    ModalType["winModal"] = "winModal";
    ModalType["toolbar"] = "toolbar";
    ModalType["other"] = "other";
})(ModalType || (ModalType = {}));
class Modal extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Modal.makeLabel(this);
        this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        if ("number" in this.retArgs) {
            this.setSize(...this.retArgs["number"]);
        }
        else
            this.setSize();
    }
    static setSize(THIS, ...numbers) {
        let [vpX, vpY] = pf.viewport();
        let numberOfArgs = numbers.length;
        let x, y, width, height;
        if (numberOfArgs >= 2 && numberOfArgs < 4) {
            width = numbers[0];
            height = numbers[1];
            x = (vpX - width) / 2;
            y = (vpY - height) / 2;
            THIS.coord.assign(x, y, width, height, 0, 0, vpX, vpY);
        }
        else if (numberOfArgs >= 4) {
            THIS.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3], 0, 0, vpX, vpY);
        }
        else {
            THIS.coord.assign(Math.round(vpX / 4), Math.round(vpY / 4), Math.round(vpX / 2), Math.round(vpY / 2), 0, 0, vpX, vpY);
        }
    }
    static events(THIS) {
        return events({ ondrag: { onDown: function () {
                    Modal.movingInstace = THIS;
                    window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
                    return Modal.startMoveModal(THIS);
                }, onMove: function (offset) { return Modal.moveModal(THIS, offset); },
                onUp: function (offset) {
                    Modal.movingInstace = undefined;
                    window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
                }
            } });
    }
    ;
    static startMoveModal(THIS) {
        THIS.handler.toTop();
        Modal.x = THIS.handler.coord.x;
        Modal.y = THIS.handler.coord.y;
    }
    static moveModal(THIS, offset) {
        let handler = THIS.handler;
        Modal.offset = offset;
        let [width, height] = pf.viewport();
        let x = Modal.x + offset["x"];
        if (x < 0)
            x = 0;
        if (x + handler.coord.width > width)
            x = width - handler.coord.width;
        handler.coord.x = x;
        let y = Modal.y + offset["y"];
        if (y < 0)
            y = 0;
        if (y + handler.coord.height > height)
            y = height - handler.coord.height;
        handler.coord.y = y;
        Handler.update();
    }
    get coord() { return this.handler.coord; }
    setSize(...numbers) { Modal.setSize(this, ...numbers); }
    show() { Handler.activate(this.handler); Handler.update(); }
    hide() { this.handler.pop(); }
    isShown() { return Handler.isActive(this.handler); }
    dragWith(...Arguments) {
        let retArgs = BaseF.argumentsByType(Arguments);
        let htmlblock;
        if ("string" in retArgs)
            htmlblock = HtmlBlock.byLabel(retArgs["string"][0]);
        else if ("HtmlBlock" in retArgs)
            htmlblock = retArgs["HtmlBlock"][0];
        else if ("DisplayCell" in retArgs)
            htmlblock = retArgs["DisplayCell"][0].htmlBlock;
        let modalEvents = Modal.events(this);
        if (htmlblock) {
            if (htmlblock.events)
                htmlblock.events.actions["ondrag"] = modalEvents.actions["ondrag"];
            else
                htmlblock.events = Modal.events(this);
            if (this.isShown()) {
                this.hide();
                this.show();
            }
        }
    }
    closeWith(...Arguments) {
        let THIS = this;
        let retArgs = BaseF.argumentsByType(Arguments);
        let htmlblock;
        if ("string" in retArgs)
            htmlblock = HtmlBlock.byLabel(retArgs["string"][0]);
        else if ("HtmlBlock" in retArgs)
            htmlblock = retArgs["HtmlBlock"][0];
        else if ("DisplayCell" in retArgs)
            htmlblock = retArgs["DisplayCell"][0].htmlBlock;
        if (htmlblock) {
            htmlblock.events = events({ onclick: function () { THIS.hide(); } });
            if (this.isShown()) {
                this.hide();
                this.show();
            }
        }
    }
}
//     static closeCss = css("closeCss",`-moz-box-sizing: border-box;
//                                       -webkit-box-sizing: border-box;
//                                       border: 1px solid black;background:white;`);
//     static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
//     static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
//     <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
//    </svg>`;
Modal.labelNo = 0;
Modal.instances = [];
Modal.activeInstances = [];
Modal.defaults = { type: ModalType.other };
Modal.argMap = {
    string: ["label"],
    DisplayCell: ["rootDisplayCell"],
};
class winModal extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        winModal.makeLabel(this);
        this.build();
    }
    buildClose() {
        return I(`${this.label}_close`, DefaultTheme.closeSVG, DefaultTheme.closeCss, `${this.headerHeight}px`);
    }
    buildHeader() {
        this.header = h(`${this.label}_header`, `${this.headerHeight}px`, I(`${this.label}_title`, this.headerText, DefaultTheme.titleCss), this.buildClose());
        return this.header;
    }
    buildBody() {
        this.body = I(`${this.label}_body`, this.bodyText, DefaultTheme.closeCss);
        return this.body;
    }
    buildFooter() {
        this.footer = I(`${this.label}_footer`, this.footerText, `${this.footerHeight}px`);
        return this.footer;
    }
    build() {
        this.buildHeader();
        this.buildBody();
        if (this.footerText)
            this.buildFooter();
        let cells = [this.header, this.body];
        if (this.footer)
            cells.push(this.footer);
        this.rootDisplayCell = v(`${this.label}_V`, ...cells);
        let numbers = this.retArgs["number"];
        if (!numbers)
            numbers = [];
        this.modal = new Modal(`${this.label}_modal`, this.rootDisplayCell, ...numbers, { type: ModalType.winModal });
        this.modal.dragWith(`${this.label}_title`);
        this.modal.closeWith(`${this.label}_close`);
        this.modal.show();
    }
}
// static titleCss = css("modalTitle",`-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
// border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`)
winModal.labelNo = 0;
winModal.instances = [];
winModal.activeInstances = [];
winModal.defaults = { headerHeight: 20, buttonsHeight: 50, footerHeight: 20, headerText: "Window", bodyText: "Body" };
winModal.argMap = {
    string: ["label"],
};
class node_ extends Base {
    // get $(){return node_.Proxy(this)}
    // get node(){return node_.Proxy(this)}
    constructor(...Arguments) {
        super();
        this.ParentNodeTree = undefined;
        this.ParentNode = undefined;
        this.PreviousSibling = undefined;
        this.NextSibling = undefined;
        this.children = [];
        this.buildBase(...Arguments);
        this.Arguments = Arguments;
    }
    static newNode(THIS, ...Arguments) {
        let newnode = new node_(...Arguments);
        newnode.ParentNodeTree = THIS.ParentNodeTree;
        if (THIS.ParentNodeTree)
            THIS.ParentNodeTree.onNodeCreation(newnode);
        return newnode;
    }
    depth(node = this, deep = 0) { while (node) {
        deep += 1;
        node = node.parent();
    } ; return deep; }
    siblingObject(top = this, returnObject = {}) {
        while (top.PreviousSibling) {
            top = top.PreviousSibling;
        }
        do {
            returnObject[top.label] = top;
            top = top.NextSibling;
        } while (top);
        return returnObject;
    }
    newChild(...Arguments) {
        let newNode;
        if (typeof (Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            newNode = (Arguments[0]);
        else
            newNode = node_.newNode(this, ...Arguments);
        newNode.ParentNodeTree = this.ParentNodeTree;
        newNode.ParentNode = this;
        this.children.push(newNode);
        return newNode;
    }
    newSibling(...Arguments) {
        let previousNextSibling = this.NextSibling;
        if (typeof (Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            this.NextSibling = (Arguments[0]);
        else
            this.NextSibling = node_.newNode(this, ...Arguments);
        this.NextSibling.ParentNodeTree = this.ParentNodeTree;
        this.NextSibling.PreviousSibling = this;
        this.NextSibling.ParentNode = this.ParentNode;
        this.NextSibling.NextSibling = previousNextSibling;
        return this.NextSibling;
    }
    topSibling() {
        let returnNode = this;
        while (returnNode.previousSibling())
            returnNode = returnNode.previousSibling();
        return returnNode;
    }
    bottomSibling() {
        let returnNode = this;
        while (returnNode.nextSibling())
            returnNode = returnNode.nextSibling();
        return returnNode;
    }
    pop() {
        let index = this.ParentNode.children.indexOf(this);
        this.ParentNode.children.splice(index, 1);
        if (this.PreviousSibling) {
            this.PreviousSibling.NextSibling = this.NextSibling;
            if (this.NextSibling)
                this.NextSibling.PreviousSibling = this.PreviousSibling;
        }
        else if (this.NextSibling)
            this.NextSibling.PreviousSibling = undefined;
        this.PreviousSibling = this.NextSibling = this.ParentNode = undefined;
        return this;
    }
    nextSibling() { return this.NextSibling; }
    previousSibling() { return this.PreviousSibling; }
    firstChild() { return this.children[0]; }
    done() { return this.ParentNodeTree; }
    root() {
        let node = this;
        while (node.parent()) {
            node = node.parent();
        }
        return node;
    }
    parent() { return this.ParentNode; }
    // collapse(value:boolean = true){this.collapsed = value;}
    log() {
        if (this.children.length) {
            console.group(this.label);
            for (let index = 0; index < this.children.length; index++)
                this.children[index].log();
            console.groupEnd();
        }
        else
            console.log(this.label);
        if (this.NextSibling)
            this.NextSibling.log();
    }
    byLabel(label) { return node_.byLabel(label); }
}
// static Proxy(THIS:node_){
//     return new Proxy(THIS, {
//         get: function(target:node_, name:string) {
//             if (name in target) {
//                 return target[name];
//             } else {
//                 if (name == "$" || name == "node")
//                     return target;
//                 let siblingObject = target.siblingObject();
//                 if (name in siblingObject)
//                     return siblingObject[name];
//             }
//         }
//       })
// }
node_.labelNo = 0;
node_.instances = [];
node_.activeInstances = [];
node_.defaults = { collapsed: false };
node_.argMap = {
    string: ["label"],
};
function sample() {
    let sampleTree = new Tree_("SampleTree");
    let node = sampleTree.rootNode;
    node.newChild("One")
        .newChild("One-A")
        .newChild("One-A-1")
        .newSibling("One-A-2")
        .parent()
        .newSibling("One-B")
        .newChild("One-B-1")
        .newSibling("One-B-2")
        .newChild("One-B-2-1")
        .parent()
        .parent()
        .newSibling("One-C")
        .parent()
        .newSibling("Two")
        .newChild("Two-A")
        .newChild("Two-A-1")
        .parent()
        .newSibling("Two-B")
        .parent()
        .newSibling("Three");
    return sampleTree;
}
const defaultArgMap = {
    string: ["label"],
    other: ["hello"]
};
class Tree_ extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let THIS = this;
        if (this.Css && !this.css) {
            //console.log("Here", this.Css)
            this.css = this.Css.classname;
        }
        if (this.rootNode)
            this.traverse(function (node) {
                node.ParentNodeTree = THIS;
                THIS.onNodeCreation(node);
            });
        else {
            this.rootNode = new node_(...Arguments);
            this.rootNode.ParentNodeTree = this;
            this.onNodeCreation(this.rootNode);
            this.rootNode.ParentNodeTree = THIS;
        }
        if (this.node_arg_map)
            node_.argMap = this.node_arg_map;
    }
    static toggleCollapse(el, node, mouseEvent) {
        if (!node.collapsed)
            node.ParentNodeTree.derenderChildren(node);
        node.collapsed = !node.collapsed;
        let iconDisplayCell = DisplayCell.byLabel(`${node.label}_icon`);
        iconDisplayCell.htmlBlock.innerHTML = (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon;
        Handler.update();
    }
    static onNodeCreation(node) {
        let nodeLabel = I(`${node.label}_node`, `${node.label}`, node.ParentNodeTree.css, node.ParentNodeTree.events);
        nodeLabel.coord.hideWidth = true;
        node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
        (node.children.length) ?
            I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`, (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon, node.ParentNodeTree.iconClass, events({ onclick: function (mouseEvent) { Tree_.toggleCollapse(this, node, mouseEvent); } }))
            : I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`), nodeLabel);
    }
    traverse(traverseFunction, node = this.rootNode, traverseChildren = function () { return true; }, traverseNode = function () { return true; }) {
        if (traverseNode(node)) {
            traverseFunction(node);
            if (traverseChildren(node)) {
                if (node.children)
                    for (let index = 0; index < node.children.length; index++)
                        this.traverse(traverseFunction, node.children[index], traverseChildren, traverseNode);
            }
        }
        if (node.NextSibling)
            this.traverse(traverseFunction, node.NextSibling, traverseChildren, traverseNode);
    }
    newRoot(node) {
        let THIS = this;
        this.derender(this.rootNode);
        this.rootNode = node;
        this.traverse(function (node) {
            node.ParentNodeTree = THIS;
            THIS.onNodeCreation(node);
        });
    }
    root(...Arguments) {
        this.rootNode = new node_(...Arguments);
        return this.rootNode;
    }
    log() {
        this.rootNode.log();
    }
    derender(node) {
        this.traverse(function traverseFunction(node) {
            Handler.renderDisplayCell(node.displaycell, undefined, undefined, true);
        }, node);
    }
    derenderChildren(node) {
        for (let index = 0; index < node.children.length; index++)
            this.derender(node.children[index]);
    }
    render(displaycell, parentDisplaygroup, index, derender) {
        let THIS = this;
        let PDScoord = THIS.parentDisplayCell.coord;
        let x_ = PDScoord.x + THIS.sideMargin - this.offsetx;
        let y_ = PDScoord.y + THIS.topMargin;
        let max_x2 = 0;
        this.traverse(function traverseFunction(node) {
            let x = x_ + (node.depth() - 1) * THIS.tabSize;
            let y = y_;
            let width = PDScoord.width - x;
            let height = THIS.height;
            node.displaycell.coord.assign(x, y, width, height, PDScoord.x, PDScoord.y, PDScoord.width, PDScoord.height, Handler.currentZindex + Handler.zindexIncrement);
            y_ += THIS.height;
            Handler.renderDisplayCell(node.displaycell, undefined, undefined, derender);
            let cellArray = node.displaycell.displaygroup.cellArray;
            let el = cellArray[cellArray.length - 1].htmlBlock.el;
            // console.log(el)
            let bounding = el.getBoundingClientRect();
            // console.log(bounding)
            let x2 = bounding["x"] + bounding["width"];
            if (x2 > max_x2)
                max_x2 = x2;
        }, THIS.rootNode, function traverseChildren(node) {
            return (!node.collapsed);
        });
        let [scrollbarh, scrollbarv] = this.getScrollBarsFromOverlays();
        // console.log(max_x2, PDScoord.x + PDScoord.width)
        // check horizontal first
        if (max_x2 > (PDScoord.x + PDScoord.width) + 2) {
            if (!scrollbarh) {
                scrollbar(this.parentDisplayCell, true);
                [scrollbarh, scrollbarv] = this.getScrollBarsFromOverlays(); // defines scrollbarh
            }
            this.offsetx = scrollbarh.update(max_x2); ////
        }
        else {
            if (scrollbarh) {
                scrollbarh.delete();
                this.popOverlay(true);
                this.offsetx = 0;
            }
        }
        // check vertical next
        // if (y_ > (PDScoord.y + PDScoord.height) + 2) { 
        //     console.log("VERT SCROLLBAR")
        //     if (!scrollbarv) {
        //         scrollbar(this.parentDisplayCell, false);
        //         [scrollbarh,scrollbarv] = this.getScrollBarsFromOverlays(); // defines scrollbarh
        //         console.log("scrollbarv", scrollbarv)
        //      }
        //     this.offsety = scrollbarv.update(y_); ////
        // } else {
        //     if (scrollbarv) {
        //         scrollbarv.delete();
        //         this.popOverlay(false);
        //         this.offsety = 0;
        //     }
        // }
    }
    popOverlay(ishor) {
        let overlays = this.parentDisplayCell.overlays;
        for (let index = 0; index < overlays.length; index++)
            if (overlays[index].sourceClassName == "ScrollBar")
                if (overlays[index].returnObj.ishor == ishor)
                    overlays.splice(index, 1);
    }
    getScrollBarsFromOverlays() {
        let scrollbarh, scrollbarv;
        let scrollbarOverlays = this.parentDisplayCell.getOverlays("ScrollBar");
        for (let index = 0; index < scrollbarOverlays.length; index++) {
            let scrollbar_ = (scrollbarOverlays[index].returnObj);
            if (scrollbar_.ishor)
                scrollbarh = scrollbar_;
            else
                scrollbarv = scrollbar_;
        }
        return [scrollbarh, scrollbarv];
    }
}
Tree_.labelNo = 0;
Tree_.instances = [];
Tree_.activeInstances = [];
Tree_.defaults = { height: 20, indent: 6, onNodeCreation: Tree_.onNodeCreation, topMargin: 2, sideMargin: 0, tabSize: 8,
    collapsedIcon: DefaultTheme.rightArrowSVG("arrowIcon"), expandedIcon: DefaultTheme.downArrowSVG("arrowIcon"),
    iconClass: DefaultTheme.arrowSVGCss.classname, offsetx: 0, offsety: 0 };
Tree_.argMap = {
    string: ["label", "css"],
    DisplayCell: ["parentDisplayCell"],
    function: ["onNodeCreation"],
    number: ["height", "indent"],
    Css: ["Css"],
    Events: ["events"],
    node_: ["rootNode"],
};
function tree(...Arguments) {
    let overlay = new Overlay("Tree_", ...Arguments);
    let newTree_ = overlay.returnObj;
    let parentDisplaycell = newTree_.parentDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Tree_"] = Tree_;
/*
let newTree = nodeTree("TreeName")
            .sibling("ONE")
                .child("Child of One")
            .parent()
            .sibling("TWO")
            .sibling("Three")
                .child("Child of Three")
                .sibling("2nd Child of Three")
            .parent()
            .sibling("Four")
*/
// class TreeNode extends Base {
//     static instances:TreeNode[] = [];
//     static activeInstances:TreeNode[] = [];
//     static defaults = {
//     }
//     static argMap = {
//         DisplayCell : ["labelCell"],
//         string : ["label"],
//         Array: ["children"],
//         boolean: ["collapsed"]
//     }
//     label:string;
//     collapsed:boolean = false;
//     labelCell: DisplayCell;
//     children:TreeNode[];
//     horizontalDisplayCell: DisplayCell;
//     nodeCellArray : DisplayCell[] = [];
//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         if (this.labelCell.htmlBlock)
//             this.labelCell.htmlBlock.hideWidth = this.labelCell.coord.hideWidth = true;
//         if (this.labelCell && !this.label) this.label = this.labelCell.label;
//     }
//     visibleChildren(noChildren = 0):number {
//         if (!this.collapsed && this.children)
//             for (let child of this.children) 
//                 noChildren += child.visibleChildren(1);
//         return noChildren;
//     }
//     addDisplayCells(newCellArray: DisplayCell[] = [], isFirst: boolean = true) : DisplayCell[]{
//         if (!isFirst) newCellArray.push( this.horizontalDisplayCell );
//         if (!this.collapsed && this.children) {
//             for (let childNode of this.children) {
//                 newCellArray = childNode.addDisplayCells(newCellArray, false)
//             }
//         }
//         return newCellArray;
//     }
//     static parentTree(node:TreeNode) {return Tree.byLabel(node.label.split("_")[0]);}
//     // static path(node:TreeNode) {
//     //     let tree:Tree = TreeNode.parentTree(node);
//     //     let returnArray:any[] = [tree]
//     //     let labelArray = node.label.split("_");
//     //     labelArray.shift();                         // we already have tree, so remove that!
//     //     let loopnode = tree.rootTreeNode
//     //     while (labelArray.length) {                 // loop indexes in name to get children
//     //         returnArray.push(loopnode);
//     //         loopnode = loopnode.children[ parseInt( labelArray[0] )-1 ];
//     //         labelArray.shift();
//     //     }
//     //     return returnArray;
//     // }
// }
// function T(...Arguments:any){return new TreeNode(...Arguments)}
// class Tree extends Base {
//     static instances:Tree[] = [];
//     static activeInstances:Tree[] = [];
//     static defaultObj = T("Tree",
//         I("Tree_TopDisplay", "Top Display"),
//         [ T( "Tree_child1", I("Tree_Child1ofTop","Child1ofTop"), // true,       
//             [ T("Tree_child1_1", I("Tree_Child1ofChild1","Child1ofChild1") ),
//               T("Tree_child1_2", I("Tree_Child2ofChild1","Child2ofChild1") )
//             ]
//           ),
//           T( "Tree_child2", I("Tree_Child2ofTop","Child2ofTop") )]
//     )
//     static defaults = {
//         cellHeight:20, SVGColor:"white", startIndent: 0, indent : 10, collapsePad: 4, collapseSize: 16,
//         margin: 2,
//     }
//     static argMap = {
//         string : ["label"],
//         number : ["cellHeight", "margin"],
//         TreeNode : ["rootTreeNode"],
//         DisplayCell : ["parentDisplayCell"],
//         Events : ["events"],
//         t_ : ["t_instance"],
//     }
//     collapseSize: number;
//     collapsePad: number;
//     startIndent: number;
//     indent: number;
//     label:string;
//     parentDisplayCell : DisplayCell;
//     rootTreeNode:TreeNode;
//     cellHeight:number;
//     SVGColor:string;
//     coord: Coord;
//     t_instance: t_;
//     margin: number;
//     css:string = ""; // default class(es) for tree items.
//     events: Events; // default events for tree items.
//     constructor(...Arguments: any) {
//         super();this.buildBase(...Arguments);
//         if (!this.parentDisplayCell) {
//             this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`)
//         }
//         if ("Css" in this.retArgs) // duplicated!!!!!
//             for (let css of this.retArgs["Css"]) 
//                 this.css = (this.css + " "+  (<Css>css).classname).trim();
//         if ("string" in this.retArgs && this.retArgs.string.length > 1)
//             this.css += " " + this.retArgs.string.splice(1).join(' ');
//         // console.log(this.parentDisplayCell)
//         let V = v(`${this.label}_rootV`, this.parentDisplayCell.dim, this.margin, this.margin);  ////////////////////////////////////// check this again!
//         let cellArray = V.displaygroup.cellArray;
//         this.parentDisplayCell.displaygroup = new DisplayGroup(`${this.label}_rootH`, V);
//         if (this.t_instance && !this.rootTreeNode){
//             // console.log("Froud t_!");
//             this.rootTreeNode = Tree.autoLabelTreenodes(this.label, this.t_instance)
//         }
//         if (!this.rootTreeNode){ this.rootTreeNode = Tree.defaultObj;}
//         this.parentDisplayCell.preRenderCallback = function(displaycell: DisplayCell, parentDisplaygroup: DisplayGroup /*= undefined*/, index:number /*= undefined*/, derender:boolean){
//             if (!Handler.firstRun) {
//                 let bounding:object;
//                 let max=0;
//                 let x2:number;
//                 let elements = document.querySelectorAll("[treenode]");
//                 for (let element of elements) {
//                     bounding = element.getBoundingClientRect();
//                     x2 = bounding["x"] + bounding["width"]
//                     if (x2>max) max=x2;
//                 }
//                 let current = displaycell.coord.x + displaycell.coord.width;
//                 let dx = displaycell.coord.x;
//                 displaycell.displaygroup.cellArray[0].dim = `${ (current > max) ? current - dx : max - dx}px`;
//                 // displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current-2 : max}px`;  ///// BINGO!!!!!!!!!
//                 // console.log(displaycell.label, displaycell.coord);
//                 // console.log(displaycell.displaygroup.cellArray[0].dim)
//             }
//         }
//         Tree.makeLabel(this);
//         this.buildTreeNode(this.rootTreeNode, cellArray);
//     }
//     drawSVG(collapsed: boolean) : string{
//         let X = this.collapsePad;
//         let Y = (this.cellHeight - this.collapseSize)/2 + this.collapsePad;
//         let XX = this.collapseSize - X;
//         let YY = Y + this.collapseSize - 2*this.collapsePad;
//         let XMID = this.collapseSize/2;
//         let YMID = this.cellHeight/2;
//         let C = this.SVGColor;
//         return `<svg height="${this.cellHeight}" width="${this.collapseSize}">` + 
//             ( (collapsed) ? `<polygon points="${X},${Y} ${XX},${YMID} ${X},${YY} ${X},${Y}"`
//                           : `<polygon points="${X},${Y} ${XX},${Y} ${XMID},${YY} ${X},${Y}"`) +
//             `style="fill:${C};stroke:${C};stroke-width:1" />
//             </svg>`;  
//     }
//     toggleCollapse(node:TreeNode, mouseEvent:MouseEvent, el:any) {
//         node.collapsed = !node.collapsed;
//         node.horizontalDisplayCell.displaygroup.cellArray[1].htmlBlock.innerHTML = this.drawSVG(node.collapsed);
//         let cellArray = this.parentDisplayCell.displaygroup.cellArray[0].displaygroup.cellArray;
//         let index = cellArray.indexOf(node.horizontalDisplayCell);
//         // remove from Dom if collapsed
//         if (node.collapsed) {
//             for (let displaycell of node.nodeCellArray) {
//                 Handler.renderDisplayCell(displaycell, undefined, undefined, true);
//              }
//              node.collapsed = !node.collapsed;
//              let noVisibleChildren =  node.visibleChildren();
//              node.collapsed = !node.collapsed;
//              cellArray.splice(index + 1, noVisibleChildren);
//         } else { // Add DisplayCells if Toggled Open
//             cellArray.splice( index+1, 0, ...node.addDisplayCells() );
//         }
//         Handler.update();
//     }
//     buildTreeNode(node:TreeNode = this.rootTreeNode, cellArray: DisplayCell[], indent:number = this.startIndent){
//         let THIS = this;
//         let hasChildren = (node.children) ? ( (node.children.length) ? true : false) : false;
//         node.labelCell.htmlBlock.attributes["treenode"] = "";
//         if (!node.labelCell.htmlBlock.css && this.css.trim()) node.labelCell.htmlBlock.css = this.css.trim();
//         if (!node.labelCell.htmlBlock.events && this.events) node.labelCell.htmlBlock.events = this.events;
//         node.horizontalDisplayCell = h(                                 // Horizontal DisplayGroup Containing:
//             I(node.label+"_spacer","",`${indent}px`),                                     // spacer First
//             I(node.label+"_svg",                                                       // This is the SVG
//                 (hasChildren) ? this.drawSVG(node.collapsed) : "",
//                 `${this.collapseSize}px`,
//                 events({onclick:function(mouseEvent:MouseEvent){        // Event Handler for clicking the SVG
//                             mouseEvent.preventDefault();
//                             THIS.toggleCollapse(node, mouseEvent, this);},
//                         onmousedown:function(mouseEvent:MouseEvent){
//                             window.addEventListener('selectstart', Drag.disableSelect);
//                         },
//                         onmouseup:function(mouseEvent:MouseEvent){
//                             window.removeEventListener('selectstart', Drag.disableSelect);
//                         }
//             })
//             ),
//             node.labelCell,                                             // This is the TreeNode Label
//             `${this.cellHeight}px`                                      // Height in pixels of TreeNode
//         )
//         cellArray.push( node.horizontalDisplayCell );
//         if (node.children) {
//             for (let childNode of node.children)
//                 this.buildTreeNode(childNode, node.nodeCellArray, indent + this.indent);
//             if (!node.collapsed) DisplayCell.concatArray(cellArray, node.nodeCellArray);     
//         }
//     }
//     render(displaycell:DisplayCell){ /* Do Nothing! YAY! */}
//     static autoLabelTreenodes(label:string, rootNode:t_ ): TreeNode {
//         Tree.autoLabel(rootNode, label);
//         // console.log(rootNode);
//         return Tree.makeTreeNodes(rootNode);
//     }
//     static autoLabel(tObj:t_, postfix:string /*="autoTree"*/){
//         tObj.label = postfix;
//         (<i_>(tObj.TreeNodeArguments[0])).label = postfix;
//         if (tObj.TreeNodeArguments.length > 1) {
//             let ta:t_[] = <t_[]>(tObj.TreeNodeArguments[1])
//             for (let index = 0; index < ta.length; index++) {
//                 const t = ta[index];
//                 Tree.autoLabel(t, postfix+"_"+index);
//             }
//         }
//     }
//     static makeTreeNodes(node:t_): TreeNode {
//         let arrayOft_:t_[];
//         let returnArray:TreeNode[] = [];
//         let returnTreeNode: TreeNode;
//         let ii: i_ = node.TreeNodeArguments[0];
//         // if (node.TreeNodeArguments.length > 1){
//             arrayOft_ = node.TreeNodeArguments[1];
//             for (const singlet_ of arrayOft_) {
//                 returnArray.push( Tree.makeTreeNodes(singlet_) );
//             }
//             returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments), returnArray, node.TreeNodeArguments[2])
//         // } else {
//         //     returnTreeNode = T(node.label,  I(ii.label, ...ii.Arguments) )
//         // }
//         return returnTreeNode
//     }
//     static t(...Arguments:any){return new t_(...Arguments)}
//     static i(...Arguments:any){return new i_(...Arguments)}
//     static onclick(event:MouseEvent){           //Tree.onclick.bind(this)(event)
//         let el=this as unknown as HTMLElement;  // this onclick function is called BOUND to element.
//         let value = el.getAttribute("pagebutton");
//         let valueArray = value.split("|");
//         let pagename = valueArray[0];
//         let pageNo:string|number = valueArray[1];
//         let page = Pages.byLabel(pagename);
//         if (page.byLabel(pageNo) == -1) pageNo = parseInt(pageNo)
//         Pages.setPage( pagename, pageNo );
//         if (HtmlBlock.byLabel(el.id).events && HtmlBlock.byLabel(el.id).events.actions["onclick"]) {
//             var doit = HtmlBlock.byLabel(el.id).events.actions["onclick"].bind(el);
//             doit(event);
//         }
//     }
// }
// function tree(...Arguments:any){
//     let overlay=new Overlay("Tree", ...Arguments);
//     let newTree = <Tree>overlay.returnObj;
//     let displaycell = newTree.parentDisplayCell;
//     // displaycell.overlay = overlay; // remove this one soon
//     displaycell.addOverlay(overlay);
//     return displaycell;
// }
// Overlay.classes["Tree"] = Tree;
// // this is a messy way to solve a problem...
// function TI(...Arguments:any) : t_ /*: TreeNode*/ {
//     let arg:any;
//     let arrayInArgs:TreeNode[] = [];
//     let newT:t_;
//     let collapsed:boolean = false;
//     if (typeof(Arguments[0]) == "boolean" &&  Arguments[0] == true){
//         collapsed = true;
//         Arguments.shift();
//     }
//     for (let index = 0; index < Arguments.length; index++) { // pull array from Arguments
//         arg = Arguments[index];
//         if (pf.isArray(arg)) {
//             arrayInArgs = arg;
//             Arguments.splice(index, 1);
//             index -= 1;
//         }
//     }
//     let newI:i_ = Tree.i(/* "auto", */...Arguments); // name auto picked up in Tree Constructor.
//     newT = Tree.t(newI, arrayInArgs, collapsed)
//     // if (arrayInArgs) newT = Tree.t(newI, arrayInArgs);
//     // else newT = Tree.t(newI);
//     return newT
// }
// class i_{
//     label:string;
//     Arguments:any[];
//     constructor(...Arguments:any){this.Arguments = Arguments}
// }
// class t_{
//     label:string;
//     TreeNodeArguments:any[];
//     ItemArguments:any[];
//     constructor(...Arguments:any){this.TreeNodeArguments = Arguments}
// }
// export {t_, i_, TI, tree, TreeNode, Tree}
// import {Base} from './Base';
// import {DisplayCell} from './DisplayCell';
// import {Handler} from './Handler';
// import {Coord} from './Coord';
// import {FunctionStack} from './FunctionStack';
// import {DisplayGroup} from './DisplayGroup';
// import {mf, pf} from './PureFunctions';
class Observe extends Base {
    // derendering: boolean = false;
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let observerInstance = this;
        let handler = Handler.byLabel(observerInstance.label);
        if (!handler.coord)
            handler.coord = new Coord();
        // put handler in stack if not there already (push Handler)
        if (Handler.activeInstances.indexOf(handler) == -1) {
            Handler.activeInstances.push(handler);
        }
        this.parentDisplayCell.htmlBlock.el.onscroll = function (event) { Observe.onScroll(event); };
        handler.controlledBySomething = true;
        if (!this.parentDisplayCell.postRenderCallback)
            this.parentDisplayCell.postRenderCallback = FunctionStack.function(this.parentDisplayCell.label);
        Observe.makeLabel(this);
        FunctionStack.push(this.parentDisplayCell.label, function (displaycell, parentDisplaygroup = undefined, index = undefined, derender = false) {
            let el = displaycell.htmlBlock.el;
            let dCoord = displaycell.coord;
            let handler = Handler.byLabel(observerInstance.label);
            let hCoord = handler.coord;
            let bound = observerInstance.el.getBoundingClientRect();
            hCoord.x = bound.x;
            hCoord.y = bound.y;
            hCoord.width = bound.width;
            hCoord.height = bound.height;
            hCoord.within.x = dCoord.x;
            hCoord.within.y = dCoord.y;
            hCoord.within.width = dCoord.width - ((el.scrollHeight > el.clientHeight) ? Observe.Os_ScrollbarSize : 0);
            hCoord.within.height = dCoord.height - ((el.scrollWidth > el.clientWidth) ? Observe.Os_ScrollbarSize : 0);
        });
        Handler.update();
    }
    static derender(displaycell) {
        let handler;
        // 
        for (let index = 0; index < Observe.instances.length; index++) {
            let observeInstance = Observe.instances[index];
            if (observeInstance.parentDisplayCell == displaycell) {
                handler = Handler.byLabel(observeInstance.label);
                let Hindex = Handler.activeInstances.indexOf(handler);
                if (Hindex > -1) {
                    Handler.activeInstances.splice(Hindex, 1);
                }
                let Oindex = Observe.instances.indexOf(observeInstance);
                Observe.instances.splice(Oindex, 1);
                Handler.renderDisplayCell(handler.rootCell, undefined, undefined, true);
                index -= 1;
            }
        }
        FunctionStack.pop(displaycell.label);
    }
    static onScroll(event) {
        for (let index = 0; index < Observe.instances.length; index++) {
            const observeInstance = Observe.instances[index];
            observeInstance.parentDisplayCell.postRenderCallback(observeInstance.parentDisplayCell);
            Handler.update();
        }
    }
    static update() {
        let els = document.querySelectorAll("[parentof]");
        let activeLabels = [];
        for (let index = 0; index < els.length; index++) { // loop elements in dom with parentof attribute...
            let el = els[index];
            let attribObj = pf.getAttribs(el);
            let handlerLabel = attribObj["parentof"];
            let handlerInstance = Handler.byLabel(handlerLabel);
            if (handlerInstance) { // if matching handler exists,
                activeLabels.push(handlerLabel);
                if (!Observe.byLabel(handlerLabel)) { // if not matching Observe instance exists
                    let parentEl = el.parentElement;
                    let parentDisplayCell;
                    while (parentEl && !parentDisplayCell) { // loop until parent matching displaycell found
                        parentDisplayCell = DisplayCell.byLabel(parentEl.id);
                        parentEl = parentEl.parentElement;
                    }
                    new Observe(handlerLabel, el, parentDisplayCell); // Create Observe Object!
                }
            } // else console.log(`Handler "${handlerLabel}" not found`);
        }
        // for (let index = 0; index < Observe.instances.length; index++) {  // now pop any Observers no longer needed
        //     const observeInstance = Observe.instances[index];
        //     if (activeLabels.indexOf(observeInstance.label) == -1) {
        //         observeInstance.pop();
        //     }
        // }
    }
}
Observe.instances = [];
Observe.activeInstances = [];
Observe.defaults = {};
Observe.argMap = {
    string: ["label"],
    HTMLDivElement: ["el"],
    DisplayCell: ["parentDisplayCell"],
};
Observe.Os_ScrollbarSize = 15;
// export {Observe}
// import {Base} from './Base';
// import {DisplayCell, I} from './DisplayCell';
// import {DisplayGroup, v, h} from './DisplayGroup';
// import {Coord} from './Coord';
// import {Handler} from './Handler';
// import {Overlay} from './Overlay';
// import {css, Css} from './Css';
// import {Modal} from './Modal';
// import {events, Events} from './Events';
// import {Pages, P} from './Pages';
// import { LabeledStatement } from "../node_modules/typescript/lib/typescript";
class Dockable extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let THIS = this;
        Dockable.makeLabel(this);
        if ("string" in this.retArgs && this.retArgs["string"].length > 1) {
            this.acceptsTypes = this.retArgs["string"].shift();
        }
        if (this.displaycell)
            this.displaygroup = this.displaycell.displaygroup;
        this.dummy = I(`${this.label}_DockableDummy`);
        window.addEventListener('ModalDropped', function (e) { THIS.dropped(e); }, false);
        window.addEventListener('ModalStartDrag', function (e) { THIS.undock(e); }, false);
    }
    undock(e) {
        let modal = e.detail;
        let toolbar = ToolBar.byLabel(modal.label.slice(0, -6));
        let ishor = this.displaygroup.ishor;
        if (toolbar) {
            let index = this.displaygroup.cellArray.indexOf(toolbar.rootDisplayCell);
            if (index > -1) { // is in this cellArray
                modal.coord.x = toolbar.rootDisplayCell.coord.x;
                modal.coord.y = toolbar.rootDisplayCell.coord.y;
                toolbar.state = (ishor) ? TBState.modalWasDockedInHor : TBState.modalWasDockedInVer;
                this.displaygroup.cellArray.splice(index, 1);
                toolbar.resizeForModal();
                toolbar.modal.show();
            }
        }
    }
    dropped(e) {
        let modal = e.detail;
        let toolbar = ToolBar.byLabel(modal.label.slice(0, -6));
        if (this.dropZones) {
            if (Dockable.activeDropZoneIndex != undefined && Dockable.DockableOwner == this.label) { // DOCK IT!
                toolbar.modal.hide();
                let ishor = this.displaygroup.ishor;
                toolbar.state = (ishor) ? TBState.dockedInHorizontal : TBState.dockedInVertical;
                toolbar.resizeFordock();
                this.displaygroup.cellArray[Dockable.activeDropZoneIndex] = toolbar.rootDisplayCell;
                Dockable.activeDropZoneIndex = undefined;
                toolbar.parentDisplayGroup = this.displaygroup;
                this.dropZones = undefined;
                Handler.update();
            }
        }
    }
    render(unuseddisplaycell, parentDisplaygroup, index, derender) {
        if (Modal.movingInstace && Modal.movingInstace.type == ModalType.toolbar) {
            let modal = Modal.movingInstace;
            let toolbar = ToolBar.byLabel(modal.label.slice(0, -6));
            let ishor = this.displaygroup.ishor;
            let cellArray = this.displaygroup.cellArray;
            if (!this.dropZones) { // define DropZones
                this.dropZones = [];
                for (let index = 0; index < cellArray.length; index++) {
                    let displaycell = cellArray[index]; // note scope is lost each loop
                    let newCoord = new Coord();
                    newCoord.copy(displaycell.coord);
                    newCoord.assign(undefined, undefined, (ishor) ? toolbar.width : undefined, (ishor) ? undefined : toolbar.height);
                    this.dropZones.push(newCoord);
                }
                let displaycell = cellArray[cellArray.length - 1];
                let newCoord = new Coord();
                newCoord.copy(displaycell.coord);
                newCoord.assign((ishor) ? displaycell.coord.x + displaycell.coord.width - toolbar.width : undefined, (ishor) ? undefined : displaycell.coord.y + displaycell.coord.height - toolbar.height, (ishor) ? toolbar.width : undefined, (ishor) ? undefined : toolbar.height);
                this.dropZones.push(newCoord);
            }
            for (let index = 0; index < this.dropZones.length; index++) {
                let dropCoord = this.dropZones[index];
                if (!toolbar.modal.coord.isCoordCompletelyOutside(dropCoord)) { // if hit zone, make zone
                    if (Dockable.activeDropZoneIndex == undefined) {
                        Dockable.DockableOwner = this.label;
                        Dockable.activeDropZoneIndex = index;
                        this.dummy.dim = `${(ishor) ? toolbar.width : toolbar.height}px`;
                        cellArray.splice(index, 0, this.dummy);
                    }
                }
                else { // When inactive, pop zone
                    if (index == Dockable.activeDropZoneIndex && Dockable.DockableOwner == this.label) {
                        Dockable.activeDropZoneIndex = undefined;
                        cellArray.splice(index, 1);
                    }
                }
            }
        }
    }
}
Dockable.labelNo = 0;
Dockable.instances = [];
Dockable.activeInstances = [];
Dockable.defaults = { acceptsTypes: ["ALL"] };
Dockable.argMap = {
    string: ["label"],
    DisplayCell: ["displaycell"],
};
function dockable(...Arguments) {
    let overlay = new Overlay("Dockable", ...Arguments);
    let newDockable = overlay.returnObj;
    let parentDisplaycell = newDockable.displaycell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["Dockable"] = Dockable;
var TBState;
(function (TBState) {
    TBState["dockedInVertical"] = "dockedInVertical";
    TBState["dockedInHorizontal"] = "dockedInHorizontal";
    TBState["modalWasDockedInHor"] = "modalWasDockedInHor";
    TBState["modalWasDockedInVer"] = "modalWasDockedInVer";
})(TBState || (TBState = {}));
class ToolBar extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        if ("DisplayCell" in this.retArgs)
            this.displayCells = this.retArgs["DisplayCell"];
        this.buildModal();
    }
    buildModal() {
        let THIS = this;
        this.rootDisplayCell =
            h(`${this.label}_h`, `${this.height}px`, I(`${this.label}_handle`, DefaultTheme.llm_checker, `${this.checkerSize}px`, events({ ondblclick: function (e) { THIS.toggleDirection(e); } })), ...this.displayCells);
        this.modal = new Modal(`${this.label}_modal`, this.rootDisplayCell, ...this.size(), { type: ModalType.toolbar });
        this.modal.dragWith(`${this.label}_handle`);
    }
    size() {
        let isHor = (this.state == TBState.dockedInVertical || this.state == TBState.modalWasDockedInVer);
        let width = (isHor) ? this.width * this.displayCells.length + this.checkerSize : this.width;
        let height = (isHor) ? this.height : this.height * this.displayCells.length + this.checkerSize;
        return [width, height];
    }
    toggleDirection(e) {
        if (this.state == TBState.modalWasDockedInHor || this.state == TBState.modalWasDockedInVer) {
            this.state = (this.state == TBState.modalWasDockedInHor) ? TBState.modalWasDockedInVer : TBState.modalWasDockedInHor;
            this.resizeForModal();
            Handler.update();
        }
    }
    resizeForModal() {
        let isHor = (this.state == TBState.modalWasDockedInVer);
        this.rootDisplayCell.displaygroup.ishor = isHor;
        this.rootDisplayCell.displaygroup.dim = `${(isHor) ? this.height : this.width}px`;
        let cellArray = this.rootDisplayCell.displaygroup.cellArray;
        for (let index = 1; index < cellArray.length; index++)
            cellArray[index].dim = `${(isHor) ? this.width : this.height}px`;
        let [width, height] = this.size();
        this.modal.coord.assign(undefined, undefined, width, height);
    }
    resizeFordock() {
        let isHor = (this.state == TBState.dockedInVertical);
        this.rootDisplayCell.displaygroup.ishor = isHor;
        this.rootDisplayCell.dim = `${(isHor) ? this.height : this.width}px`;
        let cellArray = this.rootDisplayCell.displaygroup.cellArray;
        for (let index = 1; index < cellArray.length; index++)
            cellArray[index].dim = `${(isHor) ? this.width : this.height}px`;
    }
    render(displaycell, parentDisplaygroup /*= undefined*/, index /*= undefined*/, derender) {
        if (parentDisplaygroup) {
            if (parentDisplaygroup != this.parentDisplayGroup) {
                // This only happens when docked at start!
                this.parentDisplayGroup = parentDisplaygroup;
                this.modal.hide();
                let ishor = parentDisplaygroup.ishor;
                this.state = (ishor) ? TBState.dockedInHorizontal : TBState.dockedInVertical;
                this.resizeFordock();
            }
        }
    }
}
ToolBar.labelNo = 0;
ToolBar.instances = [];
ToolBar.activeInstances = [];
ToolBar.defaults = { state: TBState.modalWasDockedInVer, checkerSize: 8, type: "default" };
ToolBar.argMap = {
    string: ["label", "type"],
    number: ["width", "height"]
};
function toolBar(...Arguments) {
    let overlay = new Overlay("ToolBar", ...Arguments);
    let newToolBar = overlay.returnObj;
    let parentDisplaycell = newToolBar.rootDisplayCell;
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["ToolBar"] = ToolBar;
class BindHandler extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        BindHandler.makeLabel(this);
    }
    render(displaycell, parentDisplaygroup, index, derender) {
        if (!this.handler.coord)
            this.handler.coord = new Coord();
        this.handler.coord.copy(this.parentDisplaycell.coord);
    }
}
BindHandler.labelNo = 0;
BindHandler.instances = [];
BindHandler.activeInstances = [];
BindHandler.defaults = {};
BindHandler.argMap = {
    string: ["label"],
    DisplayCell: ["parentDisplaycell"],
    Handler: ["handler"]
};
function bindHandler(...Arguments) {
    let overlay = new Overlay("BindHandler", ...Arguments);
    let newBindHandler = overlay.returnObj;
    let parentDisplaycell = newBindHandler.parentDisplaycell;
    // parentDisplaycell.overlay = overlay; // remove this line soon
    parentDisplaycell.addOverlay(overlay);
    return parentDisplaycell;
}
Overlay.classes["BindHandler"] = BindHandler;
