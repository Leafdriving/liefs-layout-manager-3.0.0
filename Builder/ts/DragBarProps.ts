class DragBarProps {
    constructor(){}
    static treeClicked(objectWithProperties:object){
        let propertiesInstance = <Properties>Properties.byLabel("DragBar");
        propertiesInstance.currentObject = objectWithProperties;
        Properties.setHeaderText(propertiesInstance, "DragBar - " + objectWithProperties["label"])
        DragBarProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        
    }
    static onCloseCallback(modal:Modal = undefined) {
        //let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
    }
    static updateProperties(objectWithProperties:object){

    }
}