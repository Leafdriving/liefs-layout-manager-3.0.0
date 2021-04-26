let greenBGCenteredCss = css("greenBGCentered", "background:green;text-align: center;");
let blueBGCenteredCss = css("blueBGCentered", "background:blue;color:white;text-align: center;");
let topDiv = I("events_00_top","Top Div", greenBGCenteredCss, "100px",
                events({onclick:function(){console.log("Top Clicked")},
                        onmouseover:function(){console.log("you move the mouse over top")},
                        onmouseleave:function(){console.log("mouse left the top")},
                        })
            );
topDiv.addEvents({onclick:function(){console.log("other called Top Function")}});
H("events_00",
    v("events_00_top",
        topDiv,
        I("events_00_bottom","Bottom Div", blueBGCenteredCss, events({onclick:function(){console.log("Bottom Clicked")}})),
    ),
    false,
)
DisplayCell.instances["events_00_bottom"].addEvents({onclick:function(){console.log("Bottom Again")}});