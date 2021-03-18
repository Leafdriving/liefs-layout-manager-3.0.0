declare var Prism:any;

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  let treeNode = TreeNode.byLabel(this.id);
  let tree = TreeNode.parentTree(treeNode);
  if (treeNode.collapsed)
    tree.toggleCollapse(treeNode, undefined, undefined)

  console.log(TreeNode.path(treeNode));
}});

function header(label:string, index:number, size=120){
  let noPages = 9;
  return v(label, 5,
    I("1px"),
    h(`${label}_h`, "25px", 15,
      I("1px"),
      I(`${label}_label`, label, CSS.insetLarge, `${size}px`),
      I(),
      I(`${label}_prev`,"Previous Page", CSS.h1h ,"145px", Pages.button("PAGES", (index <= 0) ? 0 : index-1)),
      I(`${label}_next`,"Next Page", CSS.h1h,"110px", Pages.button("PAGES", (index >= noPages) ? index : index + 1)),
      I("15px")
    ),
    I(label, CSS.textBlack),
  )
  }
  
let MainPages = P("PAGES",
  header("Welcome", 0),
    header("Installation", 1),
    header("The Basics", 2),
      header("HTML vs Javascript", 3, 200),
      header("Basics - DisplayCell", 4, 210),
      header("Functions & Objects", 5, 205),
      header("Arguments By Type", 6, 200),
      header("Functions", 7),
      header("Handlers", 8),
      header("DisplayGroups", 9, 160),
  )


let treeOfNodes:t_ = 
TI("Welcome to Liefs-Layout-Manager", Pages.button("PAGES",0), /* {attributes : {pagebutton : "PAGES|0"} */
    [TI("Installation", Pages.button("PAGES",1) ),
    TI("The Basics", Pages.button("PAGES",2),
        [TI("HTML vs Javascript", Pages.button("PAGES",3)),
        TI("DisplayCell", Pages.button("PAGES",4))]
    ),
    TI("Functions & Objects", Pages.button("PAGES",5),
        [TI("Arguments By Type", Pages.button("PAGES",6)),

          TI(true, "Functions", Pages.button("PAGES",7),
           [TI("H()", Pages.button("PAGES",8)),
            TI("h() v()", Pages.button("PAGES",9)),
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
        ]
      ),
    ],
)

let mainTree =
tree( "TOC",
  dragbar(I("MainTree", "", CSS.bgLBlue2, "300px"),100, 500),
  treeOfNodes,
  {SVGColor:"black"},
  clickTreeItemEvent,
  CSS.cssNode,
  20, 4,
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
                                                        //// pages Here.


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
              if (Handler.activeInstances.indexOf(slideMenu) == -1) {
                Handler.activeInstances.push(slideMenu);
                Handler.update();
              }
              else slideMenu.pop();
      }})),
    I("TitleBar2", CSS.cssTitle),
  ),
  MainPages,
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

