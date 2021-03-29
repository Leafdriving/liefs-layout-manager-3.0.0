class bCss{
    static editable = css("editable",`-moz-appearance: textfield;
                                    -webkit-appearance: textfield;
                                    background-color: white;
                                    box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    box-shadow: 1px 1px 1px 0 lightgray inset;  
                                    font: -moz-field;
                                    font: -webkit-small-control;`)
    static disabled = css("disabled",`-moz-appearance: textfield;
                                    -webkit-appearance: textfield;
                                    background-color: Azure;
                                    box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    box-shadow: 1px 1px 1px 0 lightgray inset;  
                                    font: -moz-field;
                                    font: -webkit-small-control;`)                                    
    static bgwhite = css("bgwhite", `background: white`);
    static bgLight = css("bgLight", `background: #dcedf0`);
    static bgLightCenter = css("bgLightCenter",
                                    `background: #dcedf0;
                                    text-align:center;box-sizing: border-box;
                                    border: 1px solid darkgray;
                                    -moz-box-sizing: border-box;
                                    -webkit-box-sizing: border-box;`);
    static bgGreen = css("bgGreen",`background: green;`);
    static bgBlue = css("bgBlue",`background: blue;`);
    static bgCyan = css("bgCyan",`background: cyan;`);
    static bgBlack = css("bgBlack",`background: black;
                                    opacity:0.5;
                                    box-sizing: border-box;
                                    border: 10px solid red;`);
    static menuItem = css("menuItem", `background: white;
                                       color: black;
                                       cursor: default;
                                       outline: 1px solid black;
                                       outline-offset: -1px;`,
                                       `background: black;
                                       color: white;`)
    static menuSpace = css("menuspace", `background: white;
                                        color: black;
                                        cursor: default;
                                        outline: 1px solid black;
                                        outline-offset: -1px;`);
    static handlerSVG = css("handlerSVG",`background-image: url("svg/user-homeOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`,
                                        `cursor: pointer;background-color:white;`);
    static hSVG = css("hSVG",`background-image: url("svg/Horizontal.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`,
                                        `cursor: pointer;background-color:white;`);
    static vSVG = css("vSVG",`background-image: url("svg/Vertical.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`,
                                        `cursor: pointer;background-color:white;`);
    static ISVG = css("ISVG",`background-image: url("svg/icon-htmlOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`,
                                        `cursor: pointer;background-color:white;`);
    static pagesSVG = css("pagesSVG",`background-image: url("svg/bookOPT.svg");
                                        background-repeat: no-repeat;
                                        padding-top: 3px;padding-left: 25px;`,
                                        `cursor: pointer;background-color:white;`);
    static treeItem = css("treeItem",`background: transparent; color:black; cursor:pointer`,
                                     `background:DeepSkyBlue;`)

    static bookSVGCss = css(`bookIcon`,`stroke: black;`,`fill: white;`);
    static bookSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(.069039 0 0 .048212 -4.1849 .6616)">
        <path d="m131.75 409.1c-28.8 0-52.1 18.3-52.1 40.4 0 22.6 23.3 40.4 52.1 40.4h278.4c-22.6-24.1-22.6-56.8 0-80.9h-278.4z"/>
        <path d="m120.15 1.9c-23.3 7-40.4 32.7-40.4 63.8v342.2c10.5-9.3 24.9-15.9 40.4-17.9z"/>
        <polygon points="139.95 388.9 410.25 388.9 410.25 0 244.95 0 244.95 99.2 204.85 73.9 164.85 99.2 164.85 0 139.95 0"/>
        </g>
        </svg>`;};
    static htmlSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
        <path d="m7.5329 4.4233-6.5 8.5 6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        <path d="m14.86 4.4367-4.1694 16.41" stroke-linecap="round" stroke-width="2.5"/>
        <path d="m17.467 4.4233 6.5 8.5-6.5 8.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        </g>
        </svg>`;};
    static horSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <g><path d="m11.466 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x=".91881" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/>
        <path d="m23.481 1.9856v21.23h-9.7443v0.68352h10.548v-21.913z" stroke-width=".38547"/>
        <rect x="12.933" y="1.3021" width="10.548" height="21.913" fill="#fff" fill-opacity="0.0" stroke="#f0f" stroke-width=".38547"/></g>
        </svg>`;};
   static verSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
        <path d="m2.7244 11.657h19.63v-9.7972h0.632v10.605h-20.262z"/>
        <g><rect transform="matrix(0,1,1,0,0,0)" x="1.0521" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/>
        <path d="m2.7244 23.737h19.63v-9.7972h0.632v10.605h-20.262z" stroke-width=".37166"/>
        <rect transform="matrix(0,1,1,0,0,0)" x="13.132" y="2.0924" width="10.605" height="20.262" fill="#fff" fill-opacity="0.0" stroke="#f00" stroke-width=".37166"/></g>
        </svg>`;};
    static displaycellSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" enable-background="new 0 0 48 48" version="1.1" viewBox="0 0 130.21 130.21" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    <g id="color_21_" transform="matrix(2.8344 0 0 2.8344 -6.2627 -5.5033)">
            <path d="m44 5h-37c-0.553 0-1 0.447-1 1v38c0 0.553 0.447 1 1 1h37c0.553 0 1-0.447 1-1v-38c0-0.553-0.447-1-1-1z" fill="#ffda8e"/>
    </g>
    <g id="outline_20_" transform="matrix(2.8344 0 0 2.8344 -2.2548 -2.6688)">
            <path d="m45 2h-42c-0.553 0-1 0.447-1 1v42c0 0.553 0.447 1 1 1h42c0.553 0 1-0.447 1-1v-42c0-0.553-0.447-1-1-1zm-2.414 2-4 4h-29.172l-4-4zm-32.586 30.087v-4.67l28-16.078v4.67zm28-13.748v17.661h-5v-14.79zm-7 4.019v13.642h-6v-10.196zm-8 4.594v9.048h-6v-5.603zm-8 4.594v4.454h-5v-1.583zm-5-6.459v-17.087h5v14.216zm7-4.02v-13.067h6v9.622zm14.05-8.067-6.05 3.474v-8.474h6v5zm1.95-1.12v-3.88h5v1.009zm-29-8.466 4 4v29.172l-4 4zm1.414 38.586 4-4h29.172l4 4zm38.586-1.414-4-4v-29.172l4-4z" fill="#384d68"/>
    </g>
    </svg>`}
    static homeSVG(classname:string){return `<svg class="${classname}" width="100%" height="100%" version="1.1" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
     <linearGradient id="linearGradient6715" x1="302.86" x2="302.86" y1="366.65" y2="609.51" gradientTransform="matrix(2.7744,0,0,1.9697,-1892.2,-872.89)" gradientUnits="userSpaceOnUse">
      <stop stop-opacity="0" offset="0"/>
      <stop offset=".5"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6717" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(2.7744,0,0,1.9697,-1891.6,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <linearGradient id="linearGradient5060">
      <stop offset="0"/>
      <stop stop-opacity="0" offset="1"/>
     </linearGradient>
     <radialGradient id="radialGradient6719" cx="605.71" cy="486.65" r="117.14" gradientTransform="matrix(-2.7744,0,0,1.9697,112.76,-872.89)" gradientUnits="userSpaceOnUse" xlink:href="#linearGradient5060"/>
     <radialGradient id="radialGradient238" cx="20.706" cy="37.518" r="30.905" gradientTransform="matrix(.56743 .008141 .076635 .67327 -.8499 -6.1144)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#202020" offset="0"/>
      <stop stop-color="#b9b9b9" offset="1"/>
     </radialGradient>
     <linearGradient id="linearGradient3104" x1="18.113" x2="15.515" y1="31.368" y2="6.1803" gradientTransform="matrix(.53734 0 0 .53793 .37326 -.58395)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#424242" offset="0"/>
      <stop stop-color="#777" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient491" x1="6.2298" x2="9.8981" y1="13.773" y2="66.834" gradientTransform="matrix(.80898 0 0 .37756 -.089325 -1.2284)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" stop-opacity=".87629" offset="0"/>
      <stop stop-color="#fffffe" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient9772" x1="22.176" x2="22.065" y1="36.988" y2="32.05" gradientTransform="matrix(.53309 0 0 .53567 .56202 -.4917)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6194cb" offset="0"/>
      <stop stop-color="#729fcf" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient322" x1="13.036" x2="12.854" y1="32.567" y2="46.689" gradientTransform="matrix(.70235 0 0 .43725 .093127 -1.1978)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
     <linearGradient id="linearGradient2296" x1="21.354" x2="20.796" y1="26.384" y2="50.771" gradientTransform="matrix(.64126 0 0 .43721 .51643 -.28655)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" offset="0"/>
      <stop stop-color="#fff" stop-opacity="0" offset="1"/>
     </linearGradient>
    </defs>
    <g transform="matrix(.012145 0 0 .011202 23.69 18.994)">
     <rect x="-1559.3" y="-150.7" width="1339.6" height="478.36" color="#000000" fill="url(#linearGradient6715)" opacity=".40206"/>
     <path d="m-219.62-150.68v478.33c142.88 0.9 345.4-107.17 345.4-239.2 0-132.02-159.44-239.13-345.4-239.13z" color="#000000" fill="url(#radialGradient6717)" opacity=".40206"/>
     <path d="m-1559.3-150.68v478.33c-142.8 0.9-345.4-107.17-345.4-239.2 0-132.02 159.5-239.13 345.4-239.13z" color="#000000" fill="url(#radialGradient6719)" opacity=".40206"/>
    </g>
    <path d="m2.803 20.227c0.011209 0.22446 0.24715 0.4481 0.47083 0.4481h16.833c0.22362 0 0.4358-0.2239 0.42397-0.4481l-0.50294-14.646c-0.011209-0.22418-0.24716-0.44807-0.47125-0.44807h-7.1305c-0.26116 0-0.66362-0.17009-0.75334-0.5953l-0.32887-1.5562c-0.083225-0.39576-0.47391-0.55831-0.69744-0.55831h-7.9413c-0.22362 0-0.43563 0.2239-0.42392 0.44788l0.5216 17.356z" fill="url(#radialGradient238)" stroke="url(#linearGradient3104)" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5368"/>
    <path d="m3.6163 20.17c0.00841 0.16617-0.096396 0.27686-0.26593 0.22137s-0.2863-0.16617-0.29499-0.33229l-0.50546-17.076c-0.0084066-0.16589 0.087989-0.26649 0.25472-0.26649l7.6919-0.02522c0.16701 0 0.49708 0.16001 0.60427 0.70411l0.30614 1.4995c-0.22782-0.248-0.22334-0.25556-0.34027-0.61618l-0.21661-0.67057c-0.11685-0.38746-0.37227-0.443-0.53867-0.443h-6.8738c-0.16645 0-0.27181 0.11097-0.26313 0.27714l0.50028 16.783-0.058566-0.05548z" color="#000000" display="block" fill="url(#linearGradient491)" opacity=".45143" stroke-width=".53294"/>
    <path d="m21.771 20.673c0.60931-0.02242 1.0465-0.58762 1.0912-1.2433 0.42168-6.1865 0.8844-11.373 0.8844-11.373 0.03839-0.13282-0.08967-0.26509-0.25584-0.26509h-18.323c-2.522e-4 0-0.98657 11.714-0.98657 11.714-0.061088 0.52603-0.24856 0.96634-0.8262 1.1694h18.416z" color="#000000" display="block" fill="url(#linearGradient9772)" stroke="#3465a4" stroke-linejoin="round" stroke-width=".53678"/>
    <path d="m5.6905 8.3276 17.481 0.034747-0.83909 10.715c-0.04484 0.57372-0.23987 0.76495-0.99795 0.76495-0.99795 0-15.288-0.01681-16.736-0.01681 0.12442-0.17206 0.17794-0.52978 0.1785-0.53836l0.91436-10.959z" fill="none" opacity=".46591" stroke="url(#linearGradient322)" stroke-linecap="round" stroke-width=".53678px"/>
    <path d="m5.6905 8.1985-0.62192 8.3796s4.4228-2.222 9.9507-2.222 8.2923-6.1576 8.2923-6.1576h-17.621z" fill="#fff" fill-opacity=".089286" fill-rule="evenodd" stroke-width=".53438"/>
    <path d="m9.8186 14.248-0.37533 4.0109h4.168l0.30365-3.242h2.2685l-0.30368 3.242h2.5913l0.37533-4.0109h1.4175l-5.5265-4.0399-6.2831 4.0399z" fill="url(#linearGradient2296)" fill-rule="evenodd" stroke-width="1.5885pt"/>
   </svg>`;};
}