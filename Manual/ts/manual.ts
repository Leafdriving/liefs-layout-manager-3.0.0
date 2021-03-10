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

let mainTree =
tree( "TOC",
  dragbar(I("MainTree", "", CSS.bgGreen, "300px"),100, 500),
  treeOfNodes,
  {SVGColor:"black"},
  clickTreeItemEvent,
  CSS.cssNode,
)

let slideTree =
tree( "TOC_slide",
  I("SlideTree", "", CSS.bgBlack, "350px"),
  treeOfNodes,
  {SVGColor:"white"},
  CSS.slideTree,
  35,
  events({onclick:function(){slideMenu.pop()}})
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
    mainTree,
    MainPages,
  ),
)
let MenuSvgSize = 40;
let SmallScreen =
v("Small_v",
  h("Small_h", `${MenuSvgSize}px`,
    I("MenuButton", CSS.menu_SVG(MenuSvgSize) , `${MenuSvgSize}px`, CSS.menuButton, events({
      onclick:function(){
              if (Handler.activeHandlers.indexOf(slideMenu) == -1) {
                Handler.activeHandlers.push(slideMenu);
                Handler.update();
              }
              else slideMenu.pop();
      }})),
    I("TitleBar2", CSS.cssTitle),
  ),
  MainPages,
)

let sizeFunction = function(thisPages:Pages):number {
  let [x, y] = pf.viewport();
  if (x > 920) slideMenu.pop();
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
let slideMenu =
H("SlideMenu",
  v("slide_v",
    I(`${MenuSvgSize}px`),
    h("slide_h",
      slideTree,
      I(),
    )
  ),
  false,
)
