let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");

let myPagesArray=[];
for (let index = 1; index < 5; index++)
    myPagesArray.push( I(`03 Page ${index}`,`This is Page ${index}`, [blueBG, grayBG, orangeBG, cyanBG][index-1]) );

let treenode = new node_();
treenode.newChild("03 Page 1")
            .newChild("03 Page 2")
            .parent()
        .newSibling("03 Page 3")
            .newChild("03 Page 4")
let myTree = new Tree_("MyTree",
            treenode,
            {events:{onclick:function(e){console.log(e, this)}},
            Css:css("weird","color:black;background:Aquamarine;cursor:pointer", "background:white;cursor:pointer", "cursor:pointer;background:black;color:white"),
            },
        )
H("Pages_03",
    h("Pages_03_h", 5,
        I("Pages_03_left", "300px", greenBG).addComponent( myTree ).addComponent(new DragBar(100,500)),
        new DisplayCell( new Pages("MyPages_", myTree) ),
    ),
    false
)