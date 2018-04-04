/// <reference types="webpack" />
import webpack = require("webpack");
import { AsyncSeriesWaterfallHook } from "tapable";
declare module "webpack" {
    namespace compilation {
        interface CompilationHooks {
            htmlWebpackPluginBeforeHtmlProcessing: AsyncSeriesWaterfallHook;
        }
    }
}
/**
 *
 */
declare class TransformHTMLWebpackPlugin {
    /**
     * Initializes a new TransformHTMLWebpackPlugin.
     */
    constructor();
    /**
     * @override
     */
    apply(compiler: webpack.Compiler): void;
    /**
     *
     * @param {string} html The input HTML string.
     * @param {string[]} jsFiles
     * @returns {string} The output HTML string.
     */
    private static replaceJS(html, jsFiles);
    /**
     *
     * @param {string} html
     * @param {string[]} cssFiles
     * @returns {string} The output HTML string.
     */
    private static replaceCSS(html, cssFiles);
    private static replace(html, files, regex);
}
export = TransformHTMLWebpackPlugin;
