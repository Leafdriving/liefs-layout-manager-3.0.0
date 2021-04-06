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
    static selectInstanceWhichOnEvent:Select;
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
    static treeClicked(objectWithProperties:object){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        Properties.setHeaderText(propertiesInstance, "HtmlBlock - " + objectWithProperties["label"])
        let getState = htmlBlockProps.getState();
        console.log(`Tree Clicked ${objectWithProperties["label"]} State:`, getState)
        if (getState != undefined) {
            htmlBlockProps.saveState(getState);
        }
        propertiesInstance.currentObject = objectWithProperties;

        if (getState == undefined) {
            console.log("Launching winModal");
            propertiesInstance.winModal.modal.show();
        }
        htmlBlockProps.launchState();
    }
    static saveState(getState:number = htmlBlockProps.getState()):void {
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        if (getState == 0 && htmlBlockProps.quill){
            console.log("Saving wysiwyg editor");
            htmlblock.innerHTML = htmlBlockProps.quill["root"].innerHTML;
        }
        if (getState == 1 && htmlBlockProps.monacoContainer) {
            console.log("Saving monaco edit html");
            htmlblock.innerHTML = htmlBlockProps.monacoContainer.getValue();
        }
        if (getState == 2) {
            console.log("Saving monaco edit Events");
            if (htmlBlockProps.selectInstanceWhichOnEvent.lastSelected != 0){
                htmlBlockProps.confirmwinModal(`Confirm save HtmlBlock ${htmlblock.label}`
                    +` with event ${htmlBlockProps.selectInstanceWhichOnEvent.choices[htmlBlockProps.selectInstanceWhichOnEvent.lastSelected]}`,
                    `htmlBlockProps.postConfirm("confirmed")`,`htmlBlockProps.postConfirm("canceled")`);
            }
        }
        if (getState == 3){
            console.log("Saving monaco edit Css");
            let currentCss = <Css>Css.byLabel(htmlblock.css);
            currentCss.newString( pf.insideOfFunctionString( htmlBlockProps.monacoContainer.getValue() ) );
            Css.update();
        }
    }
    
    static launchState(getState:number = htmlBlockProps.getState()){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        if (getState == 0){
            console.log("Launching wysiwyg mode");
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
            console.log("Launching monaco edit html");
            htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(objectWithProperties.innerHTML);
                htmlBlockProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0)
        }
        if (getState == 2){
            console.log("Launching monaco events edit javascript");
            htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
            else Render.update();
        }
        if (getState == 3) {
            console.log("Launching monaco edit css");
            htmlBlockProps.cssCurrentValueDisplayCell.htmlBlock.innerHTML = objectWithProperties.css;
            htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
            htmlBlockProps.cssSelect.choices = htmlBlockProps.availableCss(objectWithProperties);
            htmlBlockProps.cssSelect.buildMenuObj();
            htmlBlockProps.cssSelect.clickableName.htmlBlock.innerHTML = htmlBlockProps.cssSelect.choices[0];
            Render.update();
            setTimeout(() => {
                htmlBlockProps.monacoContainer = monacoContainer(Css.byLabel(objectWithProperties.css).css,"css");
                htmlBlockProps.cssBodyDisplayCell.htmlBlock.innerHTML = undefined;
            }, 0)
        }
    }
    static cssChange(mouseEvent:PointerEvent, choice:string, select:Select){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        if (choice == "Create New Class"){
            let newClassName = prompt("Ennter new Css Label", "");
            if (newClassName.trim() != "") {
                css(newClassName,"");
                objectWithProperties.css = newClassName;
                htmlBlockProps.launchState();
            }
        } else if (choice != objectWithProperties.css) {
            htmlBlockProps.saveState();
            objectWithProperties.css = choice;
            htmlBlockProps.launchState();
        }

        
    }
    static availableCss(objectWithProperties:HtmlBlock){
        let returnArray:string[] = [objectWithProperties.css, "Create New Class"];
        for (let index = 0; index < Css.instances.length; index++) {
            const CssInstance = Css.instances[index];
            if (!CssInstance.type && CssInstance.classname != objectWithProperties.css) returnArray.push(CssInstance.classname);
        }
        return returnArray;
    }
    static onClickPreDefinedEvent(actionEventName:string){
        console.log("You clicked a pre-defined Event!", actionEventName)
        htmlBlockProps.saveAndLoadEvent(undefined, actionEventName);
        htmlBlockProps.selectInstanceWhichOnEvent.lastSelected = htmlBlockProps.selectInstanceWhichOnEvent.currentSelected;
        htmlBlockProps.selectInstanceWhichOnEvent.currentSelected = htmlBlockProps.selectInstanceWhichOnEvent.choices.indexOf(actionEventName);
        console.log(`currentSelected was ${htmlBlockProps.selectInstanceWhichOnEvent.lastSelected} now is ${htmlBlockProps.selectInstanceWhichOnEvent.currentSelected}`)
        htmlBlockProps.selectInstanceWhichOnEvent.changeDisplayNameToIndex( htmlBlockProps.selectInstanceWhichOnEvent.choices.indexOf(actionEventName) );
    /// what if not picked???? FIX!
    }
    static onCloseCallback(THIS:any){
        console.log("closeCallback");
        htmlBlockProps.saveState();
        Render.update();
    }
    static postConfirm(answer:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let htmlblock = <HtmlBlock>propertiesInstance.currentObject;
        if (answer == "confirmed") {
            let event = htmlBlockProps.selectInstanceWhichOnEvent.choices[htmlBlockProps.selectInstanceWhichOnEvent.lastSelected];
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
    static onChooseSelectEvent(pointerEvent:PointerEvent, key:string){
        console.log("onChooseSelectEvent")
        htmlBlockProps.saveAndLoadEvent(pointerEvent, key);
        htmlBlockProps.selectInstanceWhichOnEvent.lastSelected = htmlBlockProps.selectInstanceWhichOnEvent.currentSelected;
        htmlBlockProps.selectInstanceWhichOnEvent.currentSelected = htmlBlockProps.selectInstanceWhichOnEvent.choices.indexOf(key);
        console.log(`currentSelected was ${htmlBlockProps.selectInstanceWhichOnEvent.lastSelected} now is ${htmlBlockProps.selectInstanceWhichOnEvent.currentSelected}`)
        htmlBlockProps.selectInstanceWhichOnEvent.changeDisplayNameToIndex(htmlBlockProps.selectInstanceWhichOnEvent.choices.indexOf(key));
    }


    static saveAndLoadEvent(pointerEvent:PointerEvent, eventName:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        htmlBlockProps.saveState();
        htmlBlockProps.currentDisplayFunction = `function(event){console.log("Event: ${eventName} fired on ${objectWithProperties.label}")}`;
        htmlBlockProps.displayEventFunction.htmlBlock.innerHTML = `<div id="container" style="width:100%;height:100%"></div>`;
        
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
        let buttons =`<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();window.onmousemove=undefined;${execute}'>Ok</button>`
                    +`<button onclick='htmlBlockProps.winModalConfirmInstance.modal.hide();window.onmousemove=undefined;${dontExecute}'>Cancel</button>`;
        if (! htmlBlockProps.winModalConfirmInstance)
        htmlBlockProps.winModalConfirmInstance = new winModal("Confirm","Confirm", 200,100, function(){eval(dontExecute)},
                            I("confirm",`${confirmText}</br>${buttons}`, bCss.bgwhite));
        else {
            htmlBlockProps.winModalConfirmInstance.body.htmlBlock.innerHTML = `${confirmText}</br>${buttons}`;
            htmlBlockProps.winModalConfirmInstance.modal.show();
        }
        window.onmousemove = function(mouseEvent:MouseEvent){
            let x = mouseEvent.clientX, y=mouseEvent.clientY;
            let coord = htmlBlockProps.winModalConfirmInstance.modal.handler.coord;
            if (x < coord.x) coord.x = x;
            if (y < coord.y) coord.y = y;
            if (x > coord.x + coord.width) coord.x = x - coord.width;
            if (y > coord.y + coord.height) coord.y = y - coord.height;
            Render.update(htmlBlockProps.winModalConfirmInstance.modal.handler,false, 1000);
        }
    }
    static colorPick(type:string){
        let newModal:winModal = <winModal>winModal.byLabel("COLORS");
        console.log("newModal", newModal);
        if (newModal){
            console.log("found old");
            newModal.body.htmlBlock.innerHTML = `<div id="color_picker"></div>`;
            newModal.headerText = type+" color";
            newModal.modal.show();
        } else {
            newModal = new winModal("COLORS",type+" color",251,307, I("colorPicker", `<div id="color_picker"></div>`,bCss.bgBlue));
        }
        let el = document.getElementById("color_picker");
        var picker = new Picker({parent:el, popup:false});
        newModal.body.htmlBlock.innerHTML = undefined;
        picker["onDone"] = function(color:object) {
            newModal.modal.hide();
            htmlBlockProps.colorSet(type, color["hex"]);
        };
    }
    static colorSet(type:string, colorHex:string) {
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
