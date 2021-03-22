class bCss{
    static bgLight = css("bgLight", `background: #dcedf0`);
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
}