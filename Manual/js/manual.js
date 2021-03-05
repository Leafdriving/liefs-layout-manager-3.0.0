// CSS
new Css("h1", "border: 2px solid #1C6EA4;\n              border-radius: 10px;\n              background: #D1F5F3;\n              -webkit-box-shadow: 3px 6px 7px -1px #000000; \n              box-shadow: 3px 6px 7px -1px #000000;\n              margin-left: 10px;\n              margin-top: 10px;\n              padding-left: 5px;\n              padding-right: 5px;\n              font-size: 24px;\n              display: inline-block;");
new Css("p", "text-indent: 30px;\n             margin-left: 10px;\n             font-size: 18px;", false);
var cssNode = css("cssNode", "background-color:#edf9fa;border-radius: 5px;padding-left: 5px;padding-right: 5px;", "background-color:#eaeda6;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;", "background-color:#f7ebeb;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;");
var bgBlue = css("bgBlue", "background-color:blue;");
var bgGreen = css("bgGreen", "background-color:green");
var bgRed = css("bgRed", "background-color:red");
var bgBlack = css("bgBlack", "background-color:black");
var textWhite = css("textWhite", "color:white");
var textBlue = css("textBlue", "color:blue");
var textCenter = css("textCenter", "text-align: center;");
var textBlack = css("textBlack", "color:black;");
var cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;");
// Build Tree
var clickTreeItemEvent = events({ onclick: function (mouseEvent) {
        console.log(this);
        console.log(TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML);
    } });
var treeOfNodes = TI("Welcome to Liefs-Layout-Manager", { attributes: { pagebutton: "PAGES|0" } }, [TI("Introduction", Pages.button("PAGES", 1)),
    TI("Part 2"),
    TI("Part 3", [TI("3a")]),
]);
// Framework
H("MainHandler", 2, v("Main Vertical", I("TitleBar", "30px", cssTitle), h("MainBody", 5, tree("TreeLabel", dragbar(I("MainTree", "", bgGreen, "250px"), 100, 500), treeOfNodes, { SVGColor: "black" }, clickTreeItemEvent, cssNode), P("PAGES", I("Welcome", textBlack), I("Introduction", textBlack)))), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
