class CSS {
    static menu_SVG(size = 50, color = "white") {
        return `<svg width="${size}" height="${size}" viewBox="-20 0 532 512" xmlns="http://www.w3.org/2000/svg">
    <path d="m464.883 64.267h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z"/>
    <path d="m464.883 208.867h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z"/>
    <path d="m464.883 353.467h-417.766c-25.98 0-47.117 21.137-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.012-21.137-47.149-47.117-47.149z"/>
</svg>`;
    }
} // style="fill:${color};stroke:${color};stroke-width:1" 
// static header = new Css("header",`position: sticky;top: 0;`);
CSS.h1 = new Css("h1", `border: 2px solid #1C6EA4;
                border-radius: 10px;
                background: #D1F5F3;
                -webkit-box-shadow: 3px 6px 7px -1px #000000 inset; 
                box-shadow: 3px 6px 4px -1px #000000 inset;
                padding-left: 8px;
                padding-right: 5px;
                padding-top: 5px;
                margin-top : -1px;
                font-size: 24px;
                display: inline-block;`);
CSS.h1h = new Css("h1h", `border: 2px solid #1C6EA4;
                padding-left : 6px;
                border-radius: 10px;
                background: #D1F5F3;
                -webkit-box-shadow: 3px 6px 7px -1px #000000; 
                box-shadow: 3px 6px 7px -1px #000000;
                font-size: 24px;`, `background: #42aaf5;cursor:pointer`);
CSS.p = new Css("p", `text-indent: 30px;
                margin-left: 10px;
                font-size: 18px;`, false);
CSS.codeblock = css("codeblock", `margin-left: 5px;
                                        width: -moz-calc(100% - 5px);
                                        width: -webkit-calc(100% - 5px);
                                        width: calc(100% - 5px);
                                        background-color: rgb(193, 243, 191)`);
CSS.inset = new Css("inset", `box-shadow: 2px 2px 5px black inset;
                                    margin: 20px;
                                    display: inline;
                                    padding: 10px;`);
CSS.insetLarge = new Css("insetLarge", `box-shadow: 2px 2px 5px black inset;
                                              font-size: 24px;
                                              padding-left: 16px;
                                              padding-top : 2px;
                                              padding-bottom : 2px;
                                              background: #42aaf5;
                                              color: black;`);
CSS.slideTree = css("slideTree", `background-color: black;color:white;font-size: 20px;display: flex; justify-content: center;align-items: center;`, `background-color: white;color:black;`);
CSS.cssNode = css("cssNode", `background-color:#D1F5F3;
                                    border-radius: 5px;
                                    border: 1px solid #1C6EA4;
                                    padding-top: -2px;
                                    padding-left : 5px;
                                    padding-right : 5px;
                                    -webkit-box-shadow: 2px 3px 2px -1px #000000; 
                                    box-shadow: 2px 3px 2px -1px #000000;
                                    font-size: 18px;`, `background: #42aaf5;cursor:pointer`, `box-shadow: 2px 2px 5px black inset;
                                    background: #42aaf5;
                                    margin-top: 2px;
                                    padding-left: 5px;
                                    padding-right:5px;
                                    padding-bottom: 1px;
                                    color: black;
                                    font-size: 18px;`);
CSS.menuButton = css("menuButton", `background-color:blue;fill: white;`, `cursor:pointer;background-color:white;fill: blue;`);
CSS.bgBlue = css("bgBlue", `background-color:blue;`);
CSS.bgGreen = css("bgGreen", `background-color:green`);
CSS.bgRed = css("bgRed", `background-color:red`);
CSS.bgBlack = css("bgBlack", `background-color:black`);
CSS.bgLBlue = css("bgLBlue", "background: #D1F5F3");
CSS.bgLBlue2 = css("bgLBlue2", "background: #f5fbff");
CSS.outline = css("outline", `outline: 1px solid black;
                                    display:inline`);
