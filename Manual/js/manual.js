class CSS {
}
CSS.h1 = new Css("h1", `border: 2px solid #1C6EA4;
                border-radius: 10px;
                background: #D1F5F3;
                -webkit-box-shadow: 3px 6px 7px -1px #000000; 
                box-shadow: 3px 6px 7px -1px #000000;
                margin-left: 10px;
                margin-top: 10px;
                padding-left: 5px;
                padding-right: 5px;
                font-size: 24px;
                display: inline-block;`);
CSS.p = new Css("p", `text-indent: 30px;
                margin-left: 10px;
                font-size: 18px;`, false);
CSS.cssNode = css("cssNode", `background-color:#edf9fa;border-radius: 5px;padding-left: 5px;padding-right: 5px;`, `background-color:#eaeda6;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`, `background-color:#f7ebeb;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`);
CSS.bgBlue = css("bgBlue", `background-color:blue;`);
CSS.bgGreen = css("bgGreen", `background-color:green`);
CSS.bgRed = css("bgRed", `background-color:red`);
CSS.bgBlack = css("bgBlack", `background-color:black`);
CSS.textWhite = css("textWhite", "color:white");
CSS.textBlue = css("textBlue", "color:blue");
CSS.textCenter = css("textCenter", "text-align: center;");
CSS.textBlack = css("textBlack", "color:black;overflow-y: auto;font-size: 20px;");
CSS.cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;");
CSS.cssBold = css("bold", "text-decoration: underline;font-weight:bold;background-color: yellow;");
CSS.centerText = css("centerText", `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: blue;color:white;font-weight: bold;`);
CSS.leftText = css("leftText", `font-size: 25px;background-color: #ADD8E6;color:black;font-weight: bold;`);
CSS.centerButton = css("centerButton", `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #ADD8E6;`
    + `color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;`, `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #839ae6;`
    + `color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;cursor:pointer;`, `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #4D4DFF;`
    + `color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;`);
class CodeBlock {
    constructor(...Arguments) {
        CodeBlock.instances.push(this);
        mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
        this.javascript = `H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
    ${this.javascriptForEval.replace(/\n/g, "\n  ")}
  )`;
        var elem = document.createElement('div');
        elem.innerHTML = this.html.replace(/\n/g, "\n  ");
        document.body.appendChild(elem);
        this.html = `&lthtml lang="en">
    &lthead>&ltmeta charset="utf-8">&lttitle>liefs-layout-manager ${this.label}&lt/title>
    &ltscript src="../../js/liefs-layout-managerV3.0.0.js">&lt/script>
    &lt/head>
    &ltbody>
    ${this.html.replace(/\n/g, "\n  ").replace(/</g, "&lt")}
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
    string: ["label", "html", "javascriptForEval", "discription"],
    number: ["height"]
};
function codeblock(...Arguments) {
    let cb = new CodeBlock(...Arguments);
    return cb.displaycell;
}
// Build Tree
let clickTreeItemEvent = events({ onclick: function (mouseEvent) {
        // console.log(this);
        // console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
    } });
let treeOfNodes = TI("Welcome to Liefs-Layout-Manager", { attributes: { pagebutton: "PAGES|0" } }, [TI("Installation", Pages.button("PAGES", 1)),
    TI("Part 2"),
    TI("Part 3", [TI("3a")]),
]);
// Framework
H("MainHandler", 4, v("Main Vertical", I("TitleBar", "30px", CSS.cssTitle), h("MainBody", 5, tree("TOC", dragbar(I("MainTree", "", CSS.bgGreen, "300px"), 100, 500), treeOfNodes, { SVGColor: "black" }, clickTreeItemEvent, CSS.cssNode), P("PAGES", I("Welcome", CSS.textBlack), I("Installation", CSS.textBlack)))), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
H("Example01", codeblock("Example01", `<!-- Nothing Here in this example -->`, `h("Example01",  // create Horizontal DisplayGroup (In DisplayCell)
  I("Example01_1","one", css("#Example01_1","background-color:green;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
  I("Example01_2","two", css("#Example01_2","background-color:cyan;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
)`), false, { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
