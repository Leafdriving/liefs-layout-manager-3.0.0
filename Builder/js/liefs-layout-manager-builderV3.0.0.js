class Properties extends Base {
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Properties.makeLabel(this);
        if (this.rootDisplayCell) {
            let [width, height] = Properties.defaultsize;
            this.winModal = new winModal(`${this.label}_prop_winModal`, width, height, false, 
            // this.winModal = winmodal(`${this.label}_prop_winModal`, width, height, false,
            function (THIS) {
                console.log("closeCallback");
                htmlBlockProps.saveState();
                Render.update();
            }, { body: this.rootDisplayCell,
                headerText: `${this.label}-`,
            });
        }
    }
    static processNode(node, parentDisplayCell = undefined /* not used with node */) {
        let objectWithProperties;
        if (BaseF.typeof(node) == "node_") {
            objectWithProperties = node.Arguments[1];
            parentDisplayCell = (node.Arguments[2]);
        }
        else
            objectWithProperties = node;
        let objectType = BaseF.typeof(objectWithProperties);
        if (!Properties.byLabel(objectType)) { // if instance doesn't exist...
            if (Properties[objectType])
                Properties[objectType](); // then make it (Once only)
            else
                console.log(`Please create Properties.${objectType} [static] to handle ${objectWithProperties["label"]} type ${objectType}`);
        }
        let propInstance = Properties.byLabel(objectType);
        if (!propInstance)
            console.log("No Definion in Properties for type " + objectType);
        else {
            Properties[objectType + "TreeClicked"](objectWithProperties);
        }
        Render.update();
    }
    static setHeaderText(propertiesInstance, text) {
        let headerDisplay = propertiesInstance.winModal.header.displaygroup.cellArray[0];
        headerDisplay.htmlBlock.innerHTML = text;
    }
    static displayValue(className, label, disabled = false, dim = undefined, evalFunction = undefined) {
        let Change = Properties[`${className}Change`];
        return I(`${className}_${label}_value`, dim, evalFunction, "<UNDEFINED>", (!disabled) ? bCss.editable : bCss.disabled, (!disabled) ? { attributes: { contenteditable: "true" } } : undefined, events({ onblur: function (e) { Change(label, e.target["innerHTML"]); },
            onkeydown: function (e) { if (e.code == 'Enter') {
                e.preventDefault();
                e.target["blur"]();
            } }
        }));
    }
    static coordValue(key) {
        return function (htmlBlock, zindex, derender, node, displaycell) {
            let propertiesInstance = Properties.byLabel("HtmlBlock");
            let objectNode = propertiesInstance.currentObject["renderNode"];
            let objectDisplayCell = objectNode.ParentNode.retArgs.DisplayCell[0];
            htmlBlock.innerHTML = objectDisplayCell.coord[key].toString();
        };
    }
    static Coord(className, keyCells) {
        keyCells["x"] = Properties.displayValue("HtmlBlock", "x", true, "12.5%", Properties.coordValue("x"));
        keyCells["y"] = Properties.displayValue("HtmlBlock", "y", true, "12.5%", Properties.coordValue("y"));
        keyCells["width"] = Properties.displayValue("HtmlBlock", "width", true, "12.5%", Properties.coordValue("width"));
        keyCells["height"] = Properties.displayValue("HtmlBlock", "height", true, "12.5%", Properties.coordValue("height"));
        return h(`${className}_Coord_h`, "20px", I(`HtmlBlock_DisplayCell`, `Parent DisplayCell:`, bCss.bgLightCenter, "150px"), I(`HtmlBlock_x_label`, `x:`, "8.0%", bCss.bgLightBorder), keyCells["x"], I(`HtmlBlock_y_label`, `y:`, "8.0%", bCss.bgLightBorder), keyCells["y"], I(`HtmlBlock_width_label`, `width:`, "17.0%", bCss.bgLightBorder), keyCells["width"], I(`HtmlBlock_height_label`, `height:`, "17.0%", bCss.bgLightBorder), keyCells["height"]);
    }
    static HtmlBlockTreeClicked(objectWithProperties) { htmlBlockProps.treeClicked(objectWithProperties); }
    static HtmlBlock() {
        let keyCells = {
            label: Properties.displayValue("HtmlBlock", "label", true, function (htmlBlock, zindex, derender, node, displaycell) {
                let propertiesInstance = Properties.byLabel("HtmlBlock");
                htmlBlock.innerHTML = propertiesInstance.currentObject.label;
            }),
            minDisplayGroupSize: Properties.displayValue("HtmlBlock", "minDisplayGroupSize", false, function (htmlBlock, zindex, derender, node, displaycell) {
                let propertiesInstance = Properties.byLabel("HtmlBlock");
                let minSize = propertiesInstance.currentObject.minDisplayGroupSize;
                if (minSize)
                    htmlBlock.innerHTML = minSize.toString();
                else
                    htmlBlock.innerHTML = "undefined";
            }),
        };
        htmlBlockProps.quillDisplayCell = I('htmlQuill', `<div id="editor"></div>`, bCss.bgwhite);
        htmlBlockProps.MonicoContainerDisplayCell = I("Monicocontainer", `<div id="container" style="width:100%;height:100%"></div>`);
        htmlBlockProps.displayEventFunction = I("EventsFunction", "  ", bCss.bgwhite);
        htmlBlockProps.selectInstance = new Select(["Add an Event", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover",
            "onmouseup", "onwheel", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "onselect"], "20px", function (pointerEvent, key) {
            console.log("SEelct Function");
            htmlBlockProps.selectSelected(pointerEvent, key);
            htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
            htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
            htmlBlockProps.selectInstance.resort(htmlBlockProps.selectInstance.choices.indexOf(key));
        });
        htmlBlockProps.eventsDisplayCell = v(`eventDisplayV`, P("pagesIsEvents", I("eventDisplayItemNone", "No Events Registered", bCss.bgLightBorder, "20px"), h("eventDisplayItemSome", "20px", I(`htmlblock_eventlabel`, "Events:", bCss.bgLight, "100px")), function (thisPages) {
            let propertiesInstance = Properties.byLabel("HtmlBlock");
            if (propertiesInstance) {
                let objectWithProperties = propertiesInstance.currentObject;
                if (objectWithProperties && objectWithProperties.events) {
                    let dg = DisplayGroup.byLabel("eventDisplayItemSome");
                    dg.cellArray = [dg.cellArray[0]];
                    for (let key in objectWithProperties.events.actions)
                        dg.cellArray.push(I(`${objectWithProperties.label}_${key}`, key, bCss.buttons, "100%", events({ onclick: function () {
                                htmlBlockProps.selectSelected(undefined, key);
                                htmlBlockProps.selectInstance.lastSelected = htmlBlockProps.selectInstance.currentSelected;
                                htmlBlockProps.selectInstance.currentSelected = htmlBlockProps.selectInstance.choices.indexOf(key);
                                htmlBlockProps.selectInstance.resort(htmlBlockProps.selectInstance.choices.indexOf(key)); /// what if not picked???? FIX!
                            } })));
                    return 1;
                }
            }
            return 0;
        }), htmlBlockProps.selectInstance.rootDisplayCell, htmlBlockProps.displayEventFunction);
        htmlBlockProps.cssSelect = new Select(["CssSelct", "Option2"], "200px");
        htmlBlockProps.cssCurrentValueDisplayCell = I("cssValue", "Value", bCss.bgLightBorder);
        htmlBlockProps.cssBodyDisplayCell = I("CssBody", "Body", bCss.bgwhite);
        let textColor = I("cssTextColor", "Text Color", bCss.bgLightBorder, events({ onclick: function () { htmlBlockProps.colorPick("text"); } }));
        htmlBlockProps.cssDisplayCell =
            v("cssstuff", h("currentCss", "25px", I("cssstuff", "Current:", bCss.bgLightBorder, "80px"), htmlBlockProps.cssCurrentValueDisplayCell, htmlBlockProps.cssSelect.rootDisplayCell), h("cssbuttons", "25px", textColor, I("cssBackgroundColor", "Background Color", bCss.bgLightBorder)), htmlBlockProps.cssBodyDisplayCell);
        let quillPagesDisplayCell = P("quillPages", htmlBlockProps.quillDisplayCell, htmlBlockProps.MonicoContainerDisplayCell, htmlBlockProps.eventsDisplayCell, htmlBlockProps.cssDisplayCell);
        htmlBlockProps.quillPages = quillPagesDisplayCell.pages;
        let wysiwyg = I("wysiwygButton", `wysiwyg`, "80px", bCss.buttons, events({ onclick: function (event) {
                let pages = htmlBlockProps.quillPages;
                if (pages.currentPage != 0) {
                    htmlBlockProps.saveState();
                    pages.currentPage = 0;
                    htmlBlockProps.launchState();
                    // Render.update();
                }
            } }));
        let htmlButton = I("htmlButton", `HTML`, "80px", bCss.buttons, events({ onclick: function (event) {
                let pages = htmlBlockProps.quillPages;
                if (pages.currentPage != 1) {
                    htmlBlockProps.saveState();
                    pages.currentPage = 1;
                    htmlBlockProps.launchState();
                    Render.update();
                }
            } }));
        let blockEvents = I("htmlEvents", `Events`, "80px", bCss.buttons, events({ onclick: function (event) {
                let pages = htmlBlockProps.quillPages;
                if (pages.currentPage != 2) {
                    htmlBlockProps.saveState();
                    pages.currentPage = 2;
                    htmlBlockProps.launchState();
                    Render.update();
                }
            } }));
        let pickCSS = I("pickCss", `Css Class`, "80px", bCss.buttons, events({ onclick: function (event) {
                let pages = htmlBlockProps.quillPages;
                if (pages.currentPage != 3) {
                    htmlBlockProps.saveState();
                    pages.currentPage = 3;
                    htmlBlockProps.launchState();
                    Render.update();
                }
            } }));
        let selecteds = new Selected("wysiwyg", wysiwyg, htmlButton, blockEvents, pickCSS);
        selecteds.select(undefined, wysiwyg);
        let rootcell = v(`HtmlBlock_prop_v`, h("topPropHtmlBlockBar", "20px", wysiwyg, htmlButton, blockEvents, pickCSS, I("tplabellabel", "label", bCss.bgLightBorder, "100px"), keyCells.label), Properties.Coord("HtmlBlock", keyCells), quillPagesDisplayCell);
        new Properties("HtmlBlock", rootcell, { keyCells });
    }
    static HtmlBlockChange(variable, value) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let objectWithProperties = propertiesInstance.currentObject;
        let parentNode = objectWithProperties.renderNode.ParentNode;
        let parentDisplayCell = parentNode.Arguments[1];
        console.log(`Change Htmlblock-${objectWithProperties.label} variable "${variable}" to "${value}"`);
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
Properties.labelNo = 0;
Properties.instances = [];
Properties.activeInstances = [];
Properties.defaults = {};
Properties.argMap = {
    string: ["label"],
    DisplayCell: ["rootDisplayCell"],
    winModal: ["winModal"],
    function: ["process"],
};
Properties.defaultsize = [800, 800];
class htmlBlockProps {
    constructor() { }
    static getState() {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        if (propertiesInstance.winModal.modal.isShown())
            if (htmlBlockProps.quillPages)
                return htmlBlockProps.quillPages.currentPage;
        return undefined;
    }
    static saveState(getState = htmlBlockProps.getState()) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let htmlblock = propertiesInstance.currentObject;
        if (getState == 0 && htmlBlockProps.quill)
            htmlblock.innerHTML = htmlBlockProps.quill["root"].innerHTML;
        if (getState == 1 && htmlBlockProps.monacoContainer)
            htmlblock.innerHTML = htmlBlockProps.monacoContainer.getValue();
        if (getState == 2) {
            console.log("here1", htmlBlockProps.selectInstance.lastSelected);
            if (htmlBlockProps.selectInstance.lastSelected != 0) {
                console.log("here2");
                htmlBlockProps.confirmwinModal(`Confirm save HtmlBlock ${htmlblock.label}`
                    + ` with event ${htmlBlockProps.selectInstance.choices[htmlBlockProps.selectInstance.lastSelected]}`, `htmlBlockProps.postConfirm("confirmed")`, `htmlBlockProps.postConfirm("canceled")`);
            }
        }
        if (getState == 3) {
            let currentCss = Css.byLabel(htmlblock.css);
            currentCss.css = pf.insideOfFunctionString(htmlBlockProps.monacoContainer.getValue());
            currentCss.cssObj = currentCss.makeObj();
            currentCss.css = currentCss.makeString();
            Css.update();
        }
    }
    static postConfirm(answer) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let htmlblock = propertiesInstance.currentObject;
        // console.log(answer);
        if (answer == "confirmed") {
            let event = htmlBlockProps.selectInstance.choices[htmlBlockProps.selectInstance.lastSelected];
            // console.log(event, htmlBlockProps.monacoContainer.getValue());
            // console.log(htmlblock);
            if (!htmlblock.events) {
                let obj = {};
                obj[event] = htmlBlockProps.monacoContainer.getValue();
                htmlblock.events = events(obj);
            }
            else
                htmlblock.events.actions[event] = new Function(pf.insideOfFunctionString(htmlBlockProps.monacoContainer.getValue()));
            let el = pf.elExists(htmlblock.label);
            if (el) {
                el.remove();
                Render.update();
            }
        }
    }
    static treeClicked(objectWithProperties) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let getState = htmlBlockProps.getState();
        console.log("state", getState);
        if (getState != undefined) {
            htmlBlockProps.saveState(getState);
        }
        propertiesInstance.currentObject = objectWithProperties;
        if (getState == undefined)
            propertiesInstance.winModal.modal.show();
        htmlBlockProps.launchState();
    }
    static launchState(getState = htmlBlockProps.getState()) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let objectWithProperties = propertiesInstance.currentObject;
        if (getState == 0) {
            htmlBlockProps.quillDisplayCell.htmlBlock.innerHTML = `<div id="editor"></div>`;
            if (!propertiesInstance.winModal.modal.isShown())
                propertiesInstance.winModal.modal.show();
            else {
                Render.update();
            }
            setTimeout(() => {
                htmlBlockProps.quill = new Quill('#editor', htmlBlockProps.options);
                htmlBlockProps.quill["clipboard"].dangerouslyPasteHTML(objectWithProperties.innerHTML);
                htmlBlockProps.quillDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0);
        }
        if (getState == 1) {
            htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown())
                propertiesInstance.winModal.modal.show();
            else
                Render.update();
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(objectWithProperties.innerHTML);
                htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0);
        }
        if (getState == 2) {
            htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown())
                propertiesInstance.winModal.modal.show();
            else
                Render.update();
        }
        if (getState == 3) {
            console.log("Css Launched");
            htmlBlockProps.cssCurrentValueDisplayCell.htmlBlock.innerHTML = objectWithProperties.css;
            htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            Render.update();
            setTimeout(() => {
                console.log(objectWithProperties);
                htmlBlockProps.monacoContainer = monacoContainer(Css.byLabel(objectWithProperties.css).css, "css");
                htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0);
        }
    }
    static selectSelected(pointerEvent, eventName) {
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let objectWithProperties = propertiesInstance.currentObject;
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
    static confirmwinModal(confirmText, execute, dontExecute) {
        htmlBlockProps.winModalConfirmInstance = winModal.byLabel("Confirm");
        let buttons = `<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();${execute}'>Ok</button>`
            + `<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();${dontExecute}'>Cancel</button>`;
        if (!htmlBlockProps.winModalConfirmInstance)
            htmlBlockProps.winModalConfirmInstance = new winModal("Confirm", "Confirm", 200, 100, function () { eval(dontExecute); }, I("confirm", `${confirmText}</br>${buttons}`, bCss.bgwhite));
        else {
            htmlBlockProps.winModalConfirmInstance.body.htmlBlock.innerHTML = `${confirmText}</br>${buttons}`;
            htmlBlockProps.winModalConfirmInstance.modal.show();
        }
    }
    static colorPick(type) {
        let newModal = new winModal("textcolor", type + " color", 251, 307, I("colorPicker", `<div id="color_picker"></div>`, bCss.bgBlue));
        let el = document.getElementById("color_picker");
        var picker = new Picker({ parent: el, popup: false });
        newModal.body.htmlBlock.innerHTML = undefined;
        picker["onDone"] = function (color) {
            newModal.modal.hide();
            htmlBlockProps.colorSet(type, color["hex"]);
        };
    }
    static colorSet(type, colorHex) {
        //console.log(`Set ${type} to ${colorHex}`);
        let propertiesInstance = Properties.byLabel("HtmlBlock");
        let htmlblock = propertiesInstance.currentObject;
        let currentCss = Css.byLabel(htmlblock.css);
        htmlBlockProps.saveState();
        currentCss.cssObj[((type == "text") ? "color" : "background")] = colorHex;
        currentCss.css = currentCss.makeString();
        htmlBlockProps.monacoContainer.getModel().setValue(currentCss.css);
        Css.update();
    }
}
htmlBlockProps.monacoStartString = `<div id="container" style="width:100%;height:100%"></div>`;
htmlBlockProps.toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['link', 'image', 'video', 'formula'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }]
];
htmlBlockProps.options = {
    debug: 'warn',
    modules: {
        toolbar: htmlBlockProps.toolbarOptions
    },
    placeholder: 'Start typing Here...',
    readOnly: false,
    theme: 'snow'
};
class bCss {
    static bookSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(.069039 0 0 .048212 -4.1849 .6616)">
        <path d="m131.75 409.1c-28.8 0-52.1 18.3-52.1 40.4 0 22.6 23.3 40.4 52.1 40.4h278.4c-22.6-24.1-22.6-56.8 0-80.9h-278.4z"/>
        <path d="m120.15 1.9c-23.3 7-40.4 32.7-40.4 63.8v342.2c10.5-9.3 24.9-15.9 40.4-17.9z"/>
        <polygon points="139.95 388.9 410.25 388.9 410.25 0 244.95 0 244.95 99.2 204.85 73.9 164.85 99.2 164.85 0 139.95 0"/>
        </g>
        </svg>`;
    }
    ;
    static htmlSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
        <path d="m7.5329 4.4233-6.5 8.5 6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        <path d="m14.86 4.4367-4.1694 16.41" stroke-linecap="round" stroke-width="2.5"/>
        <path d="m17.467 4.4233 6.5 8.5-6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        </g>
        </svg>`;
    }
    ;
    static horSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g><path d="m11.466 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x=".91881" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/>
        <path d="m23.481 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x="12.933" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/></g>
        </svg>`;
    }
    ;
    static verSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <path d="m2.7244 11.657h19.63v-9.7972h0.632v10.605h-20.262z"/>
        <g><rect transform="matrix(0,1,1,0,0,0)" x="1.0521" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/>
        <path d="m2.7244 23.737h19.63v-9.7972h0.632v10.605h-20.262z" stroke-width=".37166"/>
        <rect transform="matrix(0,1,1,0,0,0)" x="13.132" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/></g>
        </svg>`;
    }
    ;
    static displaycellSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" enable-background="new 0 0 48 48" version="1.1" viewBox="0 0 130.21 130.21" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    <g id="color_21_" transform="matrix(2.8344 0 0 2.8344 -6.2627 -5.5033)">
            <path d="m44 5h-37c-0.553 0-1 0.447-1 1v38c0 0.553 0.447 1 1 1h37c0.553 0 1-0.447 1-1v-38c0-0.553-0.447-1-1-1z" fill="#ffda8e"/>
    </g>
    <g id="outline_20_" transform="matrix(2.8344 0 0 2.8344 -2.2548 -2.6688)">
            <path d="m45 2h-42c-0.553 0-1 0.447-1 1v42c0 0.553 0.447 1 1 1h42c0.553 0 1-0.447 1-1v-42c0-0.553-0.447-1-1-1zm-2.414 2-4 4h-29.172l-4-4zm-32.586 30.087v-4.67l28-16.078v4.67zm28-13.748v17.661h-5v-14.79zm-7 4.019v13.642h-6v-10.196zm-8 4.594v9.048h-6v-5.603zm-8 4.594v4.454h-5v-1.583zm-5-6.459v-17.087h5v14.216zm7-4.02v-13.067h6v9.622zm14.05-8.067-6.05 3.474v-8.474h6v5zm1.95-1.12v-3.88h5v1.009zm-29-8.466 4 4v29.172l-4 4zm1.414 38.586 4-4h29.172l4 4zm38.586-1.414-4-4v-29.172l4-4z" fill="#384d68"/>
    </g>
    </svg>`;
    }
    static homeSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
     <linearGradient id="linearGradient6715" x1="302.86" x2="302.86" y1="366.65" y2="609.51" gradientTransform="matrix(2.7744,0,0,1.9697,-1892.2,-872.89)" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0" offset="0"/>
      <stop offset=".5"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6717" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(2.7744,0,0,1.9697,-1891.6,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <linearGradient id="linearGradient5060">
      <stop offset="0"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6719" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(-2.7744,0,0,1.9697,112.76,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <radialGradient id="radialGradient238" cx="20.706" cy="37.518" r="30.905" gradientTransform="matrix(.56743 .008141 .076635 .67327 -.8499 -6.1144)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#202020" offset="0"/>
      <stop stop-color="#b9b9b9" offset="1"/>
     </radialGradient>
     <linearGradient id="linearGradient3104" x1="18.113" x2="15.515" y1="31.368" y2="6.1803" gradientTransform="matrix(.53734 0 0 .53793 .37326 -.58395)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#424242" offset="0"/>
      <stop stop-color="#777" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient491" x1="6.2298" x2="9.8981" y1="13.773" y2="66.834" gradientTransform="matrix(.80898 0 0 .37756 -.089325 -1.2284)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" stop-opacity=".87629" offset="0"/>
      <stop stop-color="#fffffe" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient9772" x1="22.176" x2="22.065" y1="36.988" y2="32.05" gradientTransform="matrix(.53309 0 0 .53567 .56202 -.4917)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6194cb" offset="0"/>
      <stop stop-color="#729fcf" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient322" x1="13.036" x2="12.854" y1="32.567" y2="46.689" gradientTransform="matrix(.70235 0 0 .43725 .093127 -1.1978)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient2296" x1="21.354" x2="20.796" y1="26.384" y2="50.771" gradientTransform="matrix(.64126 0 0 .43721 .51643 -.28655)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
    </defs>
    <g transform="matrix(.012145 0 0 .011202 23.69 18.994)">
     <rect x="-1559.3" y="-150.7" width="1339.6" height="478.36" color="#000000" fill="url(#linearGradient6715)" opacity=".40206"/>
     <path d="m-219.62-150.68v478.33c142.88 0.9 345.4-107.17 345.4-239.2 0-132.02-159.44-239.13-345.4-239.13z" color="#000000" fill="url(#radialGradient6717)" opacity=".40206"/>
     <path d="m-1559.3-150.68v478.33c-142.8 0.9-345.4-107.17-345.4-239.2 0-132.02 159.5-239.13 345.4-239.13z" color="#000000" fill="url(#radialGradient6719)" opacity=".40206"/>
    </g>
    <path d="m2.803 20.227c0.011209 0.22446 0.24715 0.4481 0.47083 0.4481h16.833c0.22362 0 0.4358-0.2239 0.42397-0.4481l-0.50294-14.646c-0.011209-0.22418-0.24716-0.44807-0.47125-0.44807h-7.1305c-0.26116 0-0.66362-0.17009-0.75334-0.5953l-0.32887-1.5562c-0.083225-0.39576-0.47391-0.55831-0.69744-0.55831h-7.9413c-0.22362 0-0.43563 0.2239-0.42392 0.44788l0.5216 17.356z" fill="url(#radialGradient238)" stroke="url(#linearGradient3104)" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5368"/>
    <path d="m3.6163 20.17c0.00841 0.16617-0.096396 0.27686-0.26593 0.22137s-0.2863-0.16617-0.29499-0.33229l-0.50546-17.076c-0.0084066-0.16589 0.087989-0.26649 0.25472-0.26649l7.6919-0.02522c0.16701 0 0.49708 0.16001 0.60427 0.70411l0.30614 1.4995c-0.22782-0.248-0.22334-0.25556-0.34027-0.61618l-0.21661-0.67057c-0.11685-0.38746-0.37227-0.443-0.53867-0.443h-6.8738c-0.16645 0-0.27181 0.11097-0.26313 0.27714l0.50028 16.783-0.058566-0.05548z" color="#000000" display="block" fill="url(#linearGradient491)" opacity=".45143" stroke-width=".53294"/>
    <path d="m21.771 20.673c0.60931-0.02242 1.0465-0.58762 1.0912-1.2433 0.42168-6.1865 0.8844-11.373 0.8844-11.373 0.03839-0.13282-0.08967-0.26509-0.25584-0.26509h-18.323c-2.522e-4 0-0.98657 11.714-0.98657 11.714-0.061088 0.52603-0.24856 0.96634-0.8262 1.1694h18.416z" color="#000000" display="block" fill="url(#linearGradient9772)" stroke="#3465a4" stroke-linejoin="round" stroke-width=".53678"/>
    <path d="m5.6905 8.3276 17.481 0.034747-0.83909 10.715c-0.04484 0.57372-0.23987 0.76495-0.99795 0.76495-0.99795 0-15.288-0.01681-16.736-0.01681 0.12442-0.17206 0.17794-0.52978 0.1785-0.53836l0.91436-10.959z" fill="none" opacity=".46591" stroke="url(#linearGradient322)" stroke-linecap="round" stroke-width=".53678px"/>
    <path d="m5.6905 8.1985-0.62192 8.3796s4.4228-2.222 9.9507-2.222 8.2923-6.1576 8.2923-6.1576h-17.621z" fill="#fff" fill-opacity=".089286" fill-rule="evenodd" stroke-width=".53438"/>
    <path d="m9.8186 14.248-0.37533 4.0109h4.168l0.30365-3.242h2.2685l-0.30368 3.242h2.5913l0.37533-4.0109h1.4175l-5.5265-4.0399-6.2831 4.0399z" fill="url(#linearGradient2296)" fill-rule="evenodd" stroke-width="1.5885pt"/>
   </svg>`;
    }
    ;
    static matchSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="m5 15h-1a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>`;
    }
    ;
    static cursorSVG(classname) {
        return `<svg class="${classname}" width="100%" height="100%" stroke-width="10" version="1.1" viewBox="0 0 12.207 12.207" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(.019665 0 0 .019665 1.636 .85503)">
        <polygon points="82.489 0 82.258 471.74 187.63 370.92 249.52 512 346.08 469.64 284.19 328.56 429.74 319.31"/></g></svg>
        `;
    }
}
bCss.editable = css("editable", `-moz-appearance: textfield;
                                    -webkit-appearance: textfield;
                                    background-color: white;
                                    box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    box-shadow: 1px 1px 1px 0 lightgray inset;  
                                    font: -moz-field;
                                    font: -webkit-small-control;`, { type: "builder" });
