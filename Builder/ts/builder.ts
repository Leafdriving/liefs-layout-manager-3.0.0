class Builder extends Base {
    static labelNo = 0;
    static instances:Builder[] = [];
    static activeInstances:Builder[] = [];
    static defaults = {
    }
    static argMap = {
        string : ["label"],
    }
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Builder.makeLabel(this);
    }
    static nodeTree:Tree_ = new Tree_('Handlers');
    static makeHandlerTree(){
        let node = Builder.nodeTree.rootNode;
        for (let index = 1; index < Handler.activeInstances.length; index++) {
            const handler = Handler.activeInstances[index];
            node = node.newSibling(handler.label, handler);
            Builder.makeDisplayCell(node, handler.rootCell);
        }
    }
    static makeDisplayCell(node:node_, displaycell:DisplayCell){
        if (displaycell.htmlBlock) node.newChild(displaycell.htmlBlock.label, displaycell.htmlBlock);
        if (displaycell.pages) {
            let pagenode = node.newChild(displaycell.pages.label, displaycell.pages);
            for (let index = 0; index < displaycell.pages.displaycells.length; index++)
                Builder.makeDisplayCell(pagenode, displaycell.pages.displaycells[index]);
        }
        if (displaycell.displaygroup) {
            let groupnode = node.newChild(displaycell.displaygroup.label, displaycell.displaygroup);
            for (let index = 0; index < displaycell.displaygroup.cellArray.length; index++)
                Builder.makeDisplayCell(groupnode, displaycell.displaygroup.cellArray[index]);
        }    
    }
}

// class RenderTree extends Base {
//     static labelNo = 0;
//     static instances:RenderTree[] = [];
//     static activeInstances:RenderTree[] = [];
//     static defaults = {}
//     static argMap = {
//         string : ["label","css"],
//         number: ["height", "indent"],
//         Css: ["css"]
//     }
//     label:string
//     height:number;
//     css:string|Css;
//     indent:number;
//     collapsedSVG:string;
//     expandedSVG:string;
//     // retArgs:ArgsObj;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);

//         RenderTree.makeLabel(this);
//     }
// }