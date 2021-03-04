declare var Prism:any;
// CSS
let bgBlue = css("bgBlue",`background-color:blue;`);
let bgGreen = css("bgGreen", `background-color:green`);
let bgRed = css("bgRed", `background-color:red`);
let bgBlack = css("bgBlack", `background-color:black`);

let textWhite = css("textWhite", "color:white");
let textBlue = css("textBlue", "color:blue");
let textCenter = css("textCenter", "text-align: center;");
let textBlack = css("textBlack", "color:black;")

let cssTitle = css("title", "background-color:blue;color:white;text-align: center;")

// Build Tree

let printNode = events({onclick:function(mouseEvent:MouseEvent){
  console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
}});

let TableOfContents = autoLabelTreenodes("myLabel",
  TI("Table of Contents", printNode,
      [TI("Introduction", printNode),
      TI("Part 2", printNode),
      TI("Part 3", printNode,
          [TI("3a", printNode)]),
      ],
  )
)

// Framework

H("MainHandler", 2,
  v("Main Vertical",
    I("TitleBar", "20px", cssTitle),
    h("MainBody", 5,
      tree( dragbar(I("MainTree", "", bgGreen, "250px"),100, 500), TableOfContents, /* bgRed */{SVGColor:"black"} ),
      P("BPages", I("MainBody", textBlack)),
      // I("Body", "Body")
    ),
  ),
  {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)