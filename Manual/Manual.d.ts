declare class Manual {
    static centeredTitleCss: Css;
    static titleText: string;
    static titleDisplayCell: DisplayCell;
    static contentsTreeNode: node_;
    static treeNodeCss: Css;
    static contentsTree: Tree_;
    static treeBackgroundCss: Css;
    static treeDisplayCell: DisplayCell;
    static pages: Pages;
    static pageDisplayCell: DisplayCell;
    static load(url: string, cb?: (data: string) => void): Promise<void>;
    static fileObject: {};
}
