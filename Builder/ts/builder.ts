class Builder extends Base {
    static labelNo = 0;
    static instances:Builder[] = [];
    static activeInstances:Builder[] = [];
    static defaults = {
    }
    static argMap = {
        string : ["label"],
    }
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Builder.makeLabel(this);
    }
    static clientHandler: Handler;
    static buildClientHandler() {
        Builder.clientHandler =
            H("Client Window",
                h("Client_h", 5,
                    I("Client_Main1","left", /*bCss.bgCyan,*/ "500px"),
                    I("Client_Main2","right", bCss.bgCyan, "500px"),
                    // v("Client_v", 5,
                    //     I("Client_Top","top", bCss.bgGreen),
                    //     P("MainPages", "500px",
                    //         I("Client_Bottom1","bottom1", bCss.bgBlue),
                    //         I("Client_Bottom2","bottom2", bCss.bgLight),
                    //     )
                    // )
                ),
                false,
            );
    }
    static propertiesModal: winModal;
    static hoverModal=new Modal("BuilderHover",I("BuilderHoverDummy" /*,bCss.bgwhite*/ ));
 


    static mainHandler: Handler;
    static buildMainHandler() {
        let treePagesDisplayCell = P("pagename",
                                        tree("HandlerTree", 
                                            I("Handler_Tree", bCss.bgLight),
                                            bCss.bgCyan, sample().rootNode ),
                                        I("TWO","TWO",bCss.bgCyan)
                                    );

        Builder.mainHandler = H("Main Window", 4,
        v("Main_v",
          h("MenuBar", "20px",
            I("MenuBar_File","File", "35px", bCss.menuItem),
            I("MenuBar_Edit","Edit", "35px", bCss.menuItem),
            I("MenuBar_Spacer", "", bCss.menuSpace)
          ),
          dockable(v("Main_Dockable",
            Builder.TOOLBAR,
            dockable(h("Tree_Body", 5,
                        dragbar(
                            v("TreeTops", "300px", 5,
                                pageselect("name","20px", treePagesDisplayCell),
                                treePagesDisplayCell,
                            ),
                            200,1000),
                        bindHandler(I("Main_body"), Builder.clientHandler)
            ))
          ))
        )
      )
    }
    static updateTree(){
        let node = node_.byLabel("Handler_Client Window");
        if (node)Tree_.byLabel("HandlerTree").newRoot( node );

    }
    static TOOLBAR = toolBar("Main_toolbar", 40, 25,
        I("toolbarb1",`<button style="width:100%; height:100%">1</button>`),
        I("toolbarb2",`<button style="width:100%; height:100%">2</button>`),
        I("toolbarb3",`<button style="width:100%; height:100%">3</button>`),
    );
}

Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
setTimeout(() => {
    Builder.updateTree();Render.update();
}, 0);


let outside = new Modal("outside",I("outside_", css("outside","background:red;opacity:0.25")));
let inside = new Modal("inside", I("inside_", css("inside","background:green;opacity:0.25")));
let show = function(coord:Coord) {
    outside.setSize(coord.x, coord.y, coord.width, coord.height);
    inside.setSize(coord.within.x, coord.within.y, coord.within.width, coord.within.height);
    outside.show()
    inside.show()
}
let hide = function(){
    outside.hide();
    inside.hide();
}

   // static xboxSVG(boundCoord:Coord, Boxes:Coord[]){
    //     let top:string = `<svg width="${boundCoord.width}" height="${boundCoord.height}">`;
    //     let bottom:string = `</svg>`;
    //     let mid:string = "";
    //     for (let index = 0; index < Boxes.length; index++) {
    //         const coord = Boxes[index];
    //         let offset = 1;
    //         let x = coord.x -boundCoord.x + offset;
    //         let y = coord.y - boundCoord.y + offset;
    //         let width = coord.width- offset*2;
    //         let height = coord.height-offset*2;
    //         mid += `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill-opacity:0;stroke-width:3;stroke:red" />`
    //               +`<line x1="${x}" y1="${y}" x2="${x+width}" y2="${height}" style="stroke:red;stroke-width:3" />`
    //               +`<line x1="${x+width}" y1="${y}" x2="${x}" y2="${height}" style="stroke:red;stroke-width:3" />`
    //     }
    //     return top+mid+bottom
    // }
    // static onClickTree(mouseEvent:MouseEvent, el:HTMLElement){
    //     let node = <node_>node_.byLabel(el.id.slice(0, -5));
    //     Properties.processNode(node)
    // }
    // static onHoverTree(mouseEvent:MouseEvent, el:HTMLElement){
    //     let node = <node_>node_.byLabel(el.id.slice(0, -5));
    //     let coord = node.Arguments[ node.Arguments.length-1 ].coord;
    //     let type = BaseF.typeof(node.Arguments[1]);
    //     // console.log(type)
    //     if (coord == undefined) {
    //         let [width, height] = pf.viewport();
    //         coord = new Coord(0, 0, width, height)
    //     }
    //     Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
    //     let coordArray:Coord[] = [];
    //     if (type != "DisplayGroup") coordArray.push(coord);
    //     else {
    //         let displaygroup = (<DisplayGroup>node.Arguments[1]);
    //         for (let index = 0; index < displaygroup.cellArray.length; index++) {
    //             const displaycell = displaygroup.cellArray[index];
    //             coordArray.push(displaycell.coord);
    //         }
    //     }
    //     Builder.hoverModal.rootDisplayCell.htmlBlock.innerHTML = Builder.xboxSVG(coord, coordArray)
        
    //     Builder.hoverModal.show();
    // }
    // static onLeaveHoverTree(mouseEvent:MouseEvent, el:HTMLElement){
    //     Builder.hoverModal.hide();
    // }








// static onNodeCreation(node:node_){
//     let nodeLabel = I(`${node.label}_node`, `${node.label}`,
//                         node.ParentNodeTree.css,
//                         node.ParentNodeTree.events);
//     nodeLabel.coord.hideWidth = true;
//     let dataObj = node.Arguments[1];
//     let dataObjType = BaseF.typeof(dataObj);
//     let typeIcon:string;
//     if (dataObjType == "DisplayGroup")
//         typeIcon = ( (<DisplayGroup>dataObj).ishor ) ? bCss.horSVG("bookIcon"):bCss.verSVG("bookIcon");
//     else
//         typeIcon = {
//                 Handler:bCss.homeSVG("bookIcon"),
//                 HtmlBlock:bCss.htmlSVG("bookIcon"),
//             }[dataObjType];
//     node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.

//                             (node.children.length) ?
//                                 I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`,
//                                     (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon,
//                                     node.ParentNodeTree.iconClass,
//                                     events({onclick:function(mouseEvent:MouseEvent){ Tree_.toggleCollapse(this, node,mouseEvent) }})
//                                 )
//                             :   I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`),

//                             I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon),
//                             nodeLabel
//                         );
//                     }