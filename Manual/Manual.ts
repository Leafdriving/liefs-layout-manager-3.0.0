class Manual {
    static centeredTitleCss = css("centeredTitle", `display: grid;place-items: center;background:#c6ddf5;font-size: 25px;`);
    static titleText = "Lief's Layout Manager - The Manual";
    static titleDisplayCell = I("Title", "30px", Manual.titleText , Manual.centeredTitleCss);

    static contentsTreeNode = function(){
        let contentsTreeNode = new node_();
        contentsTreeNode.newChild("Introduction")
                        //     .parent()
                        // .newSibling("Body");
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
    static async load(url:string, cb:(data:string)=>void = (data) => console.log(data)) {
        try {
          const response = await fetch(url);
          const data = await response.text();
          cb(data);
        } catch (err) {
          console.error(err);
        }
      }
    static fileObject = {};
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