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
            instance["label"] = `${CLASS.name}_${CLASS["labelNo"]}`;
        }
    }
}
class Test extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Test.makeLabel(this);
    }
}
Test.labelNo = 0;
Test.instances = [];
Test.activeInstances = [];
Test.defaults = {
    tag: "DIV",
};
Test.argMap = {
    string: ["label", "innerHTML", "css"],
    number: ["marginLeft", "marginTop", "marginRight", "marginBottom"],
};
class FunctionStack {
    static push(label, function_) {
        if (!(label in FunctionStack.instanceObj))
            FunctionStack.instanceObj[label] = [];
        FunctionStack.instanceObj[label].push(function_);
    }
    static function(label) {
        return function (...Arguments) {
            let list = FunctionStack.instanceObj[label];
            if (list)
                for (let index = 0; index < list.length; index++)
                    list[index](...Arguments);
        };
    }
    static pop(label) { FunctionStack.instanceObj[label] = []; }
}
FunctionStack.instanceObj = {};
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
    static concatArray(main, added) { for (let displaycell of added)
        main.push(displaycell); }
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
            + `height:${this.height}px; z-index:${this.zindex + ((this.offset) ? 1 : 0)};${this.newClipStyleString()}`;
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
    let htmlblock = new HtmlBlock("", ...Arguments);
    htmlblock.label = HtmlBlock.defaults["label"]();
    return htmlblock;
}
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
function events(...arguments) { return new Events(...arguments); }
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
                    : undefined;
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
    set minDisplayGroupSize(size) { this.minDisplayGroupSize = size; }
    addOverlay(overlay) { this.overlays.push(overlay); }
    hMenuBar(menuObj) {
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({ onmouseover: hMenuBar(menuObj) });
    }
    vMenuBar(menuObj) {
        menuObj["launchcell"] = this;
        this.htmlBlock.events = events({ onmouseover: vMenuBar(menuObj) });
    }
}
_htmlBlock_ = new WeakMap(), _displaygroup_ = new WeakMap();
DisplayCell.instances = [];
DisplayCell.activeInstances = [];
DisplayCell.minDisplayGroupSize = 200; // copied from htmlblock
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
class DisplayGroup extends Base {
    // minimumCellSize:number;
    // renderStartIndex:number;
    // renderEndIndex:number;
    constructor(...Arguments) {
        super();
        this.cellArray = [];
        this.htmlBlock = undefined;
        this.overlay = undefined;
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
    Overlay: ["overlay"]
};
DisplayGroup.argCustomTypes = [];
function h(...Arguments) {
    return new DisplayCell(new DisplayGroup(...Arguments));
    // let displaycell = new DisplayCell(new DisplayGroup(...Arguments) );
    // if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    // return displaycell;
}
function v(...Arguments) {
    return new DisplayCell(new DisplayGroup(false, ...Arguments));
    // let displaycell = new DisplayCell(new DisplayGroup(false, ...Arguments) );
    // if (displaycell.displaygroup.dim) displaycell.dim = displaycell.displaygroup.dim;
    // return displaycell;
}
class Handler extends Base {
    constructor(...Arguments) {
        super();
        this.rootCell = undefined;
        this.buildBase(...Arguments);
        if ("DisplayCell" in this.retArgs)
            this.rootCell = this.retArgs["DisplayCell"][0];
        else
            pf.errorHandling(`Handler "${this.label}" requires a DisplayCell`);
        if (this.handlerMargin == undefined)
            this.handlerMargin = Handler.handlerMarginDefault;
        if (Handler.firstRun) {
            setTimeout(Handler.update);
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
    static update(ArrayofHandlerInstances = Handler.activeInstances, instanceNo = 0, derender = false) {
        // console.log("Update Fired");
        Handler.renderAgain = false;
        Pages.activePages = [];
        Handler.currentZindex = Handler.handlerZindexStart + (Handler.handlerZindexIncrement) * instanceNo;
        for (let index = 0; index < ArrayofHandlerInstances.length; index++) {
            let handlerInstance = ArrayofHandlerInstances[index];
            if (handlerInstance.preRenderCallback)
                handlerInstance.preRenderCallback(handlerInstance);
            if (handlerInstance.coord) {
                handlerInstance.rootCell.coord.copy(handlerInstance.coord);
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
                pages.displaycells[pages.previousPage].coord.copy(displaycell.coord);
                Handler.renderDisplayCell(pages.displaycells[pages.previousPage], parentDisplaygroup, index, true);
                pages.currentPage = pages.previousPage = evalCurrentPage;
                Pages.pushHistory();
            }
            pages.displaycells[evalCurrentPage].coord.copy(displaycell.coord);
            Handler.renderDisplayCell(pages.displaycells[evalCurrentPage], parentDisplaygroup, index, derender);
            pages.currentPage = evalCurrentPage;
            pages.addSelected();
        }
        else {
            let htmlBlock = displaycell.htmlBlock;
            let displaygroup = displaycell.displaygroup;
            let overlays = displaycell.overlays;
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
            if (overlays.length) {
                for (let ovlay of overlays) {
                    ovlay.renderOverlay(displaycell, parentDisplaygroup, index, derender);
                }
            }
        }
        // if (derender) displaycell.coord.within.reset();
        if (displaycell.postRenderCallback)
            displaycell.postRenderCallback(displaycell, parentDisplaygroup, index, derender);
    }
    static renderDisplayGroup(parentDisplaycell, derender) {
        let displaygroup = parentDisplaycell.displaygroup;
        let ishor = displaygroup.ishor;
        let coord = displaygroup.coord;
        let cellArraylength = displaygroup.cellArray.length;
        let marginpx = (ishor) ? displaygroup.marginHor * (cellArraylength - 1) : displaygroup.marginVer * (cellArraylength - 1);
        let maxpx = (ishor) ? coord.width - marginpx : coord.height - marginpx;
        let cellsizepx;
        let totalFixedpx = displaygroup.totalPx();
        let pxForPercent = maxpx - totalFixedpx;
        let totalPercent = 0;
        let DisplayCellPercent = 0;
        let displayCellPx;
        let pxForPercentLeft = pxForPercent;
        let overlay = displaygroup.overlay;
        // create dim array;
        // let isValid = true;
        let dimArray = [];
        // let dimArrayTotal = 0;
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
        //console.log(`Final dimarrayTotal ${dimArrayTotal} of ${maxpx}`, JSON.stringify(dimArray, null, 3));
        // this part opens and/or closes the scrollbar overlay
        if (pxForPercent < 0) {
            // console.log(pxForPercent)
            if (!overlay) {
                displaygroup.overlay = new Overlay("ScrollBar", `${displaygroup.label}_ScrollBar`, displaygroup, totalFixedpx, maxpx);
            }
            displaygroup.overlay.renderOverlay(parentDisplaycell, displaygroup, 0, false);
            let dgCoord = displaygroup.coord;
            let scrollbar = displaygroup.overlay.returnObj;
            let scrollWidth = scrollbar.scrollWidth;
            dgCoord.width -= (ishor) ? 0 : scrollWidth;
            dgCoord.within.width -= (ishor) ? 0 : scrollWidth;
            dgCoord.height -= (ishor) ? scrollWidth : 0;
            dgCoord.within.height -= (ishor) ? scrollWidth : 0;
        }
        else {
            if (overlay) {
                if (overlay.currentlyRendered)
                    displaygroup.overlay.renderOverlay(parentDisplaycell, displaygroup, 0, true);
            }
        }
        let x = displaygroup.coord.x;
        let y = displaygroup.coord.y;
        let width;
        let height;
        // apply scrollbar offset
        if (displaygroup.overlay) {
            displaygroup.offset = displaygroup.overlay.returnObj["offset"];
            x -= (ishor) ? displaygroup.offset : 0;
            y -= (ishor) ? 0 : displaygroup.offset;
        }
        // this part loops the displaycells in cellarray
        for (let index = 0; index < cellArraylength; index++) {
            let displaycell = displaygroup.cellArray[index];
            if (pf.isTypePercent(displaycell.dim)) {
                DisplayCellPercent = pf.percentAsNumber(displaycell.dim);
                totalPercent += DisplayCellPercent;
                if (totalPercent <= 100.01) {
                    displayCellPx = Math.round(pxForPercent * DisplayCellPercent / 100.0);
                    pxForPercentLeft -= displayCellPx;
                }
                else {
                    displayCellPx = pxForPercentLeft;
                }
            }
            cellsizepx = (pf.isTypePx(displaycell.dim)) ? (pf.pxAsNumber(displaycell.dim)) : displayCellPx;
            width = (ishor) ? cellsizepx : coord.width;
            height = (ishor) ? coord.height : cellsizepx;
            displaycell.coord.assign(x, y, width, height, undefined, undefined, undefined, undefined, Handler.currentZindex);
            displaycell.coord.cropWithin(displaygroup.coord.within);
            Handler.renderDisplayCell(displaycell, displaygroup, index, derender);
            x += (ishor) ? width + displaygroup.marginHor : 0;
            y += (ishor) ? 0 : height + displaygroup.marginVer;
        }
    }
    // static createDimArray(){}
    static renderHtmlBlock(displaycell, derender = false, parentDisplaygroup) {
        let htmlBlock = displaycell.htmlBlock;
        let el = pf.elExists(displaycell.label);
        let alreadyexists = (el) ? true : false;
        // if (htmlBlock.label == "Example01_javascript"){
        //     console.log(htmlBlock);
        //     console.log("Already Exists: "+alreadyexists)
        // }
        // let derenderPre = derender;
        derender = displaycell.coord.derender(derender);
        // if (derenderPre == false && derender == true)
        //      console.log(displaycell.label + "out of zone", displaycell.coord);
        let isNulDiv = (htmlBlock.css.trim() == "" &&
            htmlBlock.innerHTML.trim() == "" &&
            Object.keys(htmlBlock.attributes).length == 0 &&
            !Handler.renderNullObjects);
        if (derender || isNulDiv) {
            if (alreadyexists)
                el.remove();
            // htmlBlock.el = undefined;
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
};
Handler.argMap = {
    string: ["label"],
    number: ["handlerMargin"],
    Coord: ["coord"],
    function: ["preRenderCallback", "postRenderCallback"],
    boolean: ["addThisHandlerToStack"]
};
Handler.renderNullObjects = false;
Handler.argCustomTypes = [];
Handler.handlerZindexStart = 1;
Handler.zindexIncrement = 1;
Handler.handlerZindexIncrement = 100;
function H(...Arguments) {
    return new Handler(...Arguments);
}
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
    string: ["classname", "css", "cssHover", "cssSelect"],
    boolean: ["isClassname"]
};
Css.deleteOnFirstRunClassname = ".remove";
function css(...Arguments) { return new Css(...Arguments); }
class DefaultTheme {
}
DefaultTheme.advisedDiv = new Css("div[llm]", "position:absolute;", false);
DefaultTheme.advisedBody = new Css("body", "overflow: hidden;", false);
// context
DefaultTheme.context = css("contxt", "background-color:white;color: black;outline-style: solid;outline-width: 1px;", "contxt:hover", "background-color:black;color: white;outline-style: solid;outline-width: 1px;");
Css.theme = DefaultTheme;
class Pages extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Pages.pop(this);
        Pages.instances.unshift(this);
        if (this.retArgs["DisplayCell"])
            this.displaycells = this.retArgs["DisplayCell"];
        else
            pf.errorHandling("Pages Requires at least one DisplayCells");
        Pages.makeLabel(this);
    }
    eval() { return this.evalFunction(this); }
    evalCell() { return this.displaycells[this.eval()]; }
    setPage(pageNumber) {
        if (pageNumber != this.currentPage) {
            // this.previousPage = this.currentPage;
            this.currentPage = pageNumber;
            Handler.update();
        }
    }
    addSelected(pageNumber = this.currentPage) {
        let querry = document.querySelectorAll(`[pagebutton='${this.label}|${pageNumber}']`);
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
        let value;
        let valueArray;
        let pagename;
        let pageNo;
        let el;
        let THIS = this;
        for (let i = 0; i < querry.length; i++) {
            el = (querry[i]);
            el.onclick = function (event) { Tree.onclick.bind(this)(event); };
        }
    }
    indexByName(name) {
        for (let index = 0; index < this.displaycells.length; index++) {
            const displaycell = this.displaycells[index];
            if (displaycell.label == name)
                return index;
        }
        return -1;
    }
    static button(pagename, index) {
        // let page = Pages.byLabel(pagename);
        // let newIndex:number
        // if (typeof(index) == "string") {
        //     newIndex = page.indexByName(index);
        //     if (newIndex == -1) {
        //         console.log(`Pages.button -> no page called ${index}`);
        //         return {}
        //     }
        //     index = newIndex;
        // }
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
function P(...arguments) {
    let displaycell = new DisplayCell(new Pages(...arguments));
    if (displaycell.pages.dim)
        displaycell.dim = displaycell.pages.dim;
    return displaycell;
}
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
        (this.returnObj["render"])(displaycell, parentDisplaygroup, index, derender);
    }
}
Overlay.instances = [];
Overlay.classes = {
//    DragBar,for wxample... filled in when modules load.
};
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
DragBar.horCss = css("db_hor", "background-color:black;cursor: ew-resize;");
DragBar.verCss = css("db_ver", "background-color:black;cursor: ns-resize;");
DragBar.instances = [];
DragBar.activeInstances = [];
DragBar.defaults = {
    horcss: DragBar.horCss,
    vercss: DragBar.verCss
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
class ScrollBar extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        ScrollBar.makeLabel(this);
        this.build();
    }
    build() {
        let THIS = this;
        let off = this.arrowOffset;
        let ss = this.scrollWidth;
        let w = ss - off;
        let mid = ss / 2;
        this.leftArrow = I(this.label + "_Left", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${mid} ${w},${off} ${w},${w} ${off},${mid}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({ onhold: { event: function (mouseEvent) { THIS.clickLeftorUp(mouseEvent); } }
        }));
        this.upArrow = I(this.label + "_Up", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${w} ${mid},${off} ${w},${w} ${off},${w}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({ onhold: { event: function (mouseEvent) { THIS.clickLeftorUp(mouseEvent); } }
        }));
        this.prePaddle = I(this.label + "_Pre", "", "whiteBG", events({ onclick: function (mouseEvent) { THIS.clickPageLeftorUp(mouseEvent); } }));
        this.paddle = I(this.label + "_Paddle", "", "blackBG", events({ ondrag: { onDown: function () { THIS.offsetAtDrag = THIS.offset; }, onMove: function (output) { THIS.dragging(output); },
                /* onUp: function(output:object){console.log("mouseup");console.log(output)}*/
            }
        }));
        this.postPaddle = I(this.label + "_Post", "", "whiteBG", events({ onclick: function (mouseEvent) { THIS.clickPageRightOrDown(mouseEvent); } }));
        this.rightArrow = I(this.label + "_Right", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${off} ${w},${mid} ${off},${w} ${off},${off}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({ onhold: { event: function (mouseEvent) { THIS.clickRightOrDown(mouseEvent); } }
        }));
        this.downArrow = I(this.label + "_down", `<svg height="${ss}" width="${ss}">
            <polygon points="${off},${off} ${w},${off} ${mid},${w} ${off},${off}"
            style="fill:black;stroke:black;stroke-width:1" />
            </svg>`, `${ss}px`, "whiteBG", events({ onhold: { event: function (mouseEvent) { THIS.clickRightOrDown(mouseEvent); } }
        }));
        this.ishor = this.displaygroup.ishor;
        this.displaycell = h(this.ishor, // note even though I'm using H - id chooses here.
        (this.ishor) ? this.leftArrow : this.upArrow, this.prePaddle, this.paddle, this.postPaddle, (this.ishor) ? this.rightArrow : this.downArrow, this.label);
    }
    clickLeftorUp(mouseEvent, noTimes = 1) {
        this.offset -= this.offsetPixelRatio * noTimes;
        if (this.offset < 0)
            this.offset = 0;
        Handler.update();
    }
    clickRightOrDown(mouseEvent, noTimes = 1) {
        this.offset += this.offsetPixelRatio * noTimes;
        if (this.offset > this.maxOffset)
            this.offset = this.maxOffset;
        Handler.update();
    }
    clickPageLeftorUp(mouseEvent) {
        this.offset -= this.displayedFixedPx;
        if (this.offset < 0)
            this.offset = 0;
        Handler.update();
    }
    clickPageRightOrDown(mouseEvent) {
        this.offset += this.displayedFixedPx;
        if (this.offset > this.maxOffset)
            this.offset = this.maxOffset;
        Handler.update();
    }
    dragging(output) {
        let diff = (this.ishor) ? output["x"] : output["y"];
        // console.log(diff, diff*this.offsetPixelRatio);
        let newoffset = this.offsetAtDrag + diff * this.offsetPixelRatio;
        if (newoffset < 0)
            newoffset = 0;
        if (newoffset > this.maxOffset)
            newoffset = this.maxOffset;
        this.offset = newoffset;
        Handler.update();
    }
    render(displaycell, parentDisplaygroup, index, derender) {
        // console.log(this.label);
        // console.log(this);
        if (!this.parentDisplaygroup)
            this.parentDisplaygroup = parentDisplaygroup;
        let dgCoord = this.displaygroup.coord;
        // calculate outer scrollbar dimensions
        let x = (this.ishor) ? dgCoord.within.x : dgCoord.within.x + dgCoord.within.width - this.scrollWidth;
        let width = (this.ishor) ? dgCoord.within.width : this.scrollWidth;
        let y = (this.ishor) ? dgCoord.within.y + dgCoord.within.height - this.scrollWidth : dgCoord.within.y;
        let height = (this.ishor) ? this.scrollWidth : dgCoord.within.height;
        // let x = (this.ishor) ? dgCoord.x : dgCoord.x + dgCoord.width - this.scrollWidth;
        // let width = (this.ishor) ? dgCoord.width : this.scrollWidth;
        // let y = (this.ishor) ? dgCoord.y + dgCoord.height - this.scrollWidth : dgCoord.y;
        // let height = (this.ishor) ? this.scrollWidth : dgCoord.height;
        this.displaycell.coord.assign(x, y, width, height);
        // calculate inner scrollbar dimensions
        let preDisplayCell = this.displaycell.displaygroup.cellArray[1];
        let paddleDisplayCell = this.displaycell.displaygroup.cellArray[2];
        let postDisplayCell = this.displaycell.displaygroup.cellArray[3];
        let actualFixedPx = this.displaygroup.totalPx();
        let displayedFixedPx = this.displayedFixedPx = ((this.ishor) ? width : height);
        this.maxOffset = actualFixedPx - displayedFixedPx;
        if (this.offset > this.maxOffset)
            this.offset = this.maxOffset;
        if (this.offset < 0)
            this.offset = 0;
        // console.log(this.offset);
        this.offsetPixelRatio = actualFixedPx / displayedFixedPx;
        let prePercent = Math.round((this.offset / actualFixedPx) * 100);
        let paddlePercent = Math.round((displayedFixedPx / actualFixedPx) * 100);
        let postPercent = 100 - paddlePercent - prePercent;
        preDisplayCell.dim = `${prePercent}%`;
        paddleDisplayCell.dim = `${paddlePercent}%`;
        postDisplayCell.dim = `${postPercent}%`;
        Handler.currentZindex += Handler.zindexIncrement * 2;
        this.currentlyRendered = !derender;
        // console.log(this.displaycell);
        Handler.renderDisplayCell(this.displaycell, undefined, undefined, derender);
        Handler.currentZindex -= Handler.zindexIncrement * 2;
    }
    static distOfMouseFromWheel(THIS, event) {
        let ishor = THIS.displaygroup.ishor;
        let displaycell = THIS.displaycell;
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
    static onWheel(event) {
        let selectedInstance;
        let minDist = 100000;
        let dist;
        for (let instance of ScrollBar.instances) {
            if (instance.currentlyRendered) {
                if (instance.parentDisplaygroup.coord.isPointIn(event.clientX, event.clientY)
                    || instance.displaycell.coord.isPointIn(event.clientX, event.clientY)) {
                    dist = ScrollBar.distOfMouseFromWheel(instance, event);
                    if (!selectedInstance || dist < minDist) {
                        minDist = dist;
                        selectedInstance = instance;
                    }
                }
            }
        }
        if (selectedInstance) {
            if (event.deltaY > 0)
                selectedInstance.clickRightOrDown(event, ScrollBar.scrollWheelMult * event.deltaY / 100);
            if (event.deltaY < 0)
                selectedInstance.clickLeftorUp(event, -ScrollBar.scrollWheelMult * event.deltaY / 100);
        }
    }
}
ScrollBar.instances = [];
ScrollBar.activeInstances = [];
ScrollBar.whiteBG = css("whiteBG", "background-color:white;outline: 1px solid black;outline-offset: -1px;");
ScrollBar.blackBG = css("blackBG", "background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");
ScrollBar.defaults = {
    offset: 0, displayAtEnd: true, scrollWidth: 15, currentlyRendered: true, arrowOffset: 2,
};
ScrollBar.argMap = {
    string: ["label"],
    DisplayGroup: ["displaygroup"],
    number: ["fixedPixels", "viewingPixels", "scroolWidth"],
    boolean: ["displayAtEnd"]
};
ScrollBar.scrollWheelMult = 4;
ScrollBar.triggerDistance = 40;
Overlay.classes["ScrollBar"] = ScrollBar;
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
Context.defaultMenuBarCss = css("menuBar", "background-color:white;color: black;");
Context.defaultMenuBarHover = css("menuBar:hover", "background-color:black;color: white;");
Context.defaultMenuBarNoHoverCss = css("menuBarNoHover", "background-color:white;color: black;");
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
class Modal extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        if ("number" in this.retArgs) {
            this.setSize(...this.retArgs["number"]);
        }
        if (!this.coord) {
            let [vpX, vpY] = pf.viewport();
            this.coord = new Coord(Math.round(vpX / 4), Math.round(vpY / 4), Math.round(vpX / 2), Math.round(vpY / 2));
            this.coord.within.x = this.coord.within.y = 0;
            this.coord.within.width = vpX;
            this.coord.within.height = vpY;
        }
        if (!this.withinCoord) {
            this.withinCoord = Handler.activeInstances[0].rootCell.coord;
        }
        // if (!this.minWidth) this.minWidth = this.coord.width;
        // if (!this.minHeight) this.minHeight = this.coord.height;
        if (!this.bodyCell) {
            this.bodyCell = I(this.label, this.innerHTML, Modal.bodyCss);
        }
        if (this.footerTitle) {
            this.showFooter = true;
        }
        Modal.makeLabel(this); // see Base.ts
        this.build();
    }
    setSize(...numbers) {
        let [vpX, vpY] = pf.viewport();
        let numberOfArgs = numbers.length;
        let x, y, width, height;
        if (numberOfArgs >= 2 && numberOfArgs < 4) {
            if (!this.coord)
                this.coord = new Coord();
            width = numbers[0];
            height = numbers[1];
            x = (vpX - width) / 2;
            y = (vpY - height) / 2;
            this.coord.assign(x, y, width, height);
        }
        else if (numberOfArgs >= 4) {
            if (!this.coord)
                this.coord = new Coord();
            this.coord.assign(numbers[0], numbers[1], numbers[2], numbers[3]);
            this.coord.within.x = this.coord.within.y = 0;
            this.coord.within.width = vpX;
            this.coord.within.height = vpY;
        }
    }
    setContent(html) { this.bodyCell.htmlBlock.innerHTML = html; Handler.update(); }
    setTitle(html) { this.headerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html; Handler.update(); }
    setFooter(html) { this.footerCell.displaygroup.cellArray[0].htmlBlock.innerHTML = html; Handler.update(); }
    buildClose() {
        let THIS = this;
        return I({ innerHTML: `<svg viewPort="0 0 ${this.headerHeight} ${this.headerHeight}" version="1.1"
        xmlns="http://www.w3.org/2000/svg" style="width: ${this.headerHeight}px; height: ${this.headerHeight}px;">
        <line x1="3" y1="${this.headerHeight - 3}" x2="${this.headerHeight - 3}" y2="3" 
          stroke="black" stroke-width="2"/>
        <line x1="3" y1="3" x2="${this.headerHeight - 3}" y2="${this.headerHeight - 3}" 
          stroke="black" stroke-width="2"/></svg>`
        }, Modal.closeCss, `${this.headerHeight}px`, events({ onclick: function () { THIS.hide(); } }));
    }
    buildHeader() {
        let THIS = this;
        if (!this.headerCell) {
            this.headerCell = h(`${this.label}_header`, `${this.headerHeight}px`, I(`${this.label}_headerTitle`, this.headerTitle, Modal.headerCss, events({ ondrag: { onDown: function () { return Modal.startMoveModal(THIS.handler); }, onMove: function (offset) { return Modal.moveModal(THIS.handler, offset); },
                } })));
            if (this.showClose) {
                this.headerCell.displaygroup.cellArray.push(this.buildClose());
            }
        }
    }
    buildFooter() {
        if (!this.footerCell)
            this.footerCell = h(`${this.label}_footer`, `${this.footerHeight}px`, I(`${this.label}_footerTitle`, this.footerTitle, Modal.footerCss));
    }
    buildOptions() {
        let THIS = this;
        if (!this.optionsCell)
            this.optionsCell = h(`${this.label}_options`, `${this.optionsHeight}px`, I(`${this.label}_okButton`, `<button>OK</button>`, Modal.optionsCss, events({ onclick: function () { THIS.hide(); } })));
    }
    buildFull() {
        this.fullCell = v(this.bodyCell);
        if (this.showHeader) {
            this.fullCell.displaygroup.cellArray.unshift(this.headerCell);
        }
        if (this.showOptions) {
            this.fullCell.displaygroup.cellArray.push(this.optionsCell);
        }
        if (this.showFooter) {
            this.fullCell.displaygroup.cellArray.push(this.footerCell);
        }
    }
    build() {
        this.buildHeader();
        this.buildFooter();
        this.buildOptions();
        this.buildFull();
        this.handler = H(`${this.label}_h`, v(this.fullCell), this.coord, false, this.preRenderCallback.bind(this));
    }
    show() {
        Handler.activate(this.handler);
        Handler.update();
    }
    hide() {
        this.handler.pop();
    }
    preRenderCallback(handler) {
        let within = this.withinCoord.within;
        let x = within.x, y = within.y, x2 = within.x + within.width, y2 = within.y + within.height;
        let coord = handler.coord;
        if (coord.x + coord.width > x2)
            coord.x = x2 - coord.width; // something
        if (coord.x < x) {
            coord.width += coord.x;
            coord.x = x;
        } // is off here - make outer margin huge to see!
        if (coord.y + coord.height > y2)
            coord.y = y2 - coord.height;
        if (coord.y < y) {
            coord.height += coord.y;
            coord.y = y;
        }
    }
    static startMoveModal(handler) {
        handler.toTop();
        Modal.x = handler.coord.x;
        Modal.y = handler.coord.y;
    }
    static moveModal(handler, offset) {
        let vp = pf.viewport();
        let x = Modal.x + offset["x"];
        if (x < 0)
            x = 0;
        if (x + handler.coord.width > vp[0])
            x = vp[0] - handler.coord.width;
        handler.coord.x = x;
        let y = Modal.y + offset["y"];
        if (y < 0)
            y = 0;
        if (y + handler.coord.height > vp[1])
            y = vp[1] - handler.coord.height;
        handler.coord.y = y;
        Handler.update();
    }
}
Modal.instances = [];
Modal.activeInstances = [];
Modal.headerCss = css("HeaderTitle", "background-color:blue;color:white;text-align: center;border: 1px solid black;cursor: -webkit-grab; cursor: grab;");
Modal.footerCss = css("FooterTitle", "background-color:white;color:black;border: 1px solid black;");
Modal.closeCss = css("Close", "background-color:white;color:black;border: 1px solid black;font-size: 20px;");
Modal.closeCssHover = css("Close:hover", "background-color:red;color:white;border: 1px solid black;font-size: 20px;");
Modal.bodyCss = css("ModalBody", "background-color:white;border: 1px solid black;");
Modal.optionsCss = css("ModalOptions", "background-color:white;border: 1px solid black;display: flex;justify-content: center;align-items: center;");
Modal.defaults = {
    showHeader: true, showFooter: false, resizeable: true, showClose: true, showOptions: true,
    headerHeight: 20, footerHeight: 20, headerTitle: "", footerTitle: "", innerHTML: "", optionsHeight: 30,
};
Modal.argMap = {
    string: ["label", "innerHTML", "headerTitle", "footerTitle"],
    DisplayCell: ["bodyCell", "optionsCell", "footerCell", "headerCell"],
    Coord: ["coord", "withinCoord"]
};
class Stretch extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        if (!this.parentDisplaycell && this.parentModal)
            this.parentDisplaycell = this.parentModal.fullCell;
        this.UL = I(`${this.label}_UL`, Stretch.NWcss, this.events("UL"));
        this.UR = I(`${this.label}_UR`, Stretch.NEcss, this.events("UR"));
        this.LL = I(`${this.label}_LL`, Stretch.NEcss, this.events("LL"));
        this.LR = I(`${this.label}_LR`, Stretch.NWcss, this.events("LR"));
        Stretch.makeLabel(this);
    }
    events(corner) {
        let THIS = this;
        return events({ ondrag: { onDown: function (mouseDiff) {
                    let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
                    Stretch.startCoord.copy(coord);
                    Stretch.corner = corner;
                }, onMove: function (diff) {
                    let [vpX, vpY] = pf.viewport();
                    let coord = (THIS.parentModal) ? THIS.parentModal.handler.coord : THIS.parentDisplaycell.coord;
                    let ssc = Stretch.startCoord;
                    let x, y, width, height;
                    switch (Stretch.corner) {
                        case "UL":
                            width = ssc.width - diff.x;
                            if (width < THIS.minWidth) {
                                diff.x -= (THIS.minWidth - width);
                                width = THIS.minWidth;
                            }
                            height = ssc.height - diff.y;
                            if (height < THIS.minHeight) {
                                diff.y -= (THIS.minHeight - height);
                                height = THIS.minHeight;
                            }
                            x = ssc.x + diff.x;
                            if (x < 0) {
                                width += x;
                                x = 0;
                            }
                            y = ssc.y + diff.y;
                            if (y < 0) {
                                height += y;
                                y = 0;
                            }
                            break;
                        case "UR":
                            x = ssc.x;
                            width = ssc.width + diff.x;
                            if (width < THIS.minWidth) {
                                diff.x -= (THIS.minWidth - width);
                                width = THIS.minWidth;
                            }
                            if (x + width > vpX) {
                                width += (vpX - (x + width));
                            }
                            height = ssc.height - diff.y;
                            if (height < THIS.minHeight) {
                                diff.y -= (THIS.minHeight - height);
                                height = THIS.minHeight;
                            }
                            y = ssc.y + diff.y;
                            if (y < 0) {
                                height += y;
                                y = 0;
                            }
                            break;
                        case "LL":
                            width = ssc.width - diff.x;
                            if (width < THIS.minWidth) {
                                diff.x -= (THIS.minWidth - width);
                                width = THIS.minWidth;
                            }
                            x = ssc.x + diff.x;
                            if (x < 0) {
                                width += x;
                                x = 0;
                            }
                            y = ssc.y;
                            height = ssc.height + diff.y;
                            if (height < THIS.minHeight) {
                                diff.y -= (THIS.minHeight - height);
                                height = THIS.minHeight;
                            }
                            if (height + y > vpY) {
                                height = vpY - y;
                            }
                            break;
                        case "LR":
                            x = ssc.x;
                            y = ssc.y;
                            width = ssc.width + diff.x;
                            if (width < THIS.minWidth)
                                width = THIS.maxWidth;
                            if (width + x > vpX)
                                width = vpX - x;
                            height = ssc.height + diff.y;
                            if (height < THIS.minHeight)
                                height = THIS.maxHeight;
                            if (height + y > vpY)
                                height = vpY - y;
                            break;
                        default:
                            break;
                    }
                    coord.assign(x, y, width, height);
                    Handler.update();
                },
            } });
    }
    ;
    render(displaycell, parentDisplaygroup, index, derender) {
        if (!derender) {
            let coord = this.parentDisplaycell.coord;
            this.UL.coord.assign(coord.x, coord.y, this.pxSize, this.pxSize, coord.within.x, coord.within.y, coord.within.width, coord.within.height, coord.zindex + Handler.zindexIncrement);
            this.UR.coord.assign(coord.x + coord.width - this.pxSize + 1, coord.y, this.pxSize, this.pxSize, coord.within.x, coord.within.y, coord.within.width, coord.within.height, coord.zindex + Handler.zindexIncrement);
            this.LL.coord.assign(coord.x, coord.y + coord.height - this.pxSize + 1, this.pxSize, this.pxSize, coord.within.x, coord.within.y, coord.within.width, coord.within.height, coord.zindex + Handler.zindexIncrement);
            this.LR.coord.assign(coord.x + coord.width - this.pxSize + 1, coord.y + coord.height - this.pxSize + 1, this.pxSize, this.pxSize, coord.within.x, coord.within.y, coord.within.width, coord.within.height, coord.zindex + Handler.zindexIncrement);
        }
        let array = [this.UL, this.UR, this.LL, this.LR];
        for (let index = 0; index < array.length; index++)
            Handler.renderDisplayCell(array[index], undefined, undefined, derender);
    }
}
Stretch.labelNo = 0;
Stretch.instances = [];
Stretch.activeInstances = [];
Stretch.defaults = {
    pxSize: 10, minWidth: 200, minHeight: 200,
};
Stretch.argMap = {
    string: ["label"],
    Modal: ["parentModal"],
};
Stretch.NWcss = new Css("NWcss", `cursor: nw-resize;`);
Stretch.NEcss = new Css("NEcss", `cursor: ne-resize;`);
Stretch.startCoord = new Coord();
function stretch(...Arguments) {
    let overlay = new Overlay("Stretch", ...Arguments);
    let newStretch = overlay.returnObj;
    let parentDisplaycell = newStretch.parentDisplaycell;
    parentDisplaycell.addOverlay(overlay);
    return (newStretch.parentModal) ? newStretch.parentModal : parentDisplaycell;
}
Overlay.classes["Stretch"] = Stretch;
// events({ondrag: {onDown :function(xmouseDiff:object){
//     if (pf.isTypePercent(dragbar.parentDisplaycell.dim)) {
//         dragbar.parentDisplaygroup.percentToPx(dragbar.parentDisplaycell);
//     }
//     dragbar.startpos = pf.pxAsNumber(dragbar.parentDisplaycell.dim);
// },
// onMove :function(xmouseDiff:object){
//     let newdim = dragbar.startpos + ((dragbar.ishor) ? xmouseDiff["x"]: xmouseDiff["y"])*((dragbar.isLast) ? -1 :1);
//     if (newdim > dragbar.max) newdim = dragbar.max;
//     if (newdim < dragbar.min) newdim = dragbar.min;
//     dragbar.parentDisplaycell.dim = `${newdim}px`;
//     Handler.update();
// },
// // onUp: function(ouxmouseDifftput:object){}
// } })
class TreeNode extends Base {
    constructor(...Arguments) {
        super();
        this.collapsed = false;
        this.nodeCellArray = [];
        this.buildBase(...Arguments);
        if (this.labelCell.htmlBlock)
            this.labelCell.htmlBlock.hideWidth = this.labelCell.coord.hideWidth = true;
        if (this.labelCell && !this.label)
            this.label = this.labelCell.label;
    }
    visibleChildren(noChildren = 0) {
        if (!this.collapsed && this.children)
            for (let child of this.children)
                noChildren += child.visibleChildren(1);
        return noChildren;
    }
    addDisplayCells(newCellArray = [], isFirst = true) {
        if (!isFirst)
            newCellArray.push(this.horizontalDisplayCell);
        if (!this.collapsed && this.children) {
            for (let childNode of this.children) {
                newCellArray = childNode.addDisplayCells(newCellArray, false);
            }
        }
        return newCellArray;
    }
}
TreeNode.instances = [];
TreeNode.activeInstances = [];
TreeNode.defaults = {};
TreeNode.argMap = {
    DisplayCell: ["labelCell"],
    string: ["label"],
    Array: ["children"],
    boolean: ["collapsed"]
};
function T(...Arguments) { return new TreeNode(...Arguments); }
class Tree extends Base {
    constructor(...Arguments) {
        super();
        this.css = ""; // default class(es) for tree items.
        this.buildBase(...Arguments);
        if (!this.parentDisplayCell) {
            this.parentDisplayCell = new DisplayCell(`TreeRoot_${this.label}`);
        }
        if ("Css" in this.retArgs) // duplicated!!!!!
            for (let css of this.retArgs["Css"])
                this.css = (this.css + " " + css.classname).trim();
        if ("string" in this.retArgs && this.retArgs.string.length > 1)
            this.css += " " + this.retArgs.string.splice(1).join(' ');
        // console.log(this.parentDisplayCell)
        let V = v(`${this.label}_rootV`, this.parentDisplayCell.dim, this.margin, this.margin); ////////////////////////////////////// check this again!
        let cellArray = V.displaygroup.cellArray;
        this.parentDisplayCell.displaygroup = new DisplayGroup(`${this.label}_rootH`, V);
        if (this.t_instance && !this.rootTreeNode) {
            // console.log("Froud t_!");
            this.rootTreeNode = Tree.autoLabelTreenodes(this.label, this.t_instance);
        }
        if (!this.rootTreeNode) {
            this.rootTreeNode = Tree.defaultObj;
        }
        this.parentDisplayCell.preRenderCallback = function (displaycell, parentDisplaygroup /*= undefined*/, index /*= undefined*/, derender) {
            if (!Handler.firstRun) {
                let bounding;
                let max = 0;
                let x2;
                let elements = document.querySelectorAll("[treenode]");
                for (let element of elements) {
                    bounding = element.getBoundingClientRect();
                    x2 = bounding["x"] + bounding["width"];
                    if (x2 > max)
                        max = x2;
                }
                let current = displaycell.coord.x + displaycell.coord.width;
                let dx = displaycell.coord.x;
                displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current - dx : max - dx}px`;
                // displaycell.displaygroup.cellArray[0].dim = `${(current > max) ? current-2 : max}px`;  ///// BINGO!!!!!!!!!
                // console.log(displaycell.label, displaycell.coord);
                // console.log(displaycell.displaygroup.cellArray[0].dim)
            }
        };
        Tree.makeLabel(this);
        this.buildTreeNode(this.rootTreeNode, cellArray);
    }
    // autoLabel(node = this.rootTreeNode, newLabel=`${this.label}`){
    //     // node.label = node.labelCell.label = node.labelCell.htmlBlock.label = newLabel;
    //     node.label = newLabel;
    //     if (node.labelCell) {
    //         node.labelCell.label = newLabel;
    //         if (node.labelCell.htmlBlock)
    //             node.labelCell.htmlBlock.label = newLabel;
    //     }
    //     for (const key in node.children)
    //         this.autoLabel(node.children[key], `${newLabel}_${key}`);
    // }
    drawSVG(collapsed) {
        let X = this.collapsePad;
        let Y = (this.cellHeight - this.collapseSize) / 2 + this.collapsePad;
        let XX = this.collapseSize - X;
        let YY = Y + this.collapseSize - 2 * this.collapsePad;
        let XMID = this.collapseSize / 2;
        let YMID = this.cellHeight / 2;
        let C = this.SVGColor;
        return `<svg height="${this.cellHeight}" width="${this.collapseSize}">` +
            ((collapsed) ? `<polygon points="${X},${Y} ${XX},${YMID} ${X},${YY} ${X},${Y}"`
                : `<polygon points="${X},${Y} ${XX},${Y} ${XMID},${YY} ${X},${Y}"`) +
            `style="fill:${C};stroke:${C};stroke-width:1" />
            </svg>`;
    }
    toggleCollapse(node, mouseEvent, el) {
        node.collapsed = !node.collapsed;
        node.horizontalDisplayCell.displaygroup.cellArray[1].htmlBlock.innerHTML = this.drawSVG(node.collapsed);
        let cellArray = this.parentDisplayCell.displaygroup.cellArray[0].displaygroup.cellArray;
        let index = cellArray.indexOf(node.horizontalDisplayCell);
        // remove from Dom if collapsed
        if (node.collapsed) {
            for (let displaycell of node.nodeCellArray) {
                Handler.renderDisplayCell(displaycell, undefined, undefined, true);
            }
            node.collapsed = !node.collapsed;
            let noVisibleChildren = node.visibleChildren();
            node.collapsed = !node.collapsed;
            cellArray.splice(index + 1, noVisibleChildren);
        }
        else { // Add DisplayCells if Toggled Open
            cellArray.splice(index + 1, 0, ...node.addDisplayCells());
        }
        Handler.update();
    }
    buildTreeNode(node = this.rootTreeNode, cellArray, indent = this.startIndent) {
        let THIS = this;
        let hasChildren = (node.children) ? ((node.children.length) ? true : false) : false;
        node.labelCell.htmlBlock.attributes["treenode"] = "";
        if (!node.labelCell.htmlBlock.css && this.css.trim())
            node.labelCell.htmlBlock.css = this.css.trim();
        if (!node.labelCell.htmlBlock.events && this.events)
            node.labelCell.htmlBlock.events = this.events;
        node.horizontalDisplayCell = h(// Horizontal DisplayGroup Containing:
        I(node.label + "_spacer", "", `${indent}px`), // spacer First
        I(node.label + "_svg", // This is the SVG
        (hasChildren) ? this.drawSVG(node.collapsed) : "", `${this.collapseSize}px`, events({ onclick: function (mouseEvent) {
                mouseEvent.preventDefault();
                THIS.toggleCollapse(node, mouseEvent, this);
            },
            onmousedown: function (mouseEvent) {
                window.addEventListener('selectstart', Drag.disableSelect);
            },
            onmouseup: function (mouseEvent) {
                window.removeEventListener('selectstart', Drag.disableSelect);
            }
        })), node.labelCell, // This is the TreeNode Label
        `${this.cellHeight}px` // Height in pixels of TreeNode
        );
        cellArray.push(node.horizontalDisplayCell);
        if (node.children) {
            for (let childNode of node.children)
                this.buildTreeNode(childNode, node.nodeCellArray, indent + this.indent);
            if (!node.collapsed)
                pf.concatArray(cellArray, node.nodeCellArray);
        }
    }
    render(displaycell) { }
    static autoLabelTreenodes(label, rootNode) {
        Tree.autoLabel(rootNode, label);
        // console.log(rootNode);
        return Tree.makeTreeNodes(rootNode);
    }
    static autoLabel(tObj, postfix /*="autoTree"*/) {
        tObj.label = postfix;
        (tObj.TreeNodeArguments[0]).label = postfix;
        if (tObj.TreeNodeArguments.length > 1) {
            let ta = (tObj.TreeNodeArguments[1]);
            for (let index = 0; index < ta.length; index++) {
                const t = ta[index];
                Tree.autoLabel(t, postfix + "_" + index);
            }
        }
    }
    static makeTreeNodes(node) {
        let arrayOft_;
        let returnArray = [];
        let returnTreeNode;
        let ii = node.TreeNodeArguments[0];
        if (node.TreeNodeArguments.length > 1) {
            arrayOft_ = node.TreeNodeArguments[1];
            for (const singlet_ of arrayOft_) {
                returnArray.push(Tree.makeTreeNodes(singlet_));
            }
            returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments), returnArray);
        }
        else {
            returnTreeNode = T(node.label, I(ii.label, ...ii.Arguments));
        }
        return returnTreeNode;
    }
    static t(...Arguments) { return new t_(...Arguments); }
    static i(...Arguments) { return new i_(...Arguments); }
    static onclick(event) {
        let el = this; // this onclick function is called BOUND to element.
        let value = el.getAttribute("pagebutton");
        let valueArray = value.split("|");
        let pagename = valueArray[0];
        let pageNo = valueArray[1];
        Pages.setPage(pagename, parseInt(pageNo));
        if (HtmlBlock.byLabel(el.id).events && HtmlBlock.byLabel(el.id).events.actions["onclick"]) {
            var doit = HtmlBlock.byLabel(el.id).events.actions["onclick"].bind(el);
            doit(event);
        }
    }
}
Tree.instances = [];
Tree.activeInstances = [];
Tree.defaultObj = T("Tree", I("Tree_TopDisplay", "Top Display"), [T("Tree_child1", I("Tree_Child1ofTop", "Child1ofTop"), // true,       
    [T("Tree_child1_1", I("Tree_Child1ofChild1", "Child1ofChild1")),
        T("Tree_child1_2", I("Tree_Child2ofChild1", "Child2ofChild1"))
    ]),
    T("Tree_child2", I("Tree_Child2ofTop", "Child2ofTop"))]);
Tree.defaults = {
    cellHeight: 20, SVGColor: "white", startIndent: 0, indent: 10, collapsePad: 4, collapseSize: 16,
    margin: 2,
};
Tree.argMap = {
    string: ["label"],
    number: ["cellHeight", "margin"],
    TreeNode: ["rootTreeNode"],
    DisplayCell: ["parentDisplayCell"],
    Events: ["events"],
    t_: ["t_instance"],
};
function tree(...Arguments) {
    let overlay = new Overlay("Tree", ...Arguments);
    let newTree = overlay.returnObj;
    let displaycell = newTree.parentDisplayCell;
    // displaycell.overlay = overlay; // remove this one soon
    displaycell.addOverlay(overlay);
    return displaycell;
}
Overlay.classes["Tree"] = Tree;
// this is a messy way to solve a problem...
function TI(...Arguments) {
    let arg;
    let arrayInArgs;
    let newT;
    for (let index = 0; index < Arguments.length; index++) { // pull array from Arguments
        arg = Arguments[index];
        if (pf.isArray(arg)) {
            arrayInArgs = arg;
            Arguments.splice(index, 1);
            index -= 1;
        }
    }
    let newI = Tree.i(/* "auto", */ ...Arguments); // name auto picked up in Tree Constructor.
    if (arrayInArgs)
        newT = Tree.t(newI, arrayInArgs);
    else
        newT = Tree.t(newI);
    return newT;
}
class i_ {
    constructor(...Arguments) { this.Arguments = Arguments; }
}
class t_ {
    constructor(...Arguments) { this.TreeNodeArguments = Arguments; }
}
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
class ToolBar extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        ToolBar.makeLabel(this);
        this.spacer = I(`${this.label}_toolbar_spacer`);
        if ("DisplayCell" in this.retArgs)
            this.displaycells = this.retArgs["DisplayCell"];
        if (!this.rootDisplayCell)
            this.build();
    }
    build() {
        this.rootDisplayCell =
            P(`${this.label}_toolbar_Pages`, this.sizeFunction);
        // h(`${this.label}_toolbar_h`, `${this.sizePx}px`,
        //     spacer
        // );
    }
    sizeFunction(thisPages) {
        // let [x, y] = pf.viewport();
        // if (x > 920) slideMenu.pop();
        // // if (returnValue != thisPages.currentPage) {}
        // return (x > 920) ? 0 : 1;
        return 0;
    }
}
ToolBar.labelNo = 0;
ToolBar.instances = [];
ToolBar.activeInstances = [];
ToolBar.defaults = { sizePx: 25, isDocked: false, };
ToolBar.argMap = {
    string: ["label"],
    // DisplayCell : see constructor,
    number: ["sizePx"],
};
class bCss {
}
bCss.bgLight = css("bgLight", `background: #dcedf0`);
bCss.bgGreen = css("bgGreen", `background: green;`);
bCss.bgBlue = css("bgBlue", `background: blue;`);
bCss.bgCyan = css("bgCyan", `background: cyan;`);
bCss.menuItem = css("menuItem", `background: white;
                                       color: black;
                                       cursor: default;
                                       outline: 1px solid black;
                                       outline-offset: -1px;`, `background: black;
                                       color: white;`);
bCss.menuSpace = css("menuspace", `background: white;
                                        color: black;
                                        cursor: default;
                                        outline: 1px solid black;
                                        outline-offset: -1px;`);
bCss.handlerSVG = css("handlerSVG", `background-image: url("svg/user-homeOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.hSVG = css("hSVG", `background-image: url("svg/Horizontal.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.vSVG = css("vSVG", `background-image: url("svg/Vertical.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.ISVG = css("ISVG", `background-image: url("svg/icon-htmlOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.pagesSVG = css("pagesSVG", `background-image: url("svg/bookOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
class Builder {
    constructor() {
    }
    static updateTree(handler) {
        let returnString = `TI("${handler.label}", bCss.handlerSVG ,[\n`;
        // console.log("Updating Tree");
        returnString += Builder.DC(handler.rootCell, "\t");
        returnString += "])";
        let treeOfNodes = eval(returnString);
        // console.log(treeOfNodes)
        return treeOfNodes;
    }
    static DC(displaycell, indent) {
        let returnString = "";
        if (displaycell.htmlBlock)
            returnString += Builder.HB(displaycell.htmlBlock, indent);
        if (displaycell.displaygroup)
            returnString += Builder.DG(displaycell.displaygroup, indent);
        if (displaycell.pages)
            returnString += Builder.PG(displaycell.pages, indent);
        return returnString;
    }
    static HB(htmlblock, indent) {
        return indent + `TI("${htmlblock.label}", bCss.ISVG),\n`;
    }
    static DG(displaygroup, indent) {
        let returnString = indent + `TI("${displaygroup.label}", ${(displaygroup.ishor) ? "bCss.hSVG" : "bCss.vSVG"} ,[\n`;
        for (let index = 0; index < displaygroup.cellArray.length; index++) {
            const displaycell = displaygroup.cellArray[index];
            returnString += Builder.DC(displaycell, indent + "\t");
        }
        returnString += indent + `]),\n`;
        return returnString;
    }
    static PG(pages, indent) {
        console.log("Here");
        let returnString = indent + `TI("${pages.label}", bCss.pagesSVG ,[\n`;
        for (let index = 0; index < pages.displaycells.length; index++) {
            const displaycell = pages.displaycells[index];
            returnString += Builder.DC(displaycell, indent + "\t");
        }
        returnString += indent + `])\n`;
        return returnString;
    }
}
// let treeOfNodes:t_ = 
// TI("Welcome to Liefs-Layout-Manager", {attributes : {pagebutton : "PAGES|0"}},
//     [TI("Installation", Pages.button("PAGES",1) ),
//     TI("The Basics", Pages.button("PAGES",2),
//         [TI("HTML vs Javascript", Pages.button("PAGES",3)),
//         TI("DisplayCell", Pages.button("PAGES",4))]
//     ),
//     TI("Part 3",
//         [TI("3a")]),
//     ],
// )
window.onload = function () {
    let mainBodyDisplayCell = I("Main_body");
    mainBodyDisplayCell.postRenderCallback =
        function (displaycell, displaygroup, index, derender) {
            Handler.byLabel("Client Window").coord.copy(displaycell.coord);
        };
    let clientHandler = H("Client Window", h("Client_h", 5, I("Client_Main1", "left", bCss.bgCyan), v("Client_v", 5, I("Client_Top", "top", bCss.bgGreen), P("MainPages", I("Client_Bottom1", "bottom1", bCss.bgBlue), I("Client_Bottom2", "bottom2", bCss.bgLight)))), false, new Coord(), function () {
        // console.log(  Builder.updateTree(clientHandler)   );
    });
    let mainHandler = H("Main Window", 4, v("Main_v", h("MenuBar", "20px", I("MenuBar_File", "File", "35px", bCss.menuItem), I("MenuBar_Edit", "Edit", "35px", bCss.menuItem), I("MenuBar_Spacer", "", bCss.menuSpace)), I("Main_toolbar", "Toolbar", "24px", bCss.bgBlue), h("Tree_Body", 5, tree("Display", dragbar(I("Main_tree", "300px", bCss.bgLight), 100, 600), Builder.updateTree(clientHandler), { SVGColor: "Black" }, 25), mainBodyDisplayCell)));
    Handler.activate(clientHandler);
};
