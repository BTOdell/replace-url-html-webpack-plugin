import { AsyncSeriesWaterfallHook } from "tapable";
import webpack = require("webpack");
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
     * @override
     */
    apply(compiler: webpack.Compiler): void;
}
export = ReplaceUrlHtmlWebpackPlugin;
