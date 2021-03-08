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
        this.javascript = "H(\"" + this.label + "_handler\",  // opens a handler (Starts Liefs-layout-manager)\n  " + this.javascriptForEval.replace(/\n/g, "\n  ") + "\n)";
        var elem = document.createElement('div');
        elem.innerHTML = this.html.replace(/\n/g, "\n  ");
        document.body.appendChild(elem);
        this.html = "&lthtml lang=\"en\">\n  &lthead>&ltmeta charset=\"utf-8\">&lttitle>My title&lt/title>\n  &ltscript src=\"../js/liefs-layout-managerV3.0.0.js\">&lt/script>\n  &lt/head>\n  &ltbody>\n  " + this.html.replace(/\n/g, "\n  ").replace(/</g, "&lt") + "\n  &lt/body>\n&lt/html>";
        this.build();
    }
    CodeBlock.prototype.build = function () {
        this.htmlDisplayCell =
            v(this.label + "_v1", I(this.label + "_html_label", "HTML", "20px", centerText), I(this.label + "_html", "<pre><code class=\"language-markup\">" + this.html + "</code></pre>"));
        this.javascriptDisplayCell =
            v(this.label + "_v2", I(this.label + "_javascript_label", "Javascript", "20px", centerText), I(this.label + "_javascript", "<pre><code class=\"language-javascript\">" + this.javascript + "</code></pre>"));
        this.evalDisplayCell =
            v(this.label + "_v3", I(this.label + "_output_label", "Rendered", "20px", centerText), eval(this.javascriptForEval));
        var all3 = h(this.label + "_h", "" + this.height, 2, this.htmlDisplayCell, this.javascriptDisplayCell, this.evalDisplayCell);
        this.displaycell =
            v(this.label + "_v0", h(this.label + "_buttons", "20px", 4, I(this.label + "_b1", "Show all 3 Inline", centerButton, Pages.button(this.label + "_pages", 0)), I(this.label + "_b2", "Show Html Only", centerButton, Pages.button(this.label + "_pages", 1)), I(this.label + "_b3", "Show Javascript Only", centerButton, Pages.button(this.label + "_pages", 2)), I(this.label + "_b4", "Show Rendered Only", centerButton, Pages.button(this.label + "_pages", 3))), P(this.label + "_pages", // 3,
            all3, this.htmlDisplayCell, this.javascriptDisplayCell, this.evalDisplayCell)
            // all3,
            );
    };
    CodeBlock.instances = [];
    CodeBlock.defaults = {
        label: function () { return "CBlock_" + pf.pad_with_zeroes(CodeBlock.instances.length); },
        height: 200
    };
    CodeBlock.argMap = {
        string: ["label", "html", "javascriptForEval", "css"],
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
var centerText = css("centerText", "display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: blue;color:white;font-weight: bold;");
var centerButton = css("centerButton", "display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #ADD8E6;"
    + "color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;", "display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #839ae6;"
    + "color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;", "display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #4D4DFF;"
    + "color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;");
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
H("Example01", codeblock("Example01", "<!-- Nothing Here -->", "h(\"Example01\",  // create Horizontal DisplayGroup (In DisplayCell)\n  I(\"Example01_1\",\"one\", css(\"#Example01_1\",\"background-color:green;\", false)), // create HtmlBlock (In DisplayCell) assumes \"50%\"\n  I(\"Example01_2\",\"two\", css(\"#Example01_2\",\"background-color:cyan;\", false)), // create HtmlBlock (In DisplayCell) assumes \"50%\"\n)"), 
//I("phew", "phew"),
false, { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