bCss.disabled = css("disabled", `-moz-appearance: textfield;
                                    -webkit-appearance: textfield;
                                    background-color: #E8E8E8;
                                    box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    box-shadow: 1px 1px 1px 0 lightgray inset;  
                                    font: -moz-field;
                                    font: -webkit-small-control;`, { type: "builder" });
bCss.bgwhite = css("bgwhite", `background: white`, { type: "builder" });
bCss.bgLight = css("bgLight", `background: #dcedf0`, { type: "builder" });
bCss.bgLightBorder = css("bgLight", `background: #F0F0F0;box-sizing: border-box;border: 1px solid darkgray;`, { type: "builder" });
bCss.bgLightCenter = css("bgLightCenter", `background: #dcedf0;
                                    text-align:center;box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    -moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;`, { type: "builder" });
bCss.bgGreen = css("bgGreen", `background: green;`, { type: "builder" });
bCss.bgBlue = css("bgBlue", `background: blue;`, { type: "builder" });
bCss.bgCyan = css("bgCyan", `background: cyan;`, { type: "builder" });
bCss.bgBlack = css("bgBlack", `background: black;
                                    opacity:0.5;
                                    box-sizing: border-box;
                                    border: 10px solid red;`, { type: "builder" });
bCss.menuItem = css("menuItem", `background: white;
                                       color: black;
                                       cursor: default;
                                       outline: 1px solid black;
                                       outline-offset: -1px;`, `background: black;
                                       color: white;`, { type: "builder" });
