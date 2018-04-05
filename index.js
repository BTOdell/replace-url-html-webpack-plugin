"use strict";
const path = require("path");
function replaceJS(html, jsFiles, compilerOptions) {
    return replace(html, jsFiles, compilerOptions, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
}
function replaceCSS(html, cssFiles, compilerOptions) {
    return replace(html, cssFiles, compilerOptions, /(<link[\S\s]*?href=['"])(.+?)(['"][^>]*?>)/gi);
}
function replace(html, files, compilerOptions, regex) {
    const basePath = getBasePath(compilerOptions);
    let output = "";
    let lastIndex = 0;
    let result;
    while ((result = regex.exec(html)) !== null) {
        const scriptPrefix = result[1];
        const scriptSource = result[2];
        const scriptSuffix = result[3];
        output += html.substring(lastIndex, result.index);
        output += scriptPrefix;
        // Resolve script source path
        const resolvedScriptSource = path.resolve(basePath, scriptSource);
        const scriptSourceName = getPathName(resolvedScriptSource);
        // Determine if source should be replaced
        let replaceFile;
        for (let i = files.length - 1; i >= 0; i--) {
            const file = files[i];
            const resolvedFile = path.resolve(basePath, file);
            const fileName = getPathName(resolvedFile);
            if (scriptSourceName == fileName) {
                // Replace!
                replaceFile = path.relative(basePath, resolvedFile);
                // Remove file from files array
                files.splice(i, 1);
            }
        }
        if (replaceFile != null) {
            output += replaceFile.split(path.win32.sep).join(path.posix.sep);
        }
        else {
            output += scriptSource;
        }
        output += scriptSuffix;
        lastIndex = regex.lastIndex;
    }
    output += html.substring(lastIndex);
    return output;
}
function getBasePath(compilerOptions) {
    let base;
    if (compilerOptions.output && compilerOptions.output.path) {
        base = compilerOptions.output.path;
    }
    else if (compilerOptions.context) {
        base = compilerOptions.context;
    }
    else {
        base = __dirname;
    }
    return base;
}
function getPathName(filePath) {
    let parsedPath = path.parse(filePath);
    const dir = parsedPath.dir;
    while (parsedPath.ext.length > 0) {
        filePath = parsedPath.name;
        parsedPath = path.parse(filePath);
    }
    return path.join(dir, parsedPath.name);
}
const pluginName = "ReplaceUrlHtmlWebpackPlugin";
/**
 *
 */
class ReplaceUrlHtmlWebpackPlugin {
    /**
     * Initializes a new ReplaceUrlHtmlWebpackPlugin.
     */
    constructor() { }
    /**
     * @override
     */
    apply(compiler) {
        const compilerOptions = compiler.options;
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, (data) => {
                // Replace asset elements in HTML
                const assets = data.assets;
                const jsFiles = assets.js;
                const cssFiles = assets.css;
                let html = data.html;
                html = replaceJS(html, jsFiles, compilerOptions);
                html = replaceCSS(html, cssFiles, compilerOptions);
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
}
module.exports = ReplaceUrlHtmlWebpackPlugin;
//# sourceMappingURL=index.js.map