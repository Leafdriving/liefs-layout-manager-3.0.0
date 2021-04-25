let greenBGCenteredCss = css("greenBGCentered", "background:green;text-align: center;");
let blueBGCss = css("blueBG", "background:blue;color:white");
let redBGCss = css("redBG", "background:red;color:white");
let magentaBGCss = css("magentaBG", "background:magenta;color:white");
let cyanBGCss = css("cyanBG", "background:cyan;");
let myButtonCss = css("myButton", "background:black;color:white", "background:white;color:black");
let b1 = [];let b2 = [];
let events_ = events({onclick:function(){alert(`${this.innerHTML} Clicked`)}})
for (var x=0; x < 6; x++){
    b1.push( I(`core_displaygroup_b1_${x}`, `A${x}`, myButtonCss, events_) );
    b2.push( I(`core_displaygroup_b2_${x}`, `B${x}`, myButtonCss, events_) );
}
H("core_displaygroup01", 10,
    v("core_displaygroup01_v", 2,
        I("core_displaygroup01_top", "Top DisplayCell", greenBGCenteredCss, "50px", events_),
        h("core_displaygroup01_top_buttons", "50px", 2, ...b1),
        h("core_displaygroup01_v", 2,
            I("core_displaygroup01_left", "Left Side", blueBGCss, "200px", events_),
            v("core_displaygroup01_right", 2,
                I("core_displaygroup01_right_top", "Right Top", magentaBGCss, "30%", events_),
                I("core_displaygroup01_right_bottom", "Right Bottom", cyanBGCss, "70%", events_),
            )
        ),
        h("core_displaygroup01_bottom_buttons", "50px", 2, ...b2),
        I("core_displaygroup01_bottom", "Bottom DisplayCell", greenBGCenteredCss, "50px", events_)
    ),
    false,
);