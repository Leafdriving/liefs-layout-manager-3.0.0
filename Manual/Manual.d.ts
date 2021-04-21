declare class Manual {
    static centeredTitleCss: Css;
    static headingCss: Css;
    static subHeadingCss: Css;
    static bodyCss: Css;
    static buttonCss: Css;
    static titleText: string;
    static titleDisplayCell: DisplayCell;
    static contentsTreeNode: node_;
    static treeNodeCss: Css;
    static contentsTree: Tree_;
    static treeBackgroundCss: Css;
    static treeDisplayCell: DisplayCell;
    static pages: Pages;
    static pageDisplayCell: DisplayCell;
    static nameToUrl(name: string): string;
    static load(name: string, cb?: (data: string) => void): Promise<void>;
    static fileObject: {};
    static loadFiles: void;
}
