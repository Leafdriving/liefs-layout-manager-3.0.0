

class CodeBlock {
    static fileNameAndPath = "../../dist/liefs-layout-managerV3.0.0.GLOBALS.full.js";
    static byLabel(label:string):CodeBlock{
      for (let key in CodeBlock.instances)
          if (CodeBlock.instances[key].label == label)
              return CodeBlock.instances[key];
      return undefined;
  }
    static download(filename:string, text:string) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
    static downloadfile(el:Element) {
      el = el.parentElement;
      let label = el.id.slice(0, -3);
      let codeblock = CodeBlock.byLabel(label)
      CodeBlock.download(label+".html", codeblock.html.replace(/&lt/g, "<")+"\n<script>\n"+codeblock.javascript+"</script>");
    }
    static instances: CodeBlock[] = [];
    static defaults = {
      label : function(){return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`},
      height:200, raw: false,
    }
    static argMap = {
      string : ["label", "html", "javascriptForEval", "css"],
      number : ["height"],
    }
  
    label:string;
    html:string;
    javascript:string;
    javascriptForEval:string;
    preCode:string = "";
    css:string;
    htmlDisplayCell: DisplayCell;
    javascriptDisplayCell: DisplayCell;
    evalDisplayCell: DisplayCell;

    height:number;
  
    displaycell: DisplayCell;
  
    constructor(...Arguments:any){
      CodeBlock.instances.push(this);
      mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
      this.javascript = `${this.preCode}H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
${this.javascriptForEval}
)`;
      // if (this.preCode) this.javascriptForEval = this.preCode + this.javascriptForEval;
      var elem = document.createElement('div');
      elem.innerHTML = this.html;
      document.body.appendChild(elem);
      this.html = `&lthtml lang="en">
  &lthead>&ltmeta charset="utf-8">&lttitle>liefs-layout-manager ${this.label}&lt/title>
  &ltscript src="${CodeBlock.fileNameAndPath}">&lt/script>
  ${(this.css) ? "&ltstyle>\n" + this.css + "\n&lt/style>\n" :""}&lt/head>
  &ltbody>
${this.html.replace(/</g, "&lt")}
  &lt/body>
&lt/html>`;
  
    this.build();
    }
    build(){
      let THIS = this;
      let htmlLabel = I(`${this.label}_html_label`,`HTML`, "20px", CSS.centerText);
      let htmlBody = I(`${this.label}_html`,`<pre><code class="language-markup">${this.html}</code></pre>`);
      this.htmlDisplayCell = 
        v(`${this.label}_v1`, "37.5%",
          htmlLabel,
          htmlBody,
        );
      let DBhtmlDisplayCell =
      dragbar(
        v(`${this.label}_v1_DB`, "37.5%",
          htmlLabel,
          htmlBody,
        ), 200, 600);
  
      this.javascriptDisplayCell = 
        v(`${this.label}_v2`, "37.5%",
          I(`${this.label}_javascript_label`,`Javascript`, "20px", CSS.centerText),
          I(`${this.label}_javascript`,`<pre><code class="language-javascript">${this.javascript}</code></pre>`),
        );
      let EvalLabel = I(`${this.label}_output_label`,`Rendered`, "20px", CSS.centerText)
      let EvalJS = eval(this.preCode + this.javascriptForEval)
      this.evalDisplayCell =
        v(`${this.label}_v3`, "25%",
          EvalLabel,
          EvalJS,
        );
      let DBevalDisplayCell =
      dragbar(
        v(`${this.label}_v3`, "25%",
          EvalLabel,
          EvalJS,
        ), 200, 600);
      let all3 =
        h(`${this.label}_h`, `${this.height}`, 5,
          DBhtmlDisplayCell,
          this.javascriptDisplayCell,
          DBevalDisplayCell,
        );
  
      let H_I_I_I = h(`${this.label}_buttons`, "25px", 5,
        I(`${this.label}_b2`,`Show Html Only <button onclick="CodeBlock.downloadfile(this)">Download</button>`,
            CSS.centerButton, Pages.button(`${this.label}_inner`, 1)),
        I(`${this.label}_b3`,"Show Javascript Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 2)),
        I(`${this.label}_b4`,"Show Rendered Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 3)),
      );
  
      let P_4Items = P(`${this.label}_inner`,
        all3,
        this.htmlDisplayCell,
        this.javascriptDisplayCell,
        this.evalDisplayCell,
      );
  
      // let title = I(`${this.label}_title`,this.label +" - " + this.discription, h1, "30px")
  
      let launch = I(`${this.label}_launch`,"Launch in new Tab - (then view-source!)", "25px", CSS.centerButton,
                          events({onclick: function(){
                                  Object.assign(document.createElement('a'), {
                                    target: '_blank',
                                    href: `./Examples/${THIS.label}.html`,
                                  }).click();
                    }}));
  
      let displaycell1 =
      v(`${this.label}_v0`, 2,
        // title,
        I(`${this.label}_b1`,"Show all 3 Inline", CSS.centerButton , Pages.button(`${this.label}_inner`, 0), "25px" ),
        H_I_I_I,
        P_4Items,
        launch,
      );
  
      let displaycell2 =
      v(`${this.label}_v0_2`, 2,
        // title,
        H_I_I_I,
        P_4Items,
        launch,
      );
  
      this.displaycell = P(`${this.label}_TopPage`,
        displaycell1,
        displaycell2,
        function(thisPages:Pages):number {
          let displaycell = thisPages.displaycells[thisPages.currentPage];
          let returnValue = (displaycell.coord.width > 1300) ? 0 : 1;
          if (returnValue != thisPages.currentPage) {
            let refPage = Pages.byLabel(this.label.slice(0, -8)+"_inner");
            refPage.currentPage = (returnValue) ? ((refPage.currentPage == 0) ? 1:refPage.currentPage) : 0;
          }
          //console.log(returnValue == thisPages.currentPage)
          // console.log(returnValue,refPage.currentPage)
          // if (!Handler.firstRun && returnValue == 1 && refPage.currentPage == 0) refPage.currentPage = 3;
          return returnValue;
        }
      )
    }
  static makeExamples(){


H("Example01",
codeblock("Example01", `<!-- Nothing Here in this example -->`,
          `  h("Example01",  // create Horizontal DisplayGroup (In DisplayCell)
I("Example01_1","one", css("#Example01_1","background-color:green;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
I("Example01_2","two", css("#Example01_2","background-color:cyan;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
)`,
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)


css("#Example01_a","background-color: green", false)
css("#Example01_b","background-color: cyan", false)
H("Example01a",
codeblock("Example01a", `    <div id="Example01_a">one</div>
<div id="Example01_b">two</div>`,
          `  h("Example01a",  // create Horizontal DisplayGroup (In DisplayCell)
I("Example01_a"), // create HtmlBlock (In DisplayCell) assumes "50%"
I("Example01_b"), // create HtmlBlock (In DisplayCell) assumes "50%"
)`,
`#Example01_a {background-color: green}\n#Example01_b {background-color: cyan}`
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)

H("Example01_c",
codeblock("Example01_c", `<!-- Nothing Here in this example -->`,
`  h("Example01_c",  // create Horizontal DisplayGroup (In DisplayCell)
    I("120px", "Example01_c1","one", css("bgGREEN","background-color:green;")), // fixed to 120 pixelx
    I("Example01_c2","two", css("bgCYAN","background-color:cyan;")), // assumes "100%"... of remaing pixels
  )`,
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)

H("Example01_d",
codeblock("Example01_d", `<!-- Nothing Here in this example -->`,
` h("Example01_d", 20,
    html("Example01_dBG", css("bgRED","background-color:red;")),
    I("Example01_d1","one", css("bgGREEN","background-color:green;")),
    I("Example01_d2","two", css("bgCYAN","background-color:cyan;")),
  )`,
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)

H("Example01_e",
codeblock("Example01_e", `<!-- Nothing Here in this example -->`,
`// First we Make a Standard Handler
  h("Example01_e", 4,
// The entire screen is divided into a horizontal group with "one" on the left, and "the rest" on the right
    html("Example01_eBG", css("bgRED","background-color:red;")),
// the margin of 4 should be colored red
    I("40px", "Example01_e1","one", css("bgGREEN","background-color:green;")),
// The "one" Cell should be 40 pixels in size, background green
    v("Example01_eBottomV", 8,
// The right side of the screen is within a vertical container
      html("Example01_eBG2", css("bgPINK","background-color:Pink;")),
// the cells between the vertical container of 8 pixels, should be pink
      I("50px","Example01_e2","two", css("bgCYAN","background-color:cyan;")),
// the top cell should be 50 pixels high, background cyan
      h("Example01_e3", 6,
// The right middle, should have a horizontal container
        html("Example01_eBG3", css("bgBLUE","background-color:blue;")),
// horizontal container margins of 6 pixels should be blue
        I("Example01_e3","three", css("bgGRAY","background-color:gray;")),
// the inner horizontal left side should be 80% of the size (see next line), and gray background
        I("20%","Example01_e4","four", css("bgORANGE","background-color:orange;")),
// the inner horizontal right side shold be 20% of the size, and orange background
      ),
      I("30%","Example01_e5","five", css("bgCORAL","background-color:Coral;")),
// the bottom of the right side vertical container should be 30% of the size, background coral
    ),
  )`,
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)


let preCode_f = `let bgRed = html("Example01_fBG", css("bgRED","background-color:red;"));
let bgPink = html("Example01_fBG2", css("bgPINK","background-color:Pink;"));
let bgBlue = html("Example01_fBG3", css("bgBLUE","background-color:blue;"));
let I_one = I("40px", "Example01_f1","one", css("bgGREEN","background-color:green;"));
let I_two = I("50px","Example01_f2","two", css("bgCYAN","background-color:cyan;"));
let I_three = I("Example01_f3","three", css("bgGRAY","background-color:gray;"));
let I_four = I("20%","Example01_f4","four", css("bgORANGE","background-color:orange;"));
let I_five = I("30%","Example01_f5","five", css("bgCORAL","background-color:Coral;"));
let h_inner = h("Example01_f3", 6, bgBlue, I_three, I_four);
let v_outer = v("Example01_fBottomV", 8, bgPink,
                        I_two, h_inner, I_five,);
`;

H("Example01_f",
codeblock("Example01_f", `<!-- Nothing Here in this example -->`,
`  h("Example01_f", 4,
    bgRed,
    I_one,
    v_outer,
  )`, {preCode : preCode_f}
),
false,
{postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)



  }
}
function codeblock(...Arguments:any){
  let cb = new CodeBlock(...Arguments);
  return cb.displaycell;
}
