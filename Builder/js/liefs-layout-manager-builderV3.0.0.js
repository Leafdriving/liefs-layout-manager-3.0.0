class bCss {
}
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
class Builder extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Builder.makeLabel(this);
    }
    static makeHandlerTree() {
        let node = Builder.nodeTree.rootNode;
        for (let index = 1; index < Handler.activeInstances.length; index++) {
            const handler = Handler.activeInstances[index];
            node = node.newSibling(handler.label, handler);
            Builder.makeDisplayCell(node, handler.rootCell);
        }
    }
    static makeDisplayCell(node, displaycell) {
        if (displaycell.htmlBlock)
            node.newChild(displaycell.htmlBlock.label, displaycell.htmlBlock);
        if (displaycell.pages) {
            let pagenode = node.newChild(displaycell.pages.label, displaycell.pages);
            for (let index = 0; index < displaycell.pages.displaycells.length; index++)
                Builder.makeDisplayCell(pagenode, displaycell.pages.displaycells[index]);
        }
        if (displaycell.displaygroup) {
            let groupnode = node.newChild(displaycell.displaygroup.label, displaycell.displaygroup);
            for (let index = 0; index < displaycell.displaygroup.cellArray.length; index++)
                Builder.makeDisplayCell(groupnode, displaycell.displaygroup.cellArray[index]);
        }
    }
}
Builder.labelNo = 0;
Builder.instances = [];
Builder.activeInstances = [];
Builder.defaults = {};
Builder.argMap = {
    string: ["label"],
};
Builder.nodeTree = new Tree_('Handlers');
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