bCss.menuSpace = css("menuspace", `background: white;
                                        color: black;
                                        cursor: default;
                                        outline: 1px solid black;
                                        outline-offset: -1px;`, { type: "builder" });
bCss.handlerSVG = css("handlerSVG", `background-image: url("svg/user-homeOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`, { type: "builder" });
bCss.hSVG = css("hSVG", `background-image: url("svg/Horizontal.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`, { type: "builder" });
bCss.vSVG = css("vSVG", `background-image: url("svg/Vertical.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`, { type: "builder" });
bCss.ISVG = css("ISVG", `background-image: url("svg/icon-htmlOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`, { type: "builder" });
bCss.pagesSVG = css("pagesSVG", `background-image: url("svg/bookOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`, `cursor: pointer;background-color:white;`, { type: "builder" });
bCss.treeItem = css("treeItem", `background: transparent; color:black; cursor:pointer`, `background:DeepSkyBlue;`, { type: "builder" });
bCss.bookSVGCss = css(`bookIcon`, `stroke: black;`, `fill: white;background:white`, { type: "builder" });
bCss.buttonsSVGCss = css(`buttonIcons`, `fill: white;stroke:black; background-color:white`, `fill: black;stroke:white; background-color:black`, `fill: white;stroke:black; background-color:gray`, { type: "builder" });
bCss.treenodeCss = css(`treenode`, `background:#dcedf0; cursor:pointer;`, `background:white`, { type: "builder" });
bCss.buttons = css('buttons', `display:inline-block;
                                    box-sizing: border-box;
                                    color:#444;
                                    border:1px solid #CCC;
                                    background:#DDD;
                                    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
                                    cursor:pointer;
                                    vertical-align:middle;
                                    text-align: center;`, `
                                    color:red;
                                    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);`, `display:inline-block;box-sizing: border-box;
                                    color:#444;
                                    border:1px solid #CCC;
                                    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
                                    cursor:pointer;
                                    vertical-align:middle;
                                    text-align: center; 
                                    box-shadow: inset 1px 2px 5px #777;
                                    transform: translateY(1px);
                                    background: #e5e5e5;`, { type: "builder" });
