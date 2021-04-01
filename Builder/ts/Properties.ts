class Properties extends Base {
    static labelNo = 0;
    static instances:Properties[] = [];
    static activeInstances:Properties[] = [];
    static defaults = {}
    static argMap = {
        string : ["label"],
        DisplayCell: ["rootDisplayCell"],
        winModal : ["winModal"],
        function : ["process"],
    }
    static defaultsize = [800,800];
    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    rootDisplayCell :DisplayCell;
    winModal: winModal;
    modal:Modal;
    process:()=>void;
    keyCells:{[key: string]: DisplayCell;}
    currentObject:object;
    currentObjectParentDisplayCell: DisplayCell;

    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Properties.makeLabel(this);
        if (this.rootDisplayCell) {
            let [width, height] = Properties.defaultsize;
            this.winModal = winmodal(`${this.label}_prop_winModal`, width, height,
                                        {body: this.rootDisplayCell,
                                         headerText:`${this.label}-`,
                                        });
        }
    }
    static processNode(node:node_|object, parentDisplayCell:DisplayCell = undefined /* not used with node */){
        let objectWithProperties:object;
        if (BaseF.typeof(node) == "node_") {
            objectWithProperties = (<node_>node).Arguments[1];
            parentDisplayCell = <DisplayCell>((<node_>node).Arguments[2])
        }
        else objectWithProperties = node;

        let objectType = BaseF.typeof(objectWithProperties);

        if (!Properties.byLabel(objectType)) { // if instance doesn't exist...
            if (Properties[objectType]) Properties[objectType](objectWithProperties); // then make it (Once only)
            else console.log(`Please create Properties.${objectType} [static] to handle ${objectWithProperties["label"]} type ${objectType}`);
        }
        let propInstance = <Properties>Properties.byLabel(objectType);

        if (!propInstance) console.log("No Definion in Properties for type "+objectType);
        else {
            propInstance.currentObject = objectWithProperties;      // pass the objectwithProperties to propInstance
            propInstance.currentObjectParentDisplayCell = parentDisplayCell;
            // propInstance.process();                                 // start processing it!
            if (!propInstance.winModal.modal.isShown()) propInstance.winModal.modal.show();
        }
        Render.update();
    }
    static setHeaderText(propertiesInstance:Properties, text:string){
        let headerDisplay = propertiesInstance.winModal.header.displaygroup.cellArray[0];
        headerDisplay.htmlBlock.innerHTML = text;
    }
    // static displayLabel(className:string, label:string, dim = "50px"){
    //     return I(`${className}_${label}_label`,`${label}:`, dim, bCss.bgLightBorder);
    // }
    static displayValue(className:string, label:string, disabled = false, dim=undefined,
            evalFunction:(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell)=>void = undefined){

        let Change = <Function>Properties[`${className}Change`];
        return I(`${className}_${label}_value`, dim, evalFunction,
                "<UNDEFINED>", (!disabled)? bCss.editable: bCss.disabled, (!disabled)?{attributes: {contenteditable:"true"}}:undefined,
                events({onblur:function(e:FocusEvent){Change(label,e.target["innerHTML"])},
                        onkeydown:function(e:KeyboardEvent){if (e.code == 'Enter') {e.preventDefault();e.target["blur"]();}}
                    })
                );
    }
    // static labelAndValue(className:string, label:string, keyCells:object, dim = "50px"){
    //     return h(`${className}_${label}_h`, "20px",
    //         Properties.displayLabel(className, label, dim), // label
    //         keyCells[label]                            // value
    //     )
    // }
    static coordValue(key:string){
        return function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
            let propertiesInstance:Properties = <Properties>Properties.byLabel("HtmlBlock");
            let objectNode = <node_>propertiesInstance.currentObject["renderNode"];
            let objectDisplayCell = objectNode.ParentNode.retArgs.DisplayCell[0];
            htmlBlock.innerHTML = objectDisplayCell.coord[key].toString();
        };
    }
    static Coord(className:string, keyCells:object){
        keyCells["x"] = Properties.displayValue("HtmlBlock", "x", true, "12.5%", Properties.coordValue("x"));
        keyCells["y"] = Properties.displayValue("HtmlBlock", "y", true, "12.5%", Properties.coordValue("y"));
        keyCells["width"] = Properties.displayValue("HtmlBlock", "width", true, "12.5%", Properties.coordValue("width"));
        keyCells["height"] = Properties.displayValue("HtmlBlock", "height", true, "12.5%", Properties.coordValue("height"));
        return h(`${className}_Coord_h`, "20px",
                    I(`HtmlBlock_DisplayCell`,`Parent DisplayCell:`, bCss.bgLightCenter, "150px"),
                    I(`HtmlBlock_x_label`,`x:`, "8.0%", bCss.bgLightBorder),
                    keyCells["x"],
                    I(`HtmlBlock_y_label`,`y:`, "8.0%", bCss.bgLightBorder),
                    keyCells["y"],
                    I(`HtmlBlock_width_label`,`width:`, "17.0%", bCss.bgLightBorder),
                    keyCells["width"],
                    I(`HtmlBlock_height_label`,`height:`, "17.0%", bCss.bgLightBorder),
                    keyCells["height"],                                                            
        )
    }
    static HtmlBlock(currentObject:object){ // This creates the first and only Properties instance for Htmlblock
        let keyCells = {
            label:Properties.displayValue("HtmlBlock", "label",  true , function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                let propertiesInstance:Properties = <Properties>Properties.byLabel("HtmlBlock");
                htmlBlock.innerHTML = (<HtmlBlock>propertiesInstance.currentObject).label;
            }),
            minDisplayGroupSize:Properties.displayValue("HtmlBlock", "minDisplayGroupSize", false, function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                let propertiesInstance:Properties = <Properties>Properties.byLabel("HtmlBlock");
                let minSize = (<HtmlBlock>propertiesInstance.currentObject).minDisplayGroupSize;
                if (minSize) htmlBlock.innerHTML = minSize.toString();
                else htmlBlock.innerHTML = "undefined";
            } ), 
        }
        let quillDisplayCell = I('htmlQuill',`<div id="editor"></div>`, bCss.bgwhite)
        let htmlblock = quillDisplayCell.htmlBlock
        htmlblock.evalInnerHtml = function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
            if (!pf.elExists(htmlblock.label)) {
                setTimeout(() => {
                    console.log("now - evalInnerHtml");
                    let propInstance = <Properties>Properties.byLabel("HtmlBlock");
                    Properties.makeQuill((<HtmlBlock>propInstance.currentObject).innerHTML);
                    //(<HtmlBlock>propInstance.currentObject).innerHTML = undefined;
                    htmlBlock.innerHTML = undefined;
                }, 0);
            }
        }


        let rootcell = v(`HtmlBlock_prop_v`,
            h("topPropHtmlBlockBar", "20px",
                I("tplabellabel","label", bCss.bgLightBorder, "100px"),
                keyCells.label,
            ),
            Properties.Coord("HtmlBlock", keyCells),
            quillDisplayCell,
        )
        new Properties("HtmlBlock", rootcell,  {keyCells, currentObject});
        
    }
    static HtmlBlockChange(variable:string, value:string){ // called when an input on Properties is changed
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        let parentNode = objectWithProperties.renderNode.ParentNode;
        let parentDisplayCell = parentNode.Arguments[1]


        console.log(`Change Htmlblock-${objectWithProperties.label} variable "${variable}" to "${value}"`)
        switch (variable) {
            case "label":
                objectWithProperties.label = value;
                parentDisplayCell.label = value;

                Builder.updateTree();                
                Properties.processNode(objectWithProperties);
                break;
            default:
                console.log(`No way to handle ${variable} value ${value}`);
                break;
        }
    }
    static editHtmlwinModal: winModal;
    static initEditHtml(){
        Properties.editHtmlwinModal = new winModal("initEditHtml", "Div-Editor",
            I("initEditHtml","something"),
            function(THIS:any){
                console.log("closeCallback");
                (<HtmlBlock>(<Properties>Properties.byLabel("HtmlBlock")).currentObject).innerHTML = Properties.quill["root"].innerHTML;
                Render.update();
            }
        )
    }
    static toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{'header': [1, 2, 3, 4, 5, 6, false] }],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'direction': 'rtl'}],
        [{'size': ['small', false, 'large', 'huge']}],
        ['link', 'image', 'video', 'formula'],
        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}]
    ];
    static options = {
        debug: 'warn',
        modules: {
          toolbar: Properties.toolbarOptions
        },
        placeholder: 'Start typing Here...',
        readOnly: false,
        theme: 'snow'
      };
    static quill:Quill;
    static makeQuill(text:string){
      Properties.quill = new Quill('#editor', Properties.options);
      Properties.quill["clipboard"].dangerouslyPasteHTML(text);
      // Builder.editHtmlwinModalBody.htmlBlock.innerHTML = undefined;
    }
}

