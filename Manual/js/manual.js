// CSS
var bgBlue = css("bgBlue",`background-color:blue;`);
var bgGreen = css("bgGreen", `background-color:green`);
var bgRed = css("bgRed", `background-color:red`);

var textWhite = css("textWhite", "color:white");
var textCenter = css("textCenter", "text-align: center;");

var cssTitle = css("title", "background-color:blue;color:white;text-align: center;")

// Tree
var TableOfContext = T("TreeTableOfContents", // true,
   I("Tree_TableOfContents", "Table of Contents", bgRed),
   [T("Tree_1", // true,
      I("Tree_1","Introduction", bgRed),
      [T("Tree_child1_1", // true,
         I("Tree_Child1ofChild1","Child1ofChild1", bgRed)),
      T("Tree_child1_2", // true,
         I("Tree_Child2ofChild1","Child2ofChild1", bgRed)),
      ]
   ),
   T("Tree_child2",
      I("Tree_Child2ofTop","Child2ofTop", bgRed)
   )]
)

// Framework

H("MainHandler", 2,
  v("Main Vertical",
    I("TitleBar", "20px", cssTitle),
    h("MainBody", 5,
      tree( dragbar(I("MainTree", "", bgGreen, "250px"),100, 500), TableOfContext ),
      I("Body", "Body")
    ),
  )
)