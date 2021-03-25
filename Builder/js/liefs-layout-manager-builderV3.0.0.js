// class PageSelect extends Base {
//     static labelNo = 0;
//     static instances:PageSelect[] = [];
//     static activeInstances:PageSelect[] = [];
//     static defaults = {cellArray:[], ishor:false}
//     static argMap = {
//         string : ["label"],
//         Pages: ["pages"],
//         dim: ["dim"],
//     }
//     retArgs:ArgsObj;   // <- this will appear
//     dim:string;
//     label:string;
//     ishor:boolean;
//     rootDisplayCell: DisplayCell;
//     pages:Pages;
//     cellArray: DisplayCell[];
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         PageSelect.makeLabel(this);
//         this.build()
//     }
//     build(){
//         let menuObj = {menuObj: {
//             one:function(){console.log("one")},
//             two:function(){console.log("two")},
//             three: {a:function(){console.log("a")},
//                     b:function(){console.log("b")},
//                     c:function(){console.log("c")},
//                     },
//             four:function(){console.log("four")},
//         }}
//         let label = this.pages.displaycells[0].label;
//         let clickableName = I(`${this.label}_0`, label, DefaultTheme.bgLight /*,events({onclick:contextObjFunction})*/)
//         let downArrow = I(`${this.label}_arrow`,"20px" , DefaultTheme.downArrowSVG("scrollArrows"));
//         this.rootDisplayCell = h("Prop_h", 
//             clickableName,
//             downArrow,
//             )
//         this.rootDisplayCell.dim = this.dim;
//         let contextObjFunction = hMenuBar(menuObj, {launchcell:this.rootDisplayCell});
//         clickableName.htmlBlock.events = events({onclick:contextObjFunction});
//         downArrow.htmlBlock.events = events({onclick:contextObjFunction});
//     }
// }
// function pageselect(...Arguments:any) {
//     let ps = new PageSelect(...Arguments);
//     return ps.rootDisplayCell;
// }
class Properties extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Properties.makeLabel(this);
    }
}
Properties.labelNo = 0;
Properties.instances = [];
Properties.activeInstances = [];
Properties.defaults = {
    tag: "DIV",
};
Properties.argMap = {
    string: ["label", "innerHTML", "css"],
    number: ["marginLeft", "marginTop", "marginRight", "marginBottom"],
};
class bCss {
    static bookSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(.069039 0 0 .048212 -4.1849 .6616)">
        <path d="m131.75 409.1c-28.8 0-52.1 18.3-52.1 40.4 0 22.6 23.3 40.4 52.1 40.4h278.4c-22.6-24.1-22.6-56.8 0-80.9h-278.4z"/>
        <path d="m120.15 1.9c-23.3 7-40.4 32.7-40.4 63.8v342.2c10.5-9.3 24.9-15.9 40.4-17.9z"/>
        <polygon points="139.95 388.9 410.25 388.9 410.25 0 244.95 0 244.95 99.2 204.85 73.9 164.85 99.2 164.85 0 139.95 0"/>
        </g>
        </svg>`;
    }
    ;
    static htmlSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
        <path d="m7.5329 4.4233-6.5 8.5 6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        <path d="m14.86 4.4367-4.1694 16.41" stroke-linecap="round" stroke-width="2.5"/>
        <path d="m17.467 4.4233 6.5 8.5-6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        </g>
        </svg>`;
    }
    ;
    static horSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g><path d="m11.466 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x=".91881" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/>
        <path d="m23.481 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x="12.933" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/></g>
        </svg>`;
    }
    ;
    static verSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <path d="m2.7244 11.657h19.63v-9.7972h0.632v10.605h-20.262z"/>
        <g><rect transform="matrix(0,1,1,0,0,0)" x="1.0521" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/>
        <path d="m2.7244 23.737h19.63v-9.7972h0.632v10.605h-20.262z" stroke-width=".37166"/>
        <rect transform="matrix(0,1,1,0,0,0)" x="13.132" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/></g>
        </svg>`;
    }
    ;
    static homeSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
     <linearGradient id="linearGradient6715" x1="302.86" x2="302.86" y1="366.65" y2="609.51" gradientTransform="matrix(2.7744,0,0,1.9697,-1892.2,-872.89)" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0" offset="0"/>
      <stop offset=".5"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6717" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(2.7744,0,0,1.9697,-1891.6,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <linearGradient id="linearGradient5060">
      <stop offset="0"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6719" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(-2.7744,0,0,1.9697,112.76,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <radialGradient id="radialGradient238" cx="20.706" cy="37.518" r="30.905" gradientTransform="matrix(.56743 .008141 .076635 .67327 -.8499 -6.1144)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#202020" offset="0"/>
      <stop stop-color="#b9b9b9" offset="1"/>
     </radialGradient>
     <linearGradient id="linearGradient3104" x1="18.113" x2="15.515" y1="31.368" y2="6.1803" gradientTransform="matrix(.53734 0 0 .53793 .37326 -.58395)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#424242" offset="0"/>
      <stop stop-color="#777" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient491" x1="6.2298" x2="9.8981" y1="13.773" y2="66.834" gradientTransform="matrix(.80898 0 0 .37756 -.089325 -1.2284)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" stop-opacity=".87629" offset="0"/>
      <stop stop-color="#fffffe" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient9772" x1="22.176" x2="22.065" y1="36.988" y2="32.05" gradientTransform="matrix(.53309 0 0 .53567 .56202 -.4917)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6194cb" offset="0"/>
      <stop stop-color="#729fcf" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient322" x1="13.036" x2="12.854" y1="32.567" y2="46.689" gradientTransform="matrix(.70235 0 0 .43725 .093127 -1.1978)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient2296" x1="21.354" x2="20.796" y1="26.384" y2="50.771" gradientTransform="matrix(.64126 0 0 .43721 .51643 -.28655)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
    </defs>
    <g transform="matrix(.012145 0 0 .011202 23.69 18.994)">
     <rect x="-1559.3" y="-150.7" width="1339.6" height="478.36" color="#000000" fill="url(#linearGradient6715)" opacity=".40206"/>
     <path d="m-219.62-150.68v478.33c142.88 0.9 345.4-107.17 345.4-239.2 0-132.02-159.44-239.13-345.4-239.13z" color="#000000" fill="url(#radialGradient6717)" opacity=".40206"/>
     <path d="m-1559.3-150.68v478.33c-142.8 0.9-345.4-107.17-345.4-239.2 0-132.02 159.5-239.13 345.4-239.13z" color="#000000" fill="url(#radialGradient6719)" opacity=".40206"/>
    </g>
    <path d="m2.803 20.227c0.011209 0.22446 0.24715 0.4481 0.47083 0.4481h16.833c0.22362 0 0.4358-0.2239 0.42397-0.4481l-0.50294-14.646c-0.011209-0.22418-0.24716-0.44807-0.47125-0.44807h-7.1305c-0.26116 0-0.66362-0.17009-0.75334-0.5953l-0.32887-1.5562c-0.083225-0.39576-0.47391-0.55831-0.69744-0.55831h-7.9413c-0.22362 0-0.43563 0.2239-0.42392 0.44788l0.5216 17.356z" fill="url(#radialGradient238)" stroke="url(#linearGradient3104)" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5368"/>
    <path d="m3.6163 20.17c0.00841 0.16617-0.096396 0.27686-0.26593 0.22137s-0.2863-0.16617-0.29499-0.33229l-0.50546-17.076c-0.0084066-0.16589 0.087989-0.26649 0.25472-0.26649l7.6919-0.02522c0.16701 0 0.49708 0.16001 0.60427 0.70411l0.30614 1.4995c-0.22782-0.248-0.22334-0.25556-0.34027-0.61618l-0.21661-0.67057c-0.11685-0.38746-0.37227-0.443-0.53867-0.443h-6.8738c-0.16645 0-0.27181 0.11097-0.26313 0.27714l0.50028 16.783-0.058566-0.05548z" color="#000000" display="block" fill="url(#linearGradient491)" opacity=".45143" stroke-width=".53294"/>
    <path d="m21.771 20.673c0.60931-0.02242 1.0465-0.58762 1.0912-1.2433 0.42168-6.1865 0.8844-11.373 0.8844-11.373 0.03839-0.13282-0.08967-0.26509-0.25584-0.26509h-18.323c-2.522e-4 0-0.98657 11.714-0.98657 11.714-0.061088 0.52603-0.24856 0.96634-0.8262 1.1694h18.416z" color="#000000" display="block" fill="url(#linearGradient9772)" stroke="#3465a4" stroke-linejoin="round" stroke-width=".53678"/>
    <path d="m5.6905 8.3276 17.481 0.034747-0.83909 10.715c-0.04484 0.57372-0.23987 0.76495-0.99795 0.76495-0.99795 0-15.288-0.01681-16.736-0.01681 0.12442-0.17206 0.17794-0.52978 0.1785-0.53836l0.91436-10.959z" fill="none" opacity=".46591" stroke="url(#linearGradient322)" stroke-linecap="round" stroke-width=".53678px"/>
    <path d="m5.6905 8.1985-0.62192 8.3796s4.4228-2.222 9.9507-2.222 8.2923-6.1576 8.2923-6.1576h-17.621z" fill="#fff" fill-opacity=".089286" fill-rule="evenodd" stroke-width=".53438"/>
    <path d="m9.8186 14.248-0.37533 4.0109h4.168l0.30365-3.242h2.2685l-0.30368 3.242h2.5913l0.37533-4.0109h1.4175l-5.5265-4.0399-6.2831 4.0399z" fill="url(#linearGradient2296)" fill-rule="evenodd" stroke-width="1.5885pt"/>
   </svg>`;
    }
    ;
}
bCss.bgwhite = css("bgwhite", `background: white`);
bCss.bgLight = css("bgLight", `background: #dcedf0`);
bCss.bgGreen = css("bgGreen", `background: green;`);
bCss.bgBlue = css("bgBlue", `background: blue;`);
bCss.bgCyan = css("bgCyan", `background: cyan;`);
bCss.bgBlack = css("bgBlack", `background: black;
                                    opacity:0.5;
                                    box-sizing: border-box;
                                    border: 10px solid red;`);