CSS.textWhite = css("textWhite", "color:white");
CSS.textBlue = css("textBlue", "color:blue");
CSS.textBlueLink = css("textBlueLink", "color:blue;cursor: pointer;");
CSS.textCenter = css("textCenter", "text-align: center;");
CSS.textBlack = css("textBlack", "color:black;overflow-y: auto;font-size: 20px;");
CSS.cssTitle = css("title", `background-color:blue;
                                    color:white;
                                    text-align: center;
                                    font-size: 24px;`);
CSS.cssBold = css("bold", `text-decoration: underline;
                                    font-weight:bold;
                                    background-color: yellow;`);
CSS.centerText = css("centerText", `display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: blue;
                                            color:white;
                                            font-weight: bold;`);
CSS.leftText = css("leftText", `font-size: 25px;
                                        background-color: #ADD8E6;
                                        color:black;
                                        font-weight: bold;`);
CSS.centerButton = css("centerButton", `display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: #ADD8E6;
                                            color:black;
                                            font-weight: bold;
                                            border-radius: 10px 10px 0px 0px;`, `display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 20px;
                                        background-color: #839ae6;
                                        color:black;
                                        font-weight: bold;
                                        border-radius: 10px 10px 0px 0px;
                                        cursor:pointer;`, `display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: #4D4DFF;
                                            color:white;
                                            font-weight: bold;
                                            border-radius: 10px 10px 0px 0px;`);
