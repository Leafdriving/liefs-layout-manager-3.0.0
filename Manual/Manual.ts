declare function monacoContainer(code:string, language:string, elementId?:string):object;
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
    background-color:#476e9e;`);
    static tabCss = css("tab",`-webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;text-align:center;font-size:20px;
    border-radius: 10px 10px 0px 0px;background:orange;cursor:pointer;`,
    `background:purple`,
    `-webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;
    border-radius: 10px 10px 0px 0px;background:black;color:white;text-align:center;font-size:20px;`)
    static borderCss = css("blackBorder",`box-sizing: border-box;-moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;border: 2px solid black;`)
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
    static buttonBar(label:string, height=25) {
        let b1 = Manual.showJavascriptButton(label);
        let b2 = Manual.showHtmlButton(label);
        let b3 = Manual.showRenderButton(label);
        let dc = h(`${label}_buttonBar`, `${height}px`,b1,b2,b3, 5)
        return [dc, b1, b2, b3]
    }
    static showJavascriptButton(label:string) {return I(`${label}_showJavascript`, "Show Javascript", Manual.tabCss)}
    static showHtmlButton(label:string){return I(`${label}_showHtml`, "Show Html", Manual.tabCss)}
    static showRenderButton(label:string){return I(`${label}_Render`, "Show Rendered", Manual.tabCss)}
    static getLibrary (label:string, element:Element_, language:string, returnString = "Not Found"){
        if (!element["monaco"]) {
            let returnString_ = Manual.fileObject[label];
            if ( returnString_ ) {
                returnString = `<div id="${label}_Container" style="width:100%;height:100%"></div>`;
                element["monaco"] = "waitforIt";
                setTimeout(() => {
                    element["monaco"] = monacoContainer(returnString_, language, `${label}_Container`);
                }, 50);
            }
            return returnString;
        }
        setTimeout(() => {
            element["monaco"].layout();    
        }, 50);
        return undefined;
    }
    // static handlerToItem(label:string):DisplayCell {
    //     let javascript = Manual.fileObject[label];
    //     console.log("javascript", javascript);
    //     // eval(Manual.fileObject[label]);
    //     // let handler = Handler.instances[label];
    //     // console.log(handler);
    //     // //let displaycell = I(`${label}_rendered`)
    //     return I(`${label}_myTemp`,"temp");
    // }

    static example(label:string){
        let [buttonBar, b1, b2, b3] = Manual.buttonBar(label);
        let page1DisplayCell = I(`${label}_page1`, `${label}_page1`, Manual.borderCss,
                                    function(THIS:Element_){return Manual.getLibrary(`${label}.js`, THIS, "javascript")});
        let page2DisplayCell = I(`${label}_page2`, `${label}_page2`, Manual.borderCss,
                                    function(THIS:Element_){return Manual.getLibrary(`${label}.html`, THIS, "html")});
        let page3DisplayCell = I(`${label}_page3`, `${label}_page3`, Manual.borderCss,
            function(THIS:Element_){
                if (!THIS["happend"]) {
                    let javascript = Manual.fileObject[`${label}.js`];
                    eval(javascript);
                    let handler = Handler.instances[label];
                    
                    let exmapleDisplayCell = <DisplayCell>(handler.children[0]);
                    let parentPages = <Pages>(THIS.node.ParentNode.ParentNode.Arguments[1]);
                    setTimeout(() => {
                        Render.update(THIS.parentDisplayCell, true)    
                    }, 0);
                    
                    parentPages.cellArray[2] = exmapleDisplayCell;
                    //console.log(parentPages);
                    THIS["happened"] = true;
                }
                return undefined;
            });
        let pages = new Pages(`${label}_P`,
            page1DisplayCell,
            page2DisplayCell,
            page3DisplayCell,
            //I(`${label}_page3`, `${label}_page3`, css("pink","background:pink"))
        );

        let vert = v(`v_${label}`,
            buttonBar,
            new DisplayCell(pages),
        )
        let mySelected = new Selected(`${label}`, [b1, b2, b3], 0, {onselect: function(index:number, displaycell:DisplayCell){pages.currentPage = index;}} );
        return vert;
    }
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
H(`test`,
    Manual.example("core_00"),
    false,
    new Coord(),
)