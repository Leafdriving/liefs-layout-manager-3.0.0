// // import {Css, css} from './Css'
// class DefaultTheme {
//     static advisedDiv = new Css("div[llm]","position:absolute;", false, {type:"llm"});
//     static advisedBody = new Css("body","overflow: hidden;", false, {type:"llm"});

//     static bgLight = css("bgLight", `background: #dcedf0`, {type:"llm"});

// // WinModal
//   static titleCss = css("modalTitle",
//     `-moz-box-sizing: border-box;-webkit-box-sizing: border-box;font-size: 12px;
//       border: 1px solid black;background:LightSkyBlue;color:black;text-align: center;`,
//       `cursor:pointer`,
//       `-moz-box-sizing: border-box;-webkit-box-sizing: border-box;font-size: 12px;
//       border: 1px solid black;background:yellow;color:black;text-align: center;`, {type:"llm"})

//  // ScrollBar
// static ScrollBar_whiteBG = css("whiteBG","background-color:white;outline: 1px solid black;outline-offset: -1px;", {type:"llm"});
// static ScrollBar_blackBG = css("blackBG","background-color:black;color:white;cursor: -webkit-grab; cursor: grab;", {type:"llm"});   

// // arrows  //scrollArrows
//   static scrollArrowsSVGCss = css(`scrollArrows`,`stroke: black;`,`fill: white;`, {type:"llm"});
//   static arrowSVGCss = css(`arrowIcon`,`stroke: black;cursor:pointer;`,`fill: white;`, {type:"llm"});
//   static leftArrowSVG(classname:string) {return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
//     <path transform="rotate(182.31 12.399 12.341)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
//     </svg>`;}
//   static rightArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
//     <path transform="rotate(2.382 1.0017 36.146)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
//     </svg>`;}
//   static upArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
//     <path transform="rotate(-87.663 12.607 12.106)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
//     </svg>`;}
//   static downArrowSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="-10 -10 45 45" xmlns="http://www.w3.org/2000/svg">
//     <path transform="rotate(92.906 12.406 12.398)" d="m21.167 11.793-16.891 10.81-0.91654-20.033 8.9037 4.6114z" stroke-linecap="round" stroke-width=".84667"/>
//     </svg>`;}
 


// // Modal
//     static closeCss = css("closeCss",`-moz-box-sizing: border-box;
//       -webkit-box-sizing: border-box;
//       border: 1px solid black;background:white;`, {type:"llm"});
//     static closeSVGCss = css(`closeIcon`,`stroke: black;background:white`,`stroke: white;background:red`, {type:"llm"});
//     static closeSVG = `<svg class="closeIcon" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
//       <g stroke-linecap="round" stroke-width="3.2"><path d="m2.5 2.5 20 20"/><path d="m22.5 2.5-20 20"/></g>
//       </svg>`;


// // Dragbar
//   static horCss = css("db_hor","background-color:black;cursor: ew-resize;", {type:"llm"});
//   static verCss = css("db_ver","background-color:black;cursor: ns-resize;", {type:"llm"});

// // context
//     static context = css("contxt","background-color:white;color: black;outline-style: solid;outline-width: 1px;",
//                          "background-color:black;color: white;outline-style: solid;outline-width: 1px;", {type:"llm"});
//     // static defaultMenuBarCss = css("menuBar","background-color:white;color: black;");
//     // static defaultMenuBarHover = css("menuBar:hover","background-color:black;color: white;");
//     // static defaultMenuBarNoHoverCss = css("menuBarNoHover","background-color:white;color: black;");                         
// // Toolbar
//     static llm_checker = css("llm_checker",`cursor:pointer;
//     --checkerSize: 2px; /* edit me */
//     background-image:
//       linear-gradient(45deg, lightgrey 25%, transparent 25%), 
//       linear-gradient(135deg, lightgrey 25%, transparent 25%),
//       linear-gradient(45deg, transparent 75%, lightgrey 75%),
//       linear-gradient(135deg, transparent 75%, lightgrey 75%);
//     background-size: 
//       calc(2 * var(--checkerSize)) 
//       calc(2 * var(--checkerSize));
//     background-position: 
//       0 0, 
//       var(--checkerSize) 0, 
//       var(--checkerSize) calc(-1 * var(--checkerSize)), 
//       0px var(--checkerSize);
//     /* for fun */
//     transition-property: background-position, background-size;
//     transition-duration: 2s;`, {type:"llm"})

// }
// Css.theme = DefaultTheme;
// // export {DefaultTheme}