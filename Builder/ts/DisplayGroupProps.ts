class DisplayGroupProps {
    static rootcell: DisplayCell;
    static horizontalCellArray: DisplayCell;


    constructor(){}
    static treeClicked(objectWithProperties:DisplayGroup){
        let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
        propertiesInstance.currentObject = objectWithProperties;
        Properties.setHeaderText(propertiesInstance, "DisplayGroup - " + objectWithProperties["label"])
        DisplayGroupProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        
    }
    static onCloseCallback(modal:Modal) {
        //let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
    }
    static updateProperties(objectWithProperties:DisplayGroup){
        let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
        let arrayOfCells:DisplayCell[] = [];
        for (let index = 0; index < objectWithProperties.cellArray.length; index++) {
            const displaycell = objectWithProperties.cellArray[index];
            //console.log("displaycell", displaycell)
            arrayOfCells.push(
                h(`arrayOfCells${index}`, "20px",
                    I(`cellarray${index}`, displaycell.label, bCss.bgLightBorder,
                    //     function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                    //         htmlBlock.innerHTML = displaycell.label;
                    //     }
                    ),
                    I(`cellarray_${index}`, {innerHTML: displaycell.dim}, bCss.bgLightBorder,
                        // function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell:DisplayCell){
                        //     htmlBlock.innerHTML = displaycell.dim;
                        // }
                        ),
                    I(`deleteIndex${index}`, `<button onclick="DisplayGroupProps.deleteIndex(${index})">Delete</button>`, "50px"),
                    I(`insertIndex${index}`, `<button>Insert</button>`, "50px",
                        events({onclick:context({menuObj:
                            {above:function(){ DisplayGroupProps.insertIndex(index) },
                             below:function(){ DisplayGroupProps.insertIndex(index+1) },
                            }
                        })})
                    ),
                )
            )
        }
        DisplayGroupProps.rootcell.displaygroup.cellArray[2] = v("arrayOfCells", ...arrayOfCells, `${arrayOfCells.length*20}px`);
    }
    static deleteIndex(index:number) {
        let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
        let objectWithProperties = <DisplayGroup>propertiesInstance.currentObject;
        console.log("Delete index ", index);
        Render.update(objectWithProperties.renderNode.ParentNode.Arguments[1], true)
        objectWithProperties.cellArray.splice(index, 1);
        propertiesInstance.winModal.modal.hide();
        DisplayGroupProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();

    }
    static insertIndex(index:number) {
        console.log("Insert index ", index);

    }
}