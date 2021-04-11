class PagesProps {
    static monacoContainer:any;
    static MonicoContainerDisplayCell:DisplayCell = I("MonicocontainerPages",`<div id="container" style="width:100%;height:100%"></div>`);
    constructor(){}
    static treeClicked(objectWithProperties:Pages){
        let propertiesInstance = <Properties>Properties.byLabel("Pages");
        propertiesInstance.currentObject = objectWithProperties;
        Properties.setHeaderText(propertiesInstance, "Pages - " + objectWithProperties["label"])
        PagesProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        
    }
    static onCloseCallback(modal:Modal) {
        let propertiesInstance = <Properties>Properties.byLabel("Pages");
        let objectwithProperties = <Pages>propertiesInstance.currentObject;
        eval(`objectwithProperties.evalFunction = ${PagesProps.monacoContainer.getValue()}`)
    }
    static updateProperties(objectWithProperties:Pages){
        // console.log(objectWithProperties);
        let propertiesInstance = <Properties>Properties.byLabel("Pages");
        PagesProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = htmlBlockProps.monacoStartString;
        if (!propertiesInstance.winModal.modal.isShown()) propertiesInstance.winModal.modal.show();
        else Render.update();
        setTimeout(() => {
            PagesProps.monacoContainer = monacoContainer(objectWithProperties.evalFunction.toString(), "javascript");
            PagesProps.MonicoContainerDisplayCell.htmlBlock.innerHTML = undefined;
        }, 0)
    }
}