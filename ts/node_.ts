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
        newnode.ParentNodeTree = THIS.ParentNodeTree;
        if (THIS.ParentNodeTree) THIS.ParentNodeTree.onNodeCreation(newnode);
        return newnode;
    }
    renderx:number;
    rendery:number;
    retArgs:ArgsObj;   // <- this will appear
    label:string;
    Arguments:any;

    ParentNodeTree: Tree_ = undefined;
    ParentNode:node_ = undefined;
    PreviousSibling:node_ = undefined;
    NextSibling:node_ = undefined;
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
    siblingObject(top:node_ = this, returnObject = {}){
        while (top.PreviousSibling) {top = top.PreviousSibling}
        do {
            returnObject[top.label] = top
            top = top.NextSibling
        } while (top);
        return returnObject;
    }
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
        let previousNextSibling = this.NextSibling;
        if (typeof(Arguments[0]) == "object" && Arguments[0].constructor.name == "node_")
            this.NextSibling = <node_>(Arguments[0]);
        else
            this.NextSibling = node_.newNode(this, ...Arguments);
        this.NextSibling.ParentNodeTree = this.ParentNodeTree;
        this.NextSibling.PreviousSibling = this;
        this.NextSibling.ParentNode = this.ParentNode;

        this.NextSibling.NextSibling = previousNextSibling;
        return this.NextSibling;
    }
    topSibling(){
        let returnNode:node_ = this;
        while (returnNode.previousSibling()) returnNode = returnNode.previousSibling()
        return returnNode;
    }
    bottomSibling(){
        let returnNode:node_ = this;
        while (returnNode.nextSibling()) returnNode = returnNode.nextSibling()
        return returnNode;        
    }
    pop(){
        let index = this.ParentNode.children.indexOf(this);
        this.ParentNode.children.splice(index, 1);
        if (this.PreviousSibling) {
            this.PreviousSibling.NextSibling = this.NextSibling;
            if (this.NextSibling)
                this.NextSibling.PreviousSibling = this.PreviousSibling;
        } else if (this.NextSibling) this.NextSibling.PreviousSibling = undefined;
        this.PreviousSibling = this.NextSibling = this.ParentNode = undefined;
        return this;
    }
    nextSibling(){return this.NextSibling}
    previousSibling(){return this.PreviousSibling}
    firstChild(){return this.children[0]}
    done(){return this.ParentNodeTree}
    root(){
        let node:node_ = this;
        while(node.parent()){node = node.parent()}
        return node
    }
    parent(){return this.ParentNode}
    // collapse(value:boolean = true){this.collapsed = value;}
    log(){
        if (this.children.length) {
            console.group(this.label);
            for (let index = 0; index < this.children.length; index++) 
                this.children[index].log();
            console.groupEnd();
        } else console.log(this.label);
        if (this.NextSibling) this.NextSibling.log();
    }
    byLabel(label:string){return node_.byLabel(label);}
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
