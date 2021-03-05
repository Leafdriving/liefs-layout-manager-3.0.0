declare var Prism:any;
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
let textBlack = css("textBlack", "color:black;")

let cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;")

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  console.log(this);
  console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
}});

let treeOfNodes:t_ = 
TI("Welcome to Liefs-Layout-Manager", {attributes : {pagebutton : "PAGES|0"}},
    [TI("Introduction", Pages.button("PAGES",1) ),
    TI("Part 2"),
    TI("Part 3",
        [TI("3a")]),
    ],
)

// Framework

H("MainHandler", 2,
  v("Main Vertical",
    I("TitleBar", "30px", cssTitle),
    h("MainBody", 5,
      tree( "TreeLabel",
        dragbar(I("MainTree", "", bgGreen, "250px"),100, 500),
        treeOfNodes,
        {SVGColor:"black"},
        clickTreeItemEvent,
        cssNode,
      ),
      P("PAGES",
        I("Welcome", textBlack),
        I("Introduction", textBlack),
      ),
    ),
  ),
  {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)