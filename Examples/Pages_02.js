let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");

let pageButtons=[], myPagesArray=[];
for (let index = 1; index < 5; index++) {
    pageButtons.push( I(`Pages_02_B${index}`, `page ${index}`, greenBG) );
    myPagesArray.push( I(`Pages_02_p${index}`,`This is Page ${index}`, [blueBG, grayBG, orangeBG, cyanBG][index-1]) );
}
let myPages = new Pages("Pages_02_main", ...myPagesArray);
let mySelected = new Selected("ChooseTree", [...pageButtons], 0, {onselect: function(index, displaycell){myPages.currentPage = index;}});
H("Pages_02",
    v("Pages_02_v", 5, 
        h("Pages_02_h", "40px", 5, ...pageButtons),
        new DisplayCell().addComponent( myPages )
    ),
    false
)