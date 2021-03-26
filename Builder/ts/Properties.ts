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
    static defaultsize = [300,600];
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
            this.winModal = winmodal(`HtmlBlock_prop_winModal`, width, height,
                                        {body: this.rootDisplayCell,
                                         headerText:`HtmlBlock-`,
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
            if (Properties[objectType]) Properties[objectType](objectWithProperties); // then make it (Once only)
            else console.log(`Please create Properties.${objectType} [static] to handle ${objectWithProperties["label"]} type ${objectType}`);
        }
        let propInstance = <Properties>Properties.byLabel(objectType);

        if (!propInstance) console.log("No Definion in Properties for type "+objectType);
        else {
            propInstance.currentObject = objectWithProperties;      // pass the objectwithProperties to propInstance
            propInstance.currentObjectParentDisplayCell = parentDisplayCell;
            propInstance.process();                                 // start processing it!
        }
    }
    static setHeaderText(propertiesInstance:Properties, text:string){
        let headerDisplay = propertiesInstance.winModal.header.displaygroup.cellArray[0];
        headerDisplay.htmlBlock.innerHTML = text;
    }
    static HtmlBlockChange(variable:string, value:string){
        let propertiesInstance = <Properties>Properties.byLabel("HtmlBlock");
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        console.log(`Change Htmlblock-${objectWithProperties.label} variable "${variable}" to "${value}"`)
        switch (variable) {
            case "label":
                objectWithProperties.label = value;
                Builder.updateTree();                
                Properties.processNode(objectWithProperties);
                break;
            default:
                console.log(`No way to handle ${variable} value ${value}`);
                break;
        }
    }
    static HtmlBlockProcess() {
        let propertiesInstance:Properties = this as unknown as Properties;
        let objectWithProperties = <HtmlBlock>propertiesInstance.currentObject;
        let coord = propertiesInstance.currentObjectParentDisplayCell.coord;
        let keyCells = propertiesInstance.keyCells;
        Properties.setHeaderText(propertiesInstance, `HtmlBlock - ${objectWithProperties.label}`)
        keyCells.label.htmlBlock.innerHTML = objectWithProperties.label;
        keyCells.minDisplayGroupSize.htmlBlock.innerHTML = (objectWithProperties.minDisplayGroupSize) ? objectWithProperties.minDisplayGroupSize.toString() : "undefined"
        keyCells.x.htmlBlock.innerHTML = coord.x.toString();
        keyCells.y.htmlBlock.innerHTML = coord.y.toString();
        keyCells.width.htmlBlock.innerHTML = coord.width.toString();
        keyCells.height.htmlBlock.innerHTML = coord.height.toString();

        Handler.update();
    }
    static displayLabel(className:string, label:string, dim = "50px"){
        return I(`${className}_${label}_label`,`${label}:`, dim, bCss.bgLight);
    }
    static displayValue(className:string, label:string, disabled = false, dim=undefined){
        let Change = <Function>Properties[`${className}Change`];
        return I(`${className}_${label}_value`, dim,
                "<UNDEFINED>", (!disabled)? bCss.editable: bCss.disabled, (!disabled)?{attributes: {contenteditable:"true"}}:undefined,
                events({onblur:function(e:FocusEvent){Change(label,e.target["innerHTML"])},
                        onkeydown:function(e:KeyboardEvent){if (e.code == 'Enter') {e.preventDefault();e.target["blur"]();}}
                    })
                );
    }
    static labelAndValue(className:string, label:string, keyCells:object, dim = "50px"){
        return h(`${className}_${label}_h`, "20px",
            Properties.displayLabel(className, label, dim), // label
            keyCells[label]                            // value
        )
    }
    static Coord(className:string, keyCells:object){
        keyCells["x"] = Properties.displayValue("HtmlBlock", "x", true, "12.5%");
        keyCells["y"] = Properties.displayValue("HtmlBlock", "y", true, "12.5%");
        keyCells["width"] = Properties.displayValue("HtmlBlock", "width", true, "12.5%");
        keyCells["height"] = Properties.displayValue("HtmlBlock", "height", true, "12.5%");
        return h(`${className}_Coord_h`, "20px",
                    Properties.displayLabel("HtmlBlock", "x", "8.0%"),
                    keyCells["x"],
                    Properties.displayLabel("HtmlBlock", "y", "8.0%"),
                    keyCells["y"],
                    Properties.displayLabel("HtmlBlock", "width", "17.0%"),
                    keyCells["width"],
                    Properties.displayLabel("HtmlBlock", "height", "17.0%"),
                    keyCells["height"],                                                            
        )
    }
    static HtmlBlock(){ // This creates the first and only Properties instance for Htmlblock
        let keyCells = {
            label:Properties.displayValue("HtmlBlock", "label", /* true */ ), // true if disabled
            minDisplayGroupSize:Properties.displayValue("HtmlBlock", "minDisplayGroupSize", /* true */ ), // true if disabled
        }
        let rootcell = v(`HtmlBlock_prop_v`,
            Properties.labelAndValue("HtmlBlock", "label", keyCells), // true if disabled
            Properties.labelAndValue("HtmlBlock", "minDisplayGroupSize", keyCells, "150px"), // true if disabled
            I(`HtmlBlock_DisplayCell`,`Parent DisplayCell`, bCss.bgLightCenter, "20px"),
            
            Properties.Coord("HtmlBlock", keyCells),
        )
        new Properties("HtmlBlock", rootcell, Properties.HtmlBlockProcess, {keyCells});
    }
}

