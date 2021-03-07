declare var Prism:any;

class CodeBlock {
  static instances: CodeBlock[] = [];
  static defaults = {
    label : function(){return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`},
    height:200,
  }
  static argMap = {
    string : ["html", "javascript", "css"],
    number : ["height"]
  }

  label:string;
  html:string;
  javascript:string;
  css:string;

  height:number;

  displaycell: DisplayCell;

  constructor(...Arguments:any){
    CodeBlock.instances.push(this);
    mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
    this.build();
  }
  build(){
    this.displaycell =
    h(`${this.label}_h`, `${this.height}`, 2,
      I(`${this.label}_html`,`<pre><code class="language-markup">${this.html}</code></pre>`),
      I(`${this.label}_javascript`,`<pre><code class="language-javascript">${this.javascript}</code></pre>`),
      I(`${this.label}_css`,`<pre><code class="language-css">${this.css}</code></pre>`),
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
H("CBlock_001",
    codeblock("html", "javascript", "css"),
    false,
    {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)