"use strict";
const webpack_1 = require("webpack");
/**
 *
 */
class HTMLWebpackTransformAssetsPlugin extends webpack_1.Plugin {
    /**
     * @override
     */
    apply(compiler) {
        if (compiler.hooks) {
            // Webpack 4 support
        }
        else {
            // Webpack 3 support
            compiler.plugin("compilation", (compilation) => {
                // TODO
            });
        }
    }
}
module.exports = HTMLWebpackTransformAssetsPlugin;
//# sourceMappingURL=index.js.map