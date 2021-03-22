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
    // static handlerTree:Tree_ = new Tree_('Handlers')
    static makeHandlerTree(){
        let node = new node_();
        for (let index = 0; index < Handler.activeInstances.length; index++) {
            const handler = Handler.activeInstances[index];
            if (handler.label != "Main Window") {
                node = node.newSibling(handler.label, handler);
                Builder.makeDisplayCell(node, handler.rootCell);
            }
        }
        //Builder.handlerTree.newRoot(node);
        // Builder.handlerTree.rootNode = node;
        // Handler.update();
        return node;
    }
    static makeDisplayCell(node:node_, displaycell:DisplayCell){
        if (displaycell.htmlBlock) {
            let htmlnode = node.newChild(displaycell.htmlBlock.label, displaycell.htmlBlock);
            // htmlnode.log();
        }
        if (displaycell.pages) {
            let pagenode = node.newChild(displaycell.pages.label, displaycell.pages);
            // pagenode.log();
            for (let index = 0; index < displaycell.pages.displaycells.length; index++)
                Builder.makeDisplayCell(pagenode, displaycell.pages.displaycells[index]);
        }
        if (displaycell.displaygroup) {
            let groupnode = node.newChild(displaycell.displaygroup.label, displaycell.displaygroup);
            // groupnode.log()
            for (let index = 0; index < displaycell.displaygroup.cellArray.length; index++)
                Builder.makeDisplayCell(groupnode, displaycell.displaygroup.cellArray[index]);
        }    
    }
    static clientHandler: Handler;
    static buildClientHandler() {
        Builder.clientHandler =
            H("Client Window",
                h("Client_h", 5,
                    I("Client_Main1","left", bCss.bgCyan, "1000px"),
                    v("Client_v", 5,
                        I("Client_Top","top", bCss.bgGreen),
                        P("MainPages", "1000px",
                            I("Client_Bottom1","bottom1", bCss.bgBlue),
                            I("Client_Bottom2","bottom2", bCss.bgLight),
                        )
                    )
                ),
                false,
            );
    }
    static mainHandler: Handler;
    static buildMainHandler() {
        // Builder.makeHandlerTree();
        Builder.mainHandler = H("Main Window", 4,
        v("Main_v",
          h("MenuBar", "20px",
            I("MenuBar_File","File", "35px", bCss.menuItem),
            I("MenuBar_Edit","Edit", "35px", bCss.menuItem),
            I("MenuBar_Spacer", "", bCss.menuSpace)
          ),
          v("Main_Dockable", 
            h("Tree_Body", 5,
                tree("HandlerTree",
                    dragbar(I("Main_tree", "300px", bCss.bgLight),50,800),
                    bCss.treeItem,
                    ),
                    bindHandler(I("Main_body"), Builder.clientHandler)
            )
          )
        )
      )

    }
    static updateTree(){
        Tree_.byLabel("HandlerTree").newRoot(Builder.makeHandlerTree());
    }
}

Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
Builder.updateTree()


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