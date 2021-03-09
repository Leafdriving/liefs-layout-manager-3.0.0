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
                

    static cssNode = css("cssNode",`background-color:#edf9fa;border-radius: 5px;padding-left: 5px;padding-right: 5px;`,
                                `background-color:#eaeda6;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`,
                                `background-color:#f7ebeb;border-radius: 5px;padding-left: 5px;padding-right: 5px;cursor: pointer;`,)

    static bgBlue = css("bgBlue",`background-color:blue;`);
    static bgGreen = css("bgGreen", `background-color:green`);
    static bgRed = css("bgRed", `background-color:red`);
    static bgBlack = css("bgBlack", `background-color:black`);

    static textWhite = css("textWhite", "color:white");
    static textBlue = css("textBlue", "color:blue");
    static textCenter = css("textCenter", "text-align: center;");
    static textBlack = css("textBlack", "color:black;overflow-y: auto;font-size: 20px;")

    static cssTitle = css("title", "background-color:blue;color:white;text-align: center;font-size: 24px;")

    static cssBold = css("bold", "text-decoration: underline;font-weight:bold;background-color: yellow;")

    static centerText = css("centerText", `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: blue;color:white;font-weight: bold;`);
    static leftText = css("leftText", `font-size: 25px;background-color: #ADD8E6;color:black;font-weight: bold;`);
    static centerButton = css("centerButton",
    `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #ADD8E6;`
    +`color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;`,
    `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #839ae6;`
    +`color:black;font-weight: bold;border-radius: 10px 10px 0px 0px;cursor:pointer;`,
    `display: flex;align-items: center;justify-content: center;font-size: 20px;background-color: #4D4DFF;`
    +`color:white;font-weight: bold;border-radius: 10px 10px 0px 0px;`
);
}