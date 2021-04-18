class HandlerProps {
    constructor(){}
    static treeClicked(objectWithProperties:object){
        let propertiesInstance = <Properties>Properties.byLabel("Handler");
        propertiesInstance.currentObject = objectWithProperties;
        Properties.setHeaderText(propertiesInstance, "Handler - " + objectWithProperties["label"])
        HandlerProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        
    }
    static onCloseCallback(modal:Modal = undefined) {
        //let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
    }
    static updateProperties(objectWithProperties:object){

    }
}