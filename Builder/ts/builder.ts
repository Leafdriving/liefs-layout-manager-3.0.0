class Builder {
    constructor(){

    }
}
window.onload = function(){

let clientHandler = H("Client Window",
  I("Client_Main","Client Main"),
  false,
  new Coord(),
)

let mainBodyDisplayCell = I("Main_body");
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
Handler.activeHandlers.push(clientHandler);





}