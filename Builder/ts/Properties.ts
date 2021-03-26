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
    process:(objectWithProperties:object)=>void;
    keyCells:{[key: string]: DisplayCell;}

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
    
    static processNode(node:node_){
        console.log("Process Node")
        let objectWithProperties = node.Arguments[1];
        let objectType = BaseF.typeof(objectWithProperties);

        if (!Properties.byLabel(objectType)) Properties[objectType](objectWithProperties);
        let propInstance = <Properties>Properties.byLabel(objectType);

        if (!propInstance) console.log("No Definion in Properties for type "+objectType);
        else propInstance.process(objectWithProperties);
    }
    static HtmlBlockChange(objectWithProperties:HtmlBlock, variable:string, value:string){
        console.log(`Change Htmlblock-${objectWithProperties.label} varialbe "${variable}" to "${value}"`)

    }
    static HtmlBlock(objectWithProperties:HtmlBlock){
        let process = function(objectWithProperties:HtmlBlock){
            let THIS = <Properties>this;
            let headerDisplay = THIS.winModal.header.displaygroup.cellArray[0];
            headerDisplay.htmlBlock.innerHTML = `HtmlBlock - ${objectWithProperties.label}`;
            THIS.keyCells.label.htmlBlock.innerHTML = objectWithProperties.label;


            Handler.update();
        }

        let keyCells = {
            label:I(`HtmlBlock_label`,
                    objectWithProperties.label,
                    bCss.editable,
                    {attributes: {contenteditable:"true"}},
                    events({onblur:function(e:FocusEvent){Properties.HtmlBlockChange(objectWithProperties, "label",e.target["innerHTML"])/*console.log(e.target["innerHTML"])*/},
                            onkeydown:function(e:KeyboardEvent){if (e.code == 'Enter') {e.preventDefault();e.target["blur"]();}}
                          })
                    ),
            two:I(`HtmlBlock_two`,`HtmlBlock_two`, bCss.bgwhite)
        }
        let rootcell = v(`HtmlBlock_prop_v`,
            h(`HtmlBlock_label_h`, "20px",
                I(`HtmlBlock_labelTag`,`Label:`,"50px",bCss.bgLight),
                keyCells.label
            ),
            keyCells.two
        )

        new Properties("HtmlBlock", rootcell, process, {keyCells});
    }
}

