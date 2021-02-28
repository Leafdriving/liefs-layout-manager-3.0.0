css("CyanBG", "background-color:cyan;color:white");
css("RedBG", "background-color:red;color:white");
css("RedBG:", "background-color:red;color:white");
css("GreenBG", "background-color:green;color:white;overflow-y:auto");
css("BlueBG", "background-color:blue;color:white");


H( h(
    I("one", "hi", "BlueBG", "250px"),
    I("two", "", "GreenBG", "250px"),
    5
    ),
    10
)

// H( h(
//     dragbar(I("one", "hi", "BlueBG", "250px"), 100, 500),
//     tree( I("two", "", "GreenBG", "250px") ),
//     5
//     ),
//     10
// )

// H(
//     h(
//         I("one", "", "BlueBG", tree()),
//            P("Main",
//             I("two", "", "GreenBG"),
//             I("three", "", "RedBG" /*, {attributes: {pagebutton:"Main|1"}} */),
//             "200px"
//            ),
//         5
//     ),
//     10
// )



// let consolelogclicked = function() {console.log(`${this.id} was clicked`)}
// let menuObj = {menuObj: {
//     one:function(){console.log("one")},
//     two:function(){console.log("two")},
//     three: {a:function(){console.log("a")},
//             b:function(){console.log("b")},
//             c:function(){console.log("c")},
//             },
//     four:function(){console.log("four")},
// }}
// let contextObjFunction = context(menuObj);

// let FILE = I("file","File","75px", Context.defaultMenuBarCss);
// FILE.hMenuBar({menuObj: {
//                 one:function(){console.log("one")},
//                 two:function(){console.log("two")},
//                 three: {a:function(){console.log("a")},
//                         b:function(){console.log("b")},
//                         c:function(){console.log("c")},
//                         },
//                 four:function(){console.log("four")},
//                 }})

// let EDIT = I("edit","Edit","75px", Context.defaultMenuBarCss);
// EDIT.hMenuBar({menuObj: {
//     one:function(){console.log("one")},
//     two:function(){console.log("two")},
//     three: {a:function(){console.log("a")},
//             b:function(){console.log("b")},
//             c:function(){console.log("c")},
//             },
//     four:function(){console.log("four")},
//     }})
// H(  v(  h(  FILE,
//             EDIT,
//             I(Context.defaultMenuBarNoHoverCss),
//             "20px"
//         ),
//         I("two","TWO",css("yyy","background-color:green"), events({onclick: consolelogclicked,
//                                                                    oncontextmenu: contextObjFunction
//                                                                   })),
//         dragbar(
//             I("one","ONE","150px",css("xxx","background-color:red") ,
//                 // events({ondrag: {onDown :function(){console.log("mousedown")},
//                 //                  onMove :function(){console.log("dragging")},
//                 //                  onUp: function(output:object){console.log("mouseup");console.log(output)}
//                 //                 } }) ),
//                 events({ondrag: swipe({left :function(){console.log("Do Swipe Left Function")},
//                                     right:function(){console.log("Do Swipe Right Function")},
//                                     up:function(){console.log("Do Swipe Up Function")},
//                                     down:function(){console.log("Do Swipe Down Function")}
//                                     }),
//                         onclick: consolelogclicked
//                         }
//                     ) ),
//             100, 200
//         ),
//         5,
//         new HtmlBlock("three","",css("zzz","background-color:cyan"), events({onclick: consolelogclicked }), 5)
//     ),
//     5,
//     // new Coord(100,100,400,400)
// )
