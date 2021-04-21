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
    static load(name, cb = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(Manual.nameToUrl(name));
                const data = yield response.text();
                if (cb)
                    cb(data);
                Manual.fileObject[name] = data;
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
Manual.centeredTitleCss = css("centeredTitle", `display: grid;place-items: center;background:#c6ddf5;font-size: 25px;`);
Manual.headingCss = css("heading", "font-size: 25px;text-decoration: underline;margin: 10px;");
Manual.subHeadingCss = css("subHeading", "font-size: 20px;text-decoration: underline;margin: 10px;");
Manual.bodyCss = css("body", "text-indent: 50px;margin:10px;");
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
Manual.titleText = "Lief's Layout Manager - The Manual";
Manual.titleDisplayCell = I("Title", "30px", Manual.titleText, Manual.centeredTitleCss);
Manual.contentsTreeNode = function () {
    let contentsTreeNode = new node_();
    contentsTreeNode.newChild("Introduction")
        .newSibling("Installation");
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
Manual.loadFiles = function () {
    let names = ["core_00", "core_01"];
    for (let index = 0; index < names.length; index++) {
        Manual.load(`${names[index]}.js`);
        Manual.load(`${names[index]}.html`);
    }
}();
H(`MainHandler`, v("Main_V", Manual.titleDisplayCell, h("Main_H", Manual.treeDisplayCell, Manual.pageDisplayCell)));
