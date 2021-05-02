let blueBG = css("BlueBg","background:blue;color:white")
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");
let magentaBG = css("bgMagenta","background:magenta;", "background:magenta;color:white", "background:magenta;color:blue");
H("DragBar_01",
    v("Dragbar_v_01", 5,
        I("Dragbar_Top_01", "top", greenBG, "150px").addComponent(dragbar("Dragbar_Top_01", 100, 200)),
        h("Dragbar_01_mid", 5,
            I("Dragbar_01_left","left","100px",cyanBG).addComponent(dragbar("Dragbar_01_left", 80, 200)),
            I("Dragbar_01_middle","Middle", magentaBG),
            I("Dragbar_01_right", "right", "100px", orangeBG).addComponent(dragbar("Dragbar_01_right", 80, 200)),
        ),
        I("Dragbar_Bottom_01", "Bottom", blueBG, "150px").addComponent(dragbar("Dragbar_Bottom_01", 100, 200)),
    ),
    false
)