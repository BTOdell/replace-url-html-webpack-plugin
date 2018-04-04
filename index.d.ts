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
declare class ReplaceUrlHtmlWebpackPlugin {
    /**
     * Initializes a new ReplaceUrlHtmlWebpackPlugin.
     */
    constructor();
    /**
     * @override
     */
    apply(compiler: webpack.Compiler): void;
}
export = ReplaceUrlHtmlWebpackPlugin;
