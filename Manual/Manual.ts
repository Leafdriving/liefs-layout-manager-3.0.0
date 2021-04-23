declare function monacoContainer(code:string, language:string, elementId?:string):object;
class Manual {
    static allowScroll = css("allowScroll",`overflow-y: auto;`)
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
    border-radius: 10px 10px 0px 0px;background:black;color:white;text-align:center;font-size:20px;`);
    static bottomTabCss = css("btab",`-webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;text-align:center;font-size:20px;
    border-radius: 0px 0px 10px 10px;background:orange;cursor:pointer;`,
    `background:purple`,
    `-webkit-border-radius: 0px 0px 10px 10px;
    -moz-border-radius: 0px 0px 10px 10px;
    border-radius: 0px 0px 10px 10px;background:black;color:white;text-align:center;font-size:20px;`)
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
        let b4 = Manual.launchAsModalButton(label);
        let b5 = Manual.launchAsNewWindow(label);
        let dc = h(`${label}_buttonBar`, `${height}px`,b1,b2,b3, 5);
        let dcb = h(`${label}_BbuttonBar`, `${height}px`,b4,b5, 5);
        return [dc, b1, b2, b3, dcb];
    }
    static launchAsModal(e:MouseEvent, label:string){
        let displaygroup = DisplayGroup.instances[`${label}_buttonBar`];
        if (displaygroup.children.length == 3) {
            let pages = <Pages>Pages.instances[`${label}_P`];
            if (pages.currentPage == 2) {
                let selectInstnce = <Selected>Selected.instances[label];
                selectInstnce.select(0);
                pages.currentPage = 0;
            }
            Render.update(displaygroup.children[ displaygroup.children.length-1 ], true);
            displaygroup["temp"] = displaygroup.children[ displaygroup.children.length-1 ];
            displaygroup.children.splice(-1,1);
            if (!Handler.instances[label]) eval(Manual.fileObject[`${label}.js`]);
            let handler = Handler.instances[label];
            let winModal_ = new winModal(`${label}_`,`Example - ${label}`, handler.children[0],
                function(){
                    displaygroup.children.push( displaygroup["temp"] );
                    Render.scheduleUpdate();
                }, {sizer:{ minWidth:150, maxWidth:800, minHeight:150, maxHeight:600, width:400, height:400 }});
        }
    }
    static showJavascriptButton(label:string) {return I(`${label}_showJavascript`, "Show Javascript", Manual.tabCss)}
    static showHtmlButton(label:string){return I(`${label}_showHtml`, "Show Html", Manual.tabCss)}
    static showRenderButton(label:string){return I(`${label}_Render`, "Show Rendered", Manual.tabCss)}
    static launchAsModalButton(label:string){return I(`${label}_launchAsModal`, "Launch As Modal", Manual.bottomTabCss,
        events({onclick:function(e:MouseEvent){Manual.launchAsModal(e, label)}})    
    )}
    static launchAsNewWindow(label:string){return I(`${label}_launchAsNewWindow`, "Launch As New Window", Manual.bottomTabCss,
        events({onclick: function(){console.log("Launching");window.open(`../Examples/${label}.html`,'_blank', 'location=yes,left=100, top=150, height=350,width=500,status=yes') }}))}
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
        setTimeout(() => {element["monaco"].layout();}, 50);
        return undefined;
    }

    static example(label:string){
        let [buttonBar, b1, b2, b3, bottomButtonBar] = Manual.buttonBar(label);
        let page1DisplayCell = I(`${label}_page1`, `${label}_page1`, Manual.borderCss,
                                    function(THIS:Element_){return Manual.getLibrary(`${label}.js`, THIS, "javascript")});
        let page2DisplayCell = I(`${label}_page2`, `${label}_page2`, Manual.borderCss,
                                    function(THIS:Element_){return Manual.getLibrary(`${label}.html`, THIS, "html")});
        let page3DisplayCell = I(`${label}_page3`, `${label}_page3`, Manual.borderCss,
            function(THIS:Element_){
                if (!THIS["happend"]) {
                    eval(Manual.fileObject[`${label}.js`]);
                    let handler = Handler.instances[label];
                    let exmapleDisplayCell = <DisplayCell>(handler.children[0]);
                    let parentPages = <Pages>(THIS.node.ParentNode.ParentNode.Arguments[1]);
                    setTimeout(() => {Render.update(THIS.parentDisplayCell, true)}, 0);
                    parentPages.cellArray[2] = exmapleDisplayCell;
                    THIS["happened"] = true;
                }
                return undefined;
            });
        let pages = new Pages(`${label}_P`,
            page1DisplayCell,
            page2DisplayCell,
            page3DisplayCell,
        );
        let vert = v(`v_${label}`,
            buttonBar,
            new DisplayCell(pages),
            bottomButtonBar,
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