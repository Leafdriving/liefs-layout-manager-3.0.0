let greenSelect = css("greenSelect", "background:green", "background:white;color:black", "background:black;color:white");
let blueSelect = css("blueSelect", "background:blue", "background:white;color:black", "background:black;color:white");
let redSelect = css("redSelect", "background:red", "background:white;color:black", "background:black;color:white");
let orangeSelect = css("orangeSelect", "background:orange", "background:white;color:black", "background:black;color:white");
let cyanBG = css("cyanBG", "background:cyan;");
let hArray = [], outputString = "";
let clearit = function(index){
    Selected.instances[`Selected_01_${index}`].clear();
    document.getElementById(`SelectedOutput${index}`).innerHTML = `<div id='SelectedOutput${index}'>Group ${index}: no selection</div><br>`;
    OutputItem.getComponent("Element_").innerHTML = document.getElementById("Selected_01_output").innerHTML;
}
for (let index = 0; index < 4; index++) {
    let bArray = [];
    for (let i = 0; i < 4; i++) 
        bArray.push(I( `Selected_01_b${index}_${i}`,`Group ${index} Button ${i}`,
                        [greenSelect, blueSelect, redSelect, orangeSelect][index]));
    hArray.push( h(`Selected_01_${index}`, 5, "30px", ...bArray) );
    new Selected(`Selected_01_${index}`, [...bArray],
        (indexSelected)=> {
            let el = document.getElementById(`SelectedOutput${index}`);
            el.innerHTML = `Group ${index}: Selected: ${indexSelected} <button onclick="clearit(${index})">clear</button>`;
            OutputItem.getComponent("Element_").innerHTML = document.getElementById("Selected_01_output").innerHTML;
        }
     );
    outputString += `<div id="SelectedOutput${index}">Group ${index}: no selection</div><br>`;
}
let OutputItem = I("Selected_01_output",outputString, cyanBG)
H("Selected_01",
    v("Selected_01_v", 5, ...hArray, OutputItem),
    false
)