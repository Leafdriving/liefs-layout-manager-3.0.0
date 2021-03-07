var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var CodeBlock = /** @class */ (function () {
    function CodeBlock() {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        CodeBlock.instances.push(this);
        mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
        this.build();
    }
    CodeBlock.prototype.build = function () {
        this.displaycell =
            h(this.label + "_h", "" + this.height, I(this.label + "_html", "<pre><code class=\"language-markup\">" + this.html + "</code></pre>"), I(this.label + "_javascript", "<pre><code class=\"language-javascript\">" + this.javascript + "</code></pre>"), I(this.label + "_css", "<pre><code class=\"language-css\">" + this.css + "</code></pre>"));
    };
    CodeBlock.instances = [];
    CodeBlock.defaults = {
        label: function () { return "CBlock_" + pf.pad_with_zeroes(CodeBlock.instances.length); },
        height: 200
    };
    CodeBlock.argMap = {
        string: ["html", "javascript", "css"],
        number: ["height"]
    };
    return CodeBlock;
}());
function codeblock() {
    var Arguments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Arguments[_i] = arguments[_i];
    }
    var cb = new (CodeBlock.bind.apply(CodeBlock, __spreadArray([void 0], Arguments)))();
    return cb.displaycell;
}
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
var textBlack = css("textBlack", "color:black;overflow-y: auto;");
var cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;");
var cssBold = css("bold", "text-decoration: underline;font-weight:bold;background-color: yellow;");
// Build Tree
var clickTreeItemEvent = events({ onclick: function (mouseEvent) {
        // console.log(this);
        // console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
    } });
var treeOfNodes = TI("Welcome to Liefs-Layout-Manager", { attributes: { pagebutton: "PAGES|0" } }, [TI("Installation", Pages.button("PAGES", 1)),
    TI("Part 2"),
    TI("Part 3", [TI("3a")]),
]);
// Framework
H("MainHandler", 4, v("Main Vertical", I("TitleBar", "30px", cssTitle), h("MainBody", 5, tree("TreeLabel", dragbar(I("MainTree", "", bgGreen, "300px"), 100, 500), treeOfNodes, { SVGColor: "black" }, clickTreeItemEvent, cssNode), P("PAGES", I("Welcome", textBlack), I("Installation", textBlack)))), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
H("CBlock_001", codeblock("html", "javascript", "css"), 
// h("SubHor",
//   I("leftside","leftside", bgRed),
//   I("Rightside","rightside", bgBlue),
// ),
false, { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
