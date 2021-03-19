// class PropModal extends Base {
//     static propModals: {[key: string]: PropModal} = {};
//     static labelNo = 0;
//     static instances:PropModal[] = [];
//     static activeInstances:PropModal[] = [];
//     static defaults = {width:400,height:400}
//     static argMap = {
//         string : ["label"],
//         Modal : ["modal"],
//         DisplayCell : ["displaycell"],
//         number : ["width", "height"],
//         function: ["byObjectFunction"],
//     }
//     static cellHeight = 25;
//     // retArgs:ArgsObj;   // <- this will appear
//     label: string; // also TYPE!

//     modal: Modal;
//     displaycell:DisplayCell;
//     width:number;
//     height:number;
//     byObjectFunction: Function;
//     theObject: object;

//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);

//         PropModal.makeLabel(this);

//         if (!this.modal) this.modal = new Modal(`${this.label}_Prop`, this.width, this.height);
        
//     }
//     // setLabel() {this.modal.setTitle(`${this.label}.${this.theObject["label"]} Properties`);}
//     static set(label:string, theObject:object){
//       let propInstance = PropModal.propModals[label];
//       // console.log(propInstance)
//       propInstance.theObject = theObject;
//       propInstance.modal.setBody(   PropModal.htmlBlock( (<HtmlBlock>theObject) )   );
//       //console.log(propInstance.modal)
//       return propInstance.modal;
//     }
//     static htmlBlock(htmlBlock: HtmlBlock, cellHeight:number = PropModal.cellHeight): DisplayCell { 
//       return v("htmlBlock_v",
//         h("htmlBlock_h", `${cellHeight}px`,
//             I("htmlBlock_label_",`Label:`),
//             I("htmlBlock_label", `${htmlBlock.label}`),
//         ),
//       )
//     }
// }

// PropModal.propModals["htmlBlock"] = new PropModal("htmlBlock", "htmlBlock", PropModal.htmlBlock);

class Builder {
    
    constructor(){
    }
    static hoverModalDisplayCell: DisplayCell = I("hoverModal", bCss.bgBlack)
    static hoverModal: Modal = new Modal("hoverModal", {fullCell: Builder.hoverModalDisplayCell});

    static HandlerMouseOver(mouseEvent:MouseEvent){
      let el:HTMLDivElement = this as unknown as HTMLDivElement;
      let coord = Handler.byLabel(el.innerHTML).coord;
      Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
      Builder.hoverModal.show();
    }
    static HandlerMouseLeave(event:MouseEvent){Builder.hoverModal.hide();}
    static HandlerEvent = events({onmouseover: Builder.HandlerMouseOver,
                                  onmouseleave: Builder.HandlerMouseLeave});


    static DisplayGroupMouseOver(event:MouseEvent){
      let el:HTMLDivElement = this as unknown as HTMLDivElement;
      let coord = DisplayGroup.byLabel(el.innerHTML).coord;
      Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
      Builder.hoverModal.show();
    }
    static DisplayGroupMouseLeave(event:MouseEvent){Builder.hoverModal.hide();}
    static DisplayGroupEvent = events({onmouseover: Builder.DisplayGroupMouseOver,
                                  onmouseleave: Builder.DisplayGroupMouseLeave});



    static PagesMouseOver(event:MouseEvent){
      let el:HTMLDivElement = this as unknown as HTMLDivElement;
      let coord = DisplayCell.byLabel(el.innerHTML + "_DisplayCell").coord;
      // console.log(Pages.byLabel(el.innerHTML+"_DisplayCell"))
      Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
      Builder.hoverModal.show();
    }
    static PagesMouseLeave(event:MouseEvent){Builder.hoverModal.hide();}
    static PagesEvent = events({onmouseover: Builder.PagesMouseOver,
                                  onmouseleave: Builder.PagesMouseLeave});



    static htmlBlockMouseOver(event:MouseEvent){
      let el:HTMLDivElement = this as unknown as HTMLDivElement;
      let coord = DisplayCell.byLabel(el.innerHTML).coord;
      Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
      Builder.hoverModal.show();
    }
    static htmlBlockMouseLeave(event:MouseEvent){Builder.hoverModal.hide();}
    static htmlBlockEvent = events({onmouseover: Builder.htmlBlockMouseOver,
                                  onmouseleave: Builder.htmlBlockMouseLeave});


    static updateTree(handler:Handler){
      let returnString = `TI("${handler.label}", bCss.handlerSVG ,Builder.HandlerEvent ,[\n`;
      returnString += Builder.DC(handler.rootCell, "\t");
      returnString += "])"
      let treeOfNodes:t_ = eval(returnString)
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
      return indent + `TI("${htmlblock.label}", bCss.ISVG, Builder.htmlBlockEvent),\n`
    }
    static DG(displaygroup: DisplayGroup, indent:string){
      let returnString = indent + `TI("${displaygroup.label}", ${(displaygroup.ishor) ? "bCss.hSVG" :"bCss.vSVG"} , Builder.DisplayGroupEvent ,[\n`
      for (let index = 0; index < displaygroup.cellArray.length; index++) {
        const displaycell = displaygroup.cellArray[index];
        returnString += Builder.DC(displaycell, indent + "\t")
      }
      returnString += indent + `]),\n`
      return returnString;
    }
    static PG(pages:Pages, indent:string) {
      // console.log("Here");
      let returnString = indent + `TI("${pages.label}", bCss.pagesSVG ,Builder.PagesEvent,[\n`
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

let TOOLBAR = tool_bar("Main_toolbar", 40, 25,
  I("toolbarb1",`<button style="width:100%; height:100%">1</button>`),
  I("toolbarb2",`<button style="width:100%; height:100%">2</button>`),
  I("toolbarb3",`<button style="width:100%; height:100%">3</button>`),
);
// console.log("ToolBar", TOOLBAR)

let mainHandler = H("Main Window", 4,
  v("Main_v",
    h("MenuBar", "20px",
      I("MenuBar_File","File", "35px", bCss.menuItem),
      I("MenuBar_Edit","Edit", "35px", bCss.menuItem),
      I("MenuBar_Spacer", "", bCss.menuSpace)
    ),
    /*dockable(*/v("Main_Dockable",
      TOOLBAR,
      /*dockable(*/
      h("Tree_Body", 5,
        tree("Display",
          dragbar(I("Main_tree", "300px", bCss.bgLight), 100, 600),
          Builder.updateTree(clientHandler),
          {SVGColor: "Black"},
          25,
        ),
        mainBodyDisplayCell
      ),
      /*)*/

    ) /*)*/ ,
  )
);
Handler.activate(clientHandler);
}