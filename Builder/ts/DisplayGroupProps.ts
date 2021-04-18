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
    static onCloseCallback(modal:Modal = undefined) {
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
                    I(`cellarray${index}`, displaycell.label, bCss.bgLightBorder),
                    DisplayCell.editable(I(`cellarray_${index}`, bCss.bgWhiteBorder,
                                                function(htmlBlock:HtmlBlock, zindex:number, derender:boolean, node:node_, displaycell2:DisplayCell){
                                                    htmlBlock.innerHTML = displaycell.dim;
                                                },
                                            ),
                                function(e: FocusEvent, displaycell2: DisplayCell, innerHTML: string){
                                    displaycell.dim = innerHTML;
                                    Render.update();
                                }
                    ),
                    (index > 0) ? I(`bubbleUp${index}`,`<button onclick="DisplayGroupProps.upIndex(${index})">Up</button>`,"30px") : undefined,
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
    static upIndex(index:number) {
        let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
        let objectWithProperties = <DisplayGroup>propertiesInstance.currentObject;
        Render.update(objectWithProperties.renderNode.ParentNode.Arguments[1], true);
        pf.array_move(objectWithProperties.cellArray, index, index-1);
        propertiesInstance.winModal.modal.hide();
        DisplayGroupProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        Builder.updateTree();
    }
    static deleteIndex(index:number) {
        let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
        let objectWithProperties = <DisplayGroup>propertiesInstance.currentObject;
        Render.update(objectWithProperties.renderNode.ParentNode.Arguments[1], true);
        objectWithProperties.cellArray.splice(index, 1);
        propertiesInstance.winModal.modal.hide();
        DisplayGroupProps.updateProperties(objectWithProperties);
        propertiesInstance.winModal.modal.show();
        Builder.updateTree();

    }
    static insertIndex(index:number) {
        let answer = prompt("New DislayCell Name","new_name");
        if (answer != null && answer.trim() != "") {
            console.log("inserting insertIndex");
            let propertiesInstance = <Properties>Properties.byLabel("DisplayGroup");
            let objectWithProperties = <DisplayGroup>propertiesInstance.currentObject;
            Render.update(objectWithProperties.renderNode.ParentNode.Arguments[1], true);
            objectWithProperties.cellArray.splice(index, 0, I(answer, "", bCss.bgwhite, "50px"));
            propertiesInstance.winModal.modal.hide();
            DisplayGroupProps.updateProperties(objectWithProperties);
            propertiesInstance.winModal.modal.show();
            Builder.updateTree();
        }
    }
}