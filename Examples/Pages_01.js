let blueBG = css("BlueBg","background:blue;color:white")
let grayBG = css("greyBG","background:gray;color:white;");
let orangeBG = css("orangeBG","background:orange");
let cyanBG = css("cyanBG", "background:cyan;");
let greenBG = css("bgGreen","background:green", "background:green;color:white", "background:green;color:blue");

let pageButtons=[], myPagesArray=[];
let myPages = new Pages("Pages_01_main")

for (let index = 1; index < 5; index++) {
    pageButtons.push( I(`Pages_01_B${index}`, `page ${index}`, greenBG, events(
        {onclick:()=>{ myPages.currentPage = index-1;console.log(index-1) }}
    )) );
    myPagesArray.push( I(`Pages_01_p${index}`,`This is Page ${index}`, [blueBG, grayBG, orangeBG, cyanBG][index-1]) );
}
pageButtons.push( I(`Pages_01_hor`, `horizontal`, greenBG,events({onclick:()=>{ myPages.currentPage = 4;console.log("hor")}}) ));
let inHor =  h("Pages_01_hor_", 5, ...myPagesArray);

pageButtons.push( I(`Pages_01_ver`, `vertical`, greenBG,events({onclick:()=>{ myPages.currentPage = 5;console.log("ver")}}) ));
let inVer =  v("Pages_01_hor_", 5, ...myPagesArray);


pageButtons.push( I(`Pages_01_grid`, `Grid`, greenBG,events({onclick:()=>{ myPages.currentPage = 6;console.log("grid")}}) ));
let inGrid =  v("Pages_01_grid1", 5,
                    h("Pages_01_grid1_a", 5, myPagesArray[0], myPagesArray[1]),
                    h("Pages_01_grid1_b", 5, myPagesArray[2], myPagesArray[3]),
                );

myPages.cellArray = myPagesArray.concat([ inHor, inVer, inGrid ]);

H("Pages_01",
    v("Pages_01_v", 5,
        h("Pages_01_top", "40px", 5, ...pageButtons),
        new DisplayCell(myPages),
    ),
    false
)
