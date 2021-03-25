// class PageSelect extends Base {
//     static labelNo = 0;
//     static instances:PageSelect[] = [];
//     static activeInstances:PageSelect[] = [];
//     static defaults = {cellArray:[], ishor:false}
//     static argMap = {
//         string : ["label"],
//         Pages: ["pages"],
//         dim: ["dim"],
//     }
//     retArgs:ArgsObj;   // <- this will appear

//     dim:string;
//     label:string;
//     ishor:boolean;
//     rootDisplayCell: DisplayCell;
//     pages:Pages;
//     cellArray: DisplayCell[];
//     constructor(...Arguments:any){
//         super();this.buildBase(...Arguments);

//         PageSelect.makeLabel(this);
//         this.build()
//     }
//     build(){
//         let menuObj = {menuObj: {
//             one:function(){console.log("one")},
//             two:function(){console.log("two")},
//             three: {a:function(){console.log("a")},
//                     b:function(){console.log("b")},
//                     c:function(){console.log("c")},
//                     },
//             four:function(){console.log("four")},
//         }}
        
//         let label = this.pages.displaycells[0].label;
//         let clickableName = I(`${this.label}_0`, label, DefaultTheme.bgLight /*,events({onclick:contextObjFunction})*/)
//         let downArrow = I(`${this.label}_arrow`,"20px" , DefaultTheme.downArrowSVG("scrollArrows"));
        
//         this.rootDisplayCell = h("Prop_h", 
//             clickableName,
//             downArrow,
//             )
//         this.rootDisplayCell.dim = this.dim;

//         let contextObjFunction = hMenuBar(menuObj, {launchcell:this.rootDisplayCell});
//         clickableName.htmlBlock.events = events({onclick:contextObjFunction});
//         downArrow.htmlBlock.events = events({onclick:contextObjFunction});
//     }
// }
// function pageselect(...Arguments:any) {
//     let ps = new PageSelect(...Arguments);
//     return ps.rootDisplayCell;
// }





class Properties extends Base {
    static labelNo = 0;
    static instances:Properties[] = [];
    static activeInstances:Properties[] = [];
    static defaults = {
        tag: "DIV",
    }
    static argMap = {
        string : ["label", "innerHTML", "css"],
        number : ["marginLeft", "marginTop", "marginRight", "marginBottom"],
    }
    // retArgs:ArgsObj;   // <- this will appear
    constructor(...Arguments:any){
        super();this.buildBase(...Arguments);

        Properties.makeLabel(this);
    }
}