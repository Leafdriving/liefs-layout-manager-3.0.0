class CodeBlock {
    static byLabel(label:string):CodeBlock{
      for (let key in CodeBlock.instances)
          if (CodeBlock.instances[key].label == label)
              return CodeBlock.instances[key];
      return undefined;
  }
    static download(filename:string, text:string) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
    static downloadfile(el:Element) {
      el = el.parentElement;
      let label = el.id.slice(0, -3);
      let codeblock = CodeBlock.byLabel(label)
      CodeBlock.download(label+".html", codeblock.html.replace(/&lt/g, "<")+"\n<script>\n"+codeblock.javascript+"</script>");
    }
    static instances: CodeBlock[] = [];
    static defaults = {
      label : function(){return `CBlock_${pf.pad_with_zeroes(CodeBlock.instances.length)}`},
      height:200,
    }
    static argMap = {
      string : ["label", "html", "javascriptForEval", "discription"],
      number : ["height"]
    }
  
    label:string;
    html:string;
    javascript:string;
    javascriptForEval:string;
    css:string;
    discription: string
    htmlDisplayCell: DisplayCell;
    javascriptDisplayCell: DisplayCell;
    evalDisplayCell: DisplayCell;
  
    height:number;
  
    displaycell: DisplayCell;
  
    constructor(...Arguments:any){
      CodeBlock.instances.push(this);
      mf.applyArguments("CodeBlock", Arguments, CodeBlock.defaults, CodeBlock.argMap, this);
      this.javascript = `H("${this.label}_handler",  // opens a handler (Starts Liefs-layout-manager)
    ${this.javascriptForEval.replace(/\n/g, "\n  ")}
  )`;
      var elem = document.createElement('div');
      elem.innerHTML = this.html.replace(/\n/g, "\n  ");
      document.body.appendChild(elem);
      this.html = `&lthtml lang="en">
    &lthead>&ltmeta charset="utf-8">&lttitle>liefs-layout-manager ${this.label}&lt/title>
    &ltscript src="../../js/liefs-layout-managerV3.0.0.js">&lt/script>
    &lt/head>
    &ltbody>
    ${this.html.replace(/\n/g, "\n  ").replace(/</g, "&lt")}
    &lt/body>
  &lt/html>`;
  
    this.build();
    }
    build(){
      let THIS = this;
      let htmlLabel = I(`${this.label}_html_label`,`HTML`, "20px", CSS.centerText);
      let htmlBody = I(`${this.label}_html`,`<pre><code class="language-markup">${this.html}</code></pre>`);
      this.htmlDisplayCell = 
        v(`${this.label}_v1`, "37.5%",
          htmlLabel,
          htmlBody,
        );
      let DBhtmlDisplayCell =
      dragbar(
        v(`${this.label}_v1_DB`, "37.5%",
          htmlLabel,
          htmlBody,
        ), 200, 600);
  
      this.javascriptDisplayCell = 
        v(`${this.label}_v2`, "37.5%",
          I(`${this.label}_javascript_label`,`Javascript`, "20px", CSS.centerText),
          I(`${this.label}_javascript`,`<pre><code class="language-javascript">${this.javascript}</code></pre>`),
        );
      let EvalLabel = I(`${this.label}_output_label`,`Rendered`, "20px", CSS.centerText)
      let EvalJS = eval(this.javascriptForEval)
      this.evalDisplayCell =
        v(`${this.label}_v3`, "25%",
          EvalLabel,
          EvalJS,
        );
      let DBevalDisplayCell =
      dragbar(
        v(`${this.label}_v3`, "25%",
          EvalLabel,
          EvalJS,
        ), 200, 600);
      let all3 =
        h(`${this.label}_h`, `${this.height}`, 5,
          DBhtmlDisplayCell,
          this.javascriptDisplayCell,
          DBevalDisplayCell,
        );
  
      let H_I_I_I = h(`${this.label}_buttons`, "25px", 5,
        I(`${this.label}_b2`,`Show Html Only <button onclick="CodeBlock.downloadfile(this)">Download</button>`,
            CSS.centerButton, Pages.button(`${this.label}_inner`, 1)),
        I(`${this.label}_b3`,"Show Javascript Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 2)),
        I(`${this.label}_b4`,"Show Rendered Only", CSS.centerButton, Pages.button(`${this.label}_inner`, 3)),
      );
  
      let P_4Items = P(`${this.label}_inner`,
        all3,
        this.htmlDisplayCell,
        this.javascriptDisplayCell,
        this.evalDisplayCell,
      );
  
      // let title = I(`${this.label}_title`,this.label +" - " + this.discription, h1, "30px")
  
      let launch = I(`${this.label}_launch`,"Launch in new Tab - (then view-source!)", "25px", CSS.centerButton,
                          events({onclick: function(){
                                  Object.assign(document.createElement('a'), {
                                    target: '_blank',
                                    href: `./Examples/${THIS.label}.html`,
                                  }).click();
                    }}));
  
      let displaycell1 =
      v(`${this.label}_v0`, 2,
        // title,
        I(`${this.label}_b1`,"Show all 3 Inline", CSS.centerButton , Pages.button(`${this.label}_inner`, 0), "25px" ),
        H_I_I_I,
        P_4Items,
        launch,
      );
  
      let displaycell2 =
      v(`${this.label}_v0_2`, 2,
        // title,
        H_I_I_I,
        P_4Items,
        launch,
      );
  
      this.displaycell = P(`${this.label}_TopPage`,
        displaycell1,
        displaycell2,
        function(thisPages:Pages):number {
          let displaycell = thisPages.displaycells[thisPages.currentPage];
          let returnValue = (displaycell.coord.width > 1300) ? 0 : 1;
          if (returnValue != thisPages.currentPage) {
            let refPage = Pages.byLabel(this.label.slice(0, -8)+"_inner");
            refPage.currentPage = (returnValue) ? ((refPage.currentPage == 0) ? 1:refPage.currentPage) : 0;
          }
          //console.log(returnValue == thisPages.currentPage)
          // console.log(returnValue,refPage.currentPage)
          // if (!Handler.firstRun && returnValue == 1 && refPage.currentPage == 0) refPage.currentPage = 3;
          return returnValue;
        }
      )
    }
  }
  function codeblock(...Arguments:any){
    let cb = new CodeBlock(...Arguments);
    return cb.displaycell;
  }