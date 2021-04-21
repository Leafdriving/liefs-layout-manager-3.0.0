let greenBGCss = css("greenBG", "background:green");
let blueBGCss = css("blueBG", "background:blue;color:white");
H("core_00", // create a "Handler" to handle screen size change
    h(`core_00_h`,  // create a horizontal DisplayGroup to hold an array of DisplayCells
        I("core_00_left","Left Side", greenBGCss), // Create an Element (div)
        I("core_00_right","Right Side", blueBGCss), // Create an Element (div)
    ),
    false, // don't show on load... wait till requested
);