class DefaultTheme {
    static advised = new Css("div","position:absolute;", false);

// context
    static context = css("contxt","background-color:white;color: black;outline-style: solid;outline-width: 1px;",
                         "contxt:hover","background-color:black;color: white;outline-style: solid;outline-width: 1px;");

}
Css.theme = DefaultTheme;