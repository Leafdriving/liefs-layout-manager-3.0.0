declare class CSS {
    static h1: Css;
    static p: Css;
    static codeblock: Css;
    static inset: Css;
    static cssNode: Css;
    static bgBlue: Css;
    static bgGreen: Css;
    static bgRed: Css;
    static bgBlack: Css;
    static textWhite: Css;
    static textBlue: Css;
    static textBlueLink: Css;
    static textCenter: Css;
    static textBlack: Css;
    static cssTitle: Css;
    static cssBold: Css;
    static centerText: Css;
    static leftText: Css;
    static centerButton: Css;
}
declare class CodeBlock {
    static byLabel(label: string): CodeBlock;
    static download(filename: string, text: string): void;
    static downloadfile(el: Element): void;
    static instances: CodeBlock[];
    static defaults: {
        label: () => string;
        height: number;
    };
    static argMap: {
        string: string[];
        number: string[];
    };
    label: string;
    html: string;
    javascript: string;
    javascriptForEval: string;
    css: string;
    discription: string;
    htmlDisplayCell: DisplayCell;
    javascriptDisplayCell: DisplayCell;
    evalDisplayCell: DisplayCell;
    height: number;
    displaycell: DisplayCell;
    constructor(...Arguments: any);
    build(): void;
}
declare function codeblock(...Arguments: any): DisplayCell;
declare var Prism: any;
declare let clickTreeItemEvent: Events;
declare let treeOfNodes: t_;
