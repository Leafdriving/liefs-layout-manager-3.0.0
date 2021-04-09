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
CSS.link = css("link", `color: blue;text-decoration: underline;cursor:pointer`, `color: aqua`);
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
//let bgLIGHT = css("bgLIGHT", `background:cyan`);
let bgLightBorder = css("bgLight2border", `background: #F0F0F0;box-sizing: border-box;border: 1px solid darkgray;cursor:pointer`, `background: white;`, `background: DarkKhaki;`, { type: "CodeBlock" });
class CodeBlock extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        CodeBlock.makeLabel(this);
        let THIS = this;
        let javascriptDisplayCell = I(`${this.label}_javascript`, `<pre><code class="language-javascript">H("My Handler", \n${this.javascript}\n)</code></pre>`, bgLightBorder);
        let renderDisplayCell = eval(this.javascript);
        let fullHTML = `&lt!doctype html>
&lthtml lang="en">
&lthead>
  &ltmeta charset="utf-8">
  &lttitle>Liefs Layout Manager&lt/title>
  &ltscript src="https://leafdriving.github.io/liefs-layout-manager-3.0.0/dist/liefs-layout-managerV3.0.0.GLOBALS.full.js">&lt/script>
&lt/head>
&ltbody>
&lt/body>
&lt/html>
&ltscript>
H("My Handler",
${this.javascript}
)
&lt/script>`;
        this.pages = new Pages(`${this.label}_Pages`, h(`${this.label}_both`, javascriptDisplayCell, renderDisplayCell), javascriptDisplayCell, I(`${this.label}_p3`, `<pre><code class="language-markup">${fullHTML}</code></pre>`, bgLightBorder), renderDisplayCell);
        // let postrender = {postRenderCallback: function(){ Prism.highlightAll() } }
        this.pagesDisplayCell = new DisplayCell(`${this.label}_pages`, this.pages);
        // this.pagesDisplayCell.postRenderCallback = function(){console.log("now");Prism.highlightAll();}
        let p1 = I(`${this.label}_t1`, "Both", bgLightBorder, events({ onclick: function (mouseEvent) { THIS.pages.setPage(0); } }));
        let p2 = I(`${this.label}_t2`, "Javascript", bgLightBorder, events({ onclick: function (mouseEvent) { THIS.pages.setPage(1); } }));
        let p3 = I(`${this.label}_t3`, "Full (Html+Javascript+css)", bgLightBorder, events({ onclick: function (mouseEvent) { THIS.pages.setPage(2); } }));
        let p4 = I(`${this.label}_t4`, "rendered", bgLightBorder, events({ onclick: function (mouseEvent) { THIS.pages.setPage(3); } }));
        let temp = new Selected(`${this.label}_selected`, p1, p2, p3, p4);
        temp.select(undefined, p1);
        this.displaycell = v(`${this.label}_v`, h(`${this.label}_toph`, "25px", p1, p2, p3, p4), this.pagesDisplayCell);
        this.handler = H(this.label, this.displaycell, false);
        this.handler.postRenderCallback = function () {
            setTimeout(() => {
                Prism.highlightAll();
            }, 0);
        };
    }
}
CodeBlock.labelNo = 0;
CodeBlock.instances = [];
CodeBlock.activeInstances = [];
CodeBlock.defaults = {};
CodeBlock.argMap = {
    string: ["label", "javascript", "html"],
};
setTimeout(() => {
    let Example01 = new CodeBlock("Example01", `   h("MyHorizontal",
      I("HelloWorld","Hello", css("backWhite","background:green")),
      I("HelloWorld2","World", css("backPink","background:pink"))
   )`, `none`);
}, 0);
// class CodeBlock {
// }
// let CssTab = css("tab", "background:green")
// setTimeout(() => {
//   H("Example01",
//     v("Exmaple00_v",
//       I("Example01_01", "top", "25px", CssTab),
//       I("Example01_02", "bottom", CssTab),
//     ),
//   false,
// )  
// }, 0);
// class CodeBlock {
//     static fileNameAndPath = "../../dist/liefs-layout-managerV3.0.0.GLOBALS.full.js";
//     static byLabel(label:string):CodeBlock{
//       for (let key in CodeBlock.instances)
//           if (CodeBlock.instances[key].label == label)
//               return CodeBlock.instances[key];
//       return undefined;
//   }
//     static download(filename:string, text:string) {
//       var element = document.createElement('a');
//       element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
//       element.setAttribute('download', filename);
//       element.style.display = 'none';
//       document.body.appendChild(element);
//       element.click();
//       document.body.removeChild(element);
//     }
//     static downloadfile(el:Element) {
//       el = el.parentElement;
//       let label = el.id.slice(0, -3);
//       let codeblock = CodeBlock.byLabel(label)
//       CodeBlock.download(label+".html", codeblock.html.replace(/&lt/g, "<")+"\n<script>\n"+codeblock.javascript+"</script>");
//     }
//     static instances: CodeBlock[] = [];
//     static defaults = {
//       label : function(){return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`},
//       height:200, raw: false,
//     }
//     static argMap = {
//       string : ["label", "html", "javascriptForEval", "css"],
//       number : ["height"],
//     }
//     label:string;
//     html:string;
//     javascript:string;
//     javascriptForEval:string;
//     preCode:string = "";
//     css:string;
//     htmlDisplayCell: DisplayCell;
//     javascriptDisplayCell: DisplayCell;
//     evalDisplayCell: DisplayCell;
//     height:number;
//     displaycell: DisplayCell;
//     constructor(...Arguments:any){
//       CodeBlock.instances.push(this);
//       mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
//       this.javascript = `${this.preCode}H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
// ${this.javascriptForEval}
// )`;
//       // if (this.preCode) this.javascriptForEval = this.preCode + this.javascriptForEval;
//       var elem = document.createElement('div');
//       elem.innerHTML = this.html;
//       document.body.appendChild(elem);
//       this.html = `&lthtml lang="en">
//   &lthead>&ltmeta charset="utf-8">&lttitle>liefs-layout-manager ${this.label}&lt/title>
//   &ltscript src="${CodeBlock.fileNameAndPath}">&lt/script>
//   ${(this.css) ? "&ltstyle>\n" + this.css + "\n&lt/style>\n" :""}&lt/head>
//   &ltbody>
// ${this.html.replace(/</g, "&lt")}
//   &lt/body>
// &lt/html>`;
//     this.build();
//     }
//     build(){
//       let THIS = this;
//       let htmlLabel = I(`${this.label}_html_label`,`HTML`, "20px", CSS.centerText);
//       let htmlBody = I(`${this.label}_html`,`<pre><code class="language-markup">${this.html}</code></pre>`);
//       this.htmlDisplayCell = 
//         v(`${this.label}_v1`, "37.5%",
//           htmlLabel,
//           htmlBody,
//         );
//       let DBhtmlDisplayCell =
//       dragbar(
//         v(`${this.label}_v1_DB`, "37.5%",
//           htmlLabel,
//           htmlBody,
//         ), 200, 600);
//       this.javascriptDisplayCell = 
//         v(`${this.label}_v2`, "37.5%",
//           I(`${this.label}_javascript_label`,`Javascript`, "20px", CSS.centerText),
//           I(`${this.label}_javascript`,`<pre><code class="language-javascript">${this.javascript}</code></pre>`),
//         );
//       let EvalLabel = I(`${this.label}_output_label`,`Rendered`, "20px", CSS.centerText)
//       let EvalJS = eval(this.preCode + this.javascriptForEval)
//       this.evalDisplayCell =
//         v(`${this.label}_v3`, "25%",
//           EvalLabel,
//           EvalJS,
//         );
//       let DBevalDisplayCell =
//       dragbar(
//         v(`${this.label}_v3`, "25%",
//           EvalLabel,
//           EvalJS,
//         ), 200, 600);
//       let all3 =
//         h(`${this.label}_h`, `${this.height}`, 5,
//           DBhtmlDisplayCell,
//           this.javascriptDisplayCell,
//           DBevalDisplayCell,
//         );
//       let H_I_I_I = h(`${this.label}_buttons`, "25px", 5,
//         I(`${this.label}_b2`,`Show Html Only <button onclick="CodeBlock.downloadfile(this)">Download</button>`,
//             CSS.centerButton, Pages.button(`${this.label}_inner`, 1)),
//         I(`${this.label}_b3`,"Show Javascript Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 2)),
//         I(`${this.label}_b4`,"Show Rendered Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 3)),
//       );
//       let P_4Items = P(`${this.label}_inner`,
//         all3,
//         this.htmlDisplayCell,
//         this.javascriptDisplayCell,
//         this.evalDisplayCell,
//       );
//       // let title = I(`${this.label}_title`,this.label +" - " + this.discription, h1, "30px")
//       let launch = I(`${this.label}_launch`,"Launch in new Tab - (then view-source!)", "25px", CSS.centerButton,
//                           events({onclick: function(){
//                                   Object.assign(document.createElement('a'), {
//                                     target: '_blank',
//                                     href: `./Examples/${THIS.label}.html`,
//                                   }).click();
//                     }}));
//       let displaycell1 =
//       v(`${this.label}_v0`, 2,
//         // title,
//         I(`${this.label}_b1`,"Show all 3 Inline", CSS.centerButton , Pages.button(`${this.label}_inner`, 0), "25px" ),
//         H_I_I_I,
//         P_4Items,
//         launch,
//       );
//       let displaycell2 =
//       v(`${this.label}_v0_2`, 2,
//         // title,
//         H_I_I_I,
//         P_4Items,
//         launch,
//       );
//       this.displaycell = P(`${this.label}_TopPage`,
//         displaycell1,
//         displaycell2,
//         function(thisPages:Pages):number {
//           let displaycell = thisPages.displaycells[thisPages.currentPage];
//           let returnValue = (displaycell.coord.width > 1300) ? 0 : 1;
//           if (returnValue != thisPages.currentPage) {
//             let refPage = Pages.byLabel(this.label.slice(0, -8)+"_inner");
//             refPage.currentPage = (returnValue) ? ((refPage.currentPage == 0) ? 1:refPage.currentPage) : 0;
//           }
//           //console.log(returnValue == thisPages.currentPage)
//           // console.log(returnValue,refPage.currentPage)
//           // if (!Handler.firstRun && returnValue == 1 && refPage.currentPage == 0) refPage.currentPage = 3;
//           return returnValue;
//         }
//       )
//     }
//   static makeExamples(){
// H("Example01",
// codeblock("Example01", `<!-- Nothing Here in this example -->`,
//           `  h("Example01",  // create Horizontal DisplayGroup (In DisplayCell)
// I("Example01_1","one", css("#Example01_1","background-color:green;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
// I("Example01_2","two", css("#Example01_2","background-color:cyan;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
// )`,
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
// css("#Example01_a","background-color: green", false)
// css("#Example01_b","background-color: cyan", false)
// H("Example01a",
// codeblock("Example01a", `    <div id="Example01_a">one</div>
// <div id="Example01_b">two</div>`,
//           `  h("Example01a",  // create Horizontal DisplayGroup (In DisplayCell)
// I("Example01_a"), // create HtmlBlock (In DisplayCell) assumes "50%"
// I("Example01_b"), // create HtmlBlock (In DisplayCell) assumes "50%"
// )`,
// `#Example01_a {background-color: green}\n#Example01_b {background-color: cyan}`
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
// H("Example01_c",
// codeblock("Example01_c", `<!-- Nothing Here in this example -->`,
// `  h("Example01_c",  // create Horizontal DisplayGroup (In DisplayCell)
//     I("120px", "Example01_c1","one", css("bgGREEN","background-color:green;")), // fixed to 120 pixelx
//     I("Example01_c2","two", css("bgCYAN","background-color:cyan;")), // assumes "100%"... of remaing pixels
//   )`,
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
// H("Example01_d",
// codeblock("Example01_d", `<!-- Nothing Here in this example -->`,
// ` h("Example01_d", 20,
//     html("Example01_dBG", css("bgRED","background-color:red;")),
//     I("Example01_d1","one", css("bgGREEN","background-color:green;")),
//     I("Example01_d2","two", css("bgCYAN","background-color:cyan;")),
//   )`,
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
// H("Example01_e",
// codeblock("Example01_e", `<!-- Nothing Here in this example -->`,
// `// First we Make a Standard Handler
//   h("Example01_e", 4,
// // The entire screen is divided into a horizontal group with "one" on the left, and "the rest" on the right
//     html("Example01_eBG", css("bgRED","background-color:red;")),
// // the margin of 4 should be colored red
//     I("40px", "Example01_e1","one", css("bgGREEN","background-color:green;")),
// // The "one" Cell should be 40 pixels in size, background green
//     v("Example01_eBottomV", 8,
// // The right side of the screen is within a vertical container
//       html("Example01_eBG2", css("bgPINK","background-color:Pink;")),
// // the cells between the vertical container of 8 pixels, should be pink
//       I("50px","Example01_e2","two", css("bgCYAN","background-color:cyan;")),
// // the top cell should be 50 pixels high, background cyan
//       h("Example01_e3", 6,
// // The right middle, should have a horizontal container
//         html("Example01_eBG3", css("bgBLUE","background-color:blue;")),
// // horizontal container margins of 6 pixels should be blue
//         I("Example01_e3","three", css("bgGRAY","background-color:gray;")),
// // the inner horizontal left side should be 80% of the size (see next line), and gray background
//         I("20%","Example01_e4","four", css("bgORANGE","background-color:orange;")),
// // the inner horizontal right side shold be 20% of the size, and orange background
//       ),
//       I("30%","Example01_e5","five", css("bgCORAL","background-color:Coral;")),
// // the bottom of the right side vertical container should be 30% of the size, background coral
//     ),
//   )`,
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
// let preCode_f = `let bgRed = html("Example01_fBG", css("bgRED","background-color:red;"));
// let bgPink = html("Example01_fBG2", css("bgPINK","background-color:Pink;"));
// let bgBlue = html("Example01_fBG3", css("bgBLUE","background-color:blue;"));
// let I_one = I("40px", "Example01_f1","one", css("bgGREEN","background-color:green;"));
// let I_two = I("50px","Example01_f2","two", css("bgCYAN","background-color:cyan;"));
// let I_three = I("Example01_f3","three", css("bgGRAY","background-color:gray;"));
// let I_four = I("20%","Example01_f4","four", css("bgORANGE","background-color:orange;"));
// let I_five = I("30%","Example01_f5","five", css("bgCORAL","background-color:Coral;"));
// let h_inner = h("Example01_f3", 6, bgBlue, I_three, I_four);
// let v_outer = v("Example01_fBottomV", 8, bgPink,
//                         I_two, h_inner, I_five,);
// `;
// H("Example01_f",
// codeblock("Example01_f", `<!-- Nothing Here in this example -->`,
// `  h("Example01_f", 4,
//     bgRed,
//     I_one,
//     v_outer,
//   )`, {preCode : preCode_f}
// ),
// false,
// {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
// )
//   }
// }
// function codeblock(...Arguments:any){
//   let cb = new CodeBlock(...Arguments);
//   return cb.displaycell;
// }
// Build Tree
let clickTreeItemEvent = events({ onclick: function (mouseEvent) {
        let treeNode = node_.byLabel(this.id);
        let tree = treeNode.ParentNodeTree;
        console.log("Tree Item Clicked", treeNode);
    } });
