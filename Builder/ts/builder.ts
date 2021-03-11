class Builder {
    constructor(){
    }
    static updateTree(handler:Handler){
      console.log("Updating Tree");
      console.group("Handler: " + handler.label);
      Builder.DC(handler.rootCell);
      console.groupEnd();
    }
    static DC(displaycell:DisplayCell) {
      // console.group("DisplayCell: " + displaycell.label);
      if (displaycell.htmlBlock) Builder.HB(displaycell.htmlBlock);
      if (displaycell.displaygroup) Builder.DG(displaycell.displaygroup);
      if (displaycell.pages) Builder.PG(displaycell.pages);
      // console.groupEnd()
    }
    static HB(htmlblock:HtmlBlock) {
      console.log("HtmlBlock: " + htmlblock.label);
    }
    static DG(displaygroup: DisplayGroup){
      console.group("DisplayGroup: " + displaygroup.label);
      for (let index = 0; index < displaygroup.cellArray.length; index++) {
        const displaycell = displaygroup.cellArray[index];
        Builder.DC(displaycell);
      }
      console.groupEnd();
    }
    static PG(pages:Pages) {
      console.group(pages.label);
      for (let index = 0; index < pages.displaycells.length; index++) {
        Builder.DC(pages.displaycells[index]);
      }
      console.groupEnd();
    }
}

// let treeOfNodes:t_ = 
// TI("Welcome to Liefs-Layout-Manager", {attributes : {pagebutton : "PAGES|0"}},
//     [TI("Installation", Pages.button("PAGES",1) ),
//     TI("The Basics", Pages.button("PAGES",2),
//         [TI("HTML vs Javascript", Pages.button("PAGES",3)),
//         TI("DisplayCell", Pages.button("PAGES",4))]
//     ),
//     TI("Part 3",
//         [TI("3a")]),
//     ],
// )




window.onload = function(){



let mainBodyDisplayCell = I("Main_body", bCss.menuItem);
mainBodyDisplayCell.postRenderCallback = 
  function(displaycell: DisplayCell, displaygroup:DisplayGroup, index:number, derender:boolean) {
    Handler.byLabel("Client Window").coord.copy(displaycell.coord);
  }

let mainHandler = H("Main Window", 4,
  v("Main_v",
    h("MenuBar", "20px",
      I("MenuBar_File","File", "35px", bCss.menuItem),
      I("MenuBar_Edit","Edit", "35px", bCss.menuItem),
      I("MenuBar_Spacer", "", bCss.menuSpace)
    ),
    I("Main_toolbar", "Toolbar", "24px", bCss.bgBlue),
    h("Tree_Body", 5,
      dragbar(I("Main_tree","Tree", "300px", bCss.bgGreen), 100, 600),
      mainBodyDisplayCell
    )
  )
)
let clientHandler = H("Client Window",
  I("Client_Main","Client Main"),
  // false,
  new Coord(),
  function(){Builder.updateTree(Handler.byLabel("Main Window"))}
)





}