bCss.menuItem = css("menuItem", `background: white;
                                       color: black;
                                       cursor: default;
                                       outline: 1px solid black;
                                       outline-offset: -1px;`, `background: black;
                                       color: white;`);
bCss.menuSpace = css("menuspace", `background: white;
                                        color: black;
                                        cursor: default;
                                        outline: 1px solid black;
                                        outline-offset: -1px;`);
bCss.handlerSVG = css("handlerSVG", `background-image: url("svg/user-homeOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.hSVG = css("hSVG", `background-image: url("svg/Horizontal.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.vSVG = css("vSVG", `background-image: url("svg/Vertical.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.ISVG = css("ISVG", `background-image: url("svg/icon-htmlOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.pagesSVG = css("pagesSVG", `background-image: url("svg/bookOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`);
bCss.treeItem = css("treeItem", `background: transparent; color:black; cursor:pointer`, `background:DeepSkyBlue;`);
bCss.bookSVGCss = css(`bookIcon`, `stroke: black;`, `fill: white;`);
class Builder extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Builder.makeLabel(this);
    }
    // static handlerTree:Tree_ = new Tree_('Handlers')
    static makeHandlerTree() {
        let rootnode = new node_("Handlers");
        for (let index = 0; index < Handler.activeInstances.length; index++) {
            const handler = Handler.activeInstances[index];
            //if (handler.label != "Main Window") {
            let node = rootnode.newChild(handler.label, handler);
            Builder.makeDisplayCell(node, handler.rootCell);
            //}
        }
        //Builder.handlerTree.newRoot(node);
        // Builder.handlerTree.rootNode = node;
        // Handler.update();
        //let tree = (<Tree_>Tree_.byLabel("HandlerTree"))
        //tree.rootNode = rootnode;
        //tree.render(undefined, undefined, undefined, false)
        return rootnode;
    }
    static makeDisplayCell(node, displaycell) {
        if (displaycell.htmlBlock) {
            let htmlnode = node.newChild(displaycell.htmlBlock.label, displaycell.htmlBlock, displaycell);
            // htmlnode.log();
        }
        if (displaycell.pages) {
            let pagenode = node.newChild(displaycell.pages.label, displaycell.pages, displaycell);
            // pagenode.log();
            for (let index = 0; index < displaycell.pages.displaycells.length; index++)
                Builder.makeDisplayCell(pagenode, displaycell.pages.displaycells[index]);
        }
        if (displaycell.displaygroup) {
            let groupnode = node.newChild(displaycell.displaygroup.label, displaycell.displaygroup, displaycell);
            // groupnode.log()
            for (let index = 0; index < displaycell.displaygroup.cellArray.length; index++)
                Builder.makeDisplayCell(groupnode, displaycell.displaygroup.cellArray[index]);
        }
    }
    static buildClientHandler() {
        Builder.clientHandler =
            H("Client Window", h("Client_h", 5, I("Client_Main1", "left", bCss.bgCyan, "500px"), I("Client_Main2", "right", bCss.bgCyan, "500px")), false);
    }
    static xboxSVG(boundCoord, Boxes) {
        let top = `<svg width="${boundCoord.width}" height="${boundCoord.height}">`;
        let bottom = `</svg>`;
        let mid = "";
        for (let index = 0; index < Boxes.length; index++) {
            const coord = Boxes[index];
            let offset = 1;
            let x = coord.x - boundCoord.x + offset;
            let y = coord.y - boundCoord.y + offset;
            let width = coord.width - offset * 2;
            let height = coord.height - offset * 2;
            mid += `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill-opacity:0;stroke-width:3;stroke:red" />`
                + `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${height}" style="stroke:red;stroke-width:3" />`
                + `<line x1="${x + width}" y1="${y}" x2="${x}" y2="${height}" style="stroke:red;stroke-width:3" />`;
        }
        return top + mid + bottom;
    }
    static onClickTree(mouseEvent, el) {
        let node = node_.byLabel(el.id.slice(0, -5));
        console.log(node);
        if (Builder.propertiesModal == undefined)
            Builder.propertiesModal = new winModal("PropertiesModal", { headerText: "Properties:" }, 100, 200);
    }
    static onHoverTree(mouseEvent, el) {
        let node = node_.byLabel(el.id.slice(0, -5));
        let coord = node.Arguments[node.Arguments.length - 1].coord;
        let type = BaseF.typeof(node.Arguments[1]);
        // console.log(type)
        if (coord == undefined) {
            let [width, height] = pf.viewport();
            coord = new Coord(0, 0, width, height);
        }
        Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
        let coordArray = [];
        if (type != "DisplayGroup")
            coordArray.push(coord);
        else {
            let displaygroup = node.Arguments[1];
            for (let index = 0; index < displaygroup.cellArray.length; index++) {
                const displaycell = displaygroup.cellArray[index];
                coordArray.push(displaycell.coord);
            }
        }
        Builder.hoverModal.rootDisplayCell.htmlBlock.innerHTML = Builder.xboxSVG(coord, coordArray);
        Builder.hoverModal.show();
    }
    static onLeaveHoverTree(mouseEvent, el) {
        //let node = node_.byLabel(el.id.slice(0, -5));
        Builder.hoverModal.hide();
    }
    static onNodeCreation(node) {
        let nodeLabel = I(`${node.label}_node`, `${node.label}`, node.ParentNodeTree.css, node.ParentNodeTree.events);
        nodeLabel.coord.hideWidth = true;
        let dataObj = node.Arguments[1];
        let dataObjType = BaseF.typeof(dataObj);
        let typeIcon;
        if (dataObjType == "DisplayGroup")
            typeIcon = (dataObj.ishor) ? bCss.horSVG("bookIcon") : bCss.verSVG("bookIcon");
        else
            typeIcon = {
                Handler: bCss.homeSVG("bookIcon"),
                HtmlBlock: bCss.htmlSVG("bookIcon"),
            }[dataObjType];
        node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
        (node.children.length) ?
            I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`, (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon, node.ParentNodeTree.iconClass, events({ onclick: function (mouseEvent) { Tree_.toggleCollapse(this, node, mouseEvent); } }))
            : I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`), I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon), nodeLabel);
    }
    static buildMainHandler() {
        let treePages = P("TreePages", 
        // page 1
        tree("HandlerTree", Builder.onNodeCreation, I("Main_tree", bCss.bgLight), bCss.treeItem, events({ onmouseover: function (mouseEvent) { Builder.onHoverTree(mouseEvent, this); },
            onmouseleave: function (mouseEvent) { Builder.onLeaveHoverTree(mouseEvent, this); },
            onclick: function (mouseEvent) { Builder.onClickTree(mouseEvent, this); },
        })), 
        // page 2
        I("Dummy2", "Dummy2"), I("Dummy3", "Dummy3"));
        let treePagesSelector = pageselect("TreePagesSelector", "20px", treePages);
        Builder.mainHandler = H("Main Window", 4, v("Main_v", h("MenuBar", "20px", I("MenuBar_File", "File", "35px", bCss.menuItem), I("MenuBar_Edit", "Edit", "35px", bCss.menuItem), I("MenuBar_Spacer", "", bCss.menuSpace)), dockable(v("Main_Dockable", Builder.TOOLBAR, dockable(h("Tree_Body", 5, v("TreeTops", "300px", 5, 
        //pageselect("name","20px", new Pages("pagename",I(),I())),
        treePagesSelector, treePages), bindHandler(I("Main_body"), Builder.clientHandler)))))));
    }
    static updateTree() {
        Tree_.byLabel("HandlerTree").newRoot(Builder.makeHandlerTree());
    }
}
Builder.labelNo = 0;
Builder.instances = [];
Builder.activeInstances = [];
Builder.defaults = {};
Builder.argMap = {
    string: ["label"],
};
Builder.hoverModal = new Modal("BuilderHover", I("BuilderHoverDummy" /*,bCss.bgwhite*/));
Builder.TOOLBAR = toolBar("Main_toolbar", 40, 25, I("toolbarb1", `<button style="width:100%; height:100%">1</button>`), I("toolbarb2", `<button style="width:100%; height:100%">2</button>`), I("toolbarb3", `<button style="width:100%; height:100%">3</button>`));
Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
Builder.updateTree();
let outside = new Modal("outside", I("outside_", css("outside", "background:red;opacity:0.25")));
let inside = new Modal("inside", I("inside_", css("inside", "background:green;opacity:0.25")));
let show = function (coord) {
    outside.setSize(coord.x, coord.y, coord.width, coord.height);
    inside.setSize(coord.within.x, coord.within.y, coord.within.width, coord.within.height);
    outside.show();
    inside.show();
};
let hide = function () {
    outside.hide();
    inside.hide();
};
// Handler.preRenderCallback = function(){ if (!Handler.firstRun)Builder.updateTree() }
// class RenderTree extends Base {
//     static labelNo = 0;
//     static instances:RenderTree[] = [];
//     static activeInstances:RenderTree[] = [];
//     static defaults = {}
//     static argMap = {
//         string : ["label","css"],
//         number: ["height", "indent"],
//         Css: ["css"]
//     }
//     label:string
//     height:number;
//     css:string|Css;
//     indent:number;
//     collapsedSVG:string;
//     expandedSVG:string;
//     // retArgs:ArgsObj;   // <- this will appear
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);
//         RenderTree.makeLabel(this);
//     }
// }
