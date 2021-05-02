let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");

let pageButtons=[], myPagesArray=[];
for (let index = 1; index < 5; index++) {
    pageButtons.push( I(`Pages_04_B${index}`, `page ${index}`, greenBG) );
    myPagesArray.push( I(`Pages_04_p${index}`,`This is Page ${index}`, [blueBG, grayBG, orangeBG, cyanBG][index-1]) );
}
let myPages = new Pages("Pages_04_main", ...myPagesArray);
let mySelected = new Selected("ChooseTree", [...pageButtons], 0, {onselect: function(index, displaycell){myPages.currentPage = index;}});

let inHor =  h("Pages_04_hor_", 5, ...myPagesArray);
let inVer =  v("Pages_04_hor_", 5, ...myPagesArray);
let inGrid =  v("Pages_04_grid1", 5,
                    h("Pages_04_grid1_a", 5, myPagesArray[0], myPagesArray[1]),
                    h("Pages_04_grid1_b", 5, myPagesArray[2], myPagesArray[3]),
                );
let singleView = v("Pages_04_v", 5, 
                    h("Pages_04_h", "40px", 5, ...pageButtons),
                    new DisplayCell().addComponent( myPages )
                );
let myEvalFunction = (thisPages)=>{
    let {width, height} = Handler.ScreenSizeCoord;
    if (width > 800) {
        if (height > 600) return 3;
        return 1;
    }
    if (height > 600) return 2;
    return 0;
}
H("Pages_04", P("PagesByScreenSize", singleView, inHor, inVer, inGrid, myEvalFunction),false);
// setTimeout(() => {let myModal = new winModal("Pages_04m", "Resize This Page", "Resize This Page");
// setTimeout(() => {myModal.hide();}, 3000);}, 500);