function header(label, index, size = 120) {
    let noPages = 52;
    return v(label, 5, I("1px"), h(`${label}_h`, "25px", 15, I("1px"), I(`${label}_label`, label, CSS.insetLarge, `${size}px`), I(), I(`${label}_prev`, "Previous Page", CSS.h1h, "145px", Pages.button("PAGES", (index <= 0) ? 0 : index - 1)), I(`${label}_next`, "Next Page", CSS.h1h, "110px", Pages.button("PAGES", (index >= noPages) ? index : index + 1)), I("15px")), I(label, CSS.textBlack));
}
let gotoPage = function (PageName) { return events({ onclick: function () { Pages.setPage("PAGES", PageName); } }); };
let pagesNode = new node_("Table Of Contents");
let makearray = function (name, num = undefined) {
    let returnArray = [name, I(name + "_", name, gotoPage(name))];
    if (num)
        returnArray.push(num);
    return returnArray; // ...makearray("Trees")
};
pagesNode.newChild(...makearray("Welcome"))
    .newSibling(...makearray("Installation"))
    .newSibling(...makearray("The Basics"))
    .newChild(...makearray("HTML vs Javascript", 200))
    .newSibling(...makearray("Basics - DisplayCell", 210))
    .newSibling(...makearray("Functions & Objects", 205))
    .newSibling(...makearray("Arguments By Type", 200))
    .newSibling(...makearray("Functions"))
    .newSibling(...makearray("Handlers"))
    .newSibling(...makearray("DisplayGroups"))
    .newSibling(...makearray("HtmlBlocks"))
    .newSibling(...makearray("pages"))
    .newSibling(...makearray("css"))
    .newSibling(...makearray("swipe"))
    .newSibling(...makearray("DragBars"))
    .newSibling(...makearray("events"))
    .newSibling(...makearray("Htmlblock"))
    .newSibling(...makearray("stretch"))
    .newSibling(...makearray("dockable"))
    .newSibling(...makearray("Toolbars"))
    .newSibling(...makearray("Trees"))
    .parent()
    .newChild(...makearray("Objects"))
    .newSibling(...makearray("Base"))
    .newSibling(...makearray("HtmlBlock"))
    .newSibling(...makearray("DisplayCells"))
    .newSibling(...makearray("DisplayGroup"))
    .newSibling(...makearray("Coord"))
    .newSibling(...makearray("Context"))
    .newSibling(...makearray("Css"))
    .newSibling(...makearray("Default Theme"))
    .newSibling(...makearray("Drag"))
    .newSibling(...makearray("Swipe"))
    .newSibling(...makearray("DragBar"))
    .newSibling(...makearray("Events"))
    .newSibling(...makearray("FunctionStack"))
    .newSibling(...makearray("Handler"))
    .newSibling(...makearray("Hold"))
    .newSibling(...makearray("Modal"))
    .newSibling(...makearray("Stretch"))
    .newSibling(...makearray("Observe"))
    .newSibling(...makearray("Overlay"))
    .newSibling(...makearray("Pages"))
    .newSibling(...makearray("pf_mf"))
    .newSibling(...makearray("ScrollBar"))
    .newSibling(...makearray("Dockable"))
    .newSibling(...makearray("ToolBar"))
    .newSibling(...makearray("TreeNode"))
    .newSibling(...makearray("Tree"))
    .parent()
    .newSibling(...makearray("Examples"))
    .newChild(...makearray("Examples_01"));
