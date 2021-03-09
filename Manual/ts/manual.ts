declare var Prism:any;

class CodeBlock {
  static instances: CodeBlock[] = [];
  static defaults = {
    label : function(){return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`},
    height:200,
  }
  static argMap = {
    string : ["label", "html", "javascriptForEval", "css"],
    number : ["height"]
  }

  label:string;
  html:string;
  javascript:string;
  javascriptForEval:string;
  css:string;

  htmlDisplayCell: DisplayCell;
  javascriptDisplayCell: DisplayCell;
  evalDisplayCell: DisplayCell;

  height:number;

  displaycell: DisplayCell;

  constructor(...Arguments:any){
    CodeBlock.instances.push(this);
    mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
    this.javascript = `H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
  ${this.javascriptForEval.replace(/\n/g, "\n  ")}
)`;
    var elem = document.createElement('div');
    elem.innerHTML = this.html.replace(/\n/g, "\n  ");
    document.body.appendChild(elem);
    this.html = `&lthtml lang="en">
  &lthead>&ltmeta charset="utf-8">&lttitle>My title&lt/title>
  &ltscript src="../js/liefs-layout-managerV3.0.0.js">&lt/script>
  &lt/head>
  &ltbody>
  ${this.html.replace(/\n/g, "\n  ").replace(/</g, "&lt")}
  &lt/body>
&lt/html>`;

  this.build();
  }
  build(){
    this.htmlDisplayCell = 
      v(`${this.label}_v1`,
        I(`${this.label}_html_label`,`HTML`, "20px", centerText),
        I(`${this.label}_html`,`<pre><code class="language-markup">${this.html}</code></pre>`),
      );
    this.javascriptDisplayCell = 
      v(`${this.label}_v2`,
        I(`${this.label}_javascript_label`,`Javascript`, "20px", centerText),
        I(`${this.label}_javascript`,`<pre><code class="language-javascript">${this.javascript}</code></pre>`),
      );
    this.evalDisplayCell =
      v(`${this.label}_v3`,
        I(`${this.label}_output_label`,`Rendered`, "20px", centerText),
        eval(this.javascriptForEval),
      );
    let all3 =
      h(`${this.label}_h`, `${this.height}`, 5,
        dragbar(this.htmlDisplayCell, 200, 800),
        this.javascriptDisplayCell,
        dragbar(this.evalDisplayCell, 200, 800),
      );

    this.displaycell =
    v(`${this.label}_v0`,
      h(`${this.label}_buttons`, "25px", 4,
        I(`${this.label}_b1`,"Show all 3 Inline", centerButton , Pages.button(`${this.label}_pages`, 0) ),
        I(`${this.label}_b2`,"Show Html Only", centerButton, Pages.button(`${this.label}_pages`, 1)),
        I(`${this.label}_b3`,"Show Javascript Only", centerButton, Pages.button(`${this.label}_pages`, 2)),
        I(`${this.label}_b4`,"Show Rendered Only", centerButton, Pages.button(`${this.label}_pages`, 3)),
      ),

      P(`${this.label}_pages`, // 3,
        all3,
        this.htmlDisplayCell,
        this.javascriptDisplayCell,
        this.evalDisplayCell
      )


      // all3,
    );
  }
}
function codeblock(...Arguments:any){
  let cb = new CodeBlock(...Arguments);
  return cb.displaycell;
}

// CSS

new Css("h1",`border: 2px solid #1C6EA4;
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
new Css("p",`text-indent: 30px;
             margin-left: 10px;
             font-size: 18px;`, false);
              

let cssNode = css("cssNode",`background-color:#edf9fa;border-radius: 5px;padding-left: 5px;padding-right: 5px;`,
                            `background-color:#eaeda6;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`,
                            `background-color:#f7ebeb;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`,)

let bgBlue = css("bgBlue",`background-color:blue;`);
let bgGreen = css("bgGreen", `background-color:green`);
let bgRed = css("bgRed", `background-color:red`);
let bgBlack = css("bgBlack", `background-color:black`);

let textWhite = css("textWhite", "color:white");
let textBlue = css("textBlue", "color:blue");
let textCenter = css("textCenter", "text-align: center;");
let textBlack = css("textBlack", "color:black;overflow-y: auto;")

let cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;")

let cssBold = css("bold", "text-decoration: underline;font-weight:bold;background-color: yellow;")

let centerText = css("centerText", `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: blue;color:white;font-weight: bold;`);
let centerButton = css("centerButton",
`display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #ADD8E6;`
+`color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;`,
`display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #839ae6;`
+`color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;`,
`display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #4D4DFF;`
+`color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;`
);

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  // console.log(this);
  // console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
}});

let treeOfNodes:t_ = 
TI("Welcome to Liefs-Layout-Manager", {attributes : {pagebutton : "PAGES|0"}},
    [TI("Installation", Pages.button("PAGES",1) ),
    TI("Part 2"),
    TI("Part 3",
        [TI("3a")]),
    ],
)

// Framework

H("MainHandler", 4,
  v("Main Vertical",
    I("TitleBar", "30px", cssTitle),
    h("MainBody", 5,
      tree( "TreeLabel",
        dragbar(I("MainTree", "", bgGreen, "300px"),100, 500),
        treeOfNodes,
        {SVGColor:"black"},
        clickTreeItemEvent,
        cssNode,
      ),
      P("PAGES",
        I("Welcome", textBlack),
        I("Installation", textBlack),
      ),
    ),
  ),
  {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
  //false,
);
H("Example01",
    codeblock("Example01", `<!-- Nothing Here -->`, `h("Example01",  // create Horizontal DisplayGroup (In DisplayCell)
  I("Example01_1","one", css("#Example01_1","background-color:green;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
  I("Example01_2","two", css("#Example01_2","background-color:cyan;", false)), // create HtmlBlock (In DisplayCell) assumes "50%"
)`),
    //I("phew", "phew"),
    false,
    {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)