class CodeBlock {
    constructor(...Arguments) {
        CodeBlock.instances.push(this);
        mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
        this.javascript = `H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
${this.javascriptForEval}
)`;
        var elem = document.createElement('div');
        elem.innerHTML = this.html;
        document.body.appendChild(elem);
        this.html = `&lthtml lang="en">
  &lthead>&ltmeta charset="utf-8">&lttitle>liefs-layout-manager ${this.label}&lt/title>
  &ltscript src="../../js/liefs-layout-managerV3.0.0.js">&lt/script>
  ${(this.css) ? "&ltstyle>\n" + this.css + "\n&lt/style>\n" : ""}&lt/head>
  &ltbody>
${this.html.replace(/</g, "&lt")}
  &lt/body>
&lt/html>`;
        this.build();
    }
    static byLabel(label) {
        for (let key in CodeBlock.instances)
            if (CodeBlock.instances[key].label == label)
                return CodeBlock.instances[key];
        return undefined;
    }
    static download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    static downloadfile(el) {
        el = el.parentElement;
        let label = el.id.slice(0, -3);
        let codeblock = CodeBlock.byLabel(label);
        CodeBlock.download(label + ".html", codeblock.html.replace(/&lt/g, "<") + "\n<script>\n" + codeblock.javascript + "</script>");
    }
    build() {
        let THIS = this;
        let htmlLabel = I(`${this.label}_html_label`, `HTML`, "20px", CSS.centerText);
        let htmlBody = I(`${this.label}_html`, `<pre><code class="language-markup">${this.html}</code></pre>`);
        this.htmlDisplayCell =
            v(`${this.label}_v1`, "37.5%", htmlLabel, htmlBody);
        let DBhtmlDisplayCell = dragbar(v(`${this.label}_v1_DB`, "37.5%", htmlLabel, htmlBody), 200, 600);
        this.javascriptDisplayCell =
            v(`${this.label}_v2`, "37.5%", I(`${this.label}_javascript_label`, `Javascript`, "20px", CSS.centerText), I(`${this.label}_javascript`, `<pre><code class="language-javascript">${this.javascript}</code></pre>`));
        let EvalLabel = I(`${this.label}_output_label`, `Rendered`, "20px", CSS.centerText);
        let EvalJS = eval(this.javascriptForEval);
        this.evalDisplayCell =
            v(`${this.label}_v3`, "25%", EvalLabel, EvalJS);
        let DBevalDisplayCell = dragbar(v(`${this.label}_v3`, "25%", EvalLabel, EvalJS), 200, 600);
        let all3 = h(`${this.label}_h`, `${this.height}`, 5, DBhtmlDisplayCell, this.javascriptDisplayCell, DBevalDisplayCell);
        let H_I_I_I = h(`${this.label}_buttons`, "25px", 5, I(`${this.label}_b2`, `Show Html Only <button onclick="CodeBlock.downloadfile(this)">Download</button>`, CSS.centerButton, Pages.button(`${this.label}_inner`, 1)), I(`${this.label}_b3`, "Show Javascript Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 2)), I(`${this.label}_b4`, "Show Rendered Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 3)));
        let P_4Items = P(`${this.label}_inner`, all3, this.htmlDisplayCell, this.javascriptDisplayCell, this.evalDisplayCell);
        // let title = I(`${this.label}_title`,this.label +" - " + this.discription, h1, "30px")
        let launch = I(`${this.label}_launch`, "Launch in new Tab - (then view-source!)", "25px", CSS.centerButton, events({ onclick: function () {
                Object.assign(document.createElement('a'), {
                    target: '_blank',
                    href: `./Examples/${THIS.label}.html`,
                }).click();
            } }));
        let displaycell1 = v(`${this.label}_v0`, 2, 
        // title,
        I(`${this.label}_b1`, "Show all 3 Inline", CSS.centerButton, Pages.button(`${this.label}_inner`, 0), "25px"), H_I_I_I, P_4Items, launch);
        let displaycell2 = v(`${this.label}_v0_2`, 2, 
        // title,
        H_I_I_I, P_4Items, launch);
        this.displaycell = P(`${this.label}_TopPage`, displaycell1, displaycell2, function (thisPages) {
            let displaycell = thisPages.displaycells[thisPages.currentPage];
            let returnValue = (displaycell.coord.width > 1300) ? 0 : 1;
            if (returnValue != thisPages.currentPage) {
                let refPage = Pages.byLabel(this.label.slice(0, -8) + "_inner");
                refPage.currentPage = (returnValue) ? ((refPage.currentPage == 0) ? 1 : refPage.currentPage) : 0;
            }
            //console.log(returnValue == thisPages.currentPage)
            // console.log(returnValue,refPage.currentPage)
            // if (!Handler.firstRun && returnValue == 1 && refPage.currentPage == 0) refPage.currentPage = 3;
            return returnValue;
        });
    }
}
CodeBlock.instances = [];
CodeBlock.defaults = {
    label: function () { return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`; },
    height: 200,
};
CodeBlock.argMap = {
    string: ["label", "html", "javascriptForEval", "css"],
    number: ["height"]
};
function codeblock(...Arguments) {
    let cb = new CodeBlock(...Arguments);
    return cb.displaycell;
}
// Build Tree
let clickTreeItemEvent = events({ onclick: function (mouseEvent) {
        let treeNode = TreeNode.byLabel(this.id);
        let tree = TreeNode.parentTree(treeNode);
        if (treeNode.collapsed)
            tree.toggleCollapse(treeNode, undefined, undefined);
        console.log(TreeNode.path(treeNode));
    } });
function header(label, index, size = 120) {
    let noPages = 9;
    return v(label, 5, I("1px"), h(`${label}_h`, "25px", 15, I("1px"), I(`${label}_label`, label, CSS.insetLarge, `${size}px`), I(), I(`${label}_prev`, "Previous Page", CSS.h1h, "145px", Pages.button("PAGES", (index <= 0) ? 0 : index - 1)), I(`${label}_next`, "Next Page", CSS.h1h, "110px", Pages.button("PAGES", (index >= noPages) ? index : index + 1)), I("15px")), I(label, CSS.textBlack));
}
let MainPages = P("PAGES", header("Welcome", 0), header("Installation", 1), header("The Basics", 2), header("HTML vs Javascript", 3, 200), header("Basics - DisplayCell", 4, 210), header("Functions & Objects", 5, 205), header("Arguments By Type", 6, 200), header("Functions", 7), header("Handlers", 8), header("DisplayGroups", 9, 160));
let treeOfNodes = TI("Welcome to Liefs-Layout-Manager", Pages.button("PAGES", 0), /* {attributes : {pagebutton : "PAGES|0"} */ [TI("Installation", Pages.button("PAGES", 1)),
    TI("The Basics", Pages.button("PAGES", 2), [TI("HTML vs Javascript", Pages.button("PAGES", 3)),
        TI("DisplayCell", Pages.button("PAGES", 4))]),
    TI("Functions & Objects", Pages.button("PAGES", 5), [TI("Arguments By Type", Pages.button("PAGES", 6)),
        TI(true, "Functions", Pages.button("PAGES", 7), [TI("H()", Pages.button("PAGES", 8)),
            TI("h() v()", Pages.button("PAGES", 9)),
            TI("I()"),
            TI("P()"),
            TI("css()"),
            TI("swipe()"),
            TI("dragbar()"),
            TI("events"),
            TI("html()"),
            TI("stretch()"),
            TI("dockable()"),
            TI("tool_bar()"),
            TI("T()"),
            TI("tree()"),
            TI("TI()"),
        ]),
        TI(true, "Objects", [
            TI("Base"),
            TI("htmlBlock"),
            TI("DisplayCell"),
            TI("DisplayGroup"),
            TI("Coord"),
            TI("Context"),
            TI("Css"),
            TI("DefaultTheme"),
            TI("Drag"),
            TI("Swipe"),
            TI("DragBar"),
            TI("Events"),
            TI("FunctionStack"),
            TI("Handler"),
            TI("Hold"),
            TI("Modal"),
            TI("Stretch"),
            TI("Observe"),
            TI("Overlay"),
            TI("Pages"),
            TI("pf/mf"),
            TI("ScrollBar"),
            TI("Dockable"),
            TI("ToolBar"),
            TI("TreeNode"),
            TI("Tree"),
            TI("i_"),
            TI("t_"),
        ]),
    ]),
]);
let mainTree = tree("TOC", dragbar(I("MainTree", "", CSS.bgLBlue2, "300px"), 100, 500), treeOfNodes, { SVGColor: "black" }, clickTreeItemEvent, CSS.cssNode, 20, 4);
let slideTree = tree("TOC_slide", I("SlideTree", "", CSS.bgBlack, "350px"), treeOfNodes, { SVGColor: "white" }, CSS.slideTree, 35, events({ onclick: function () { slideMenu.pop(); } }));
// Framework
//// pages Here.
let LargeScreen = v("Main Vertical", I("TitleBar", "30px", CSS.cssTitle), h("MainBody", 5, mainTree, MainPages));
let MenuSvgSize = 40;
let SmallScreen = v("Small_v", h("Small_h", `${MenuSvgSize}px`, I("MenuButton", CSS.menu_SVG(MenuSvgSize), `${MenuSvgSize}px`, CSS.menuButton, events({
    onclick: function () {
        if (Handler.activeInstances.indexOf(slideMenu) == -1) {
            Handler.activeInstances.push(slideMenu);
            Handler.update();
        }
        else
            slideMenu.pop();
    }
})), I("TitleBar2", CSS.cssTitle)), MainPages);
let slideMenu = H("SlideMenu", v("slide_v", I(`${MenuSvgSize}px`), h("slide_h", slideTree, I())), false);
let sizeFunction = function (thisPages) {
    let [x, y] = pf.viewport();
    if (x > 920)
        slideMenu.pop();
    // if (returnValue != thisPages.currentPage) {}
    return (x > 920) ? 0 : 1;
};
H("MainHandler", 4, P("MainSizer", LargeScreen, SmallScreen, sizeFunction), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
H("Example01", codeblock("Example01", `<!-- Nothing Here in this example -->`, `  h("Example01",  // create Horizontal DisplayGroup (In DisplayCell)
    I("Example01_1","one", css("#Example01_1","background-color:green;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
    I("Example01_2","two", css("#Example01_2","background-color:cyan;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
  )`), false, { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
css("#Example01_a", "background-color: green", false);
css("#Example01_b", "background-color: cyan", false);
H("Example01a", codeblock("Example01a", `    <div id="Example01_a">one</div>
    <div id="Example01_b">two</div>`, `  h("Example01a",  // create Horizontal DisplayGroup (In DisplayCell)
    I("Example01_a"), // create HtmlBlock (In DisplayCell) assumes "50%"
    I("Example01_b"), // create HtmlBlock (In DisplayCell) assumes "50%"
  )`, `#Example01_a {background-color: green}\n#Example01_b {background-color: cyan}`), false, { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
