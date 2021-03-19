declare var Prism:any;

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  let treeNode = TreeNode.byLabel(this.id);
  let tree = TreeNode.parentTree(treeNode);
  if (treeNode.collapsed)
    tree.toggleCollapse(treeNode, undefined, undefined)

  // console.log(TreeNode.path(treeNode));
}});

function header(label:string, index:number, size=120){
  let noPages = 52;
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
      header("HtmlBlocks", 10, 130),
      header("pages", 11),
      header("css", 12),
      header("swipe", 13),
      header("DragBars", 14),
      header("events", 15),
      header("Htmlblock", 16),
      header("stretch", 17),
      header("dockable", 18),
      header("Toolbars", 19),
      header("Trees", 20),
      header("TI", 21),
      header("Objects", 22),
      header("Base", 23),
      header("HtmlBlock", 24),
      header("DisplayCells", 25, 130),
      header("DisplayGroup", 26, 140),
      header("Coord", 27),
      header("Context", 28),
      header("Css", 29),
      header("Default Theme", 30, 150),
      header("Drag", 31),
      header("Swipe", 32),
      header("DragBar", 33),
      header("Events", 34),
      header("FunctionStack", 35, 160),
      header("Handler", 36),
      header("Hold", 37),
      header("Modal", 38),
      header("Stretch", 39),
      header("Observe", 40),
      header("Overlay", 41),
      header("Pages", 42),
      header("pf_mf", 43),
      header("ScrollBar", 44),
      header("Dockable", 45),
      header("ToolBar", 46),
      header("TreeNode", 47),
      header("Tree", 48),
      header("i_", 49),
      header("t_", 50),
      header("Examples", 51),
      header("Examples_01", 52, 180),
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
            TI("I()", Pages.button("PAGES",10)),
            TI("P()", Pages.button("PAGES", 11)),
            TI("css()", Pages.button("PAGES", 12)),
            TI("swipe()", Pages.button("PAGES", 13)),
            TI("dragbar()", Pages.button("PAGES", 14)),
            TI("events", Pages.button("PAGES", 15)),
            TI("html()", Pages.button("PAGES", 16)),
            TI("stretch()", Pages.button("PAGES", 17)),
            TI("dockable()", Pages.button("PAGES", 18)),
            TI("tool_bar()", Pages.button("PAGES", 19)),
            TI("tree()", Pages.button("PAGES", 20)),
            TI("TI()", Pages.button("PAGES", 21)),
        ]),

        TI(true, "Objects", Pages.button("PAGES", 22), [
          TI("Base", Pages.button("PAGES", 23)),
          TI("htmlBlock", Pages.button("PAGES", 24)),
          TI("DisplayCell", Pages.button("PAGES", 25)),
          TI("DisplayGroup", Pages.button("PAGES", 26)),
          TI("Coord", Pages.button("PAGES", 27)),
          TI("Context", Pages.button("PAGES", 28)),
          TI("Css", Pages.button("PAGES", 29)),
          TI("DefaultTheme", Pages.button("PAGES", 30)),
          TI("Drag", Pages.button("PAGES", 31)),
          TI("Swipe", Pages.button("PAGES", 32)),
          TI("DragBar", Pages.button("PAGES", 33)),
          TI("Events", Pages.button("PAGES", 34)),
          TI("FunctionStack", Pages.button("PAGES", 35)),
          TI("Handler", Pages.button("PAGES", 36)),
          TI("Hold", Pages.button("PAGES", 37)),
          TI("Modal",  Pages.button("PAGES", 38)),
          TI("Stretch",  Pages.button("PAGES", 39)),
          TI("Observe",  Pages.button("PAGES", 40)),
          TI("Overlay",  Pages.button("PAGES", 41)),
          TI("Pages",  Pages.button("PAGES", 42)),
          TI("pf/mf",  Pages.button("PAGES", 43)),
          TI("ScrollBar",  Pages.button("PAGES", 44)),
          TI("Dockable",  Pages.button("PAGES", 45)),
          TI("ToolBar",  Pages.button("PAGES", 46)),
          TI("TreeNode",  Pages.button("PAGES", 47)),
          TI("Tree",  Pages.button("PAGES", 48)),
          TI("i_",  Pages.button("PAGES", 49)),
          TI("t_",  Pages.button("PAGES", 50)), 
          ]),
          TI(/* true,*/ "Examples",  Pages.button("PAGES", 51), [
            TI("01 Basics",  Pages.button("PAGES", 52)),
            TI("Example01a"),

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
CodeBlock.makeExamples();
