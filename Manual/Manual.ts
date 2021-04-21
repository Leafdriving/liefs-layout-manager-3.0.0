class Manual {
    static centeredTitleCss = css("centeredTitle", `display: grid;place-items: center;background:#c6ddf5;font-size: 25px;`);
    static headingCss = css("heading","font-size: 25px;text-decoration: underline;margin: 10px;");
    static subHeadingCss = css("subHeading","font-size: 20px;text-decoration: underline;margin: 10px;");
    static bodyCss = css("body", "text-indent: 50px;margin:10px;");
    static buttonCss = css("button", `box-shadow: 0px 0px 0px 2px #9fb4f2;
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
    text-shadow:2px 2px 0px #283966;`,`
    background:linear-gradient(to bottom, #476e9e 5%, #7892c2 100%);
    background-color:#476e9e;`)
    static titleText = "Lief's Layout Manager - The Manual";
    static titleDisplayCell = I("Title", "30px", Manual.titleText , Manual.centeredTitleCss);

    static contentsTreeNode = function(){
        let contentsTreeNode = new node_();
        contentsTreeNode.newChild("Introduction")
                        .newSibling("Installation");
        return contentsTreeNode}();
    static treeNodeCss = css("treenode", `cursor:pointer`, `background:black;color:white`, `background:#82fa95;color:black`);

    static contentsTree = new Tree_("MyTree",
                            Manual.contentsTreeNode,
                            { events:{onclick:function(e:MouseEvent|PointerEvent){/*console.log(e, this)*/}},
                            Css:Manual.treeNodeCss },
                        )
    static treeBackgroundCss = css("treeBackground", "background:#ccffd4");
    static treeDisplayCell = I("ContentsTreeBackground", Manual.treeBackgroundCss, "300px")
                            .addComponent( Manual.contentsTree )
                            // .addComponent( new DragBar(200,400) )

    static pages = new Pages("ContentsPages", Manual.contentsTree);
    static pageDisplayCell = new DisplayCell(Manual.pages);
    static nameToUrl(name:string){return `https://leafdriving.github.io/liefs-layout-manager-3.0.0/Examples/${name}`}
    static async load(name:string, cb:(data:string)=>void = undefined) {
        try {
          const response = await fetch( Manual.nameToUrl(name) );
          const data = await response.text();
          if (cb) cb(data);
          Manual.fileObject[name] = data;
        } catch (err) {
          console.error(err);
        }
    }
    static fileObject = {};
    static loadFiles = function(){
        let names = ["core_00", "core_01"];
        for (let index = 0; index < names.length; index++) {
          Manual.load(`${names[index]}.js`);Manual.load(`${names[index]}.html`);  
        }
      }();
}
H(`MainHandler`,
    v("Main_V",
        Manual.titleDisplayCell,
        h("Main_H",
            Manual.treeDisplayCell,
            Manual.pageDisplayCell,
        )
    )
);