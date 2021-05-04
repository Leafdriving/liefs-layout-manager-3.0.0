/**
 * Node - A basic Tree Object.  Node by itself doesn't do much.
 * It purpose is determined by its parent, usually a Tree_ Object
 */
class node_ extends Base {
    static labelNo = 0;
    static instances:{[key: string]: node_;} = {};
    static activeInstances:{[key: string]: node_;} = {};
    static defaults = {collapsed:false}
    static argMap:objectStringArray = {
        string : ["label"],
    }
    /**
     * New node - Used Interally
     * @param THIS 
     * @param Arguments 
     * @returns  
     */
    static newNode(THIS:node_, ...Arguments:any){
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
    static asArray(node:node_, traverseFunction:(node:node_)=>any = function(node){return node}): any[] {
        let returnArray:any[] = [];
        node_.traverse(node, function(node:node_){returnArray.push( traverseFunction(node) )});
        return returnArray;
    }
    /**
     * Traverses node 
     * @param node - parent starting node
     * @param traverseFunction - what to do on each iteration
     * @param [traverseChildren] - Boolean Return - Traverse this Child?
     * @param [traverseNode] - Boolean Return - Traverse this Node?
     */
    static traverse(node:node_, traverseFunction:(node: node_) => void,
            traverseChildren:(node: node_)=>boolean = function(){return true},
            traverseNode:(node: node_)=>boolean = function(){return true}) {
        if (traverseNode(node)) {
            traverseFunction(node);                
            if (traverseChildren(node))
                if (node.children)
                    for (let index = 0; index < node.children.length; index++)
                        node_.traverse(node.children[index], traverseFunction,
                                            traverseChildren,
                                            traverseNode);
        }
    }
    label:string;
    Arguments:any;
    ParentNodeTree: any;  /* Tree_  */
    ParentNode:node_ = undefined;

    /**
     * Gets previous sibling
     */
    get PreviousSibling() {
        if (!this.ParentNode) return undefined;
        let index = this.ParentNode.children.indexOf(this);
        return (index > 0) ? this.ParentNode.children[index-1] : undefined}
    set PreviousSibling(newNode:node_) {
        if (this.ParentNode) {
            let index = this.ParentNode.children.indexOf(this);
            this.ParentNode.children.splice(index, 0, newNode);
        }
    }
    /**
     * Gets next sibling
     */
    get NextSibling() {
        if (!this.ParentNode) return undefined;
        let index = this.ParentNode.children.indexOf(this);
        return (index > -1 && index < this.ParentNode.children.length-1) ? this.ParentNode.children[index + 1] : undefined
    }
    set NextSibling(newNode:node_) {
        if (this.ParentNode) {
            let index = this.ParentNode.children.indexOf(this);
            this.ParentNode.children.splice(index + 1, 0, newNode);
        }
    }
    /**
     * Collapsed  true if node is collapsed
     */
    collapsed: boolean;
    children:node_[] = [];
    /**
     * Creates an instance of node .
     * @param Arguments 
     */
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        this.Arguments = Arguments;
        if (!this.label) node_.makeLabel(this);
    }
    /**
     * Depth - returns number of steps up parent, to reach the root
     * @param [deep] 
     * @returns  
     */
    depth(deep=0){
        let node = <node_>this;
        while(node){
            deep += 1;
            node = node.parent();
        };
        return deep;
    }
    /**
     * Length - returns number of node children (Recursive)
     * @param [count] 
     * @returns  
     */
    length(count = -1){
        node_.traverse(this, function(node:node_){count++});
        return count;
    }
    /**
     * Create New Child Node.
     * Either a) Fill node.Arguements Array or
     * b) insert type node here.
     * @param Arguments 
     * @returns child 
     */
    newChild(...Arguments:any): node_{
        let newNode:node_;
        if (typeof(Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            newNode = <node_>(Arguments[0]);
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
    newSibling(...Arguments:any): node_ {
        let newNode:node_;
        if (typeof(Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            newNode = <node_>(Arguments[0]);
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
    pop(){
        this.ParentNode.children.splice(this.ParentNode.children.indexOf(this), 1);
        this.ParentNode = undefined;
        return this;
    }
    /**
     * Done - returns ParentNodeTree
     * @returns  
     */
    done(){return this.ParentNodeTree}
    /**
     * Return Root Node Of Tree
     * @returns  
     */
    root(){
        let node:node_ = this;
        while(node.parent()){node = node.parent()}
        return node;
    }
    /**
     * Returns Parent of Current Node 
     * @returns  
     */
    parent(){return this.ParentNode}
    /**
     * Logs node to console.  set (true) to get full node objects as well
     * @param [showNode] 
     */
    log(showNode:boolean = false){
        if (this.children.length) {
            console.groupCollapsed(this.label);
            if (showNode) console.log(this)
            for (let index = 0; index < this.children.length; index++) 
                this.children[index].log(showNode);
            console.groupEnd();
        } else {
            if (showNode) {
                console.groupCollapsed(this.label);
                console.log(this)
                console.groupEnd();
            } else console.log(this.label)
        }
    }
}
// Sample Node Provided in Source
function sample(){
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
        .newSibling("Three")
    return node;
}
