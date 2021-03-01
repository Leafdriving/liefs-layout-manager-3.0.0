var bgBlue = css(
  "bgBlue",`
  background-color:blue;
  `);
var textWhite = css("textWhite", "color:white");
var textCenter = css("textCenter", "text-align: center;");
var allThree = [bgBlue, textWhite, textCenter];

H("MainHandler",
  v("Main Vertical",
    I("TitleBar", "150px", ...allThree),
    I("MainBody"),
  )
)