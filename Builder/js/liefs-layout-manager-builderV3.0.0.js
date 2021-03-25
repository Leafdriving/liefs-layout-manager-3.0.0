class bCss {
    static bookSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(.069039 0 0 .048212 -4.1849 .6616)">
        <path d="m131.75 409.1c-28.8 0-52.1 18.3-52.1 40.4 0 22.6 23.3 40.4 52.1 40.4h278.4c-22.6-24.1-22.6-56.8 0-80.9h-278.4z"/>
        <path d="m120.15 1.9c-23.3 7-40.4 32.7-40.4 63.8v342.2c10.5-9.3 24.9-15.9 40.4-17.9z"/>
        <polygon points="139.95 388.9 410.25 388.9 410.25 0 244.95 0 244.95 99.2 204.85 73.9 164.85 99.2 164.85 0 139.95 0"/>
        </g>
        </svg>`;
    }
    ;
    static htmlSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
        <path d="m7.5329 4.4233-6.5 8.5 6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        <path d="m14.86 4.4367-4.1694 16.41" stroke-linecap="round" stroke-width="2.5"/>
        <path d="m17.467 4.4233 6.5 8.5-6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        </g>
        </svg>`;
    }
    ;
    static horSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g><path d="m11.466 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x=".91881" y="1.3021" width="10.548" height="21.913" fill="#fff" stroke="#f0f" stroke-width=".38547"/>
        <path d="m23.481 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x="12.933" y="1.3021" width="10.548" height="21.913" fill="#fff" stroke="#f0f" stroke-width=".38547"/></g>
        </svg>`;
    }
    ;
    static verSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <path d="m2.7244 11.657h19.63v-9.7972h0.632v10.605h-20.262z"/>
        <g><rect transform="matrix(0,1,1,0,0,0)" x="1.0521" y="2.0924" width="10.605" height="20.262" fill="#fff" stroke="#f00" stroke-width=".37166"/>
        <path d="m2.7244 23.737h19.63v-9.7972h0.632v10.605h-20.262z" stroke-width=".37166"/>
        <rect transform="matrix(0,1,1,0,0,0)" x="13.132" y="2.0924" width="10.605" height="20.262" fill="#fff" stroke="#f00" stroke-width=".37166"/></g>
        </svg>`;
    }
    ;
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
bCss.bookSVGCss = css(`bookIcon`, `stroke: black;`, `fill: white;`);
class Builder extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Builder.makeLabel(this);
    }
    // static handlerTree:Tree_ = new Tree_('Handlers')
    static makeHandlerTree() {
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
    static onNodeCreation(node) {
        let nodeLabel = I(`${node.label}_node`, `${node.label}`, node.ParentNodeTree.css, node.ParentNodeTree.events);
        nodeLabel.coord.hideWidth = true;
        let dataObj = node.Arguments[1];
        let dataObjType = BaseF.typeof(dataObj);
        let typeIcon;
        if (dataObjType == "DisplayGroup")
            typeIcon = (dataObj.ishor) ? bCss.horSVG("bookIcon") : bCss.verSVG("bookIcon");
        else
            typeIcon = {
                Handler: bCss.bookSVG("bookIcon"),
                HtmlBlock: bCss.htmlSVG("bookIcon"),
            }[dataObjType];
        node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
        (node.children.length) ?
            I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`, (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon, node.ParentNodeTree.iconClass, events({ onclick: function (mouseEvent) { Tree_.toggleCollapse(this, node, mouseEvent); } }))
            : I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`), I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon), nodeLabel);
    }
    static buildMainHandler() {
        // Builder.makeHandlerTree();
        Builder.mainHandler = H("Main Window", 4, v("Main_v", h("MenuBar", "20px", I("MenuBar_File", "File", "35px", bCss.menuItem), I("MenuBar_Edit", "Edit", "35px", bCss.menuItem), I("MenuBar_Spacer", "", bCss.menuSpace)), dockable(v("Main_Dockable", Builder.TOOLBAR, dockable(h("Tree_Body", 5, tree("HandlerTree", Builder.onNodeCreation, dragbar(I("Main_tree", "300px", bCss.bgLight), 50, 800), bCss.treeItem), bindHandler(I("Main_body"), Builder.clientHandler)))))));
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
