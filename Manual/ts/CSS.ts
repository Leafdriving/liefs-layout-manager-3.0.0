class CSS {
    static h1 = new Css("h1",`border: 2px solid #1C6EA4;
                border-radius: 10px;
                background: #D1F5F3;
                -webkit-box-shadow: 3px 6px 7px -1px #000000; 
                box-shadow: 3px 6px 7px -1px #000000;
                margin-left: 10px;
                margin-top: 10px;
                padding-left: 5px;
                padding-right: 5px;
                font-size: 24px;
                display: inline-block;`);
    static p = new Css("p",`text-indent: 30px;
                margin-left: 10px;
                font-size: 18px;`, false);
    static codeblock = css("codeblock", `margin-left: 5px;
                                        width: -moz-calc(100% - 5px);
                                        width: -webkit-calc(100% - 5px);
                                        width: calc(100% - 5px);
                                        background-color: rgb(193, 243, 191)`)
    static inset = new Css("inset",`box-shadow: 2px 2px 5px black inset;
                                    margin: 20px;
                                    display: inline;
                                    padding: 10px;`)                

    static cssNode = css("cssNode",`background-color:#edf9fa;
                                    border-radius: 5px;
                                    padding-left: 5px;
                                    padding-right: 5px;`,
                                `background-color:#eaeda6;
                                border-radius: 5px;
                                padding-left: 5px;
                                padding-right: 5px;
                                cursor: pointer;`,
                                    `background-color:#f7ebeb;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`,)
    static menuButton = css("menuButton",`background-color:blue;fill: white;`,
                                        `cursor:pointer;background-color:white;fill: blue;`)

    static bgBlue = css("bgBlue",`background-color:blue;`);
    static bgGreen = css("bgGreen", `background-color:green`);
    static bgRed = css("bgRed", `background-color:red`);
    static bgBlack = css("bgBlack", `background-color:black`);

    static textWhite = css("textWhite", "color:white");
    static textBlue = css("textBlue", "color:blue");
    static textBlueLink = css("textBlueLink", "color:blue;cursor: pointer;");
    static textCenter = css("textCenter", "text-align: center;");
    static textBlack = css("textBlack", "color:black;overflow-y: auto;font-size: 20px;")

    static cssTitle = css("title", `background-color:blue;
                                    color:white;
                                    text-align: center;
                                    font-size: 24px;`)

    static cssBold = css("bold",    `text-decoration: underline;
                                    font-weight:bold;
                                    background-color: yellow;`)

    static centerText = css("centerText", `display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: blue;
                                            color:white;
                                            font-weight: bold;`);
    static leftText = css("leftText", `font-size: 25px;
                                        background-color: #ADD8E6;
                                        color:black;
                                        font-weight: bold;`);
    static centerButton = css("centerButton",`display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: #ADD8E6;
                                            color:black;
                                            font-weight: bold;
                                            border-radius: 10px 10px 0px 0px;`,
                                        `display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 20px;
                                        background-color: #839ae6;
                                        color:black;
                                        font-weight: bold;
                                        border-radius: 10px 10px 0px 0px;
                                        cursor:pointer;`,
                                            `display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-size: 20px;
                                            background-color: #4D4DFF;
                                            color:white;
                                            font-weight: bold;
                                            border-radius: 10px 10px 0px 0px;`);
    static menu_SVG(size:number = 50, color:string = "white"){ 
            return `<svg width="${size}" height="${size}" viewBox="-20 0 532 512" xmlns="http://www.w3.org/2000/svg">
    <path d="m464.883 64.267h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z"/>
    <path d="m464.883 208.867h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z"/>
    <path d="m464.883 353.467h-417.766c-25.98 0-47.117 21.137-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.012-21.137-47.149-47.117-47.149z"/>
</svg>`;
    }
} // style="fill:${color};stroke:${color};stroke-width:1" 