declare var Prism:any;
// CSS
let bgBlue = css("bgBlue",`background-color:blue;`);
let bgGreen = css("bgGreen", `background-color:green`);
let bgRed = css("bgRed", `background-color:red`);
let bgBlack = css("bgBlack", `background-color:black`);

let textWhite = css("textWhite", "color:white");
let textBlue = css("textBlue", "color:blue");
let textCenter = css("textCenter", "text-align: center;");
let textBlack = css("textBlack", "color:black;")

let cssTitle = css("title", "background-color:blue;color:white;text-align: center;")

// let TI = function(...Arguments) {

// }

let TableOfContents = autoLabelTreenodes("myLabel",
  TI("Table of Contents",
      [TI("Introduction"),
      TI("Part 2"),
      TI("Part 3", 
          [TI("3a")]),
      ],
  )
)

// T(I("T_", "Table of Contents"),
//    [T(I("T_1","Introduction"),
//       [T(I("T_1_1","Child1ofChild1")),
//        T(I("T_1_2","Child2ofChild1")),
//       ]),
//     T(I("T_2","Child2ofTop")),
//    ]
// )

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

H("MainHandler", 2,
  v("Main Vertical",
    I("TitleBar", "20px", cssTitle),
    h("MainBody", 5,
      tree( dragbar(I("MainTree", "", bgGreen, "250px"),100, 500), TableOfContents, /* bgRed */{SVGColor:"black"} ),
      P("BPages", I("MainBody", textBlack)),
      // I("Body", "Body")
    ),
  ),
  {postRenderCallback:function(handlerInstance:Handler){Prism.highlightAll();}},
)