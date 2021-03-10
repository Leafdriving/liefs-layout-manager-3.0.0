declare var Prism:any;

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  // console.log(this);
  // console.log( TreeNode.byLabel(this.id).labelCell.htmlBlock.innerHTML )
}});

let treeOfNodes:t_ = 
TI("Welcome to Liefs-Layout-Manager", {attributes : {pagebutton : "PAGES|0"}},
    [TI("Installation", Pages.button("PAGES",1) ),
    TI("The Basics", Pages.button("PAGES",2),
        [TI("DisplayCell", Pages.button("PAGES",3))
        ]
    ),
    TI("Part 3",
        [TI("3a")]),
    ],
)

// Framework

let MainPages = P("PAGES",
  I("Welcome", CSS.textBlack),
  I("Installation", CSS.textBlack),
  I("TheBasics", CSS.textBlack),
  I("BasicsDisplayCell", CSS.textBlack),
)

let LargeScreen =
v("Main Vertical",
  I("TitleBar", "30px", CSS.cssTitle),
  h("MainBody", 5,
    tree( "TOC",
      dragbar(I("MainTree", "", CSS.bgGreen, "300px"),100, 500),
      treeOfNodes,
      {SVGColor:"black"},
      clickTreeItemEvent,
      CSS.cssNode,
    ),
    MainPages,
  ),
)
let SmallScreen =
v("Small_v",
  h("Small_h", "40px",
    I("MenuButton", CSS.menu_SVG(40) , "40px", CSS.menuButton),
    I("TitleBar2", CSS.cssTitle),
  ),
  MainPages,
)



let sizeFunction = function(thisPages:Pages):number {
  let [x, y] = pf.viewport();
  // if (returnValue != thisPages.currentPage) {}
  return (x > 920) ? 0 : 1;
}

H("MainHandler", 4,
  P("MainSizer",
    LargeScreen,
    SmallScreen,
    sizeFunction,
  ),
  {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
  //false,
);
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