let pagesArray = [];
let counter = 0;
node_.traverse(pagesNode, function (node) {
    if (node.Arguments.length == 2)
        pagesArray.push(header(node.label, counter++));
    else
        pagesArray.push(header(node.label, counter++, node.Arguments[2]));
});
let MainPages = P("PAGES", ...pagesArray);
MainPages.pages.currentPage = 1;
let mainTree = tree("TOC", dragbar(I("MainTree", "", CSS.bgLBlue2, "300px"), 100, 500), { SVGColor: "black" }, clickTreeItemEvent, CSS.cssNode, pagesNode, 20, 4);
let slideTree = tree("TOC_slide", I("SlideTree", "", CSS.bgBlack, "350px"), { SVGColor: "white" }, CSS.slideTree, 35, events({ onclick: function () { slideMenu.pop(); } }));
// Framework
//// pages Here.
let LargeScreen = v("Main Vertical", I("TitleBar", "30px", CSS.cssTitle), h("MainBody", 5, mainTree, MainPages));
let MenuSvgSize = 40;
let SmallScreen = v("Small_v", h("Small_h", `${MenuSvgSize}px`, I("MenuButton", CSS.menu_SVG(MenuSvgSize), `${MenuSvgSize}px`, CSS.menuButton, events({
    onclick: function () {
        if (Handler.activeInstances.indexOf(slideMenu) == -1) {
            Handler.activeInstances.push(slideMenu);
            Render.update();
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
// CodeBlock.makeExamples();
