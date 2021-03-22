// import {Css, css} from './Css'
class DefaultTheme {
    static advisedDiv = new Css("div[llm]","position:absolute;", false);
    static advisedBody = new Css("body","overflow: hidden;", false);

// WinModal
  static titleCss = css("modalTitle",`-moz-box-sizing: border-box;-webkit-box-sizing: border-box;
    border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;cursor:pointer`)

 // ScrollBar
//  static whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;");
//  static blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;");   

// arrows
  static arrowSVGCss = css(`arrowIcon`,`stroke: black;`,`fill: white;`);
  static leftArrowSVG = `<svg class="arrowIcon" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(182.31 12.399 12.341)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
  static rightArrowSVG = `<svg class="arrowIcon" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
  static upArrowSVG = `<svg class="arrowIcon" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(-87.663 12.607 12.106)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
  static downArrowSVG = `<svg class="arrowIcon" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
    <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
    </svg>`;
 


// Modal
    static closeCss = css("closeCss",`-moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      border: 1px solid black;background:white;`);
    static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`);
    static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
      </svg>`;


// Dragbar
  static horCss = css("db_hor","background-color:black;cursor: ew-resize;");
  static verCss = css("db_ver","background-color:black;cursor: ns-resize;");

// context
    static context = css("contxt","background-color:white;color: black;outline-style: solid;outline-width: 1px;",
                         "contxt:hover","background-color:black;color: white;outline-style: solid;outline-width: 1px;");
    // static defaultMenuBarCss = css("menuBar","background-color:white;color: black;");
    // static defaultMenuBarHover = css("menuBar:hover","background-color:black;color: white;");
    // static defaultMenuBarNoHoverCss = css("menuBarNoHover","background-color:white;color: black;");                         
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