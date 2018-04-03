import webpack = require("webpack");
import {Plugin as WebpackPlugin} from "webpack";
import Compiler = webpack.compiler.Compiler;
import Compilation = webpack.compilation.Compilation;

/**
 * 
 */
class HTMLWebpackTransformAssetsPlugin extends WebpackPlugin {

    /**
     * @override
     */
    public apply(compiler: Compiler): void {
        if (compiler.hooks) {
            // Webpack 4 support
            
        } else {
            // Webpack 3 support
            compiler.plugin("compilation", (compilation: Compilation) => {
                // TODO
            });
        }
    }
}

export = HTMLWebpackTransformAssetsPlugin;