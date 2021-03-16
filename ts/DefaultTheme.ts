// import {Css, css} from './Css'
class DefaultTheme {
    static advisedDiv = new Css("div[llm]","position:absolute;", false);
    static advisedBody = new Css("body","overflow: hidden;", false);

// context
    static context = css("contxt","background-color:white;color: black;outline-style: solid;outline-width: 1px;",
                         "contxt:hover","background-color:black;color: white;outline-style: solid;outline-width: 1px;");

}
Css.theme = DefaultTheme;
// export {DefaultTheme}