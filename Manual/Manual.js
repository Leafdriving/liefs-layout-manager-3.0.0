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
    static load(url, cb = (data) => console.log(data)) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url);
                const data = yield response.text();
                cb(data);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
Manual.centeredTitleCss = css("centeredTitle", `display: grid;place-items: center;background:#c6ddf5;font-size: 25px;`);
Manual.titleText = "Lief's Layout Manager - The Manual";
Manual.titleDisplayCell = I("Title", "30px", Manual.titleText, Manual.centeredTitleCss);
Manual.contentsTreeNode = function () {
    let contentsTreeNode = new node_();
    contentsTreeNode.newChild("Introduction");
    //     .parent()
    // .newSibling("Body");
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
H(`MainHandler`, v("Main_V", Manual.titleDisplayCell, h("Main_H", Manual.treeDisplayCell, Manual.pageDisplayCell)));
