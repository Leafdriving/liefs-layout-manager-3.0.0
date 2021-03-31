class node_ extends Base {
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
    static labelNo = 0;
    static instances:Tree_[] = [];
    static activeInstances:Tree_[] = [];
    static defaults = {collapsed:false}
    static argMap:ArgMap = {
        string : ["label"],
    }
    static newNode(THIS:node_, ...Arguments:any){
        let newnode = new node_(...Arguments);
        // console.log(`Createed Node ${newnode.label}`);
        newnode.ParentNodeTree = THIS.ParentNodeTree;
        if (THIS.ParentNodeTree) THIS.ParentNodeTree.onNodeCreation(newnode);
        return newnode;
    }
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
    renderx:number;
    rendery:number;
    retArgs:ArgsObj;   // <- this will appear
    label:string;
    Arguments:any;

    ParentNodeTree: Tree_ = undefined;
    ParentNode:node_ = undefined;

    get PreviousSibling() {let index = this.ParentNode.children.indexOf(this);
        return (index > 0) ? this.ParentNode.children[index-1] : undefined}
    set PreviousSibling(newNode:node_) {
        let index = this.ParentNode.children.indexOf(this);
        this.ParentNode.children.splice(index, 0, newNode);
    }

    get NextSibling() {let index = this.ParentNode.children.indexOf(this);
        return (index > -1 && index < this.ParentNode.children.length-1) ? this.ParentNode.children[index + 1] : undefined}
    set NextSibling(newNode:node_) {
        let index = this.ParentNode.children.indexOf(this);
        this.ParentNode.children.splice(index + 1, 0, newNode);
    }



    collapsed: boolean;
    displaycell:DisplayCell;
    children:node_[] = [];
    // get $(){return node_.Proxy(this)}
    // get node(){return node_.Proxy(this)}
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);
        this.Arguments = Arguments;
    }
    depth(node:node_ = this, deep=0){while(node){deep += 1;node = node.parent()};return deep;}

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
  
    done(){return this.ParentNodeTree}
    root(){
        let node:node_ = this;
        while(node.parent()){node = node.parent()}
        return node
    }
    parent(){return this.ParentNode}
    log(showNode:boolean = false){
        if (this.children.length) {
            console.groupCollapsed(this.label);
            if (showNode) {
                //console.groupCollapsed("node");
                console.log(this)
                //console.groupEnd();
            }
            for (let index = 0; index < this.children.length; index++) 
                this.children[index].log(showNode);
            console.groupEnd();
        } else {
            if (showNode) {
                console.groupCollapsed(this.label);
                //console.groupCollapsed("node");
                console.log(this)
                //console.groupEnd();
                console.groupEnd();
            } else {
                console.log(this.label)
            }
            
        }
    }
    byLabel(label:string){return node_.byLabel(label);}

    static copy(node:node_|Tree_, suffix = "_copy", onNodeCreation:(node:node_, newNode:node_)=>void = function(node,newNode){}) {
        let newNode = new node_(`${node.label}${suffix}`);
        if (BaseF.typeof(node) == "Tree_"){
            node = <node_>((<Tree_>node).rootNode);
            console.log(`node_.copy() was passes a TREE not a node... assuming rootNode`);
        }
        else node = (<node_>node)
        onNodeCreation(node, newNode);
        if (node.children && node.children.length)
            for (let index = 0; index < node.children.length; index++) 
                newNode.newChild( node_.copy(node.children[index], suffix, onNodeCreation) );
        return newNode;
    }
}

function sample(){
    let sampleTree = new Tree_("SampleTree", /*function(node:node_){}*/);
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
        .newSibling("Three")
    return sampleTree;
}
