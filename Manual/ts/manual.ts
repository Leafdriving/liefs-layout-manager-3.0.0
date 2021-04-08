declare var Prism:any;

// Build Tree

let clickTreeItemEvent = events({onclick:function(mouseEvent:MouseEvent){
  
  let treeNode = <node_>node_.byLabel(this.id);
  let tree = treeNode.ParentNodeTree;
  console.log("Tree Item Clicked", treeNode)
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
let gotoPage = function(PageName:string):Events { return events({onclick: function(){Pages.setPage("PAGES", PageName)}})}
let pagesNode = new node_("Table Of Contents");
let makearray = function(name:string, num:number = undefined){
  let returnArray:any =  [name, I(name+"_", name, gotoPage(name))];
  if (num) returnArray.push(num);
  return returnArray; // ...makearray("Trees")
}
 pagesNode.newChild( ...makearray("Welcome") )
          .newSibling( ...makearray("Installation"))
          .newSibling( ...makearray("The Basics") )
              .newChild( ...makearray("HTML vs Javascript", 200) )
              .newSibling( ...makearray("Basics - DisplayCell", 210) )
              .newSibling( ...makearray("Functions & Objects", 205) )
              .newSibling( ...makearray("Arguments By Type", 200) )
              .newSibling( ...makearray("Functions") )
              .newSibling( ...makearray("Handlers") )
              .newSibling( ...makearray("DisplayGroups") )
              .newSibling( ...makearray("HtmlBlocks") )
              .newSibling( ...makearray("pages") )
              .newSibling( ...makearray("css") )
              .newSibling( ...makearray("swipe") )
              .newSibling( ...makearray("DragBars") )
              .newSibling( ...makearray("events") )
              .newSibling( ...makearray("Htmlblock") )
              .newSibling( ...makearray("stretch") )
              .newSibling( ...makearray("dockable") )
              .newSibling( ...makearray("Toolbars") )
              .newSibling( ...makearray("Trees") )
          .parent()
          .newChild( ...makearray("Objects") )
              .newSibling( ...makearray("Base"))
              .newSibling( ...makearray("HtmlBlock"))
              .newSibling( ...makearray("DisplayCells"))
              .newSibling( ...makearray("DisplayGroup"))
              .newSibling( ...makearray("Coord"))
              .newSibling( ...makearray("Context"))
              .newSibling( ...makearray("Css"))
              .newSibling( ...makearray("Default Theme"))
              .newSibling( ...makearray("Drag"))
              .newSibling( ...makearray("Swipe"))
              .newSibling( ...makearray("DragBar"))
              .newSibling( ...makearray("Events"))
              .newSibling( ...makearray("FunctionStack"))
              .newSibling( ...makearray("Handler"))
              .newSibling( ...makearray("Hold"))
              .newSibling( ...makearray("Modal"))
              .newSibling( ...makearray("Stretch"))
              .newSibling( ...makearray("Observe"))
              .newSibling( ...makearray("Overlay"))
              .newSibling( ...makearray("Pages"))
              .newSibling( ...makearray("pf_mf"))
              .newSibling( ...makearray("ScrollBar"))
              .newSibling( ...makearray("Dockable"))
              .newSibling( ...makearray("ToolBar"))
              .newSibling( ...makearray("TreeNode"))
              .newSibling( ...makearray("Tree"))
          .parent()
          .newSibling( ...makearray("Examples"))
              .newChild( ...makearray("Examples_01"))





              
let pagesArray:DisplayCell[] = [];
let counter=0;
node_.traverse(pagesNode,function(node:node_){
    if (node.Arguments.length == 2)
      pagesArray.push( header(node.label, counter++) )
    else 
      pagesArray.push( header(node.label, counter++, node.Arguments[2]) )
})
let MainPages = P("PAGES", ...pagesArray)
MainPages.pages.currentPage = 1;



let mainTree =
tree( "TOC",
  dragbar(I("MainTree", "", CSS.bgLBlue2, "300px"),100, 500),
  {SVGColor:"black"},
  clickTreeItemEvent,
  CSS.cssNode,
  pagesNode,
  20, 4,
)

let slideTree =
tree( "TOC_slide",
  I("SlideTree", "", CSS.bgBlack, "350px"),
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
                Render.update();
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
