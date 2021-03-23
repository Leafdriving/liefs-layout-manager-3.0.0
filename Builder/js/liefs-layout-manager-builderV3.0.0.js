class bCss {
}
bCss.bgLight = css("bgLight", `background: #dcedf0`);
bCss.bgGreen = css("bgGreen", `background: green;`);
bCss.bgBlue = css("bgBlue", `background: blue;`);
bCss.bgCyan = css("bgCyan", `background: cyan;`);
bCss.bgBlack = css("bgBlack", `background: black;
                                    opacity:0.5;
                                    box-sizing: border-box;
                                    border: 10px solid red;`);
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
bCss.treeItem = css("treeItem", `background: transparent; color:black; cursor:pointer`, `background:DeepSkyBlue;`);
class Builder extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Builder.makeLabel(this);
    }
    // static handlerTree:Tree_ = new Tree_('Handlers')
    static makeHandlerTree() {
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
    static makeDisplayCell(node, displaycell) {
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
    static buildClientHandler() {
        Builder.clientHandler =
            H("Client Window", h("Client_h", 5, I("Client_Main1", "left", bCss.bgCyan, "500px"), I("Client_Main2", "right", bCss.bgCyan, "500px")), false);
    }
    static buildMainHandler() {
        // Builder.makeHandlerTree();
        Builder.mainHandler = H("Main Window", 4, v("Main_v", h("MenuBar", "20px", I("MenuBar_File", "File", "35px", bCss.menuItem), I("MenuBar_Edit", "Edit", "35px", bCss.menuItem), I("MenuBar_Spacer", "", bCss.menuSpace)), dockable(v("Main_Dockable", Builder.TOOLBAR, dockable(h("Tree_Body", 5, tree("HandlerTree", dragbar(I("Main_tree", "300px", bCss.bgLight), 50, 800), bCss.treeItem), bindHandler(I("Main_body"), Builder.clientHandler)))))));
    }
    static updateTree() {
        Tree_.byLabel("HandlerTree").newRoot(Builder.makeHandlerTree());
    }
}
Builder.labelNo = 0;
Builder.instances = [];
Builder.activeInstances = [];
Builder.defaults = {};
Builder.argMap = {
    string: ["label"],
};
Builder.TOOLBAR = toolBar("Main_toolbar", 40, 25, I("toolbarb1", `<button style="width:100%; height:100%">1</button>`), I("toolbarb2", `<button style="width:100%; height:100%">2</button>`), I("toolbarb3", `<button style="width:100%; height:100%">3</button>`));
Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
Builder.updateTree();
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
