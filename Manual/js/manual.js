// CSS
var bgBlue = css("bgBlue", "background-color:blue;");
var bgGreen = css("bgGreen", "background-color:green");
var bgRed = css("bgRed", "background-color:red");
var bgBlack = css("bgBlack", "background-color:black");
var textWhite = css("textWhite", "color:white");
var textBlue = css("textBlue", "color:blue");
var textCenter = css("textCenter", "text-align: center;");
var textBlack = css("textBlack", "color:black;");
var cssTitle = css("title", "background-color:blue;color:white;text-align: center;");
// let TI = function(...Arguments) {
// }
var TableOfContents = T(I("T_", "Table of Contents"), [T(I("T_1", "Introduction"), [T(I("T_1_1", "Child1ofChild1")),
        T(I("T_1_2", "Child2ofChild1")),
    ]),
    T(I("T_2", "Child2ofTop")),
]);
// TI("Table of Contents",
//     [TI("Introduction"),
//         [TI("Part 1"),
//          TI("Part 2"),
//         ],
//     ],
// );
// let toc =
// TI("Table of Contents",[
//    TI("Introduction",[
//       TI("Child1"),
//       TI("Child2"),
//    ]),
// ])
// Framework
H("MainHandler", 2, v("Main Vertical", I("TitleBar", "20px", cssTitle), h("MainBody", 5, tree(dragbar(I("MainTree", "", bgGreen, "250px"), 100, 500), TableOfContents, /* bgRed */ { SVGColor: "black" }), P("BPages", I("MainBody", textBlack)))), { postRenderCallback: function (handlerInstance) { Prism.highlightAll(); } });
