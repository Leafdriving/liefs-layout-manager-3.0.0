let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let weird = css("weird","color:black;background:Aquamarine;cursor:pointer",
                "background:white;cursor:pointer", "cursor:pointer;background:black;color:white")

let cells = []; let myNode = new node_(), moveingNode = myNode;
for (let index = 0; index < 60; index++) moveingNode = moveingNode.newChild(`Child_${index}`);
for (let index = 0; index < 20; index++) cells.push( I(`Scrollbar_01_I${index}`, `Item ${index+1}`, "100px", blueBG) );

H("Scrollbar_01",
    h("Scrollbar_01_h", {allowScrollBar:true},
        v("Scrollbar_01_v", {allowScrollBar:true}, 5, "500px", ...cells),
        I("Scrollbar_01_2", "left middle", "500px", orangeBG),
        I("Scrollbar_01_3", "500px", grayBG)
            .addComponent( new Tree_("MyTree", myNode, {Css:weird}) ),
        I("Scrollbar_01_4", "right most", "500px", cyanBG),
    )
)