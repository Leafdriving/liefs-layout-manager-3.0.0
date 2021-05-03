let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");

let makeNodeblock = function(node, pre, type) {
node.newChild(`${pre}${type}`)
    .newChild(`${pre}${type}Child1`)
        .newChild(`${pre}${type}Child1Child`)
        .parent()
    .newSibling(`${pre}${type}Child2`)
        .newChild(`${pre}${type}Child2Child1`)
        .newSibling(`${pre}${type}Child2Child2`)
        .parent()
    .newSibling(`${pre}${type}Child3`)
}
let makeNode = function(pre){
  let myNode = new node_();
  makeNodeblock(myNode, pre, "Top");
  makeNodeblock(myNode, pre, "Middle");
  makeNodeblock(myNode, pre, "Bottom");
return myNode;
}
let onclick = function(e){alert(e.target.innerHTML)}
let leftTree = new Tree_("Tree_01_left", makeNode("Left_"),{Css:greenBG, events:{onclick}, topMargin:25});
let midTree = new Tree_("Tree_01_left", makeNode("Mid_"),{Css:greenBG, selectParents:false, events:{onclick}, topMargin:25});
let rightTree = new Tree_("Tree_01_right", makeNode("Right_"),{Css:greenBG, useSelected:false, events:{onclick}, topMargin:25});
H("Tree_01",
    h("Tree_01", 5,
        I("Tree_01_left", orangeBG, "Select All Parents").addComponent( leftTree ),
        I("Tree_01_mid", cyanBG, "Select Cell Only").addComponent( midTree ),
        I("Tree_01_right", grayBG, "No Select").addComponent( rightTree ),
    ),
    false
)