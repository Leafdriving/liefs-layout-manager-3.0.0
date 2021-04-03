class htmlBlockProps {
    constructor(){}
    static monacoStartString = `<div id="container" style="width:100%;height:100%"></div>`;
    static quillDisplayCell:DisplayCell;
    static monacoContainer:any;
    static MonicoContainerDisplayCell:DisplayCell;
    static editHtmlwinModal: winModal;
    static quill:Quill;
    static quillPages:Pages;
    static eventsDisplayCell:DisplayCell;
    static cssDisplayCell:DisplayCell;
    static cssSelect:Select;
    static cssCurrentValueDisplayCell:DisplayCell;
    static cssBodyDisplayCell:DisplayCell;
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
        if (getState == 3){
            let currentCss = <Css>Css.byLabel(htmlblock.css);
            currentCss.css = pf.insideOfFunctionString( htmlBlockProps.monacoContainer.getValue() )
            currentCss.cssObj = currentCss.makeObj();
            currentCss.css = currentCss.makeString();
            Css.update();
        }
    }
    static postConfirm(answer:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        // console.log(answer);
        if (answer == "confirmed") {
            let event = htmlBlockProps.selectInstance.choices[htmlBlockProps.selectInstance.lastSelected];
            // console.log(event, htmlBlockProps.monacoContainer.getValue());
            // console.log(htmlblock);
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
            htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(objectWithProperties.innerHTML);
                htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0)
        }
        if (getState == 2){
            htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
        }
        if (getState == 3) {
            console.log("Css Launched");
            htmlBlockProps.cssCurrentValueDisplayCell.htmlBlock.innerHTML = objectWithProperties.css;
            htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            Render.update();
            setTimeout(() => {
                console.log(objectWithProperties)
                
                htmlBlockProps.monacoContainer = monacoContainer(Css.byLabel(objectWithProperties.css).css,"css");
                htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0)
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
    static colorPick(type:string){
        let newModal = new winModal("textcolor",type+" color",251,307, I("colorPicker", `<div id="color_picker"></div>`,bCss.bgBlue));
        let el = document.getElementById("color_picker");
        var picker = new Picker({parent:el, popup:false});
        newModal.body.htmlBlock.innerHTML = undefined;
        picker["onDone"] = function(color:object) {
            newModal.modal.hide();
            htmlBlockProps.colorSet(type, color["hex"]);
        };
    }
    static colorSet(type:string, colorHex:string) {
        //console.log(`Set ${type} to ${colorHex}`);
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        let currentCss = <Css>Css.byLabel(htmlblock.css);
        htmlBlockProps.saveState();
        currentCss.cssObj[((type == "text") ? "color" : "background")] = colorHex;
        currentCss.css = currentCss.makeString();
        htmlBlockProps.monacoContainer.getModel().setValue(currentCss.css);
        Css.update();
    }
}