bCss.buttonsPressed = css('buttonsPressed', `display:inline-block;
                                    color:#444;
                                    border:1px solid #CCC;
                                    box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
                                    cursor:pointer;
                                    vertical-align:middle;
                                    text-align: center; 
                                    box-shadow: inset 1px 2px 5px #777;
                                    transform: translateY(1px);
                                    background: #e5e5e5;`, `
                                    color:red;
                                    box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);`, { type: "builder" });
;
class Builder extends Base {
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments) {
        super();
        this.buildBase(...Arguments);
        Builder.makeLabel(this);
    }
    static buildClientHandler() {
        Builder.clientHandler =
            H("Client Window", h("Client_h", 5, I("Client_M1", "left", bCss.bgLight, events({ onclick: function () { console.log("Client_M1 clicked"); } })), I("Client_Main2", "right", bCss.bgCyan, "200px")), false);
    }
    static buildMainHandler() {
        let treePagesDisplayCell = P("pagename", tree("HandlerTree", I("Handler_Tree", bCss.bgLight), bCss.treenodeCss, sample().rootNode, events({ onmouseover: function (e) { Builder.onHoverTree(e, this); },
            onmouseleave: function (e) { Builder.onLeaveHoverTree(e, this); },
            onclick: function (e) { Builder.onClickTree(e, this); },
            oncontextmenu: function (e) { Builder.oncontextmenu(e, this); },
        }), function onNodeCreation(node) {
            let nodeLabel = I(`${node.label}_node`, `${node.Arguments[0]}`, node.ParentNodeTree.css, node.ParentNodeTree.events);
            nodeLabel.coord.hideWidth = true;
            let dataObj = node.Arguments[1];
            let dataObjType = BaseF.typeof(dataObj);
            let typeIcon;
            if (dataObjType == "DisplayGroup")
                typeIcon = (dataObj.ishor) ? bCss.horSVG("bookIcon") : bCss.verSVG("bookIcon");
            else
                typeIcon = {
                    Handler: bCss.homeSVG("bookIcon"),
                    HtmlBlock: bCss.htmlSVG("bookIcon"),
                    DisplayCell: bCss.displaycellSVG("bookIcon"),
                }[dataObjType];
            node.displaycell = h(`${node.label}_h`, // dim is un-necessary, not used.
            (node.children.length) ?
                I(`${node.label}_icon`, `${node.ParentNodeTree.height}px`, (node.collapsed) ? node.ParentNodeTree.collapsedIcon : node.ParentNodeTree.expandedIcon, node.ParentNodeTree.iconClass, events({ onclick: function (mouseEvent) { Tree_.toggleCollapse(this, node, mouseEvent); } }))
                : I(`${node.label}_iconSpacer`, `${node.ParentNodeTree.height}px`), I(`${node.label}_typeIcon`, `${node.ParentNodeTree.height}px`, typeIcon), nodeLabel);
        }), I("TWO", "TWO", bCss.bgCyan));
        Builder.mainHandler = H("Main Window", 4, v("Main_v", h("MenuBar", "20px", I("MenuBar_File", "File", "35px", bCss.menuItem), I("MenuBar_Edit", "Edit", "35px", bCss.menuItem), I("MenuBar_Spacer", "", bCss.menuSpace)), dockable(v("Main_Dockable", Builder.TOOLBAR, dockable(h("Tree_Body", 5, dragbar(v("TreeTops", "300px", 5, pageselect("name", "20px", treePagesDisplayCell), treePagesDisplayCell), 200, 1000), bindHandler(I("Main_body"), Builder.clientHandler)))))));
    }
    static updateTree() {
        Render.update();
        const node = node_.byLabel("Client Window");
        // console.log(node);
        if (node) {
            Builder.builderTreeRootNode = node_.copy(node, "_", function (node, newNode) {
                newNode["Arguments"] = node.Arguments;
                newNode["typeof"] = BaseF.typeof(node.Arguments[1]);
            });
            Builder.noDisplayCellnode = Builder.noDisplayCells();
            Tree_.byLabel("HandlerTree").newRoot(Builder.noDisplayCellnode);
            // Builder.noDisplayCellnode.log(true)
        }
        Render.update();
    }
    static noDisplayCells(node = Builder.builderTreeRootNode, newNode = new node_("noDisplayCells")) {
        let childNode;
        if (node["typeof"] != "DisplayCell") {
            childNode = newNode.newChild("_" + node.label);
            childNode.Arguments = node.Arguments;
            childNode["typeof"] = node["typeof"];
        }
        else
            childNode = newNode;
        for (let index = 0; index < node.children.length; index++)
            Builder.noDisplayCells(node.children[index], childNode);
        return childNode;
    }
    static onSelect(displaycell) {
        let htmlblock = displaycell.htmlBlock;
        let el = htmlblock.el;
        let svgEl = el.children[0];
        let oldClassName = svgEl.className["baseVal"];
        if (!oldClassName.endsWith("Selected"))
            svgEl.className["baseVal"] = oldClassName + "Selected";
        htmlblock.innerHTML = htmlblock.innerHTML.replace(oldClassName, oldClassName + "Selected");
    }
    static onUnselect(displaycell) {
        let htmlblock = displaycell.htmlBlock;
        let el = htmlblock.el;
        let svgEl = el.children[0];
        let oldClassName = svgEl.className["baseVal"];
        if (oldClassName.endsWith("Selected"))
            svgEl.className["baseVal"] = oldClassName.slice(0, -8);
        htmlblock.innerHTML = htmlblock.innerHTML.replace(oldClassName, oldClassName.slice(0, -8));
    }
    static xboxSVG(boundCoord, Boxes) {
        let top = `<svg width="${boundCoord.width}" height="${boundCoord.height}">`;
        let bottom = `</svg>`;
        let mid = "";
        for (let index = 0; index < Boxes.length; index++) {
            const coord = Boxes[index];
            let offset = 1;
            let x = coord.x - boundCoord.x + offset;
            let y = coord.y - boundCoord.y + offset;
            let width = coord.width - offset * 2;
            let height = coord.height - offset * 2;
            mid += `<rect x="${x}" y="${y}" width="${width}" height="${height}" style="fill-opacity:0;stroke-width:3;stroke:red" />`
                + `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${height}" style="stroke:red;stroke-width:3" />`
                + `<line x1="${x + width}" y1="${y}" x2="${x}" y2="${height}" style="stroke:red;stroke-width:3" />`;
        }
        return top + mid + bottom;
    }
    static onClickTree(mouseEvent, el) {
        let node = node_.byLabel(el.id.slice(0, -5));
        Properties.processNode(node);
    }
    static oncontextmenu(event, el) {
        let node = node_.byLabel(el.id.slice(0, -5));
        let objectwithProperties = node.Arguments[1];
        let objectType = BaseF.typeof(objectwithProperties);
        let propInstance = Properties.byLabel(objectType);
        if (!propInstance) {
            Builder.onClickTree(event, el);
            propInstance = Properties.byLabel(objectType);
        }
        propInstance.currentObject = objectwithProperties;
        let treeDisplaycell = DisplayCell.byLabel(el.id);
        let coord = treeDisplaycell.coord;
        let x = coord.x + coord.width;
        let y = coord.y;
        let object_ = {
            hello: function () { console.log("one"); },
            two: function () { console.log("two"); },
            three: function () { console.log("three"); },
        };
        switch (objectType) {
            case "HtmlBlock":
                object_ = { "Edit": function (mouseEvent) { console.log("Edit Clicked"); } };
                break;
            default:
                break;
        }
        Builder.context.changeMenuObject(object_);
        Builder.context.render(event, x, y);
    }
    static get buttonIndex() { return ToolBar.byLabel("Main_toolbar").selected.currentButtonIndex; }
    static onHoverTree(mouseEvent, el) {
        if (Builder.buttonIndex == 1) {
            let node = node_.byLabel(el.innerText);
            // console.log(node)
            let object_ = node.Arguments[node.Arguments.length - 1];
            let coord = object_.coord;
            if (!coord) {
                let possibleDisplayCell = DisplayCell.byLabel(object_.label);
                if (possibleDisplayCell)
                    coord = possibleDisplayCell.coord;
            }
            let type = BaseF.typeof(node.Arguments[1]);
            // console.log(coord, node.Arguments)
            if (coord == undefined) {
                let [width, height] = pf.viewport();
                coord = new Coord(0, 0, width, height);
            }
            Builder.hoverModal.setSize(coord.x, coord.y, coord.width, coord.height);
            let coordArray = [];
            if (type != "DisplayGroup")
                coordArray.push(coord);
            else {
                let displaygroup = node.Arguments[1];
                for (let index = 0; index < displaygroup.cellArray.length; index++) {
                    const displaycell = displaygroup.cellArray[index];
                    coordArray.push(displaycell.coord);
                }
            }
            Builder.hoverModal.rootDisplayCell.htmlBlock.innerHTML = Builder.xboxSVG(coord, coordArray);
            Builder.hoverModal.show();
        }
    }
    static onLeaveHoverTree(mouseEvent, el) {
        Builder.hoverModal.hide();
    }
    static horDivide(mouseEvent) {
        let show = false;
        let clientWindowNode = node_.byLabel("Client Window");
        console.log(clientWindowNode != undefined);
        node_.traverse(clientWindowNode, function (node) {
            if (BaseF.typeof(node.Arguments[1]) == "DisplayCell") {
                let displaycell = node.Arguments[1];
                let coord = displaycell.coord;
                if (coord.isPointIn(mouseEvent.clientX, mouseEvent.clientY)) {
                    if (displaycell.htmlBlock) {
                        // console.log(displaycell.label);
                        let coord = displaycell.coord;
                        horVerModal.setSize(mouseEvent.clientX - 2, coord.y, 4, coord.height);
                        console.log(horVerModal.isShown());
                        if (!horVerModal.isShown())
                            horVerModal.show();
                        show = true;
                        Render.update();
                    }
                }
            }
        });
        if (!show && horVerModal.isShown)
            horVerModal.hide();
    }
}
Builder.labelNo = 0;
Builder.instances = [];
Builder.activeInstances = [];
Builder.defaults = {};
Builder.argMap = {
    string: ["label"],
};
Builder.context = new Context("nodeTreeContext");
//static TOOLBAR_currentButtonName:string;
Builder.TOOLBAR_B1 = I("toolbarCursor", bCss.cursorSVG("buttonIcons"), events({ onclick: function (e) { console.log("hello"); } }));
Builder.TOOLBAR_B2 = I("toolbarMatch", bCss.matchSVG("buttonIcons"));
Builder.TOOLBAR_B3 = I("toolbarHor", bCss.horSVG("buttonIcons"));
Builder.TOOLBAR_B4 = I("toolbarVer", bCss.verSVG("buttonIcons"));
Builder.TOOLBAR = toolBar("Main_toolbar", 25, 25, Builder.onSelect, Builder.onUnselect, Builder.TOOLBAR_B1, Builder.TOOLBAR_B2, Builder.TOOLBAR_B3, Builder.TOOLBAR_B4);
Builder.hoverModal = new Modal("BuilderHover", I("BuilderHoverDummy" /*,bCss.bgwhite*/));
///////////////////////////////////////////////////////////
//////////  Main Run Executiuon ///////////////////////////
///////////////////////////////////////////////////////////
Builder.buildClientHandler();
Builder.buildMainHandler();
Handler.activate(Builder.clientHandler);
setTimeout(() => {
    Builder.updateTree();
}, 0);
window.onmousemove = function (mouseEvent) {
    let buttonIndex = Builder.buttonIndex;
    if (buttonIndex == 2)
        Builder.horDivide(mouseEvent);
    if (buttonIndex == 3)
        console.log(mouseEvent);
};
let horVerModal = new Modal("horVerModal", I("horVerModal", css("horVerModal", "background:red;opacity:0.25"), events({ onclick: function () { console.log("clicked"); } })));
// let outside = new Modal("outside",I("outside_", css("outside","background:red;opacity:0.25")));
// let inside = new Modal("inside", I("inside_", css("inside","background:green;opacity:0.25")));
// let show = function(coord:Coord) {
//     outside.setSize(coord.x, coord.y, coord.width, coord.height);
//     inside.setSize(coord.within.x, coord.within.y, coord.within.width, coord.within.height);
//     outside.show()
//     inside.show()
// }
// let hide = function(){
//     outside.hide();
//     inside.hide();
// }
