let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");
let magentaBG = css("bgMagenta","background:magenta;", "background:magenta;color:white", "background:magenta;color:blue");
let specialBG = css("bgSpecial","background:gray;", "background:pink;color:white", "background:purple;color:blue");

let topthingNode = new node_(), nextthingNode = new node_(), childthingNode = new node_();
topthingNode.newChild("You right clicked this!");
nextthingNode.newChild("This one too!");
childthingNode.newChild("You even clicked this!");

let onclickFunction = function(event,displaycell,node){
    console.log("clicked!", event,displaycell,node);alert(`${node.label} clicked`);
};

I("TopThing","This is the top thing",grayBG).addComponent( context("topthing_", topthingNode, onclickFunction) )
I("Next Thing","This is the next thing",orangeBG).addComponent( context("nextthing_", nextthingNode, onclickFunction) )
I("Child Thing","This is the child thing",cyanBG).addComponent( context("childthing_", childthingNode, onclickFunction) )

let treenode = new node_();
treenode.newChild("TopThing", I("TopThing1", "TopThingy", specialBG).addComponent( context("TopThingContext", onclickFunction) ))
        .newSibling("Next Thing")
            .newChild("Child Thing");

let myTree = new Tree_("MyTree", treenode,
    {Css:css("weird","color:black;background:Aquamarine;cursor:pointer",
                     "background:white;cursor:pointer",
                     "cursor:pointer;background:black;color:white")});


let B1node = new node_(), lettersBig = ["A", "B", "C", "D", "E"], lettersSmall = ["w", "x", "y", "z"];
for (let index1 = 0; index1 < lettersBig.length; index1++) {
    let c1 = B1node.newChild(lettersBig[index1]);
    for (let index2 = 0; index2 < 6; index2++) {
        let c2 = c1.newChild(`${lettersBig[index1]}_${index2}`);
        for (let index3 = 0; index3 < lettersSmall.length; index3++) 
            c2.newChild(`${lettersBig[index1]}_${index2}_${lettersSmall[index3]}`)
    }
}


let B1 = I("B1",greenBG, events({onclick:()=>alert("Green Clicked")}))
            .addComponent( myTree )
            .addComponent( context("B1context", B1node, onclickFunction));
let myMouseOver = (name)=>context(name, "onmouseover", false, false, onclickFunction);
let myButton = (name)=>I(name,name, blueBG).addComponent( myMouseOver(name) )
let buttonRow = h("buttonrow", "30px", 5,
                myButton("ButtonOne"), myButton("ButtonTwo"), myButton("ButtonThree"), myButton("ButtonFour")
)
let B2 = I("B2", "Try Right Clicking a few things", magentaBG, events({onclick:()=>alert("Magenta Clicked")}))
            .addComponent( context("Mycontext", onclickFunction) );
let pages = new Pages("MyPages", "300px", myTree);
let pageDisplayCell = new DisplayCell(pages)
H("context_01", 25,
        h("hor1", 5,
            v("Butons", 5,
                B1,
                buttonRow,
                B2,
            ),
            pageDisplayCell,
        )
        , false
)