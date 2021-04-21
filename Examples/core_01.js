let greenBGCss = css("greenBG", "background:green");
let blueBGCss = css("blueBG", "background:blue;color:white");
let redBGCss = css("redBG", "background:red");
H("core_01", 10, // set 10 pixels border on outside
    h(`core_01_h`, -5, // set -5 pixels between cells (to offset below 5+5-5= 5 pixels)
        I("core_01_left","Left Side", greenBGCss, 5), // 5 pixel margin all sides
        I("core_01_right","Right Side", blueBGCss, 5), // 5 pixel margin all sides
    ),
    I(`core_01_background`, redBGCss) // Background 
);
