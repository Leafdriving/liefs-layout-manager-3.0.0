
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
    static activeInstance:Properties;
    // retArgs:ArgsObj;   // <- this will appear
    label:string;
    rootDisplayCell :DisplayCell;
    winModal: winModal;
    modal:Modal;
    process:()=>void;
    keyCells:{[key: string]: DisplayCell;}
    currentObject:object;
    currentObjectParentDisplayCell: DisplayCell;
    close:()=>void;


    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Properties.makeLabel(this);
        if (this.rootDisplayCell) {
            let [width, height] = Properties.defaultsize;
            this.winModal = new winModal(`${this.label}_prop_winModal`, width, height, false,
                function(THIS:any){
                    console.log(pf.preUnderscore(THIS.label))
                    switch (pf.preUnderscore(THIS.label)) {
                        case "HtmlBlock":
                            htmlBlockProps.onCloseCallback(THIS);
                            break;
                        case "DisplayGroup":
                            DisplayGroupProps.onCloseCallback(THIS);
                            break;
                        case "Pages":
                            PagesProps.onCloseCallback(THIS);
                        default:
                            break;
                    }
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
            if (Properties.activeInstance){
                Properties.activeInstance.close()
            }
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
        htmlBlockProps.selectInstanceWhichOnEvent = new Select(["Add an Event", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover",
            "onmouseup", "onwheel", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "onselect"], "20px",
            function(pointerEvent:PointerEvent, key:string){
                htmlBlockProps.onChooseSelectEvent(pointerEvent, key);
                // console.log("SEelct Function")
                // htmlBlockProps.selectSelected(pointerEvent, key);
                // htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
                // htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
                // htmlBlockProps.selectInstance.resort(htmlBlockProps.selectInstance.choices.indexOf(key));
            }
        )
        // Events pages created here
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
                                    htmlBlockProps.onClickPreDefinedEvent(key);
                                    //  htmlBlockProps.selectSelected(undefined, key);
                                    //  htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
                                    //  htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
                                    //  htmlBlockProps.selectInstance.changeDisplayNameToIndex( htmlBlockProps.selectInstance.choices.indexOf(key) ); /// what if not picked???? FIX!
                                    }})), )
                            return 1;
                        }
                    }
                    return 0;
                }
            ),
            htmlBlockProps.selectInstanceWhichOnEvent.rootDisplayCell,
            htmlBlockProps.displayEventFunction,
        );
        htmlBlockProps.cssSelect= new Select(["CssSelct"], "200px", htmlBlockProps.cssChange);
        htmlBlockProps.cssCurrentValueDisplayCell = I("cssValue", "Value", bCss.bgLightBorder);
        htmlBlockProps.cssBodyDisplayCell = I("CssBody","Body", bCss.bgwhite);

        let textColor = I("cssTextColor","Text Color",bCss.bgLightBorder, events({onclick:function(){htmlBlockProps.colorPick("text")}}))
        let bgColor = I("cssBGColor","Background Color",bCss.bgLightBorder, events({onclick:function(){htmlBlockProps.colorPick("background")}}))


        htmlBlockProps.cssDisplayCell =
        v("cssstuff",
            h("currentCss", "25px",
                I("cssstuff","Current:", bCss.bgLightBorder, "80px"),
                htmlBlockProps.cssCurrentValueDisplayCell,
                htmlBlockProps.cssSelect.rootDisplayCell,
            ),
            h("cssbuttons", "25px",
                textColor,
                bgColor,
            ),
            htmlBlockProps.cssBodyDisplayCell
        )

        let quillPagesDisplayCell = P("quillPages",
            htmlBlockProps.quillDisplayCell,
            htmlBlockProps.MonicoContainerDisplayCell,
            htmlBlockProps.eventsDisplayCell,
            htmlBlockProps.cssDisplayCell,
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
        
        let pickCSS = I("pickCss",`Css Class`, "80px", bCss.buttons, events({onclick: function(event:MouseEvent){
            let pages = htmlBlockProps.quillPages;
            if (pages.currentPage !=3) {
                htmlBlockProps.saveState();
                pages.currentPage = 3;
                htmlBlockProps.launchState();
                Render.update();
            }
        }}));
        

        let selecteds = new Selected("wysiwyg", wysiwyg, htmlButton, blockEvents, pickCSS );
        selecteds.select(undefined, wysiwyg);

        let rootcell = v(`HtmlBlock_prop_v`,
            h("topPropHtmlBlockBar", "20px",
                wysiwyg,
                htmlButton,
                blockEvents,
                pickCSS,
                I("tplabellabel","label", bCss.bgLightBorder, "100px"),
                keyCells.label,
            ),
            Properties.Coord("HtmlBlock", keyCells),
            quillPagesDisplayCell,
        )
        new Properties("HtmlBlock", rootcell,  {keyCells, close:function(){
            (<Properties>(Properties.byLabel("HtmlBlock"))).winModal.modal.hide();
            htmlBlockProps.onCloseCallback();
        }});
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
    static DisplayGroup(){ // This creates the first and only Properties instance for DisplayGroup
        let ishorSelect = select("SelectIshor", ["true", "false"],
            function(pointerEvent:PointerEvent, key:string){
                let propertiesInstance:Properties = <Properties>Properties.byLabel("DisplayGroup");
                let displaygroup = <DisplayGroup>propertiesInstance.currentObject;
                if (key == "false" && displaygroup.ishor) {displaygroup.ishor = false;Builder.updateTree();Render.update()}
                if (key == "true" && !displaygroup.ishor) {displaygroup.ishor = true;Builder.updateTree();Render.update()}
            });
        ishorSelect.preRenderCallback = function(displaycell:DisplayCell, derender:boolean){
            let propertiesInstance:Properties = <Properties>Properties.byLabel("DisplayGroup");
            let displaygroup = <DisplayGroup>propertiesInstance.currentObject;
            let select = <Select>Select.byLabel("SelectIshor");
            select.clickableName.htmlBlock.innerHTML = select.choices[(displaygroup.ishor) ? 0 : 1];
            // if (select.currentSelected == 0 && !displaygroup.ishor) select.changeDisplayNameToIndex(1);
            // if (select.currentSelected == 1 && displaygroup.ishor) select.changeDisplayNameToIndex(0);
        }
        let keyCells = {
            label:Properties.displayValue("DislayGroup", "label",  true , function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                let propertiesInstance:Properties = <Properties>Properties.byLabel("DisplayGroup");
                htmlBlock.innerHTML = (<DisplayGroup>propertiesInstance.currentObject).label;
            }),
            ishor:ishorSelect,
            margin: DisplayCell.editable( I("DisplayGroupMargin_", bCss.bgWhiteBorder,
                                            function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                                                let propertiesInstance:Properties = <Properties>Properties.byLabel("DisplayGroup");
                                                htmlBlock.innerHTML = (<DisplayGroup>propertiesInstance.currentObject).marginHor.toString();
                                            }),
                                function(e: FocusEvent, displaycell: DisplayCell, innerHTML: string){

                                    let propertiesInstance:Properties = <Properties>Properties.byLabel("DisplayGroup");
                                    let displaygroup = <DisplayGroup>propertiesInstance.currentObject;
                                    displaygroup.marginHor = displaygroup.marginVer = parseInt(innerHTML);
                                    Render.update();
                                }
            )
        }
    
    DisplayGroupProps.horizontalCellArray = I("blank_o","", "20px", bCss.bgLightBorder);
    DisplayGroupProps.rootcell = v(`DislayGroup_prop_v`,
        h("DisplayGroup_prop_hTop", "20px",
            I(`DisplayGroupLabel`,"Label:", bCss.bgLightBorder),
            keyCells.label,
            I(`DisplayGroupishor`,"IsHorizontal:", bCss.bgLightBorder),
            keyCells.ishor,
            I(`DisplayGroupMargin`,"Margin Between Cells:", "160px",bCss.bgLightBorder),
            keyCells.margin,
        ),
        I("DisplayGroupChildren", "DisplayGroup Children:", "20px", bCss.bgLightBorder),
        DisplayGroupProps.horizontalCellArray,

        I("Hello", "Hello", bCss.bgLightBorder)
    );
    new Properties("DisplayGroup", DisplayGroupProps.rootcell,  {keyCells, close:function(){
        (<Properties>(Properties.byLabel("DisplayGroup"))).winModal.modal.hide();
        DisplayGroupProps.onCloseCallback();
    }});
    }
    static DisplayGroupTreeClicked(objectWithProperties:DisplayGroup) {DisplayGroupProps.treeClicked(objectWithProperties)}

    static DragBar(){ // This creates the first and only Properties instance for DisplayGroup
        let keyCells = {
            label:Properties.displayValue("DragBarLabel", "label",  true , function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                let propertiesInstance:Properties = <Properties>Properties.byLabel("DragBar");
                htmlBlock.innerHTML = (<DragBar>propertiesInstance.currentObject).label;
            }),
            min: DisplayCell.editable( I("DragBarMin_", bCss.bgWhiteBorder,
                                            function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                                                let propertiesInstance:Properties = <Properties>Properties.byLabel("DragBar");
                                                htmlBlock.innerHTML = (<DragBar>propertiesInstance.currentObject).min.toString();
                                            }),
                                function(e: FocusEvent, displaycell: DisplayCell, innerHTML: string){
                                    let propertiesInstance:Properties = <Properties>Properties.byLabel("DragBar");
                                    let dragbar = <DragBar>propertiesInstance.currentObject;
                                    dragbar.min = parseInt(innerHTML);
                                    Render.update();
                                }
            ),
            max: DisplayCell.editable( I("DragBarMax_", bCss.bgWhiteBorder,
                                            function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                                                let propertiesInstance:Properties = <Properties>Properties.byLabel("DragBar");
                                                htmlBlock.innerHTML = (<DragBar>propertiesInstance.currentObject).max.toString();
                                            }),
                                function(e: FocusEvent, displaycell: DisplayCell, innerHTML: string){
                                    let propertiesInstance:Properties = <Properties>Properties.byLabel("DragBar");
                                    let dragbar = <DragBar>propertiesInstance.currentObject;
                                    dragbar.max = parseInt(innerHTML);
                                    Render.update();
                                }
),
        }
    let rootcell = v(`DragBar_prop_v`,
        h(`dragbar_h_`, "20px",
            I("DragBar_label", "Label:", bCss.bgLightBorder),
            keyCells.label,
        ),
        h(`dragbar_h2_`, "20px",
            I("DragBar_min", "Min:", bCss.bgLightBorder),
            keyCells.min,
            I("DragBar_max", "Max:", bCss.bgLightBorder),
            keyCells.max,
        ),
    );
    new Properties("DragBar", rootcell,  {keyCells, close:function(){
        (<Properties>(Properties.byLabel("DragBar"))).winModal.modal.hide();
        DragBarProps.onCloseCallback();
    }});
    }
    static DragBarTreeClicked(objectWithProperties:object) {
        DragBarProps.treeClicked(objectWithProperties);
    }
    static Handler(){ // This creates the first and only Properties instance for DisplayGroup
        let keyCells = {
            // label:Properties.displayValue("HtmlBlock", "label",  true , function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
            //     let propertiesInstance:Properties = <Properties>Properties.byLabel("HtmlBlock");
            //     htmlBlock.innerHTML = (<HtmlBlock>propertiesInstance.currentObject).label;
            // }),
            // minDisplayGroupSize:Properties.displayValue("HtmlBlock", "minDisplayGroupSize", false, function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
            //     let propertiesInstance:Properties = <Properties>Properties.byLabel("HtmlBlock");
            //     let minSize = (<HtmlBlock>propertiesInstance.currentObject).minDisplayGroupSize;
            //     if (minSize) htmlBlock.innerHTML = minSize.toString();
            //     else htmlBlock.innerHTML = "undefined";
            // } ), 
        }
    let rootcell = v(`Handler_prop_v`,
        
        I("Hello", "Hello", bCss.bgLightBorder)
    );
    new Properties("Handler", rootcell,  {keyCells, close:function(){
        (<Properties>(Properties.byLabel("Handler"))).winModal.modal.hide();
        HandlerProps.onCloseCallback();
    }});
    }
    static HandlerTreeClicked(objectWithProperties:object) {HandlerProps.treeClicked(objectWithProperties)}
    static Pages(){
        let keyCells = {
            label:Properties.displayValue("PagesLabel", "label",  true ,
                function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                    let propertiesInstance:Properties = <Properties>Properties.byLabel("Pages");
                    htmlBlock.innerHTML = (<Pages>propertiesInstance.currentObject).label;
                }),
            currentPage: DisplayCell.editable( I("currentPage", bCss.bgWhiteBorder,
                                                function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                                                    let propertiesInstance:Properties = <Properties>Properties.byLabel("Pages");
                                                    htmlBlock.innerHTML = (<Pages>propertiesInstance.currentObject).currentPage.toString();
                                                }),
                function(e: FocusEvent, displaycell: DisplayCell, innerHTML: string){
                    let propertiesInstance:Properties = <Properties>Properties.byLabel("Pages");
                    let pages = <Pages>propertiesInstance.currentObject;
                    pages.currentPage = parseInt(innerHTML);
                    Builder.updateTree();
                }
            )
        }
        
        let rootcell = v(`Pages_prop_v`,
        h("Pages_props_h", "25px",
            I(`Pages_proph2`,"Label", bCss.bgLightBorder),
            keyCells.label,
            I(`Pages_proph3`,"currentPage", bCss.bgLightBorder),
            keyCells.currentPage,
        ),
        PagesProps.MonicoContainerDisplayCell
    );
        new Properties("Pages", rootcell, {keyCells, close:function(){
            (<Properties>(Properties.byLabel("Pages"))).winModal.modal.hide();
            PagesProps.onCloseCallback();
        }});
    }
    static PagesTreeClicked(objectWithProperties:Pages) {PagesProps.treeClicked(objectWithProperties)}
}

