declare class CSS {
    static h1: Css;
    static h1h: Css;
    static p: Css;
    static codeblock: Css;
    static inset: Css;
    static insetLarge: Css;
    static slideTree: Css;
    static cssNode: Css;
    static menuButton: Css;
    static bgBlue: Css;
    static bgGreen: Css;
    static bgRed: Css;
    static bgBlack: Css;
    static bgLBlue: Css;
    static bgLBlue2: Css;
    static outline: Css;
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
    static menu_SVG(size?: number, color?: string): string;
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
declare function header(label: string, index: number, size?: number): DisplayCell;
declare let MainPages: DisplayCell;
declare let treeOfNodes: t_;
declare let mainTree: DisplayCell;
declare let slideTree: DisplayCell;
declare let LargeScreen: DisplayCell;
declare let MenuSvgSize: number;
declare let SmallScreen: DisplayCell;
declare let slideMenu: Handler;
declare let sizeFunction: (thisPages: Pages) => number;
