"use strict";
const pluginName = "TransformHTMLWebpackPlugin";
/**
 *
 */
class TransformHTMLWebpackPlugin {
    /**
     * Initializes a new TransformHTMLWebpackPlugin.
     */
    constructor() { }
    /**
     * @override
     */
    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, (data) => {
                // Transform asset elements in HTML
                const assets = data.assets;
                const jsFiles = assets.js;
                const cssFiles = assets.css;
                let html = data.html;
                html = TransformHTMLWebpackPlugin.replaceJS(html, jsFiles);
                html = TransformHTMLWebpackPlugin.replaceCSS(html, cssFiles);
                // Remove chunks that were removed
                const chunks = assets.chunks;
                for (let chunkName in chunks) {
                    if (chunks.hasOwnProperty(chunkName)) {
                        const chunk = chunks[chunkName];
                        if (jsFiles.indexOf(chunk.entry) < 0) {
                            delete chunks[chunkName];
                        }
                    }
                }
                // Assign HTML back to data object
                data.html = html;
                // Return data object
                return data;
            });
        });
    }
    /**
     *
     * @param {string} html The input HTML string.
     * @param {string[]} jsFiles
     * @returns {string} The output HTML string.
     */
    static replaceJS(html, jsFiles) {
        return TransformHTMLWebpackPlugin.replace(html, jsFiles, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
    }
    /**
     *
     * @param {string} html
     * @param {string[]} cssFiles
     * @returns {string} The output HTML string.
     */
    static replaceCSS(html, cssFiles) {
        return html;
    }
    static replace(html, files, regex) {
        let output = "";
        let lastIndex = 0;
        let result;
        while ((result = regex.exec(html)) !== null) {
            const scriptPrefix = result[1];
            const scriptSource = result[2];
            const scriptSuffix = result[3];
            console.log(scriptPrefix + ":" + scriptSource + ":" + scriptSuffix);
            console.log("Index: " + result.index + ", lastIndex: " + regex.lastIndex);
            lastIndex = regex.lastIndex;
        }
        return output;
    }
}
module.exports = TransformHTMLWebpackPlugin;
//# sourceMappingURL=index.js.map