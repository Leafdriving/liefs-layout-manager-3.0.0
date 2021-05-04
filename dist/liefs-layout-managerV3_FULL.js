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
class pf {
    static commonKeys(obj1, obj2) {
        let returnStringArray = [];
        for (let index in obj1)
            if (index in obj2)
                returnStringArray.push(index);
        return returnStringArray;
    }
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
    static insideOfFunctionString(functionString) {
        return functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"));
    }
    static array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
    ;
    static undefinedIs(thing, value = 0) { return (thing == undefined) ? value : thing; }
    static preUnderscore(someString) { return someString.substring(0, someString.indexOf("_")); }
    static uis0(num) { return (num == undefined) ? 0 : num; }
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
    static decimalPlaces(number, places) { return Math.round(Math.pow(10, places) * number) / Math.pow(10, places); }
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
/**
 * Arguments_ :
 * This object is responsible for sorting Arguments for a new class or function.
 *
 */
class Arguments_ {
    /**
     * Arguments by type
     * @param Args Array of Arguments ie new Class(...Args)
     * @param [customTypes] Array of Functions returning Type Name (if qualifies), or undefined.
     * @returns An Object Key "TypeName", value Array of Arguments, of that Type, in the order discovered
     */
    static argumentsByType(Args, // 1st argument is a list of args.
    customTypes = []) {
        customTypes = customTypes.concat(Base.defaultIsChecks); // assumed these are included.
        let returnObject = {};
        let valueType;
        let returnValue;
        for (let value of Args) {
            valueType = typeof (value); // evaluate type
            for (let checkFunction of customTypes) { // check if it is a custom Type
                returnValue = checkFunction(value);
                if (returnValue)
                    valueType = returnValue;
            }
            if (!(valueType in returnObject))
                returnObject[valueType] = []; // If type doesn't exist, add empty array
            returnObject[valueType].push(value); // Assign Type Value
        }
        return returnObject;
    }
    /**
     * This function merges the defaults Object, with Argument Object(s)
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns Defaults Objects merged with Argument Objects
     */
    static ifObjectMergeWithDefaults(THIS, CLASS) {
        if ("object" in THIS.retArgs) {
            let returnObj = CLASS.defaults; // mergeObjects doens't overwrite this!
            for (let key in THIS.retArgs["object"])
                returnObj = Arguments_.mergeObjects(returnObj, THIS.retArgs["object"][key]);
            return returnObj;
        }
        return CLASS.defaults;
    }
    /**
     * retArgsMapped
     * @param updatedDefaults (Return of Arguments_.ifObjectMergeWithDefaults())
     * @param THIS - Class Object instance, like "DisplayCell"
     * @param CLASS - Class (static) Object
     * @returns args mapped
     */
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
    /**
     * Similar to javascript typeof, but returns custom types like "dim" (ending in "px" or "%")
     * @param Argument
     * @returns Type Name (If Object, Class Name)
     */
    static typeof(Argument) { return (Object.keys(Arguments_.argumentsByType([Argument])))[0]; }
    /**
     * Modifys class properties
     * @param argobj - Object to be mapped from
     * @param targetobject - Object (Class Instance) to be mapped to
     */
    static modifyClassProperties(argobj, targetobject) {
        for (let key of Object.keys(argobj))
            targetobject[key] = argobj[key];
    }
}
/**
 * Standard Merge objects function
 */
Arguments_.mergeObjects = function (startObj, AddObj) {
    let returnObject = {};
    for (let i in startObj)
        returnObject[i] = startObj[i];
    for (let j in AddObj)
        returnObject[j] = AddObj[j];
    return returnObject;
};
/**
 * Base Class for most Classes (Extends Base)
 */
class Base /* extends Function */ {
    /**
     * Creates an instance of base.  This is called by the extended class
     * @param neverRead
     */
    constructor(...neverRead) { }
    buildBase(...Arguments) { this.constructor["buildBase"](this, ...Arguments); }
    /**
     * Sorts Agruments by type, then applies them as attributes to the Class Object Instance,
     * according to default arguments map (argMap)  This is called by all Objects in the Constructor
     * @param THIS
     * @param Arguments
     */
    static buildBase(THIS, ...Arguments) {
        let CLASS = this;
        THIS.retArgs = Arguments_.argumentsByType(Arguments);
        let updatedDefaults = Arguments_.ifObjectMergeWithDefaults(THIS, CLASS);
        let retArgsMapped = Arguments_.retArgsMapped(updatedDefaults, THIS, CLASS);
        Arguments_.modifyClassProperties(retArgsMapped, THIS);
    }
    /**
     * If label is not defined, create One.
     * @param instance
     */
    static makeLabel(instance) {
        let CLASS = this;
        if (instance["label"] == undefined || instance["label"].trim() == "") {
            instance["label"] = `${CLASS["name"]}_${++CLASS["labelNo"]}`;
        }
    }
}
/**
 * Default custom check Function List (Array)
 */
Base.defaultIsChecks = [pf.isArray, pf.isObjectAClass, pf.isDim];
class Component extends Base {
    /**
     * When Parent DisplayCell Discovers this Component, onConnect is called by the Parent DisplayCell
     */
    onConnect() { }
    ;
    /**
     * Pre Stage of Rendering a Page.  It is useful if a child component wished to modify a parent
     * component.  The parent is first altered here, then properly rendered at the Render Stage
     * @param derender - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered (Normally empty, since Render phase is usually a better choice)
     */
    preRender(derender, node, zindex) { return undefined; }
    ;
    /**
     * Rendering stage of aa Page.(After preRender phase).  In this function, usually the Co-ordinates of
     * a child/childrend are calculated, and assigned, to be returned as an array
     * @param derender  - True if this and children are to be DE-Rendered, not rendered.
     * @param node - Render Node passed by Render Class
     * @param zindex - Current zindex - Note: this is normally READ ONlY
     * @returns array of children to be rendered
     */
    Render(derender, node, zindex) { return undefined; }
    ;
    /**
     * Returns Child (in .children) by label
     * @param label
     * @returns child DisplayCell/Component
     */
    getChild(label) {
        for (let index = 0; index < this.children.length; index++)
            if (this.children[index].label == label)
                return this.children[index];
        return undefined;
    }
    /**
     * Deletes component
     */
    delete() { }
}
// The following is boierplate code, and left here for reference
// class Test extends Base {
//     static labelNo = 0;
//     static instances:{[key: string]: Test;} = {};
//     static activeInstances:{[key: string]: Test;} = {};
//     static defaults:{[key: string]: any;} = {}
//     static argMap:{[key: string]: Array<string>;} = {
//         string : ["label", "innerHTML", "css"],
//         number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
//     }
//     // retArgs:objectAny;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         Test.makeLabel(this); Test.instances[this.label] = this;
//     }
// }
/**
 * Function stack base
 */
class FunctionStack_BASE extends Function {
    constructor() {
        super('...args', 'return this.__self__.__call__(...args)');
        let self = this.bind(this);
        this["__self__"] = self;
        return self;
    }
}
/**
 * Function stack
 */
class FunctionStack extends FunctionStack_BASE {
    constructor() {
        super();
        this.functionArray = [];
    }
    /**
     * Determines whether call
     * @param Arguments
     */
    __call__(...Arguments) {
        let elTarget = Arguments[0]["target"];
        if (this.functionArray && this.functionArray.length)
            for (let index = 0; index < this.functionArray.length; index++)
                this.functionArray[index].bind(elTarget)(...Arguments);
    }
    /**
     * Pushs function stack
     * @param prevFunction
     * @param [newFunction]
     * @returns
     */
    static push(prevFunction, newFunction = undefined) {
        let functionStackInstance;
        if (prevFunction && prevFunction.constructor && prevFunction.constructor.name == "FunctionStack")
            functionStackInstance = prevFunction;
        else {
            functionStackInstance = new FunctionStack();
            if (prevFunction && typeof (prevFunction) == "function")
                functionStackInstance.functionArray.push(prevFunction);
        }
        if (newFunction) {
            if (newFunction.constructor && newFunction.constructor.name == "FunctionStack")
                functionStackInstance.functionArray = functionStackInstance.functionArray.concat(newFunction.functionArray);
            else
                functionStackInstance.functionArray.push(newFunction);
        }
        return functionStackInstance;
    }
    /**
     * Pops function stack
     * @param functionStackInstance
     * @param label
     * @returns
     */
    static pop(functionStackInstance, label) {
        for (let index = 0; index < functionStackInstance.functionArray.length; index++)
            if (label == functionStackInstance.functionArray[index].name)
                functionStackInstance.functionArray.splice(index--, 1);
        return functionStackInstance;
    }
    /**
     * Determines whether in is
     * @param functionStackInstance
     * @param label
     * @returns
     */
    static isIn(functionStackInstance, label) {
        for (let index = 0; index < functionStackInstance.functionArray.length; index++)
            if (label == functionStackInstance.functionArray[index].name)
                return true;
        return false;
    }
}
/**
 * Debounce
 */
class debounce_ extends FunctionStack_BASE {
    /**
     * Creates an instance of debounce .
     * @param FUNCTION
     * @param delay
     */
    constructor(FUNCTION, delay) {
        super();
        this.FUNCTION = FUNCTION;
        this.delay = delay;
        this.lasttime = new Date().getTime();
    }
    /**
     * Determines whether call
     * @param Arguments
     */
    __call__(...Arguments) {
        let thistime = new Date().getTime();
        if (thistime - this.lasttime > this.delay) {
            this.FUNCTION(...Arguments);
            this.lasttime = thistime;
        }
    }
}
function debounce(FUNCTION, delay) { return new debounce_(FUNCTION, delay); }
/**
 * Node - A basic Tree Object.  Node by itself doesn't do much.
 * It purpose is determined by its parent, usually a Tree_ Object
 */
class node_ extends Base {
    /**
     * Creates an instance of node .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.ParentNode = undefined;
        this.children = [];
        this.buildBase(...Arguments);
        this.Arguments = Arguments;
        if (!this.label)
            node_.makeLabel(this);
    }
    /**
     * New node - Used Interally
     * @param THIS
     * @param Arguments
     * @returns
     */
    static newNode(THIS, ...Arguments) {
        let newnode = new node_(...Arguments);
        newnode.ParentNodeTree = THIS.ParentNodeTree;
        return newnode;
    }
    /**
     * Returns a Tree Structure, as An Array
     * @param node
     * @param [traverseFunction]
     * @returns array
     */
    static asArray(node, traverseFunction = function (node) { return node; }) {
        let returnArray = [];
        node_.traverse(node, function (node) { returnArray.push(traverseFunction(node)); });
        return returnArray;
    }
    /**
     * Traverses node
     * @param node - parent starting node
     * @param traverseFunction - what to do on each iteration
     * @param [traverseChildren] - Boolean Return - Traverse this Child?
     * @param [traverseNode] - Boolean Return - Traverse this Node?
     */
    static traverse(node, traverseFunction, traverseChildren = function () { return true; }, traverseNode = function () { return true; }) {
        if (traverseNode(node)) {
            traverseFunction(node);
            if (traverseChildren(node))
                if (node.children)
                    for (let index = 0; index < node.children.length; index++)
                        node_.traverse(node.children[index], traverseFunction, traverseChildren, traverseNode);
        }
    }
    /**
     * Gets previous sibling
     */
    get PreviousSibling() {
        if (!this.ParentNode)
            return undefined;
        let index = this.ParentNode.children.indexOf(this);
        return (index > 0) ? this.ParentNode.children[index - 1] : undefined;
    }
    set PreviousSibling(newNode) {
        if (this.ParentNode) {
            let index = this.ParentNode.children.indexOf(this);
            this.ParentNode.children.splice(index, 0, newNode);
        }
    }
    /**
     * Gets next sibling
     */
    get NextSibling() {
        if (!this.ParentNode)
            return undefined;
        let index = this.ParentNode.children.indexOf(this);
        return (index > -1 && index < this.ParentNode.children.length - 1) ? this.ParentNode.children[index + 1] : undefined;
    }
    set NextSibling(newNode) {
        if (this.ParentNode) {
            let index = this.ParentNode.children.indexOf(this);
            this.ParentNode.children.splice(index + 1, 0, newNode);
        }
    }
    /**
     * Depth - returns number of steps up parent, to reach the root
     * @param [deep]
     * @returns
     */
    depth(deep = 0) {
        let node = this;
        while (node) {
            deep += 1;
            node = node.parent();
        }
        ;
        return deep;
    }
    /**
     * Length - returns number of node children (Recursive)
     * @param [count]
     * @returns
     */
    length(count = -1) {
        node_.traverse(this, function (node) { count++; });
        return count;
    }
    /**
     * Create New Child Node.
     * Either a) Fill node.Arguements Array or
     * b) insert type node here.
     * @param Arguments
     * @returns child
     */
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
    /**
     * Create New Sibling Node
     * Either a) Fill node.Arguements Array or
     * b) insert type node here.
     * @param Arguments
     * @returns sibling
     */
    newSibling(...Arguments) {
        let newNode;
        if (typeof (Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            newNode = (Arguments[0]);
        else
            newNode = node_.newNode(this, ...Arguments);
        newNode.ParentNodeTree = this.ParentNodeTree;
        newNode.ParentNode = this.ParentNode;
        this.NextSibling = newNode;
        return newNode;
    }
    /**
     * Pops node from node tree
     * @returns
     */
    pop() {
        this.ParentNode.children.splice(this.ParentNode.children.indexOf(this), 1);
        this.ParentNode = undefined;
        return this;
    }
    /**
     * Done - returns ParentNodeTree
     * @returns
     */
    done() { return this.ParentNodeTree; }
    /**
     * Return Root Node Of Tree
     * @returns
     */
    root() {
        let node = this;
        while (node.parent()) {
            node = node.parent();
        }
        return node;
    }
    /**
     * Returns Parent of Current Node
     * @returns
     */
    parent() { return this.ParentNode; }
    /**
     * Logs node to console.  set (true) to get full node objects as well
     * @param [showNode]
     */
    log(showNode = false) {
        if (this.children.length) {
            console.groupCollapsed(this.label);
            if (showNode)
                console.log(this);
            for (let index = 0; index < this.children.length; index++)
                this.children[index].log(showNode);
            console.groupEnd();
        }
        else {
            if (showNode) {
                console.groupCollapsed(this.label);
                console.log(this);
                console.groupEnd();
            }
            else
                console.log(this.label);
        }
    }
}
node_.labelNo = 0;
node_.instances = {};
node_.activeInstances = {};
node_.defaults = { collapsed: false };
node_.argMap = {
    string: ["label"],
};
// Sample Node Provided in Source
function sample() {
    let node = new node_();
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
    return node;
}
var _x_, _y_, _width_, _height_;
/**
 * Point - Yea, a interface would do the same thing... so whats the point!
 */
class Point {
}
/**
 * Within - Coordinates of the Parent - to determine if this (child) is partially cut off
 * or goes partially (or completly) out of view
 */
class Within {
    /**
     * Creates an instance of within.
     * @param Arguments
     */
    constructor(...Arguments) { }
    get x() { return (this.lockedToScreenSize) ? 0 : this.x_; }
    set x(x) { this.x_ = x; }
    get y() { return (this.lockedToScreenSize) ? 0 : this.y_; }
    set y(y) { this.y_ = y; }
    get width() { return (this.lockedToScreenSize) ? Handler.ScreenSizeCoord.width : this.width_; }
    set width(width) { this.width_ = width; }
    get height() { return (this.lockedToScreenSize) ? Handler.ScreenSizeCoord.height : this.height_; }
    set height(height) { this.height_ = height; }
    /**
     * Resets within to undefined values
     */
    reset() { this.x = this.y = this.width = this.height = undefined; }
    ;
}
/**
 * Coord
 */
class Coord extends Base {
    constructor(...Arguments) {
        super();
        _x_.set(this, void 0);
        _y_.set(this, void 0);
        _width_.set(this, void 0);
        _height_.set(this, void 0);
        /**
         * Within of coord
         */
        this.within = new Within();
        this.buildBase(...Arguments);
        Coord.makeLabel(this);
    }
    get x() { return __classPrivateFieldGet(this, _x_) + ((this.offset) ? this.offset.x : 0); }
    set x(x) { if (!this.frozen)
        __classPrivateFieldSet(this, _x_, x); }
    get y() { return __classPrivateFieldGet(this, _y_) + ((this.offset) ? this.offset.y : 0); }
    set y(y) { if (!this.frozen)
        __classPrivateFieldSet(this, _y_, y); }
    get width() { return __classPrivateFieldGet(this, _width_) + ((this.offset) ? this.offset.width : 0); }
    set width(width) { if (!this.frozen)
        __classPrivateFieldSet(this, _width_, width); }
    get height() { return __classPrivateFieldGet(this, _height_) + ((this.offset) ? this.offset.height : 0); }
    set height(height) { if (!this.frozen)
        __classPrivateFieldSet(this, _height_, height); }
    /**
     * Gets x2 (Read Only)
     */
    get x2() { return this.x + this.width; }
    /**
     * Gets y2 (Read Only)
     */
    get y2() { return this.y + this.height; }
    /**
     * Sets offset (x=0, y=0, width=0, height=0)
     */
    setOffset(x = 0, y = 0, width = 0, height = 0) {
        if (x == 0 && y == 0 && width == 0 && height == 0)
            this.offset = undefined;
        else
            this.offset = { x, y, width, height };
    }
    /**
     * Merges parent Within with this Within (to see if part goes off-screen)
     * @param p Coord Object
     */
    mergeWithin(p /* parent Coord */) {
        if (!this.frozen) {
            let ax1 = p.x, ax2 = p.x + p.width, ay1 = p.y, ay2 = p.y + p.height;
            let bx1 = p.within.x, bx2 = bx1 + p.within.width, by1 = p.within.y, by2 = by1 + p.within.height;
            this.within.x = (ax1 > bx1) ? ax1 : bx1;
            this.within.width = (ax2 < bx2) ? ax2 - this.within.x : bx2 - this.within.x;
            this.within.y = (ay1 > by1) ? ay1 : by1;
            this.within.height = (ay2 < by2) ? ay2 - this.within.y : by2 - this.within.y;
        }
        return this;
    }
    /**
     * Applys margins (left:number = 0, right:number = 0, top:number =0, bottom:number =0)
     * @returns
     */
    applyMargins(left = 0, right = 0, top = 0, bottom = 0) {
        this.x += left;
        this.y += top;
        this.width -= (left + right);
        this.height -= (top + bottom);
        return this;
    }
    /**
     * Assigns coord (x, y, width, height, wx, wy, wwidth, wheight, zindex)
     * Used for assigning a "New Coord Root"
     */
    assign(x = undefined, y = undefined, width = undefined, height = undefined, wx = undefined, wy = undefined, wwidth = undefined, wheight = undefined, zindex = undefined) {
        if (!this.frozen) {
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
        return this;
    }
    /**
     * Copys coord (and uses their 'within', and applies child co-ordinates)
     * @param (fromCoord,  x, y, width, height, zindex)
     * @returns
     */
    copy(fromCoord, x = undefined, y = undefined, width = undefined, height = undefined, zindex = undefined) {
        if (!this.frozen) {
            let noX = (x == undefined);
            this.zindex = (zindex == undefined) ? fromCoord.zindex : zindex;
            this.x = noX ? fromCoord.x : x;
            this.y = noX ? fromCoord.y : y;
            this.width = noX ? fromCoord.width : width;
            this.height = noX ? fromCoord.height : height;
            if (noX) {
                this.within.x = fromCoord.within.x;
                this.within.y = fromCoord.within.y;
                this.within.width = fromCoord.within.width;
                this.within.height = fromCoord.within.height;
            }
            else
                this.mergeWithin(fromCoord);
        }
        return this;
    }
    /**
     * Logs coord
     */
    log() {
        console.log(`x=${this.x}`, `y=${this.y}`, `width=${this.width}`, `height=${this.height}`);
        console.log(`wx=${this.within.x}`, `wy=${this.within.y}`, `wwidth=${this.within.width}`, `wheight=${this.within.height}`);
    }
    /**
     * Determines whether coord completely outside is
     * if true, de-render, rather than render.
     * @param WITHIN or Coord
     * @returns boolean
     */
    isCoordCompletelyOutside(WITHIN = this.within) {
        return ((WITHIN.x + WITHIN.width < this.x) ||
            (WITHIN.x > this.x + this.width) ||
            (WITHIN.y + WITHIN.height < this.y) ||
            (WITHIN.y > this.y + this.height));
    }
    /**
     * Derenders - if was already derender, or completly outside, then derender.
     * @param derender
     * @returns boolean
     */
    derender(derender) { return derender || this.isCoordCompletelyOutside(); }
    /**
     * Determines whether point is in Coord
     * @param (x, y)
     * @returns true if point whithin Coord.
     */
    isPointIn(x, y) { return (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height); }
    /**
     * Red coord - used for de-bugging - Renders a Coord "Red"
     * @param [id]
     */
    red(id = "red") {
        let div = document.getElementById(id);
        if (!div) {
            div = document.createElement("div");
            Element_.setAttrib(div, "id", id);
            Element_.setAttrib(div, "llm", "");
            document.body.appendChild(div);
        }
        div.style.cssText = `background:red;left: ${this.x}px; top: ${this.y}px; width: ${this.width}px; height: ${this.height}px; z-index: 1000;`; //style="left: 559px; top: 25px; width: 300px; height: 829px; z-index: 30;"
    }
}
_x_ = new WeakMap(), _y_ = new WeakMap(), _width_ = new WeakMap(), _height_ = new WeakMap();
/**
 * Instances of coord object (Key = label)
 */
Coord.instances = [];
/**
 * Active instances of coord (Not Implemented)
 */
Coord.activeInstances = [];
/**
 * Defaults of coord
 */
Coord.defaults = { x: 0, y: 0, width: 0, height: 0, zindex: 0 };
/**
 * Arg map of coord: for example:
 * instance.label = first string argument
 * instance.x , y, width, height, zindex = first though fifth arguments
 * instance.hidewidth = first boolean argument
 */
Coord.argMap = {
    string: ["label"],
    number: ["x", "y", "width", "height", "zindex"],
    boolean: ["hideWidth"]
};
function events(object_) { return { processEvents: object_ }; }
/**
 * Element
 */
class Element_ extends Component {
    /**
     * Creates an instance of element .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.events = {};
        this.attributes = { llm: "" };
        this.buildBase(...Arguments);
        Element_.makeLabel(this);
        Element_.instances[this.label] = this;
        this.attributes.id = this.label;
        if (this.Css)
            this.css = this.Css.classname;
        let el = Element_.elExists(this.label);
        // console.log(this.label, el)
        if (el)
            this.loadElement(el);
        if (this.processEvents) {
            this.addEvents(this.processEvents);
        }
    }
    get dim() { return (this.parentDisplayCell) ? this.parentDisplayCell.dim : this.dim_; }
    ;
    set dim(value) {
        if (this.parentDisplayCell)
            this.parentDisplayCell.dim = value;
        else
            this.dim_ = value;
    }
    get css() {
        if (this.Css)
            return this.Css.classname;
        if (this.css_)
            return this.css_;
        return undefined;
    }
    set css(value) {
        this.css_ = value;
        this.attributes.class = value;
    }
    get coord() { if (this.parentDisplayCell)
        return this.parentDisplayCell.coord; return undefined; }
    /**
     * Loads element
     * @param el
     */
    loadElement(el) {
        this.el = el;
        this.attributes = Element_.getAttribs(el);
        this.attributes["llm"] = "";
        this.innerHTML = el.innerHTML;
        // console.log("loading Element", el)
        el.remove();
    }
    /**
     * Applys events
     */
    applyEvents() { for (let key in this.events)
        this.el[key] = this.events[key]; }
    /**
     * Adds events
     * @param eventObject
     */
    addEvents(eventObject) {
        for (const key in eventObject) {
            if (key in Element_.customEvents)
                this.addEvents(Element_.customEvents[key](eventObject[key]));
            else
                this.events[key] = FunctionStack.push(this.events[key], eventObject[key]);
        }
    }
    /**
     * Renders html attributes
     */
    renderHtmlAttributes() { for (let key in this.attributes)
        Element_.setAttrib(this.el, key, this.attributes[key]); }
    /**
     * Determines whether connect on
     */
    onConnect() {
        if (this.dim_) {
            this.parentDisplayCell.dim = this.dim_;
            this.dim_ = undefined;
        }
        if (this.retArgs["number"])
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"]);
    }
    /**
     * Renders element
     * @param derender
     * @param node
     * @returns
     */
    Render(derender, node) {
        let el = Element_.elExists(this.label);
        if (derender || this.coord.width <= 0) {
            if (el)
                el.remove();
            return [];
        }
        if (!this.el)
            this.el = document.createElement("div");
        if (!el)
            document.body.appendChild(this.el);
        if (this.innerHTML && (!this.ignoreInner) && this.innerHTML != this.el.innerHTML) {
            let newinner = this.evalInner(this);
            if (newinner != undefined)
                this.el.innerHTML = newinner;
        }
        this.renderHtmlAttributes();
        this.applyEvents();
        let styleString = Element_.style(this);
        if (this.el.style.cssText != styleString)
            this.el.style.cssText = styleString;
        return [];
    }
    /**
     * Sets as selected
     */
    setAsSelected() {
        if (!this.attributes.class.endsWith("Selected")) {
            this.attributes.class += "Selected";
            if (this.el)
                Element_.setAttrib(this.el, "class", this.attributes.class);
        }
    }
    /**
     * Sets as un selected
     */
    setAsUnSelected() {
        if (this.attributes.class.endsWith("Selected")) {
            this.attributes.class = this.attributes.class.slice(0, -8);
            if (this.el)
                Element_.setAttrib(this.el, "class", this.attributes.class);
        }
    }
    /**
     * Clips style string
     * @param element
     * @returns
     */
    static clipStyleString(element) {
        let COORD = element.coord;
        let WITHIN = element.coord.within;
        let returnString = "";
        let left = (COORD.x < WITHIN.x) ? (WITHIN.x - COORD.x) : 0;
        let right;
        if (COORD.hideWidth) {
            let el = document.getElementById(element.label);
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
    /**
     * Styles element
     * @param element
     * @returns style
     */
    static style(element) {
        let coord = element.coord;
        let clip = Element_.clipStyleString(element);
        let returnString = `left:${coord.x}px;top:${coord.y}px;`
            + `${(coord.hideWidth || coord.width == undefined) ? "" : "width:" + coord.width + "px;"}`
            + `height:${coord.height}px;z-index:${coord.zindex};${(clip) ? clip + ";" : ""}`
            + ((element.attributes.style) ? element.attributes.style : "");
        return returnString;
    }
    /**
     * Gets attribs
     * @param el
     * @param [retObj]
     * @returns attribs
     */
    static getAttribs(el, retObj = {}) {
        for (let i = 0; i < el.attributes.length; i++)
            if (Element_.attribFilter.indexOf(el.attributes[i].name) == -1)
                retObj[el.attributes[i].name] = el.attributes[i].value;
        return retObj;
    }
    /**
     * exists
     * @param id_label
     * @returns
     */
    static elExists(id_label) { return document.getElementById(id_label); }
    /**
     * Sets attribs
     * @param element
     */
    static setAttribs(element) {
        for (const key in element.attributes)
            Element_.setAttrib(element.el, key, element.attributes[key]);
    }
    /**
     * Sets attrib
     * @param el
     * @param attrib
     * @param value
     */
    static setAttrib(el, attrib, value) {
        let prevAttrib = el.getAttribute(attrib);
        if (prevAttrib != value) {
            let att = document.createAttribute(attrib);
            att.value = value;
            el.setAttributeNode(att);
        }
    }
}
Element_.eventsArray = [];
Element_.labelNo = 0;
Element_.instances = {};
Element_.activeInstances = {};
Element_.defaults = { evalInner: (THIS) => THIS.innerHTML };
Element_.argMap = {
    string: ["label", "innerHTML", "css_"],
    dim: ["dim_"],
    Css: ["Css"],
    function: ["evalInner"],
};
/**
 * Custom events of element
 */
Element_.customEvents = {};
/**
 * Attrib filter of element
 */
Element_.attribFilter = ["id"];
function I(...Arguments) { return new DisplayCell(new Element_(...Arguments)); }
/**
 * Display cell houses all the Componenets within a Coord (div)
 * It can have multiple children.  All Components must be withing a DisplayCell
 */
class DisplayCell extends Component {
    /**
     * Creates an instance of display cell.
     * Arguments are first string = label, and object to become children.
     * usually, you will use displaycellInstance.addComponent()
     */
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        if (!this.coord)
            this.coord = new Coord();
        if (this.retArgs["number"])
            DisplayCell.marginAssign(this, this.retArgs["number"]);
        for (let index = 0; index < Arguments.length; index++) {
            const component = Arguments[index];
            if (typeof (component) == "object" && component.constructor) {
                if (component.constructor.name == "Coord")
                    this.coord = component;
                else
                    this.addComponent(component);
            }
        }
        if (!this.label)
            DisplayCell.makeLabel(this);
        DisplayCell.instances[this.label] = this;
    }
    set dim(value) { this.setdim(value); }
    get dim() { return this.getdim(); }
    /**
     * Adds component to children of DisplayCell, and runs onConnect()
     */
    addComponent(component) {
        DisplayCell.objectTypes.add(component.constructor.name);
        this.children.push(component);
        component.parentDisplayCell = this;
        component.onConnect();
        if (!this.label)
            this.label = component.label;
        return this;
    }
    /**
     * Gets component from the Children of DisplayCell
     * @param type ie Element_, DisplayGroup
     * @param label of above type, in cases of multiple similar types in children
     */
    getComponent(type, label = undefined) {
        for (let index = 0; index < this.children.length; index++) {
            const component = this.children[index];
            if (Arguments_.typeof(component) == type) {
                if (!label)
                    return component;
                if (label == component["label"])
                    return component;
            }
        }
        return undefined;
    }
    /**
     * Deletes component from DisplayCell Children
     */
    deleteComponent(type, label = undefined) {
        let returnValue = false;
        for (let index = 0; index < this.children.length; index++) {
            const component = this.children[index];
            if ((Arguments_.typeof(component) == type) && (!label || label == component["label"])) {
                component["parentDisplayCell"] = undefined;
                this.children.splice(index--, 1);
                returnValue = true;
            }
        }
        return returnValue;
    }
    /**
     * Pre render phase is identical to Render, but gives you an oppotunity
     * to change the parent DisplayCells, before they are rendered
     */
    preRender(derender, node, zindex) {
        let returnArray = [];
        for (let index = 0; index < this.children.length; index++) {
            let component = this.children[index];
            let type = Arguments_.typeof(component);
            if (type != "DisplayCell") {
                let temp = component.preRender(derender, node, zindex);
                if (temp)
                    returnArray.concat(temp);
            }
        }
        return returnArray;
    }
    /**
     * Renders objects and expects a return array of children of this object to be rendered.
     * It is at this point that the co-ordinates of the children are set.
     */
    Render(derender = false, node, zindex) {
        this.coord.applyMargins(this.marginLeft, this.marginRight, this.marginTop, this.marginBottom);
        if (this.coord.zindex < 0)
            this.coord.zindex *= -1;
        else
            this.coord.zindex = zindex;
        return this.children;
    }
    /**
     * Adds events to expected child Element_
     */
    addEvents(Argument) {
        let element_ = this.getComponent("Element_");
        if (element_)
            element_.addEvents(Argument);
    }
    /**
     * Sets Margins, in different ways depending on number of arguments.
     * if one, all set to that value, if two, left and right to first, top and bottom to second,
     * if 4, left, right, top, bottom set to those values
     */
    static marginAssign(cell, numberArray) {
        switch (numberArray.length) {
            case 1:
                cell.marginLeft = cell.marginRight = cell.marginTop = cell.marginBottom = numberArray[0];
                break;
            case 2:
                cell.marginLeft = cell.marginRight = numberArray[0];
                cell.marginTop = cell.marginBottom = numberArray[1];
                break;
            case 4:
                cell.marginLeft = numberArray[0];
                cell.marginRight = numberArray[1];
                cell.marginTop = numberArray[2];
                cell.marginBottom = numberArray[3];
                break;
            default:
                break;
        }
    }
}
DisplayCell.labelNo = 0;
/**
 * Instances of display cell as object key=label of DisplayCell
 */
DisplayCell.instances = {};
DisplayCell.activeInstances = {};
DisplayCell.defaults = { getdim: function () { return this.dim_; }, setdim: function (value) { this.dim_ = value; } };
DisplayCell.argMap = {
    string: ["label"],
};
DisplayCell.objectTypes = new Set();
/**
 * Display group Objects stores an Array of children to be
 * rendered in either a column (vertical) or row (horizontal)
 */
class DisplayGroup extends Component {
    /**
     * Creates an instance of display group.
     * first string argument is label,
     * first number argument is number of pixels between cells
     * optional "dim" value expected (ends with "px" or "%")
     * if new DisplayGroup() - first boolean true = horizontal, false = vertical
     */
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        DisplayGroup.makeLabel(this);
        DisplayGroup.instances[this.label] = this;
        DisplayGroup.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs)
            this.children = this.retArgs["DisplayCell"];
    }
    get dim() { return this.dim_; }
    ;
    set dim(value) { this.dim_ = value; }
    get coord() { return (this.parentDisplayCell) ? this.parentDisplayCell.coord : undefined; }
    /**
     * This is called by the parent when it finds this child.
     * Parent retrieves "dim" value of this, and copies Margins.
     */
    onConnect() {
        let THIS = this;
        this.parentDisplayCell.getdim = function () { return THIS.dim; };
        this.parentDisplayCell.setdim = function (value) { THIS.dim = value; };
        if (this.retArgs["number"] && this.retArgs["number"].length > 1)
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"].slice(1));
    }
    ;
    /**
     * Renders Displaygroup (Called during Render Phase)
     * (derender:boolean, node:node_, zindex:number)
     */
    Render(derender, node, zindex) {
        // console.log("Render")
        let TotalPixels = ((this.isHor) ? this.coord.width : this.coord.height) - (this.children.length - 1) * ((this.margin) ? this.margin : 0);
        let answersArray = [];
        let totalPxUsed = 0;
        let percentUsed = 0;
        let emptyDim = 0;
        // first pass fills in stuff
        for (let index = 0; index < this.children.length; index++) {
            let child = this.children[index];
            let dim = child.dim;
            let min = (child.min) ? child.min : 0;
            if (dim) {
                if (dim.endsWith("px")) {
                    let px = pf.pxAsNumber(dim);
                    if (px < min)
                        px = min;
                    answersArray.push({ px, percent: 0, min });
                    totalPxUsed += px;
                }
                else {
                    let percent = pf.percentAsNumber(dim);
                    answersArray.push({ px: undefined, percent, min });
                    percentUsed += percent;
                }
            }
            else {
                answersArray.push({ px: undefined, percent: undefined, min });
                ++emptyDim;
            }
        }
        // second pass fills in empty
        if (emptyDim) {
            for (let index = 0; index < answersArray.length; index++)
                if (answersArray[index].percent == undefined)
                    answersArray[index].percent = pf.decimalPlaces((100 - percentUsed) / emptyDim, 2);
        }
        // third pass evaluates percents
        let pixelsLeft = TotalPixels - totalPxUsed;
        for (let index = 0; index < answersArray.length; index++) {
            let aA = answersArray[index];
            if (aA.percent)
                aA.px = pf.decimalPlaces((aA.percent / 100) * pixelsLeft, 1);
        }
        let morePixels = DisplayGroup.forceMin(answersArray);
        let pixelsAvailable = (this.isHor) ? this.coord.width : this.coord.height;
        let margin = ((this.margin == undefined) ? 0 : this.margin);
        let pixelsUsed = 0;
        for (let index = 0; index < answersArray.length; index++) {
            let px = answersArray[index].px;
            pixelsUsed += px + ((index == 0) ? 0 : margin);
        }
        if (("ScrollBar" in Render.classes) && this.allowScrollBar) {
            if (pixelsUsed > pixelsAvailable + 1) {
                if (!this.scrollbar) {
                    this.scrollbar = scrollbar(this.label + "_ScrollBar", this.isHor);
                    this.parentDisplayCell.addComponent(this.scrollbar);
                }
                this.offset = this.scrollbar.update(pixelsUsed, pixelsAvailable);
            }
            else {
                if (this.scrollbar) {
                    this.scrollbar.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar");
                    this.scrollbar = undefined;
                }
            }
        }
        let x = this.coord.x - ((this.isHor) ? this.offset : 0);
        let y = this.coord.y - ((this.isHor) ? 0 : this.offset);
        let width;
        let height;
        for (let index = 0; index < answersArray.length; index++) {
            let px = answersArray[index].px;
            width = (this.isHor) ? px : this.coord.width;
            height = (this.isHor) ? this.coord.height : px;
            this.children[index].coord.copy(this.coord, x, y, width, height, zindex);
            x += (this.isHor) ? width + margin : 0;
            y += (this.isHor) ? 0 : height + margin;
        }
        return this.children;
    }
    /**
     * Forces min
     * @param answersArray
     * @returns
     */
    static forceMin(answersArray) {
        let morePixels = 0;
        let totalPercent = 0;
        for (let index = 0; index < answersArray.length; index++) {
            let aA = answersArray[index];
            if (aA.px < aA.min) {
                morePixels += aA.min - aA.px;
                aA.px = aA.min;
                if (aA.percent) {
                    aA.percent = undefined;
                }
            }
            if (aA.percent)
                totalPercent += aA.percent;
        }
        if (totalPercent < 99 && totalPercent > 0) {
            let scaleFactor = 100 / totalPercent;
            for (let index = 0; index < answersArray.length; index++) {
                let aA = answersArray[index];
                if (aA.percent)
                    aA.percent = pf.decimalPlaces(aA.percent * scaleFactor, 2);
            }
        }
        return morePixels;
    }
}
DisplayGroup.labelNo = 0;
DisplayGroup.instances = {};
DisplayGroup.activeInstances = {};
DisplayGroup.defaults = { isHor: true, margin: 0, offset: 0 };
DisplayGroup.argMap = {
    string: ["label"],
    number: ["margin"],
    dim: ["dim_"],
    boolean: ["isHor"],
};
function h(...Arguments) { return new DisplayCell(new DisplayGroup(...Arguments)); }
function v(...Arguments) { return h(false, ...Arguments); }
/**
 * Handler
 */
class Handler extends Component {
    /**
     * Creates an instance of handler.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        Handler.makeLabel(this);
        Handler.instances[this.label] = this;
        for (let index = 0; index < Arguments.length; index++) {
            const newChildObject = Arguments[index];
            if (typeof (newChildObject) == "object" && newChildObject.constructor) {
                if (newChildObject.constructor.name == "Coord")
                    this.coord = newChildObject;
                else {
                    DisplayCell.objectTypes.add(newChildObject.constructor.name);
                    this.children.push(newChildObject);
                }
            }
        }
        if (!this.coord)
            this.coord = Handler.ScreenSizeCoord;
        if (this.startRendered)
            Handler.activeInstances[this.label] = this;
    }
    /**
     * Links handlers
     */
    static linkHandlers() {
        let links = document.querySelectorAll("[handler]");
        Handler.linkHandlerOldList = Handler.linkHandlerNewList;
        Handler.linkHandlerNewList = [];
        for (let index = 0; index < links.length; index++) {
            const el = links[index];
            let parentEl = el;
            do {
                parentEl = parentEl.parentElement;
            } while (!(parentEl.id && Element_.instances[parentEl.id]) && (parentEl));
            let coord = (parentEl) ? Element_.instances[parentEl.id].parentDisplayCell.coord : Handler.ScreenSizeCoord;
            let handlerLabel = el.getAttribute("handler");
            let handler = Handler.instances[handlerLabel];
            if (handler) {
                if (!Handler.activeInstances[handlerLabel])
                    Handler.activeInstances[handlerLabel] = handler;
                if (Handler.linkHandlerNewList.indexOf(handler) == -1)
                    Handler.linkHandlerNewList.push(handler);
                if (!handler.preRenderCallBack) {
                    handler.preRenderCallBack = FunctionStack.push(undefined, function setHandlerCoord(handler) {
                        let { x, y, width, height } = el.getBoundingClientRect();
                        handler.coord.copy(coord, x, y, width, height);
                    });
                }
            }
        }
        for (let index = 0; index < Handler.linkHandlerOldList.length; index++) {
            let handler = Handler.linkHandlerOldList[index];
            if (Handler.linkHandlerNewList.indexOf(handler) == -1) {
                delete handler.preRenderCallBack;
                Render.update(handler.parentDisplayCell, true);
                delete Handler.activeInstances[handler.label];
            }
        }
    }
    /**
     * Updates screen size coord
     */
    static updateScreenSizeCoord() {
        let win = window, doc = document, docElem = doc.documentElement, body = doc.getElementsByTagName('body')[0], x = win.innerWidth || docElem.clientWidth || body.clientWidth, y = win.innerHeight || docElem.clientHeight || body.clientHeight;
        Handler.ScreenSizeCoord.frozen = false;
        Handler.ScreenSizeCoord.assign(0, 0, x, y, 0, 0, x, y);
        Handler.ScreenSizeCoord.frozen = true;
    }
    /**
     * Gets handlers
     * @returns handlers
     */
    static getHandlers() {
        let objectArray = [];
        for (const key in Handler.activeInstances)
            objectArray.push(Handler.activeInstances[key].parentDisplayCell);
        return objectArray;
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        if (this.retArgs["number"] && this.retArgs["number"].length >= 1)
            DisplayCell.marginAssign(this.parentDisplayCell, this.retArgs["number"]);
        if (this.startRendered)
            Render.scheduleUpdate();
    }
    /**
     * Pre render
     * @param derender
     * @param node
     */
    preRender(derender, node) {
        if (this.preRenderCallBack)
            this.preRenderCallBack(this);
        this.parentDisplayCell.coord.copy(this.coord);
    }
    /**
     * Renders handler
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        for (let index = 0; index < this.children.length; index++)
            (this.children[index]).coord.copy(this.parentDisplayCell.coord);
        if (this.postRenderCallBack)
            this.postRenderCallBack(this);
        return this.children;
    }
    /**
     * Shows handler
     */
    show() { Handler.activeInstances[this.label] = this; Render.scheduleUpdate(); }
    /**
     * Hides handler
     */
    hide() {
        Render.update(this.parentDisplayCell, true);
        delete Handler.activeInstances[this.label];
    }
}
Handler.labelNo = 0;
Handler.instances = {};
Handler.activeInstances = {};
Handler.defaults = { startRendered: true };
Handler.argMap = {
    string: ["label"],
    Coord: ["coord"],
    boolean: ["startRendered"],
    function: ["preRenderCallBack", "postRenderCallBack"]
};
Handler.linkHandlerOldList = [];
Handler.linkHandlerNewList = [];
/**
 * Screen size coord of handler
 */
Handler.ScreenSizeCoord = new Coord();
function H(...Arguments) { return new DisplayCell(new Handler(...Arguments)); }
/**
 * Css - This class is used like a css sheet.
 * It stores the data in an object, rather than css sheet
 */
class Css extends Base {
    /**
     * Creates an instance of css.
     * First String is classname, Second is css, third is onhover css, fourth is on Selected
     */
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
        Css.instances[this.classname] = this;
    }
    /**
     * label
     * @param classname
     * @returns label
     */
    static byLabel(classname) {
        for (let key in Css.instances)
            if (Css.instances[key].classname == classname)
                return Css.instances[key];
        return undefined;
    }
    /**
     * News string
     * @param data
     */
    newString(data) {
        this.cssObj = this.makeObj(data);
        this.css = this.makeString();
    }
    /**
     * Converts Obect to String
     */
    makeString(obj = this.cssObj, postfix = "", addToClassName = "") {
        let returnString = `${(this.isClassname) ? "." : ""}${this.classname}${addToClassName}${(postfix) ? ":" + postfix : ""} {\n`;
        for (let key in obj)
            returnString += `  ${key}:${obj[key]};\n`;
        returnString += "}";
        return returnString;
    }
    /**
     * Makes an object from a css string (within the {} of class definition)
     * @returns obj
     */
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
    /**
     * Updates css Objects in DOM <style id="llmstyle"></style>
     */
    static update() {
        let style = document.getElementById(Css.elementId);
        let alreadyexists = true;
        if (!style) {
            alreadyexists = false;
            style = document.createElement('style');
        }
        Element_.setAttrib(style, "id", Css.elementId);
        let outstring = "\n";
        for (const key in Css.instances) {
            const instance = Css.instances[key];
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
Css.instances = {};
Css.activeInstances = {};
Css.defaults = { isClassname: true };
/**
 * Argument map of css
 * First String is classname, Second is css, third is onhover css, fourth is on Selected
 */
Css.argMap = {
    string: ["classname", "css", "cssHover", "cssSelect", "cssSelectHover"],
    boolean: ["isClassname"]
};
/**
 * On First Run, all elements with class = "remove", are removed.
 */
Css.deleteOnFirstRunClassname = ".remove";
Css.advisedDiv = new Css("div[llm]", "position:absolute;", false, { type: "llm" });
Css.advisedBody = new Css("body", "overflow: auto hidden;", false, { type: "llm" });
Css.advisedHtml = new Css("html", "overflow: auto hidden;", false, { type: "llm" });
function css(...Arguments) { return new Css(...Arguments); }
/**
 * Render Object - Renders Components
 */
class Render {
    /**
     * Schedules update - Prefered Method for updating
     */
    static scheduleUpdate() {
        if (Render.firstRun) {
            Render.firstRun = false;
            window.onresize = FunctionStack.push(undefined, function fullupdate(e) { Render.fullupdate(); });
            window.addEventListener('scroll', function () { Render.fullupdate(); }, true);
            window.onwheel = FunctionStack.push(undefined, function fullupdate(e) { Render.fullupdate(); });
            let deletes = document.getElementsByClassName("remove");
            for (let index = 0; index < deletes.length; index++)
                deletes[index].remove();
        }
        if (!Render.pleaseUpdate) {
            Render.pleaseUpdate = true;
            setTimeout(() => {
                Render.pleaseUpdate = false;
                Render.fullupdate();
            }, 0);
        }
    }
    /**
     * Fullupdates render
     * @param [derender]
     */
    static fullupdate(derender = false) {
        Css.update();
        Render.node = new node_("Root");
        Handler.updateScreenSizeCoord();
        Handler.linkHandlers();
        let handlers = Handler.getHandlers();
        let currentNumberOfHandlers = handlers.length;
        for (let index = 0; index < handlers.length; index++) {
            Render.update([handlers[index]], derender, Render.node, index * Render.zindexHandlerIncrement);
        }
    }
    /**
     * Updates render - usually called for de-render
     * update(SomeObject, true);
     * @param [components_]
     * @param [derender]
     * @param [parentNode]
     * @param [zindex]
     */
    static update(components_ = undefined, derender = false, parentNode = undefined, zindex = 0) {
        if (components_) {
            let components;
            if (Arguments_.typeof(components_) != "Array")
                components = [components_];
            else
                components = components_;
            let node;
            for (let index = 0; index < components.length; index++) {
                const component = components[index];
                let type = Arguments_.typeof(component);
                if (derender)
                    node = component.node;
                else {
                    node = parentNode.newChild(component.label, component);
                    component.node = node;
                }
                if (type == "DisplayCell") {
                    let newObjects = component.preRender(derender, node, zindex);
                    if (newObjects && newObjects.length)
                        Render.update(newObjects, derender, node, zindex + Render.zindexIncrement);
                }
                let newObjects = component.Render(derender, node, zindex);
                if (newObjects && newObjects.length)
                    Render.update(newObjects, derender, node, zindex + Render.zindexIncrement);
            }
        }
    }
    /**
     * Registers render
     * @param label
     * @param object_
     */
    static register(label, object_) { Render.classes[label] = object_; }
}
Render.zindexIncrement = 5;
Render.zindexHandlerIncrement = 100;
Render.pleaseUpdate = false;
Render.firstRun = true;
/**
 * Classes of render - Used for determinine what modules are loaded
 */
Render.classes = { /* DragBar,for wxample... filled in when modules load. */};
class ScrollBar extends Component {
    /**
     * Creates an instance of scroll bar.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        ScrollBar.makeLabel(this);
        ScrollBar.instances[this.label] = this;
        this.build();
        ScrollBar.instances[this.label] = this;
    }
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
    get scrollbarPixels() {
        let coord = this.scrollbarDisplayCell.coord;
        return (this.isHor) ? coord.width - this.barSize * 2 : coord.height - this.barSize * 2;
    }
    get ratio() {
        return pf.decimalPlaces(this.pixelsUsed / this.scrollbarPixels, 3);
    }
    /**
     * Updates scroll bar
     * @param pixelsUsed
     * @param pixelsAvailable
     * @returns update
     */
    update(pixelsUsed, pixelsAvailable) {
        this.pixelsUsed = pixelsUsed;
        this.pixelsAvailable = pixelsAvailable;
        this.limit();
        return this.offset;
    }
    /**
     * Limits scroll bar
     */
    limit() {
        if (this.offset < 0)
            this.offset = 0;
        if (this.offset > this.pixelsUsed - this.pixelsAvailable)
            this.offset = this.pixelsUsed - this.pixelsAvailable;
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        this.preRender(undefined, undefined);
        Render.scheduleUpdate();
    }
    ;
    /**
     * Pre render
     * @param derender
     * @param node
     * @returns render
     */
    preRender(derender, node) {
        if (this.isHor)
            this.parentDisplayCell.coord.height -= this.barSize;
        else
            this.parentDisplayCell.coord.width -= this.barSize;
        return undefined;
    }
    ;
    /**
     * Renders scroll bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        // console.log("Scrollbar Render");
        let coord = this.parentDisplayCell.coord;
        let x = (this.isHor) ? coord.x : coord.x + coord.width;
        let y = (this.isHor) ? coord.y + coord.height : coord.y;
        let width = (this.isHor) ? coord.width : this.barSize;
        let height = (this.isHor) ? this.barSize : coord.height;
        this.scrollbarDisplayCell.coord.assign(x, y, width, height, x, y, width, height, zindex);
        this.preBar.dim = `${this.offset / this.ratio}px`;
        this.Bar.dim = `${this.scrollbarPixels * this.pixelsAvailable / this.pixelsUsed - 1}px`;
        this.postBar.dim = `100%`;
        return [this.scrollbarDisplayCell];
    }
    ;
    /**
     * Deletes scroll bar
     */
    delete() {
        Render.update(this.scrollbarDisplayCell, true);
        Render.scheduleUpdate();
    }
    /**
     * Builds scroll bar
     */
    build() {
        let label = this.label + ((this.isHor) ? "_H" : "_V");
        this.preBar = I(`${label}_preBar`, ScrollBar.ScrollBar_whiteBG, events({ onclick: this.onSmallerBar.bind(this) }));
        this.Bar = I(`${label}_Bar`, ScrollBar.ScrollBar_blackBG, events({ ondrag: [this.onBarDown.bind(this), this.onBarMove.bind(this)] }));
        this.postBar = I(`${label}_postBar`, ScrollBar.ScrollBar_whiteBG, events({ onclick: this.onBiggerBar.bind(this) }));
        this.scrollbarDisplayCell =
            h(`${label}_h`, this.isHor, I(`${label}_backArrow`, `${this.barSize}px`, (this.isHor) ? ScrollBar.leftArrowSVG("scrollArrows") : ScrollBar.upArrowSVG("scrollArrows"), events({ onholdclick: [this.onSmallArrow.bind(this)] })), this.preBar, this.Bar, this.postBar, I(`${label}_forwardArrow`, `${this.barSize}px`, (this.isHor) ? ScrollBar.rightArrowSVG("scrollArrows") : ScrollBar.downArrowSVG("scrollArrows"), events({ onholdclick: [this.onBigArrow.bind(this)] })));
    }
    onSmallArrow(e) { this.offset -= this.ratio * this.scrollMultiplier; this.limit(); Render.scheduleUpdate(); }
    onBigArrow(e) { this.offset += this.ratio * this.scrollMultiplier; this.limit(); Render.scheduleUpdate(); }
    onSmallerBar(e) { this.offset -= this.pixelsAvailable; this.limit(); Render.scheduleUpdate(); }
    onBiggerBar(e) { this.offset += this.pixelsAvailable; this.limit(); Render.scheduleUpdate(); }
    onBarDown(e) { ScrollBar.startoffset = this.offset; }
    onBarMove(e, xmouseDiff) {
        let dist = (this.isHor) ? xmouseDiff["x"] : xmouseDiff["y"];
        this.offset = ScrollBar.startoffset + dist * this.ratio;
        this.limit();
        Render.scheduleUpdate();
    }
}
ScrollBar.labelNo = 0;
ScrollBar.instances = {};
ScrollBar.activeInstances = {};
ScrollBar.defaults = { barSize: 15, offset: 0, scrollMultiplier: 5 };
ScrollBar.argMap = {
    string: ["label"],
    boolean: ["isHor"],
    //DisplayGroup : ["parentDisplayGroup"],
};
ScrollBar.ScrollBar_whiteBG = css("whiteBG", "background-color:white;outline: 1px solid black;outline-offset: -1px;", { type: "llm" });
ScrollBar.ScrollBar_blackBG = css("blackBG", "background-color:black;color:white;cursor: -webkit-grab; cursor: grab;", { type: "llm" });
// arrows  //scrollArrows
ScrollBar.scrollArrowsSVGCss = css(`scrollArrows`, `stroke: black;`, `fill: white;`, { type: "llm" });
ScrollBar.arrowSVGCss = css(`arrowIcon`, `stroke: black;cursor:pointer;`, `fill: white;`, { type: "llm" });
Render.register("ScrollBar", ScrollBar);
function scrollbar(...Arguments) {
    return new ScrollBar(...Arguments);
}
/**
 * On drag
 */
class onDrag_ extends Base {
    /**
     * Creates an instance of on drag .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.onDown = function () { };
        this.onMove = function () { };
        this.onUp = function () { };
        this.isDown = false;
        this.buildBase(...Arguments);
        if ("Array" in this.retArgs) {
            let array = this.retArgs["Array"][0];
            let num = array.length;
            if (num > 0)
                this.onDown = array[0];
            if (num > 1)
                this.onMove = array[1];
            if (num > 2)
                this.onUp = array[2];
        }
        let THIS = this;
        onDrag_.makeLabel(this);
        this.returnObject = {
            onmousedown: function (e) {
                THIS.onDown(e);
                THIS.isDown = true;
                THIS.mousePos = { x: e.clientX, y: e.clientY };
                window.addEventListener('selectstart', onDrag_.disableSelect);
                window.onmousemove = FunctionStack.push(window.onmousemove, function onDragMove(e) {
                    THIS.mouseDiff = { x: e.clientX - THIS.mousePos["x"], y: e.clientY - THIS.mousePos["y"] };
                    THIS.onMove(e, THIS.mouseDiff);
                });
                window.onmouseup = FunctionStack.push(window.onmouseup, function onDragUp(e) {
                    THIS.reset();
                    THIS.onUp(e, THIS.mouseDiff);
                });
            }
        };
    }
    /**
     * Resets on drag
     */
    reset() {
        FunctionStack.pop((window.onmousemove), "onDragMove");
        FunctionStack.pop((window.onmouseup), "onDragUp");
        window.removeEventListener('selectstart', onDrag_.disableSelect);
        this.isDown = false;
    }
    static disableSelect(event) { event.preventDefault(); }
}
onDrag_.instances = [];
onDrag_.activeInstances = [];
onDrag_.defaults = {};
onDrag_.argMap = {
    string: ["label"],
    function: ["onDown", "onMove", "onUp"],
};
function onDrag(...Arguments) { return (new onDrag_(...Arguments)).returnObject; }
Element_.customEvents["ondrag"] = function (newData) { return onDrag(newData); };
/**
 * On hold click
 */
class onHoldClick_ extends Base {
    /**
     * Creates an instance of on hold click .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        onHoldClick_.makeLabel(this);
        onHoldClick_.instances[this.label] = this;
        let THIS = this;
        this.returnObject = {
            onmousedown: function (e) {
                THIS.mouseDownEvent = e;
                THIS.onDown(e);
                THIS.isDown = new Date().getTime();
                window.onmouseup = FunctionStack.push(window.onmouseup, function onHoldClickUp(e) {
                    //console.log("mouseUp");
                    FunctionStack.pop((window.onmouseup), "onHoldClickUp");
                    THIS.isDown = undefined;
                });
                setTimeout(() => {
                    let newTime = new Date().getTime();
                    // console.log("ok",newTime - THIS.isDown, THIS.initialDelay)
                    if (THIS.isDown && (newTime - THIS.isDown) >= THIS.initialDelay) {
                        THIS.repeat();
                    }
                }, THIS.initialDelay);
            }
        };
    }
    /**
     * Repeats on hold click
     */
    repeat() {
        let THIS = this;
        this.FUNCTION(this.mouseDownEvent);
        setTimeout(() => { if (THIS.isDown)
            THIS.repeat(); }, THIS.repeatDelay);
    }
    onDown(e) { this.FUNCTION(e); }
}
onHoldClick_.labelNo = 0;
onHoldClick_.instances = {};
onHoldClick_.activeInstances = {};
onHoldClick_.defaults = { initialDelay: 1000, repeatDelay: 75 };
onHoldClick_.argMap = {
    string: ["label"],
    number: ["initialDelay", "repeatDelay"],
    function: ["FUNCTION"],
};
function onHoldClick(...Arguments) { return (new onHoldClick_(...Arguments)).returnObject; }
Element_.customEvents["onholdclick"] = function (newData) { return onHoldClick(...newData); };
/**
 * Selected
 */
class Selected extends Base {
    /**
     * Creates an instance of selected.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Selected.makeLabel(this);
        this.updateEvents();
        if (this.startValue != undefined)
            this.select(this.startValue);
        Selected.instances[this.label] = this;
    }
    get indexer() { return this.getIndexerArray(this); }
    set indexer(value) { this.indexer_ = value; }
    /**
     * Updates events
     */
    updateEvents() {
        let THIS = this;
        for (let index = 0; index < this.indexer.length; index++) {
            let displayCells;
            let type = Arguments_.typeof(this.indexer[index]);
            if (type == "DisplayCell")
                displayCells = this.indexer[index] = [(this.indexer[index])];
            else if (type == "Array")
                displayCells = (this.indexer[index]);
            for (let index = 0; index < displayCells.length; index++)
                displayCells[index].addEvents({ onclick: function selected(e) { THIS.select(displayCells[index]); } });
        }
    }
    /**
     * Selects selected
     * @param displaycellOrNumber
     */
    select(displaycellOrNumber) {
        let newIndex;
        let type = Arguments_.typeof(displaycellOrNumber);
        if (type == "number")
            newIndex = displaycellOrNumber;
        else if (type == "DisplayCell")
            newIndex = this.indexOf(displaycellOrNumber);
        if (newIndex != undefined) {
            if (this.currentButtonIndex != newIndex) {
                if (this.currentButtonIndex != undefined)
                    this.onUnselect(this.currentButtonIndex);
                this.currentButtonIndex = newIndex;
                this.onSelect(this.currentButtonIndex);
            }
        }
    }
    /**
     * Clears selected
     */
    clear() { this.onUnselect(this.currentButtonIndex); this.currentButtonIndex = undefined; }
    /**
     * Indexs of
     * @param displaycell
     * @returns of
     */
    indexOf(displaycell) {
        for (let index = 0; index < this.indexer.length; index++)
            if (this.indexer[index].indexOf(displaycell) > -1)
                return index;
        return undefined;
    }
    /**
     * Determines whether select on
     * @param index
     */
    onSelect(index) {
        // console.log("onSelectCalled", this.indexer)
        let selectArray = (this.indexer[index]);
        for (let i = 0; i < selectArray.length; i++) {
            const displaycell = selectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element)
                element.setAsSelected();
            if (this.onselect)
                this.onselect(index, displaycell);
        }
    }
    /**
     * Determines whether unselect on
     * @param index
     */
    onUnselect(index) {
        let unSelectArray = (this.indexer[index]);
        for (let i = 0; i < unSelectArray.length; i++) {
            const displaycell = unSelectArray[i];
            let element = displaycell.getComponent("Element_");
            if (element)
                element.setAsUnSelected();
            if (this.onunselect)
                this.onunselect(index, displaycell);
        }
    }
}
Selected.labelNo = 0;
Selected.instances = {};
Selected.activeInstances = {};
Selected.defaults = { indexer: [], getIndexerArray: function (selectedInstance) { return selectedInstance.indexer_; } };
Selected.argMap = {
    string: ["label"],
    function: ["onselect", "onunselect"],
    Array: ["indexer_"],
    number: ["startValue"],
    Pages: ["pages"],
};
/**
 * Pages
 */
class Pages extends Component {
    // retArgs:objectAny;   // <- this will appear
    /**
     * Creates an instance of pages.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let THIS = this;
        Pages.makeLabel(this);
        Pages.instances[this.label] = this;
        if ("DisplayCell" in this.retArgs)
            this.cellArray = this.retArgs["DisplayCell"];
        let index = -1;
        if (this.tree) {
            this.cellArray = [];
            node_.traverse(this.tree.parentTreeNode, function (node) {
                let label = node.Arguments[0];
                let displaycell = DisplayCell.instances[label];
                if (!displaycell)
                    displaycell = I(label);
                let element_ = (node["displaycell"]).getComponent("Element_");
                let i = index;
                element_.addEvents({ onclick: function () { THIS.currentPage = i; } });
                THIS.cellArray.push(displaycell);
                index++;
            });
            this.cellArray.shift();
        }
        Pages.instances[this.label] = this;
    }
    get dim() { return this.dim_; }
    set dim(value) { this.dim_ = value; }
    set currentPage(value) {
        if (value < 0)
            value = 0;
        if (value >= this.cellArray.length)
            value = this.cellArray.length - 1;
        if (value != this.currentPage_) {
            this.currentPage_ = value;
            Render.scheduleUpdate();
            setTimeout(() => { Render.scheduleUpdate(); }, 10);
        }
    }
    get currentPage() { return this.currentPage_; }
    /**
     * Determines whether connect on
     */
    onConnect() {
        let THIS = this;
        this.parentDisplayCell.getdim = function () { return THIS.dim; };
        this.parentDisplayCell.setdim = function (value) { THIS.dim = value; };
    }
    ;
    /**
     * Renders pages
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        let newPage = this.evalFunction(this);
        if (newPage != this.prevPage)
            Render.update(this.cellArray[this.prevPage], true);
        this.currentPage_ = this.prevPage = newPage;
        //console.log("parentDisplayCell", this.parentDisplayCell.label)
        //this.parentDisplayCell.coord.log()
        this.cellArray[this.currentPage].coord.copy(this.parentDisplayCell.coord);
        return [this.cellArray[this.currentPage]];
    }
    ;
}
Pages.labelNo = 0;
Pages.instances = {};
Pages.activeInstances = {};
Pages.defaults = {
    currentPage_: 0, prevPage: 0,
    evalFunction: function (thisPages) { return thisPages.currentPage; }
};
Pages.argMap = {
    string: ["label"],
    function: ["evalFunction"],
    dim: ["dim_"],
    Tree_: ["tree"],
};
Render.register("Pages", Pages);
function P(...Arguments) {
    return new DisplayCell(new Pages(...Arguments));
}
/**
 * Tree
 */
class Tree_ extends Component {
    /**
     * Creates an instance of tree .
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        let THIS = this;
        Tree_.makeLabel(this);
        Tree_.instances[this.label] = this;
        if (this.Css)
            this.css = this.Css.classname;
        if (!this.parentTreeNode)
            this.parentTreeNode = sample();
        this.newNode(this.parentTreeNode);
        if (this.useSelected && this.selected == undefined) {
            let getIndexerArray = function (selectedInstance) {
                return node_.asArray(THIS.parentTreeNode, function (node) { return [node["displaycell"]]; });
            };
            let onselect = function (index, displaycell) {
                let node = (node_.asArray(THIS.parentTreeNode)[index]);
                if (THIS.selectParents) {
                    while (node.ParentNode) {
                        node = node.ParentNode;
                        let displaycell = node["displaycell"];
                        let element = (displaycell.getComponent("Element_"));
                        if (element)
                            element.setAsSelected();
                    }
                }
            };
            let onunselect = function (index, displaycell) {
                if (THIS.selectParents) {
                    let node = (node_.asArray(THIS.parentTreeNode)[index]);
                    while (node.ParentNode) {
                        node = node.ParentNode;
                        let displaycell = node["displaycell"];
                        let element = (displaycell.getComponent("Element_"));
                        if (element)
                            element.setAsUnSelected();
                    }
                }
            };
            this.selected = new Selected(`${this.label}`, this.selectedStartIndex, { getIndexerArray, onselect, onunselect });
        }
    }
    static collapsedSVG(classname = "scrollArrows") {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
    static expandedSVG(classname = "scrollArrows") {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
    }
    static toggleCollapse(el, node, mouseEvent) {
        // console.log(node)
        if (!node.collapsed)
            Tree_.deRenderChildren(node);
        node.collapsed = !node.collapsed;
        Render.scheduleUpdate();
    }
    static deRenderChildren(parentNode) {
        for (let index = 0; index < parentNode.children.length; index++) {
            let node = parentNode.children[index];
            node_.traverse(node, function (node) {
                Render.update(node["rendercell"], true);
            });
        }
    }
    /**
     * Icons tree
     * @param node
     * @returns
     */
    static icon(node) {
        return (node.children.length) ? ((node.collapsed) ? Tree_.collapsedSVG() : Tree_.expandedSVG()) : "";
    }
    /**
     * News node
     * @param node
     */
    newNode(node) {
        let THIS = this;
        let argMap = {
            string: ["label"],
            DisplayCell: ["displaycell"],
        };
        node_.traverse(node, function (node) {
            node.retArgs = Arguments_.argumentsByType(node.Arguments);
            Arguments_.modifyClassProperties(Arguments_.retArgsMapped({}, node, { argMap }), node);
            // if (node["DisplayCell"]) alert("told ya so!");
            if (!node["displaycell"])
                node["displaycell"] = I(node.label + Tree_.extension, node.label);
            let displaycell = (node["displaycell"]);
            let element = displaycell.getComponent("Element_");
            if (!element.css && THIS.css)
                element.css = THIS.css;
            if (THIS.events)
                element.addEvents(THIS.events);
            displaycell.coord.hideWidth = true;
            let icon = I(`${node.label}_icon`, `${THIS.height}px`, Tree_.pointerCss, Tree_.icon(node), events({ onclick: function (e) { Tree_.toggleCollapse(this.parentElement, node, e); } }), (el) => Tree_.icon(node));
            node["iconElement_"] = icon.getComponent("Element_");
            node["rendercell"] = h(`${THIS.label}_rendercell`, icon, displaycell);
        });
        this.parentTreeNode = node;
    }
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender, node, zindex) {
        this.displayHeight = (this.topMargin + this.parentTreeNode.length() * this.height) - this.parentDisplayCell.coord.y;
        return undefined;
    }
    ;
    /**
     * Renders tree
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        let THIS = this;
        let returnDisplayCellArray = [];
        let PDCoord = this.parentDisplayCell.coord;
        let xWithoutIndent = PDCoord.x + this.sideMargin - this.offsetx;
        let y = PDCoord.y + this.topMargin - this.offsety;
        let scheduleUpdate = true;
        this.displayWidth = 0;
        node_.traverse(this.parentTreeNode, function (node) {
            if (node != THIS.parentTreeNode) {
                let rendercell = node["rendercell"];
                if (rendercell) {
                    let x = xWithoutIndent + node.depth(-2) * THIS.indent;
                    rendercell.coord.copy(PDCoord, x, y, PDCoord.x + PDCoord.width - x, THIS.height, zindex);
                    returnDisplayCellArray.push(rendercell);
                }
                y += THIS.height;
                let el = Element_.elExists(node.label + Tree_.extension);
                if (el) {
                    scheduleUpdate = false;
                    let bound = el.getBoundingClientRect();
                    if (bound.x + bound.width - PDCoord.x > THIS.displayWidth)
                        THIS.displayWidth = bound.x + bound.width - PDCoord.x;
                }
            }
        }, (node) => !node.collapsed);
        if (("ScrollBar" in Render.classes)) {
            // vertical first
            if (y > PDCoord.y + PDCoord.height) {
                if (!this.scrollbarv) {
                    this.scrollbarv = scrollbar(this.label + "_ScrollBarV", false);
                    this.parentDisplayCell.addComponent(this.scrollbarv);
                }
                this.offsety = this.scrollbarv.update(y, PDCoord.y + PDCoord.height);
            }
            else {
                if (this.scrollbarv) {
                    this.scrollbarv.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar", this.label + "_ScrollBarV");
                    this.scrollbarv = undefined;
                }
            }
            // horizontal first
            if (this.displayWidth > this.parentDisplayCell.coord.width) {
                if (!this.scrollbarh) {
                    this.scrollbarh = scrollbar(this.label + "_ScrollBarH", true);
                    this.parentDisplayCell.addComponent(this.scrollbarh);
                }
                this.offsetx = this.scrollbarh.update(this.displayWidth, this.parentDisplayCell.coord.width);
            }
            else {
                if (this.scrollbarh) {
                    this.scrollbarh.delete();
                    this.parentDisplayCell.deleteComponent("ScrollBar", this.label + "_ScrollBarH");
                    this.scrollbarh = undefined;
                }
            }
        }
        if (scheduleUpdate)
            Render.scheduleUpdate();
        return returnDisplayCellArray;
    }
    ;
    delete() { }
}
Tree_.labelNo = 0;
Tree_.instances = {};
Tree_.activeInstances = {};
Tree_.defaults = { collapsedIcon: Tree_.collapsedSVG(), expandedIcon: Tree_.expandedSVG(),
    indent: 10, topMargin: 0, sideMargin: 0, height: 20, offsetx: 0, offsety: 0,
    useSelected: true, selectedStartIndex: 0, selectParents: true, cascadeCollapse: true };
Tree_.argMap = {
    string: ["label"],
    node_: ["parentTreeNode"],
    DisplayCell: ["parentDislayCell"],
    boolean: ["useSelected"],
};
Tree_.scrollArrowsSVGCss = css(`scrollArrows`, `stroke: black;`, `fill: white;`, { type: "llm" });
Tree_.extension = "_TreeNode";
Tree_.pointerCss = css("justpointer", "cursor:pointer");
Render.register("Tree_", Tree_);
/**
 * Context
 */
class Context extends Component {
    // retArgs:objectAny;   // <- this will appear
    /**
     * Creates an instance of context.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Context.makeLabel(this);
        Context.instances[this.label] = this;
        if (!this.contextNode)
            this.contextNode = sample();
        this.build();
    }
    /**
     * Builds context
     */
    build() {
        let THIS = this;
        let displaycells = [];
        for (let index = 0; index < this.contextNode.children.length; index++) {
            let childNode = this.contextNode.children[index];
            let retArgs = Arguments_.argumentsByType(childNode.Arguments);
            let label = ("string" in retArgs) ? retArgs["string"][0] : undefined;
            let displaycell = ("DisplayCell" in retArgs) ? retArgs["DisplayCell"][0] : undefined;
            let function_ = ("function" in retArgs) ? retArgs["function"][0] : undefined;
            if (!label && displaycell)
                label = displaycell.label;
            displaycell = (displaycell) ? displaycell : I(`${this.label}_${label}`, label, Context.Css);
            let onclick = (THIS.onclick) ? (e) => { Context.popAll(); THIS.onclick(e, displaycell, childNode); }
                : (e) => { Context.popAll(); };
            if (function_) {
                displaycell.addEvents({ onclick: function_ });
                if (THIS.onclick && !this.newFunctionReplacesold)
                    displaycell.addEvents({ onclick });
            }
            else {
                displaycell.addEvents({ onclick });
            }
            if (childNode.children.length)
                displaycell.addComponent(context(`${childNode.label}_context`, "onmouseover", false, childNode, this.onclick));
            childNode["displaycell"] = displaycell;
            displaycells.push(displaycell);
        }
        this.displaygroup = new DisplayGroup(`${this.label}_ContextV`, false, ...displaycells);
        this.displaycell = new DisplayCell(this.displaygroup);
    }
    /**
     * Contexts on mouse move
     * @param event
     * @returns
     */
    static ContextOnMouseMove(event) {
        let X = event.clientX, Y = event.clientY;
        let length = Context.activeInstanceArray.length;
        let topInstance = Context.activeInstanceArray[length - 1];
        let valid = ((topInstance.parentDisplayCell.coord.isPointIn(X, Y) && (length > 1 || !topInstance.byPoint))
            || topInstance.displaycell.coord.isPointIn(X, Y));
        if (!valid)
            topInstance.pop();
        return Context.activeInstanceArray.length;
    }
    /**
     * Pops all
     * @param [keepFunction]
     */
    static popAll(keepFunction = false) {
        while (Context.activeInstanceArray.length)
            Context.activeInstanceArray[Context.activeInstanceArray.length - 1].pop(keepFunction);
    }
    /**
     * Pops context
     * @param [keepFunction]
     */
    pop(keepFunction = false) {
        // console.log("pop")
        let index = Context.activeInstanceArray.indexOf(this);
        if (index != -1) {
            Render.update(this.displaycell, true);
            this.isShown = false;
            Context.activeInstanceArray.splice(index, 1);
            if (Context.activeInstanceArray.length == 0 && !keepFunction)
                window.onmousemove = FunctionStack.pop(window.onmousemove, "ContextOnMouseMove");
        }
    }
    /**
     * Launchs context
     * @param [event]
     */
    launchContext(event = undefined) {
        // console.log("launch")
        event.preventDefault();
        let length = Context.activeInstanceArray.length;
        if (length) {
            if (this.contextNode.root() != Context.activeInstanceArray[0].contextNode.root())
                Context.popAll(true);
            else {
                let lastContextInstance = Context.activeInstanceArray[length - 1];
                if (this.contextNode.depth() <= lastContextInstance.contextNode.depth())
                    lastContextInstance.pop();
            }
        }
        else
            window.onmousemove = FunctionStack.push(window.onmousemove, Context.ContextOnMouseMove);
        Context.activeInstanceArray.push(this);
        this.launchEvent = event;
        this.isShown = true;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        let eventObject = {};
        eventObject[this.eventType] = this.launchContext.bind(this);
        this.parentDisplayCell.addEvents(eventObject);
    }
    ;
    /**
     * Sets coord
     * @param [Pcoord]
     * @param [event]
     */
    setCoord(Pcoord = this.parentDisplayCell.coord, event = this.launchEvent) {
        let Dcoord = this.displaycell.coord;
        let Mcoord = Handler.ScreenSizeCoord;
        let x = (this.byPoint) ? this.launchEvent.clientX - Context.pointOffset : ((this.toTheRight) ? Pcoord.x + Pcoord.width : Pcoord.x);
        let y = (this.byPoint) ? this.launchEvent.clientY - Context.pointOffset : ((this.toTheRight) ? Pcoord.y : Pcoord.y + Pcoord.height);
        let width = this.width;
        let height = this.displaygroup.children.length * this.height;
        if (y + height > Mcoord.y + Mcoord.height)
            height = Mcoord.y + Mcoord.height - y;
        this.displaycell.coord.copy(Mcoord, x, y, width, height);
    }
    /**
     * Renders context
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        if (this.isShown) {
            this.setCoord();
            return [this.displaycell];
        }
        return undefined;
    }
    ;
}
Context.Css = css("ContextCss", `color:black;background:white`, `color:white;background:black:cursor:pointer`);
Context.labelNo = 0;
Context.instances = {};
Context.activeInstances = {};
Context.defaults = { width: 150, height: 20, isShown: false, byPoint: true,
    eventType: "oncontextmenu", toTheRight: true, newFunctionReplacesold: false };
Context.argMap = {
    string: ["label", "eventType"],
    node_: ["contextNode"],
    number: ["width", "height"],
    boolean: ["byPoint", "toTheRight"],
    function: ["onclick"],
};
Context.pointOffset = 5;
Context.activeInstanceArray = [];
function context(...Arguments) { return new Context(...Arguments); }
Render.register("Context", Context);
/**
 * Modal
 */
class Modal extends Component {
    /**
     * Creates an instance of modal.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        Modal.makeLabel(this);
        Modal.instances[this.label] = this;
        if (!this.handler)
            this.handler = new Handler(`${this.label}_handler`, false, this.rootDisplayCell, new Coord());
        if (!this.handler.coord)
            this.handler.coord = new Coord();
        if (this.handler.parentDisplayCell)
            this.parentDisplayCell = this.handler.parentDisplayCell;
        else
            this.parentDisplayCell = new DisplayCell(this.label).addComponent(this.handler);
        this.parentDisplayCell.addComponent(this);
        if (this.startCoord) {
            this.sizer.width = this.startCoord.width;
            this.sizer.height = this.startCoord.height;
        }
        if ("number" in this.retArgs)
            this.sizer = this.evalNumbers(this.retArgs["number"]);
    }
    /**
     * Determines whether down on
     */
    static onDown() {
        let THIS = this;
        window.dispatchEvent(new CustomEvent('ModalStartDrag', { detail: THIS }));
        Modal.movingInstace = THIS;
        Modal.x = THIS.coord.x;
        Modal.y = THIS.coord.y;
    }
    /**
     * Determines whether move on
     * @param mouseEvent
     * @param offset
     */
    static onMove(mouseEvent, offset) {
        let THIS = this;
        THIS.coord.x = Modal.x + offset.x;
        THIS.coord.y = Modal.y + offset.y;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether up on
     * @param mouseEvent
     * @param offset
     */
    static onUp(mouseEvent, offset) {
        let THIS = this;
        Modal.movingInstace = undefined;
        Modal.x = undefined;
        Modal.y = undefined;
        window.dispatchEvent(new CustomEvent('ModalDropped', { detail: THIS }));
    }
    get coord() { return this.handler.coord; }
    /**
     * Evals numbers
     * @param numbers
     * @returns numbers
     */
    evalNumbers(numbers) {
        let qty = numbers.length;
        let sizer = {};
        sizer.width = numbers[0];
        if (qty > 1)
            sizer.height = numbers[1];
        if (qty > 2)
            sizer.minWidth = numbers[2];
        if (qty > 3)
            sizer.minHeight = numbers[3];
        if (qty > 4)
            sizer.maxWidth = numbers[4];
        if (qty > 5)
            sizer.maxHeight = numbers[5];
        return sizer;
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        if (this.startCoord)
            this.handler.coord.copy(this.startCoord);
        else {
            let ssCoord = Handler.ScreenSizeCoord;
            let width = (this.sizer.width) ? this.sizer.width : Math.round(ssCoord.width / 3);
            let height = (this.sizer.height) ? this.sizer.height : Math.round(ssCoord.height / 3);
            let x = Math.round((ssCoord.width - width) / 2);
            let y = Math.round((ssCoord.height - height) / 2);
            this.coord.assign(x, y, width, height, 0, 0, ssCoord.width, ssCoord.height);
        }
    }
    ;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender, node, zindex) {
        if (this.sizer.minWidth && !this.stretch)
            this.stretch = new Stretch(this);
        let ssCoord = Handler.ScreenSizeCoord;
        if (this.coord.x2 > ssCoord.width)
            this.coord.x -= (this.coord.x2 - ssCoord.width);
        if (this.coord.y2 > ssCoord.height)
            this.coord.y -= (this.coord.y2 - ssCoord.height);
        if (this.coord.x < 0)
            this.coord.x = 0;
        if (this.coord.y < 0)
            this.coord.y = 0;
        this.coord.within.width = ssCoord.width;
        this.coord.within.height = ssCoord.height;
        return undefined;
    }
    ;
    /**
     * Renders modal
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        return this.children;
    }
    ;
    /**
     * Gets child
     * @param label
     * @returns
     */
    getChild(label) {
        for (let index = 0; index < this.children.length; index++)
            if (this.children[index].label == label)
                return this.children[index];
        return undefined;
    }
    /**
     * Shows modal
     */
    show() {
        if (!Handler.activeInstances[this.handler.label]) {
            Handler.activeInstances[this.handler.label] = this.handler;
            Render.scheduleUpdate();
        }
    }
    /**
     * Hides modal
     * @param [event]
     */
    hide(event = undefined) {
        if (Handler.activeInstances[this.handler.label]) {
            Render.update(Handler.activeInstances[this.handler.label], true);
            delete Handler.activeInstances[this.handler.label];
        }
    }
    /**
     * Determines whether shown is
     * @returns
     */
    isShown() { return (Handler.activeInstances[this.handler.label]) ? true : false; }
    /**
     * Drags with
     * @param displaycells
     */
    dragWith(...displaycells) {
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            const displaycell = displaycells[index];
            let element = displaycell.getComponent("Element_");
            // console.log(element)
            element.addEvents({ ondrag: [Modal.onDown.bind(THIS), Modal.onMove.bind(THIS), Modal.onUp.bind(THIS)] });
        }
    }
    /**
     * Closes with
     * @param displaycells
     */
    closeWith(...displaycells) {
        let THIS = this;
        for (let index = 0; index < displaycells.length; index++) {
            displaycells[index].addEvents({ onclick: THIS.hide.bind(THIS) });
        }
    }
}
Modal.labelNo = 0;
Modal.instances = {};
Modal.activeInstances = {};
Modal.closeCss = css("closeCss", `-moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;
                                    border: 1px solid black;background:white;`);
Modal.closeSVGCss = css(`closeIcon`, `stroke: black;background:white`, `stroke: white;background:red`);
Modal.closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
   </svg>`;
Modal.defaults = { sizer: {} };
Modal.argMap = {
    string: ["label"],
    DisplayCell: ["rootDisplayCell"],
    Coord: ["startCoord"],
    Handler: ["handler"],
};
/**
 * Win modal
 */
class winModal extends Base {
    /**
     * Creates an instance of win modal.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        winModal.makeLabel(this);
        winModal.instances[this.label] = this;
        this.build();
        this.modal = new Modal(`${this.label}`, (this.suppliedHandler) ? this.suppliedHandler : this.fullDisplayCell);
        this.modal.dragWith(this.titleDisplayCell);
        this.modal.closeWith(this.closeDisplayCell);
        if (this.onclose)
            this.closeDisplayCell.addEvents({ onclick: this.onclose });
        if ("number" in this.retArgs)
            this.modal.evalNumbers(this.retArgs["number"]);
        if (this["sizer"]) {
            this.modal.sizer = this["sizer"];
            delete this["sizer"];
        }
        this.show();
    }
    get parentDisplayCell() { return this.modal.parentDisplayCell; }
    set parentDisplayCell(value) { this.modal.parentDisplayCell = value; }
    show() { this.modal.show(); }
    hide() { this.modal.hide(); }
    /**
     * Builds win modal
     */
    build() {
        this.titleDisplayCell = I(`${this.label}_titleCell`, this.titleText, winModal.titleCss);
        this.closeDisplayCell = I(`${this.label}_closeIcon`, winModal.closeSVG, `${this.headerHeight}px`);
        this.headerDisplayCell = h(`${this.label}_header`, `${this.headerHeight}px`, this.titleDisplayCell, this.closeDisplayCell);
        if (!this.bodyDisplayCell)
            this.bodyDisplayCell = I(`${this.label}_body`, this.innerHTML, winModal.whiteBGCss);
        if (this.suppliedHandler) {
            this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.suppliedHandler.parentDisplayCell);
        }
        else
            this.fullDisplayCell = v(`${this.label}_full`, this.headerDisplayCell, this.bodyDisplayCell);
    }
}
winModal.labelNo = 0;
winModal.instances = {};
winModal.activeInstances = {};
winModal.defaults = { headerHeight: 20, titleText: "My Title", innerHTML: "Body" };
winModal.argMap = {
    string: ["label", "titleText", "innerHTML"],
    DisplayCell: ["bodyDisplayCell"],
    function: ["onclose"],
    Handler: ["suppliedHandler"],
};
winModal.titleCss = css(`titleCss`, `background:#00CED1;cursor:pointer;text-align: center;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`, { type: "llm" });
winModal.closeSVGCss = css(`closeIcon`, `stroke: black;background:white;box-sizing: border-box;
    -moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: 1px solid black;`, `stroke: white;background:red`, { type: "llm" });
winModal.closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
      </svg>`;
winModal.whiteBGCss = css(`whiteBGCss`, `background:white;box-sizing: border-box;-moz-box-sizing: border-box;
                                            -webkit-box-sizing: border-box;border: 1px solid black;`);
/**
 * Stretch
 */
class Stretch extends Component {
    /**
     * Creates an instance of stretch.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.children = [];
        this.buildBase(...Arguments);
        Stretch.makeLabel(this);
        Stretch.instances[this.label] = this;
        this.build();
        if (this.modal)
            this.modal.children.push(this);
        this.parentDisplayCell = this.modal.parentDisplayCell;
    }
    static setStart(e) {
        let THIS = this;
        Stretch.startDrag.copy(THIS.modal.coord);
    }
    static updateCoord(modal, x, y, w, h, offset) {
        let sd = Stretch.startDrag, mc = modal.coord, ms = modal.sizer;
        mc.x = sd.x + offset.x * x;
        mc.width = sd.width + offset.x * w;
        mc.y = sd.y + offset.y * y;
        mc.height = sd.height + offset.y * h;
        if (mc.width < ms.minWidth)
            mc.width = ms.minWidth;
        if (mc.width > ms.maxWidth)
            mc.width = ms.maxWidth;
        if (mc.height < ms.minHeight)
            mc.height = ms.minHeight;
        if (mc.height > ms.maxHeight)
            mc.height = ms.maxHeight;
        Render.scheduleUpdate();
    }
    ;
    static ulDrag(e, offset) { Stretch.updateCoord(this["modal"], 1, 1, -1, -1, offset); }
    static urDrag(e, offset) { Stretch.updateCoord(this["modal"], 0, 1, 1, -1, offset); }
    static llDrag(e, offset) { Stretch.updateCoord(this["modal"], 1, 0, -1, 1, offset); }
    static lrDrag(e, offset) { Stretch.updateCoord(this["modal"], 0, 0, 1, 1, offset); }
    /**
     * Builds stretch
     */
    build() {
        this.upperLeft = I(`${this.label}_ul`, Stretch.CssNW, events({ ondrag: [Stretch.setStart.bind(this), Stretch.ulDrag.bind(this)] }));
        this.upperRight = I(`${this.label}_ur`, Stretch.CssNE, events({ ondrag: [Stretch.setStart.bind(this), Stretch.urDrag.bind(this)] }));
        this.lowerLeft = I(`${this.label}_ll`, Stretch.CssNE, events({ ondrag: [Stretch.setStart.bind(this), Stretch.llDrag.bind(this)] }));
        this.lowerRight = I(`${this.label}_lr`, Stretch.CssNW, events({ ondrag: [Stretch.setStart.bind(this), Stretch.lrDrag.bind(this)] }));
    }
    /**
     * Determines whether connect on
     */
    onConnect() {
        console.log("STretch Connected");
    }
    ;
    /**
     * Pre render
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    preRender(derender, node, zindex) {
        //console.log("Stretch Pre-Render");
        return undefined;
    }
    ;
    /**
     * Renders stretch
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        if (this.parentDisplayCell) {
            let z = -(zindex + Render.zindexIncrement * 10);
            let PDCoord = this.parentDisplayCell.coord;
            this.upperLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.upperRight.coord.copy(PDCoord, PDCoord.x2 - Stretch.pixelSize, PDCoord.y, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerLeft.coord.copy(PDCoord, PDCoord.x, PDCoord.y2 - Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z);
            this.lowerRight.coord.copy(PDCoord, PDCoord.x2 - Stretch.pixelSize, PDCoord.y2 - Stretch.pixelSize, Stretch.pixelSize, Stretch.pixelSize, z);
            return [this.upperRight, this.upperLeft, this.lowerLeft, this.lowerRight];
        }
        return undefined;
    }
    ;
}
Stretch.labelNo = 0;
Stretch.instances = {};
Stretch.activeInstances = {};
Stretch.defaults = {};
Stretch.argMap = {
    Modal: ["modal"],
};
Stretch.CssNE = css("CssNE", `cursor:ne-resize`);
Stretch.CssNW = css("CssNW", `cursor:nw-resize`);
Stretch.pixelSize = 10;
Stretch.startDrag = new Coord();
/**
 * Drag bar
 */
class DragBar extends Component {
    /**
     * Creates an instance of drag bar.
     * @param Arguments
     */
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        DragBar.makeLabel(this);
        DragBar.instances[this.label] = this;
        DragBar.instances[this.label] = this;
    }
    /**
     * Parents display group
     * @param THIS
     * @returns display group
     */
    static parentDisplayGroup(THIS) {
        let node = THIS.parentDisplayCell.node;
        let prev;
        do {
            prev = node;
            node = node.ParentNode;
        } while (node != undefined && Arguments_.typeof(node.Arguments[1]) != "DisplayGroup");
        THIS.parentDisplayGroupChild = prev.Arguments[1];
        let displaygroup = node.Arguments[1];
        return (node) ? [node.Arguments[1], (displaygroup.children.indexOf(THIS.parentDisplayCell) == displaygroup.children.length - 1)]
            : [undefined, undefined];
    }
    /**
     * Determines whether down on
     * @param e
     */
    static onDown(e) {
        let THIS = this;
        DragBar.dragStartDim = pf.pxAsNumber(THIS.parentDisplayGroupChild.dim);
    }
    /**
     * Determines whether move on
     * @param e
     * @param offset
     */
    static onMove(e, offset) {
        let THIS = this;
        let newdim = DragBar.dragStartDim + (((THIS.isHor) ? offset.x : offset.y) * ((THIS.isLast) ? -1 : 1));
        if (newdim > THIS.max)
            newdim = THIS.max;
        if (newdim < THIS.min)
            newdim = THIS.min;
        THIS.parentDisplayGroupChild.dim = `${newdim}px`;
        Render.scheduleUpdate();
    }
    /**
     * Determines whether up on
     * @param e
     * @param offset
     */
    static onUp(e, offset) { DragBar.dragStartDim = undefined; }
    get isHor() { return this.parentDisplayGroup.isHor; }
    /**
     * Renders drag bar
     * @param derender
     * @param node
     * @param zindex
     * @returns render
     */
    Render(derender, node, zindex) {
        if (!this.parentDisplayGroup) {
            [this.parentDisplayGroup, this.isLast] = DragBar.parentDisplayGroup(this);
            // console.log(this.label, this.isLast)
            if (this.parentDisplayGroup.margin > 2)
                this.width = this.parentDisplayGroup.margin;
        }
        if (!this.dragbarDisplayCell)
            this.dragbarDisplayCell = I(`${this.label}_Dragbar`, (this.isHor) ? DragBar.horCss : DragBar.verCss);
        this.dragbarDisplayCell.addEvents({ ondrag: [DragBar.onDown.bind(this), DragBar.onMove.bind(this), DragBar.onUp.bind(this)] });
        this.children = [this.dragbarDisplayCell];
        let PDcoord = this.parentDisplayCell.coord;
        let PDG = this.parentDisplayGroup;
        let x = (this.isHor) ? ((this.isLast) ? PDcoord.x - PDG.margin
            : PDcoord.x2 + PDG.margin - this.width)
            : PDcoord.x;
        let y = (this.isHor) ? PDcoord.y
            : ((this.isLast) ? PDcoord.y - PDG.margin
                : PDcoord.y2 + PDG.margin - this.width);
        let width = (this.isHor) ? this.width : PDcoord.width;
        let height = (this.isHor) ? PDcoord.height : this.width;
        this.dragbarDisplayCell.coord.copy(PDG.parentDisplayCell.coord, x, y, width, height);
        return [this.dragbarDisplayCell];
    }
    ;
}
DragBar.labelNo = 0;
DragBar.instances = {};
DragBar.activeInstances = {};
DragBar.defaults = { width: 5 };
DragBar.argMap = {
    string: ["label"],
    number: ["min", "max", "width"],
};
DragBar.horCss = css("db_hor", "background-color:black;cursor: ew-resize;");
DragBar.verCss = css("db_ver", "background-color:black;cursor: ns-resize;");
let dragbar = function (...Arguments) { return new DragBar(...Arguments); };
Render.register("DragBar", DragBar);
