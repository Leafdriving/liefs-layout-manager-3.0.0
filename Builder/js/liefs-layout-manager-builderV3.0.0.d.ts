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
    static hoverModalDisplayCell: DisplayCell;
    static hoverModal: Modal;
    static HandlerMouseOver(mouseEvent: MouseEvent): void;
    static HandlerMouseLeave(event: MouseEvent): void;
    static HandlerEvent: Events;
    static DisplayGroupMouseOver(event: MouseEvent): void;
    static DisplayGroupMouseLeave(event: MouseEvent): void;
    static DisplayGroupEvent: Events;
    static PagesMouseOver(event: MouseEvent): void;
    static PagesMouseLeave(event: MouseEvent): void;
    static PagesEvent: Events;
    static htmlBlockMouseOver(event: MouseEvent): void;
    static htmlBlockMouseLeave(event: MouseEvent): void;
    static htmlBlockEvent: Events;
    static updateTree(handler: Handler): t_;
    static DC(displaycell: DisplayCell, indent: string): string;
    static HB(htmlblock: HtmlBlock, indent: string): string;
    static DG(displaygroup: DisplayGroup, indent: string): string;
    static PG(pages: Pages, indent: string): string;
}
