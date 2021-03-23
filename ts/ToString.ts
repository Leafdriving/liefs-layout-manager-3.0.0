class ToString{
    static exemptions = ["tag", "retArgs", "toString"];
    static customs = {
        attributes:function(thisValue:object){
            return ((Object.keys(thisValue).length == 0) ? "//" : "  ") + 
                ` attributes: ${JSON.stringify(thisValue)},\n`
            },
        css:function(thisValue:string){
            return ((!thisValue.length) ? "//" : "  ") + 
                ` css: "${thisValue}",\n`
            },
        dim:function(thisValue:string){
            return ((!thisValue.length) ? "//" : "  ") + 
                ` dim: "${thisValue}",\n`
            },
    }
}
HtmlBlock.prototype.toString = function(){
    let exemptions = ToString.exemptions.concat([]);
    let THIS = <HtmlBlock>this;
    let CLASS = HtmlBlock;
    let preText = "";
    let definer = `let HTMLBlock_${this.label} = new HtmlBlock(\n`;
    let inner = "";
    let closer = ")";
    
    let keyValue:[string, string][]=[];

    for (let key in this) {
        if (exemptions.indexOf(key) == -1)
            keyValue.push([key, BaseF.typeof(this[key])]);
    }
    inner += "  {\n";
    for (let index = 0; index < keyValue.length; index++) {
        let [key, type] = keyValue[index];
        if (key in ToString.customs)
            inner += ToString.customs[key](this[key]);
        else {
            switch (type) {
                case "string":
                    inner += `   ${key}: "${this[key]}",\n`
                    break;
                case "number":
                    inner += `   ${key}: ${this[key]},\n`
                    break;
                case "object":
                    inner += `   ${key}: ${JSON.stringify(this[key])},\n`
                    break;                
                default:
                    inner += `// no handler for type "${type}"`;
                    break;
            }
        }
    }
    inner += "  }\n";
    let fullreturn = preText+definer+inner+closer;
    console.log(fullreturn);
};
