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
                    I("Client_M1","left", bCss.bgLight),
                    I("Client_Main2","right", bCss.bgCyan, "200px"),
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
                                            bCss.treenodeCss, sample().rootNode,
                                            events({onmouseover: function(e:MouseEvent){Builder.onHoverTree(e, this)},
                                                    onmouseleave: function(e:MouseEvent){Builder.onLeaveHoverTree(e,this)},
                                                    onclick: function(e:MouseEvent){ Builder.onClickTree(e, this) },
                                            }),

function onNodeCreation(node:node_){
    let nodeLabel = I(`${node.label}_node`, `${node.Arguments[0]}`,
                        node.ParentNodeTree.css,
                        node.ParentNodeTree.events);
    nodeLabel.coord.hideWidth = true;
    let dataObj = node.Arguments[1];
    let dataObjType = BaseF.typeof(dataObj);
    let typeIcon:string;
    if (dataObjType == "DisplayGroup")
        typeIcon = ( (<DisplayGroup>dataObj).ishor ) ? bCss.horSVG("bookIcon"):bCss.verSVG("bookIcon");
    else
        typeIcon = {
                Handler:bCss.homeSVG("bookIcon"),
                HtmlBlock:bCss.htmlSVG("bookIcon"),
                DisplayCell:bCss.displaycellSVG("bookIcon"),
            }[dataObjType];
    node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
                            (node.children.length) ?
                                I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`,
                                    (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon,
                                    node.ParentNodeTree.iconClass,
                                    events({onclick:function(mouseEvent:MouseEvent){ Tree_.toggleCollapse(this, node,mouseEvent) }})
                                )
                            :   I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`),

                            I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon),
                            nodeLabel
                        );
                    },                                            

                                            ),
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
    static builderTreeRootNode:node_
    static updateTree(){
        Render.update();
        const node = node_.byLabel("Client Window");
        // console.log(node);
        if (node) {
            Builder.builderTreeRootNode = node_.copy(node, "_", function(node, newNode){
                newNode["Arguments"] = node.Arguments;
                newNode["typeof"] = BaseF.typeof(node.Arguments[1])
            })
            Builder.noDisplayCellnode = Builder.noDisplayCells();
            Tree_.byLabel("HandlerTree").newRoot( Builder.noDisplayCellnode );
            // Builder.noDisplayCellnode.log(true)
        }
        Render.update();
    }
    static noDisplayCellnode: node_
    static noDisplayCells(node:node_ = Builder.builderTreeRootNode, newNode:node_ = new node_("noDisplayCells")): node_{
        let childNode: node_
        if (node["typeof"] != "DisplayCell") {
            childNode = newNode.newChild("_"+node.label);
            childNode.Arguments = node.Arguments;
            childNode["typeof"] = node["typeof"];
        }
        else childNode = newNode;
        for (let index = 0; index < node.children.length; index++) 
            Builder.noDisplayCells(node.children[index], childNode)
        return childNode;
    }

    static onSelect(displaycell:DisplayCell){
        let htmlblock = displaycell.htmlBlock;
        let el=htmlblock.el;
        let svgEl = el.children[0]
        let oldClassName = svgEl.className["baseVal"];
        if (!oldClassName.endsWith("Selected"))
            svgEl.className["baseVal"] = oldClassName + "Selected";
        htmlblock.innerHTML = htmlblock.innerHTML.replace(oldClassName, oldClassName+"Selected")
    }
    static onUnselect(displaycell:DisplayCell){
        let htmlblock = displaycell.htmlBlock;
        let el=htmlblock.el;
        let svgEl = el.children[0]
        let oldClassName = svgEl.className["baseVal"];
        if (oldClassName.endsWith("Selected"))
            svgEl.className["baseVal"] = oldClassName.slice(0, -8);
        htmlblock.innerHTML = htmlblock.innerHTML.replace(oldClassName, oldClassName.slice(0, -8))
    }
    static TOOLBAR_currentButton_el:Element;
    //static TOOLBAR_currentButtonName:string;
    static TOOLBAR_B1 = I("toolbarCursor", bCss.cursorSVG("buttonIcons"), events({onclick:function(e){console.log("hello")}}));
    static TOOLBAR_B2 = I("toolbarMatch",bCss.matchSVG("buttonIcons"));
    static TOOLBAR_B3 = I("toolbarHor",bCss.horSVG("buttonIcons"));
    static TOOLBAR_B4 = I("toolbarVer",bCss.verSVG("buttonIcons"));
    static TOOLBAR = toolBar("Main_toolbar", 25, 25, Builder.onSelect, Builder.onUnselect,
        Builder.TOOLBAR_B1,
        Builder.TOOLBAR_B2,
        Builder.TOOLBAR_B3,
        Builder.TOOLBAR_B4,
    );
   static xboxSVG(boundCoord:Coord, Boxes:Coord[]){
        let top:string = `<svg width="${boundCoord.width}" height="${boundCoord.height}">`;
        let bottom:string = `</svg>`;
        let mid:string = "";
        for (let index = 0; index < Boxes.length; index++) {
            const coord = Boxes[index];
            let offset = 1;
            let x = coord.x -boundCoord.x + offset;
            let y = coord.y - boundCoord.y + offset;
            let width = coord.width- offset*2;
            let height = coord.height-offset*2;
            mid += `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill-opacity:0;stroke-width:3;stroke:red" />`
                  +`<line x1="${x}" y1="${y}" x2="${x+width}" y2="${height}" style="stroke:red;stroke-width:3" />`
                  +`<line x1="${x+width}" y1="${y}" x2="${x}" y2="${height}" style="stroke:red;stroke-width:3" />`
        }
        return top+mid+bottom
    }
    static onClickTree(mouseEvent:MouseEvent, el:HTMLElement){
        let node = <node_>node_.byLabel(el.id.slice(0, -5));
        Properties.processNode(node)
    }
    static get buttonIndex():number{return (<ToolBar>ToolBar.byLabel("Main_toolbar")).selected.currentButtonIndex;}
    static onHoverTree(mouseEvent:MouseEvent, el:HTMLElement){
        if(Builder.buttonIndex == 1) {
            let node = <node_>node_.byLabel(el.innerText);
            // console.log(node)
            let object_ = node.Arguments[ node.Arguments.length-1 ]
            let coord = object_.coord;
            if (!coord) {
                let possibleDisplayCell = DisplayCell.byLabel(object_.label)
                if (possibleDisplayCell) coord = possibleDisplayCell.coord;
            }
            let type = BaseF.typeof(node.Arguments[1]);
            // console.log(coord, node.Arguments)
            if (coord == undefined) {
                let [width, height] = pf.viewport();
                coord = new Coord(0, 0, width, height)
            }
            Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
            let coordArray:Coord[] = [];
            if (type != "DisplayGroup") coordArray.push(coord);
            else {
                let displaygroup = (<DisplayGroup>node.Arguments[1]);
                for (let index = 0; index < displaygroup.cellArray.length; index++) {
                    const displaycell = displaygroup.cellArray[index];
                    coordArray.push(displaycell.coord);
                }
            }
            Builder.hoverModal.rootDisplayCell.htmlBlock.innerHTML = Builder.xboxSVG(coord, coordArray)
            
            Builder.hoverModal.show();
        }
    }
    static onLeaveHoverTree(mouseEvent:MouseEvent, el:HTMLElement){
        Builder.hoverModal.hide();
    }
    static horDivide(mouseEvent:MouseEvent){
        let show = false;
        let clientWindowNode = <node_>node_.byLabel("Client Window")
        console.log(clientWindowNode != undefined)
        node_.traverse(clientWindowNode, function(node){
            if (BaseF.typeof(node.Arguments[1]) == "DisplayCell") {
                let displaycell = <DisplayCell>node.Arguments[1];
                let coord = displaycell.coord;
                if (coord.isPointIn(mouseEvent.clientX, mouseEvent.clientY)) {
                    if (displaycell.htmlBlock) {
                        // console.log(displaycell.label);
                        let coord = displaycell.coord
                        horVerModal.setSize(mouseEvent.clientX-2, coord.y, 4, coord.height)
                        console.log(horVerModal.isShown())
                        if (!horVerModal.isShown()) horVerModal.show()
                        show = true;
                        Render.update();
                    }

                }
                
            }
        })
        if (!show && horVerModal.isShown) horVerModal.hide();
    }
}

Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
setTimeout(() => {
    Builder.updateTree();
}, 0);
window.onmousemove = function(mouseEvent:MouseEvent) {
    let buttonIndex = Builder.buttonIndex;
    if (buttonIndex == 2) Builder.horDivide(mouseEvent);
    if (buttonIndex == 3) console.log(mouseEvent);
}
let horVerModal = new Modal("horVerModal",I("horVerModal", css("horVerModal","background:red;opacity:0.25"),
                                            events({onclick:function(){console.log("clicked")}}))); 

// let outside = new Modal("outside",I("outside_", css("outside","background:red;opacity:0.25")));
// let inside = new Modal("inside", I("inside_", css("inside","background:green;opacity:0.25")));
// let show = function(coord:Coord) {
//     outside.setSize(coord.x, coord.y, coord.width, coord.height);
//     inside.setSize(coord.within.x, coord.within.y, coord.within.width, coord.within.height);
//     outside.show()
//     inside.show()
// }
// let hide = function(){
//     outside.hide();
//     inside.hide();
// }








