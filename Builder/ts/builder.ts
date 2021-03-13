class Builder {
    constructor(){
    }
    static updateTree(handler:Handler){
      let returnString = `TI("${handler.label}", bCss.handlerSVG ,[\n`;
      // console.log("Updating Tree");
      returnString += Builder.DC(handler.rootCell, "\t");
      returnString += "])"
      let treeOfNodes:t_ = eval(returnString)
      // console.log(treeOfNodes)
      return treeOfNodes;
    }
    static DC(displaycell:DisplayCell, indent:string) {
      let returnString = "";
      if (displaycell.htmlBlock) returnString += Builder.HB(displaycell.htmlBlock, indent);
      if (displaycell.displaygroup) returnString += Builder.DG(displaycell.displaygroup, indent);
      if (displaycell.pages) returnString += Builder.PG(displaycell.pages, indent);
      return returnString;
    }
    static HB(htmlblock:HtmlBlock, indent:string) {
      return indent + `TI("${htmlblock.label}", bCss.ISVG),\n`
    }
    static DG(displaygroup: DisplayGroup, indent:string){
      let returnString = indent + `TI("${displaygroup.label}", ${(displaygroup.ishor) ? "bCss.hSVG" :"bCss.vSVG"} ,[\n`
      for (let index = 0; index < displaygroup.cellArray.length; index++) {
        const displaycell = displaygroup.cellArray[index];
        returnString += Builder.DC(displaycell, indent + "\t")
      }
      returnString += indent + `]),\n`
      return returnString;
    }
    static PG(pages:Pages, indent:string) {
      console.log("Here");
      let returnString = indent + `TI("${pages.label}", bCss.pagesSVG ,[\n`
      for (let index = 0; index < pages.displaycells.length; index++) {
        const displaycell = pages.displaycells[index];
        returnString += Builder.DC(displaycell, indent + "\t")
      }
      returnString += indent + `])\n`
      return returnString
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



let mainBodyDisplayCell = I("Main_body");
mainBodyDisplayCell.postRenderCallback = 
  function(displaycell: DisplayCell, displaygroup:DisplayGroup, index:number, derender:boolean) {
    Handler.byLabel("Client Window").coord.copy(displaycell.coord);
  }


let clientHandler =
H("Client Window",
  h("Client_h", 5,
    I("Client_Main1","left", bCss.bgCyan),
    v("Client_v", 5,
      I("Client_Top","top", bCss.bgGreen),
      P("MainPages",
        I("Client_Bottom1","bottom1", bCss.bgBlue),
        I("Client_Bottom2","bottom2", bCss.bgLight),
      )
    )
  ),
  false,
  new Coord(),
  function(){
    // console.log(  Builder.updateTree(clientHandler)   );
  }
);

let mainHandler = H("Main Window", 4,
  v("Main_v",
    h("MenuBar", "20px",
      I("MenuBar_File","File", "35px", bCss.menuItem),
      I("MenuBar_Edit","Edit", "35px", bCss.menuItem),
      I("MenuBar_Spacer", "", bCss.menuSpace)
    ),
    I("Main_toolbar", "Toolbar", "24px", bCss.bgBlue),
    h("Tree_Body", 5,
      tree("Display",
        dragbar(I("Main_tree", "300px", bCss.bgLight), 100, 600),
        Builder.updateTree(clientHandler),
        {SVGColor: "Black"},
        25,
      ),
      mainBodyDisplayCell
    )
  )
);
Handler.activate(clientHandler);







}