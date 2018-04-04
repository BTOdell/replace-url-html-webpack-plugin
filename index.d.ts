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
}
export = TransformHTMLWebpackPlugin;
