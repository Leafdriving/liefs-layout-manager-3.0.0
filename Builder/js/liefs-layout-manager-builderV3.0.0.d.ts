declare class bCss {
    static bgLight: Css;
    static bgGreen: Css;
    static bgBlue: Css;
    static bgCyan: Css;
    static bgBlack: Css;
    static menuItem: Css;
    static menuSpace: Css;
    static handlerSVG: Css;
    static hSVG: Css;
    static vSVG: Css;
    static ISVG: Css;
    static pagesSVG: Css;
}
declare class Builder extends Base {
    static labelNo: number;
    static instances: Builder[];
    static activeInstances: Builder[];
    static defaults: {};
    static argMap: {
        string: string[];
    };
    constructor(...Arguments: any);
    static nodeTree: Tree_;
    static makeHandlerTree(): void;
    static makeDisplayCell(node: node_, displaycell: DisplayCell): void;
}
