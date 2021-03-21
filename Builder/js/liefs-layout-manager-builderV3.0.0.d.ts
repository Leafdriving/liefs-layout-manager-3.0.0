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
declare class Builder {
    constructor();
    static updateTree(handler: Handler): t_;
    static DC(displaycell: DisplayCell, indent: string): string;
    static HB(htmlblock: HtmlBlock, indent: string): string;
    static DG(displaygroup: DisplayGroup, indent: string): string;
    static PG(pages: Pages, indent: string): string;
}
