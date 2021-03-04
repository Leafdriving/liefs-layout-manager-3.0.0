// CSS
var bgBlue = css("bgBlue", "background-color:blue;");
var bgGreen = css("bgGreen", "background-color:green");
var bgRed = css("bgRed", "background-color:red");
var bgBlack = css("bgBlack", "background-color:black");
var textWhite = css("textWhite", "color:white");
var textBlue = css("textBlue", "color:blue");
var textCenter = css("textCenter", "text-align: center;");
var textBlack = css("textBlack", "color:black;");
var cssTitle = css("title", "background-color:blue;color:white;text-align: center;");
// Build Tree
var printNode = events({ onclick: function (mouseEvent) {
        console.log(TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML);
    } });
var TableOfContents = autoLabelTreenodes("myLabel", TI("Table of Contents", printNode, [TI("Introduction", printNode),
    TI("Part 2", printNode),
    TI("Part 3", printNode, [TI("3a", printNode)]),
]));
// Framework
H("MainHandler", 2, v("Main Vertical", I("TitleBar", "20px", cssTitle), h("MainBody", 5, tree(dragbar(I("MainTree", "", bgGreen, "250px"), 100, 500), TableOfContents, /* bgRed */ { SVGColor: "black" }), P("BPages", I("MainBody", textBlack)))), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
