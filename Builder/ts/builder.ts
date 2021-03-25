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
        let rootnode = new node_("Handlers");
        for (let index = 0; index < Handler.activeInstances.length; index++) {
            const handler = Handler.activeInstances[index];
            //if (handler.label != "Main Window") {
                let node = rootnode.newChild(handler.label, handler);
                Builder.makeDisplayCell(node, handler.rootCell);
            //}
        }
        //Builder.handlerTree.newRoot(node);
        // Builder.handlerTree.rootNode = node;
        // Handler.update();
        
        //let tree = (<Tree_>Tree_.byLabel("HandlerTree"))
        //tree.rootNode = rootnode;
        //tree.render(undefined, undefined, undefined, false)
        
        return rootnode;
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
                    I("Client_Main1","left", bCss.bgCyan, "500px"),
                    I("Client_Main2","right", bCss.bgCyan, "500px"),
                    // v("Client_v", 5,
                    //     I("Client_Top","top", bCss.bgGreen),
                    //     P("MainPages", "500px",
                    //         I("Client_Bottom1","bottom1", bCss.bgBlue),
                    //         I("Client_Bottom2","bottom2", bCss.bgLight),
                    //     )
                    // )
                ),
                false,
            );
    }
    static onNodeCreation(node:node_){
        let nodeLabel = I(`${node.label}_node`, `${node.label}`,
                            node.ParentNodeTree.css,
                            node.ParentNodeTree.events);
        nodeLabel.coord.hideWidth = true;
        let dataObj = node.Arguments[1];
        let dataObjType = BaseF.typeof(dataObj);
        let typeIcon:string;
        if (dataObjType == "DisplayGroup")
            typeIcon = ( (<DisplayGroup>dataObj).ishor ) ? bCss.horSVG("bookIcon"):bCss.verSVG("bookIcon");
        else
            typeIcon = {
                    Handler:bCss.bookSVG("bookIcon"),
                    HtmlBlock:bCss.htmlSVG("bookIcon"),
                }[dataObjType];
        node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.

                                (node.children.length) ?
                                    I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`,
                                        (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon,
                                        node.ParentNodeTree.iconClass,
                                        events({onclick:function(mouseEvent:MouseEvent){ Tree_.toggleCollapse(this, node,mouseEvent) }})
                                    )
                                :   I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`),

                                I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon),
                                nodeLabel
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
          dockable(v("Main_Dockable",
            Builder.TOOLBAR,
            dockable(h("Tree_Body", 5,
                tree("HandlerTree", Builder.onNodeCreation,
                    dragbar(I("Main_tree", "300px", bCss.bgLight),50,800),
                    bCss.treeItem,
                    //{preRenderCallback: function(){if (!Handler.firstRun)Builder.updateTree()}}
                    ),
                    bindHandler(I("Main_body"), Builder.clientHandler)
            ))
          ))
        )
      )

    }
    static updateTree(){
        Tree_.byLabel("HandlerTree").newRoot(Builder.makeHandlerTree());
    }
    static TOOLBAR = toolBar("Main_toolbar", 40, 25,
        I("toolbarb1",`<button style="width:100%; height:100%">1</button>`),
        I("toolbarb2",`<button style="width:100%; height:100%">2</button>`),
        I("toolbarb3",`<button style="width:100%; height:100%">3</button>`),
    );
}

Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
Builder.updateTree()
// Handler.preRenderCallback = function(){ if (!Handler.firstRun)Builder.updateTree() }


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