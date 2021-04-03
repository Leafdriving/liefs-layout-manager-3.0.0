class htmlBlockProps {
    constructor(){}
    static quillDisplayCell:DisplayCell;
    static monacoContainer:any;
    static MonicoContainerDisplayCell:DisplayCell;
    static editHtmlwinModal: winModal;
    static quill:Quill;
    static quillPages:Pages;
    static eventsDisplayCell:DisplayCell;
    static displayEventFunction:DisplayCell;
    static selectInstance:Select;
    static currentDisplayFunction:string;
    static winModalConfirmInstance:winModal;


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
          toolbar: htmlBlockProps.toolbarOptions
        },
        placeholder: 'Start typing Here...',
        readOnly: false,
        theme: 'snow'
      };
    static getState():number{
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock")
        if (propertiesInstance.winModal.modal.isShown())
            if (htmlBlockProps.quillPages) 
                return htmlBlockProps.quillPages.currentPage;
        return undefined;
    }
    static saveState(getState:number = htmlBlockProps.getState()):void {
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        if (getState == 0 && htmlBlockProps.quill)
                htmlblock.innerHTML = htmlBlockProps.quill["root"].innerHTML;
        if (getState == 1 && htmlBlockProps.monacoContainer)
                htmlblock.innerHTML = htmlBlockProps.monacoContainer.getValue();
        if (getState == 2) {
            console.log("here1", htmlBlockProps.selectInstance.lastSelected);
            if (htmlBlockProps.selectInstance.lastSelected != 0){
                console.log("here2")
                htmlBlockProps.confirmwinModal(`Confirm save HtmlBlock ${htmlblock.label}`
                    +` with event ${htmlBlockProps.selectInstance.choices[htmlBlockProps.selectInstance.lastSelected]}`,
                    `htmlBlockProps.postConfirm("confirmed")`,`htmlBlockProps.postConfirm("canceled")`);
            }
        }
    }
    static postConfirm(answer:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        // console.log(answer);
        if (answer == "confirmed") {
            let event = htmlBlockProps.selectInstance.choices[htmlBlockProps.selectInstance.lastSelected];
            console.log(event, htmlBlockProps.monacoContainer.getValue());
            console.log(htmlblock);
            if (!htmlblock.events){
                let obj = {};obj[event] = htmlBlockProps.monacoContainer.getValue();
                htmlblock.events = events(obj)
            } else htmlblock.events.actions[ event ] = new Function( pf.insideOfFunctionString(htmlBlockProps.monacoContainer.getValue()) );
            let el = pf.elExists(htmlblock.label);
            if (el) {
                el.remove();
                Render.update();
            }
        }
    }
    static treeClicked(objectWithProperties:object){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let getState = htmlBlockProps.getState();
        console.log("state", getState)
        if (getState != undefined) {
            htmlBlockProps.saveState(getState);
        }
            propertiesInstance.currentObject = objectWithProperties;

            if (getState == undefined) propertiesInstance.winModal.modal.show();
            htmlBlockProps.launchState();
    }
    static launchState(getState:number = htmlBlockProps.getState()){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        if (getState == 0){
            htmlBlockProps.quillDisplayCell.htmlBlock.innerHTML = `<div id="editor"></div>`;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else {Render.update();}
            setTimeout(() => {
                htmlBlockProps.quill = new Quill('#editor', htmlBlockProps.options);
                htmlBlockProps.quill["clipboard"].dangerouslyPasteHTML(objectWithProperties.innerHTML);
                htmlBlockProps.quillDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0);
        }
        if (getState == 1){
            htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = `<div id="container" style="width:100%;height:100%"></div>`;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(objectWithProperties.innerHTML);
                htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0)
        }
        if (getState == 2){
            htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = `<div id="container" style="width:100%;height:100%"></div>`;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
        }
    }

    static selectSelected(pointerEvent:PointerEvent, eventName:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        htmlBlockProps.currentDisplayFunction = `function(event){console.log("Event: ${eventName} fired on ${objectWithProperties.label}")}`;
        htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = `<div id="container" style="width:100%;height:100%"></div>`;
        htmlBlockProps.saveState();
        let actions = objectWithProperties.events.actions;
        if (eventName in actions) {
            htmlBlockProps.currentDisplayFunction = actions[eventName].toString();
        }
        Render.update();
        if (eventName != "Add an Event")
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(htmlBlockProps.currentDisplayFunction, "javascript");
                htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = undefined;
            }, 0);
    }
    
    static confirmwinModal(confirmText:string, execute:string, dontExecute:string){
        htmlBlockProps.winModalConfirmInstance = <winModal>winModal.byLabel("Confirm");
        let buttons =`<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();${execute}'>Ok</button>`
                    +`<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();${dontExecute}'>Cancel</button>`;
        if (! htmlBlockProps.winModalConfirmInstance)
        htmlBlockProps.winModalConfirmInstance = new winModal("Confirm","Confirm", 200,100, function(){eval(dontExecute)},
                            I("confirm",`${confirmText}</br>${buttons}`, bCss.bgwhite));
        else {
            htmlBlockProps.winModalConfirmInstance.body.htmlBlock.innerHTML = `${confirmText}</br>${buttons}`;
            htmlBlockProps.winModalConfirmInstance.modal.show();
        }
    }
}

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
            this.winModal = new winModal(`${this.label}_prop_winModal`, width, height, false,
            // this.winModal = winmodal(`${this.label}_prop_winModal`, width, height, false,
                function(THIS:any){
                    console.log("closeCallback");
                    htmlBlockProps.saveState();
                    Render.update();
                },
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
            if (Properties[objectType]) Properties[objectType](); // then make it (Once only)
            else console.log(`Please create Properties.${objectType} [static] to handle ${objectWithProperties["label"]} type ${objectType}`);
        }
        let propInstance = <Properties>Properties.byLabel(objectType);
        if (!propInstance) console.log("No Definion in Properties for type "+objectType);
        else {
            Properties[objectType+"TreeClicked"](objectWithProperties)
        }
        Render.update();
    }
    static setHeaderText(propertiesInstance:Properties, text:string){
        let headerDisplay = propertiesInstance.winModal.header.displaygroup.cellArray[0];
        headerDisplay.htmlBlock.innerHTML = text;
    }

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
    static HtmlBlockTreeClicked(objectWithProperties:object) {htmlBlockProps.treeClicked(objectWithProperties)}
    static HtmlBlock(){ // This creates the first and only Properties instance for Htmlblock
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
        htmlBlockProps.quillDisplayCell = I('htmlQuill',`<div id="editor"></div>`, bCss.bgwhite);
        htmlBlockProps.MonicoContainerDisplayCell = I("Monicocontainer",`<div id="container" style="width:100%;height:100%"></div>`);
        htmlBlockProps.displayEventFunction = I("EventsFunction","  ", bCss.bgwhite )
        htmlBlockProps.selectInstance = new Select(["Add an Event", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover",
            "onmouseup", "onwheel", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "onselect"], "20px",
            function(pointerEvent:PointerEvent, key:string){
                console.log("SEelct Function")
                htmlBlockProps.selectSelected(pointerEvent, key);
                 htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
                htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
                htmlBlockProps.selectInstance.resort(htmlBlockProps.selectInstance.choices.indexOf(key));
            }
        )
        
        htmlBlockProps.eventsDisplayCell = v(`eventDisplayV`,
            P("pagesIsEvents",
                I("eventDisplayItemNone","No Events Registered", bCss.bgLightBorder, "20px"),
                h("eventDisplayItemSome", "20px",
                    I(`htmlblock_eventlabel`,"Events:", bCss.bgLight, "100px"),
                ),
                function(thisPages:Pages):number {  // choose Page Function updates display cells
                    let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
                    if (propertiesInstance){
                        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
                        if (objectWithProperties && objectWithProperties.events) {
                            let dg = <DisplayGroup>DisplayGroup.byLabel("eventDisplayItemSome");
                            dg.cellArray = [ dg.cellArray[0] ];
                            for (let key in objectWithProperties.events.actions) 
                                dg.cellArray.push( I(`${objectWithProperties.label}_${key}`, key, bCss.buttons, "100%",
                                events({onclick:function(){
                                     htmlBlockProps.selectSelected(undefined, key);
                                     htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
                                     htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
                                     htmlBlockProps.selectInstance.resort( htmlBlockProps.selectInstance.choices.indexOf(key) ); /// what if not picked???? FIX!
                                    }})), )
                            return 1;
                        }
                    }
                    return 0;
                }
            ),
            htmlBlockProps.selectInstance.rootDisplayCell,
            htmlBlockProps.displayEventFunction,
        );

        let quillPagesDisplayCell = P("quillPages",
            htmlBlockProps.quillDisplayCell,
            htmlBlockProps.MonicoContainerDisplayCell,
            htmlBlockProps.eventsDisplayCell
        )
        htmlBlockProps.quillPages = quillPagesDisplayCell.pages;

        let wysiwyg = I("wysiwygButton",`wysiwyg`, "80px", bCss.buttons, events({onclick:function(event:MouseEvent){
            let pages = htmlBlockProps.quillPages;
            if (pages.currentPage !=0) {
                htmlBlockProps.saveState();
                pages.currentPage = 0;
                htmlBlockProps.launchState();
                // Render.update();
            }
        }}));
        
        let htmlButton = I("htmlButton",`HTML`, "80px",bCss.buttons, events({onclick: function(event:MouseEvent){
            let pages = htmlBlockProps.quillPages;
            if (pages.currentPage !=1) {
                htmlBlockProps.saveState();
                pages.currentPage = 1;
                htmlBlockProps.launchState();
                Render.update();
            }
        }}));

        let blockEvents = I("htmlEvents",`Events`, "80px", bCss.buttons, events({onclick: function(event:MouseEvent){
            let pages = htmlBlockProps.quillPages;
            if (pages.currentPage !=2) {
                htmlBlockProps.saveState();
                pages.currentPage = 2;
                htmlBlockProps.launchState();
                Render.update();
            }
        }}));
        
        
        let selecteds = new Selected("wysiwyg", wysiwyg, htmlButton, blockEvents );
        selecteds.select(undefined, wysiwyg);

        let rootcell = v(`HtmlBlock_prop_v`,
            h("topPropHtmlBlockBar", "20px",
                wysiwyg,
                htmlButton,
                blockEvents,
                I("tplabellabel","label", bCss.bgLightBorder, "100px"),
                keyCells.label,
            ),
            Properties.Coord("HtmlBlock", keyCells),
            quillPagesDisplayCell,
        )
        new Properties("HtmlBlock", rootcell,  {keyCells});
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
    
}

