var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Manual {
    static nameToUrl(name) { return `https://leafdriving.github.io/liefs-layout-manager-3.0.0/Examples/${name}`; }
    static buttonBar(label, height = 25) {
        let b1 = Manual.showJavascriptButton(label);
        let b2 = Manual.showHtmlButton(label);
        let b3 = Manual.showRenderButton(label);
        let b4 = Manual.launchAsModalButton(label);
        let b5 = Manual.launchAsNewWindow(label);
        let dc = h(`${label}_buttonBar`, `${height}px`, b1, b2, b3, 5);
        let dcb = h(`${label}_BbuttonBar`, `${height}px`, b4, b5, 5);
        return [dc, b1, b2, b3, dcb];
    }
    static launchAsModal(e, label) {
        let displaygroup = DisplayGroup.instances[`${label}_buttonBar`];
        if (displaygroup.children.length == 3) {
            let pages = Pages.instances[`${label}_P`];
            if (pages.currentPage == 2) {
                let selectInstnce = Selected.instances[label];
                selectInstnce.select(0);
                pages.currentPage = 0;
            }
            Render.update(displaygroup.children[displaygroup.children.length - 1], true);
            displaygroup["temp"] = displaygroup.children[displaygroup.children.length - 1];
            displaygroup.children.splice(-1, 1);
            if (!Handler.instances[label])
                eval(Manual.fileObject[`${label}.js`]);
            let handler = Handler.instances[label];
            let winModal_ = new winModal(`${label}_`, `Example - ${label}`, handler.children[0], function () {
                displaygroup.children.push(displaygroup["temp"]);
                Render.scheduleUpdate();
            }, { sizer: { minWidth: 150, maxWidth: 800, minHeight: 150, maxHeight: 600, width: 400, height: 400 } });
            if (handler.children.length > 1)
                winModal_.modal.handler.children.push(handler.children[1]);
        }
    }
    static showJavascriptButton(label) { return I(`${label}_showJavascript`, "Show Javascript", Manual.tabCss); }
    static showHtmlButton(label) { return I(`${label}_showHtml`, "Show Html", Manual.tabCss); }
    static showRenderButton(label) { return I(`${label}_Render`, "Show Rendered", Manual.tabCss); }
    static launchAsModalButton(label) {
        return I(`${label}_launchAsModal`, "Launch As Modal", Manual.bottomTabCss, events({ onclick: function (e) { Manual.launchAsModal(e, label); } }));
    }
    static launchAsNewWindow(label) {
        return I(`${label}_launchAsNewWindow`, "Launch As New Window", Manual.bottomTabCss, events({ onclick: function () { console.log("Launching"); window.open(`../Examples/${label}.html`, '_blank', 'location=yes,left=100, top=150, height=350,width=500,status=yes'); } }));
    }
    static getLibrary(label, element, language, returnString = "Not Found") {
        if (!element["monaco"]) {
            let returnString_ = Manual.fileObject[label];
            if (returnString_) {
                returnString = `<div id="${label}_Container" style="width:100%;height:100%"></div>`;
                element["monaco"] = "waitforIt";
                setTimeout(() => {
                    element["monaco"] = monacoContainer(returnString_, language, `${label}_Container`);
                }, 50);
            }
            return returnString;
        }
        setTimeout(() => { element["monaco"].layout(); }, 50);
        return undefined;
    }
    static example(label) {
        let [buttonBar, b1, b2, b3, bottomButtonBar] = Manual.buttonBar(label);
        let page1DisplayCell = I(`${label}_page1`, `${label}_page1`, Manual.borderCss, function (THIS) { return Manual.getLibrary(`${label}.js`, THIS, "javascript"); });
        let page2DisplayCell = I(`${label}_page2`, `${label}_page2`, Manual.borderCss, function (THIS) { return Manual.getLibrary(`${label}.html`, THIS, "html"); });
        let page3DisplayCell = I(`${label}_page3`, `${label}_page3`, Manual.borderCss, function (THIS) {
            if (!THIS["happend"]) {
                eval(Manual.fileObject[`${label}.js`]);
                let handler = Handler.instances[label];
                let exampleDisplayCell;
                // if (handler.children.length > 1) {
                //     exampleDisplayCell = h(`${label}_junk`,handler.children[0])
                //     exampleDisplayCell.children.push(handler.children[1]) 
                // }
                //  else 
                exampleDisplayCell = (handler.children[0]);
                //let exampleDisplayCell = handler.parentDisplayCell;
                // exampleDisplayCell.deleteComponent("Handler");
                // if (handler.children.length > 1) exmapleDisplayCell.addComponent(handler.children[1])
                let parentPages = (THIS.node.ParentNode.ParentNode.Arguments[1]);
                setTimeout(() => { Render.update(THIS.parentDisplayCell, true); }, 0);
                parentPages.cellArray[2] = exampleDisplayCell;
                //if (handler.children.length > 1) parentPages.cellArray[2].children.push(handler.children[1])
                THIS["happened"] = true;
            }
            return undefined;
        });
        let pages = new Pages(`${label}_P`, page1DisplayCell, page2DisplayCell, page3DisplayCell);
        let vert = v(`v_${label}`, buttonBar, new DisplayCell(pages), bottomButtonBar);
        let mySelected = new Selected(`${label}`, [b1, b2, b3], 0, { onselect: function (index, displaycell) { pages.currentPage = index; } });
        return vert;
    }
    static load(name, cb = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(Manual.nameToUrl(name));
                const data = yield response.text();
                if (cb)
                    cb(data);
                Manual.fileObject[name] = data;
                if (++Manual.fileObjectsLoaded == Manual.names.length) {
                    for (let index = 0; index < Manual.names.length; index++) {
                        H(`${Manual.names[index]}_`, Manual.example(Manual.names[index]), false, new Coord());
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
Manual.allowScroll = css("allowScroll", `overflow-y: auto;`);
Manual.centeredTitleCss = css("centeredTitle", `display: grid;place-items: center;background:#c6ddf5;font-size: 25px;`);
Manual.headingCss = css("heading", "font-size: 25px;text-decoration: underline;margin: 10px;");
Manual.subHeadingCss = css("subHeading", "font-size: 20px;text-decoration: underline;margin: 10px;");
// static bodyCss = css("body", "text-indent: 50px;margin:10px;");
Manual.buttonCss = css("button", `box-shadow: 0px 0px 0px 2px #9fb4f2;
    background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
    background-color:#7892c2;
    border-radius:10px;
    border:1px solid #4e6096;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:15px;
    padding:2px 7px;
    text-decoration:none;
    text-shadow:2px 2px 0px #283966;`, `
    background:linear-gradient(to bottom, #476e9e 5%, #7892c2 100%);
    background-color:#476e9e;`);
Manual.tabCss = css("tab", `-webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;text-align:center;font-size:20px;
    border-radius: 10px 10px 0px 0px;background:orange;cursor:pointer;`, `background:purple`, `-webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;
    border-radius: 10px 10px 0px 0px;background:black;color:white;text-align:center;font-size:20px;`);
Manual.bottomTabCss = css("btab", `-webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;text-align:center;font-size:20px;
    border-radius: 0px 0px 10px 10px;background:orange;cursor:pointer;`, `background:purple`, `-webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;
    border-radius: 0px 0px 10px 10px;background:black;color:white;text-align:center;font-size:20px;`);
Manual.borderCss = css("blackBorder", `box-sizing: border-box;-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;border: 2px solid black;background:white;`);
Manual.titleText = "Lief's Layout Manager - The Manual";
Manual.titleDisplayCell = I("Title", "30px", Manual.titleText, Manual.centeredTitleCss);
Manual.contentsTreeNode = function () {
    let contentsTreeNode = new node_();
    contentsTreeNode.newChild("Introduction")
        .newSibling("Installation")
        .newSibling("Usage")
        .newChild("Core-Quick Glance")
        .newChild("Arguments By Type")
        .newSibling("FunctionStack")
        .newSibling("Coord")
        .newSibling("DisplayCell")
        .newSibling("DisplayGroup")
        .newSibling("Handler")
        .newSibling("Element_")
        .newSibling("Events")
        .parent()
        .newSibling("Examples")
        .newChild("Handler 01");
    return contentsTreeNode;
}();
Manual.treeNodeCss = css("treenode", `cursor:pointer`, `background:black;color:white`, `background:#82fa95;color:black`);
Manual.contentsTree = new Tree_("MyTree", Manual.contentsTreeNode, { events: { onclick: function (e) { } }, Css: Manual.treeNodeCss });
Manual.treeBackgroundCss = css("treeBackground", "background:#ccffd4");
Manual.treeDisplayCell = I("ContentsTreeBackground", Manual.treeBackgroundCss, "300px")
    .addComponent(Manual.contentsTree);
// .addComponent( new DragBar(200,400) )
Manual.pages = new Pages("ContentsPages", Manual.contentsTree);
Manual.pageDisplayCell = new DisplayCell(Manual.pages);
Manual.fileObject = {};
Manual.fileObjectsLoaded = 0;
Manual.names = ["core_00", "core_01", "core_displaygroup01", "events_00"];
for (let index = 0; index < Manual.names.length; index++) {
    Manual.load(`${Manual.names[index]}.js`);
    Manual.load(`${Manual.names[index]}.html`);
}
H(`MainHandler`, 8, v("Main_V", Manual.titleDisplayCell, h("Main_H", 8, Manual.treeDisplayCell, Manual.pageDisplayCell)));
