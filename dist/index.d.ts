/// <reference types="webpack" />
import webpack = require("webpack");
import { Plugin as WebpackPlugin } from "webpack";
import Compiler = webpack.compiler.Compiler;
/**
 *
 */
declare class HTMLWebpackTransformAssetsPlugin extends WebpackPlugin {
    /**
     * @override
     */
    apply(compiler: Compiler): void;
}
export = HTMLWebpackTransformAssetsPlugin;
