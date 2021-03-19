// import {Css, css} from './Css'
class DefaultTheme {
    static advisedDiv = new Css("div[llm]","position:absolute;", false);
    static advisedBody = new Css("body","overflow: hidden;", false);

// context
    static context = css("contxt","background-color:white;color: black;outline-style: solid;outline-width: 1px;",
                         "contxt:hover","background-color:black;color: white;outline-style: solid;outline-width: 1px;");
// Toolbar
    static llm_checker = css("llm_checker",`cursor:pointer;
    --checkerSize: 2px; /* edit me */
    background-image:
      linear-gradient(45deg, lightgrey 25%, transparent 25%), 
      linear-gradient(135deg, lightgrey 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, lightgrey 75%),
      linear-gradient(135deg, transparent 75%, lightgrey 75%);
    background-size: 
      calc(2 * var(--checkerSize)) 
      calc(2 * var(--checkerSize));
    background-position: 
      0 0, 
      var(--checkerSize) 0, 
      var(--checkerSize) calc(-1 * var(--checkerSize)), 
      0px var(--checkerSize);
    /* for fun */
    transition-property: background-position, background-size;
    transition-duration: 2s;`)

}
Css.theme = DefaultTheme;
// export {DefaultTheme}