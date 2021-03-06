declare function monacoContainer(code: string, language: string, elementId?: string): object;
declare class Prism {
    static highlightAll: () => void;
}
declare class Manual {
    static allowScroll: Css;
    static centeredTitleCss: Css;
    static headingCss: Css;
    static subHeadingCss: Css;
    static buttonCss: Css;
    static tabCss: Css;
    static bottomTabCss: Css;
    static borderCss: Css;
    static justWhiteCss: Css;
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
    static fileObject: {};
    static fileObjectsLoaded: number;
    static buttonBar(label: string, height?: number): DisplayCell[];
    static launchAsModal(e: MouseEvent, label: string): void;
    static showJavascriptButton(label: string): DisplayCell;
    static showHtmlButton(label: string): DisplayCell;
    static showRenderButton(label: string): DisplayCell;
    static launchAsModalButton(label: string): DisplayCell;
    static launchAsNewWindow(label: string): DisplayCell;
    static getLibrary(label: string, element: Element_, language: string, returnString?: string): string;
    static newHandler(handler: Handler): Component;
    static example(label: string): DisplayCell;
    static names: string[];
    static load(name: string, cb?: (data: string) => void): Promise<void>;
}
