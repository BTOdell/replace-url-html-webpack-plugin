import webpack = require("webpack");
import {AsyncSeriesWaterfallHook} from "tapable";

const pluginName = "TransformHTMLWebpackPlugin";

// Added by the HTMLWebpackPlugin
declare module "webpack" {
    namespace compilation {
        interface CompilationHooks {
            htmlWebpackPluginBeforeHtmlProcessing: AsyncSeriesWaterfallHook;
        }
    }
}

interface HTMLPluginDataAssetChunk {

    size: number;
    entry: string;
    hash: string;
    css: string[];

}

interface HTMLPluginDataAssets {

    publicPath: string;
    chunks: { [key: string]: HTMLPluginDataAssetChunk };
    js: string[];
    css: string[];

}

interface HTMLPluginData {

    html: string;
    assets: HTMLPluginDataAssets;
    //plugin: HtmlWebpackPlugin;
    outputName: string;

}

/**
 * 
 */
class TransformHTMLWebpackPlugin {

    /**
     * Initializes a new TransformHTMLWebpackPlugin.
     */
    constructor() {}

    /**
     * @override
     */
    public apply(compiler: webpack.Compiler): void {
        compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, (data: HTMLPluginData) => {
                // Transform asset elements in HTML
                const assets: HTMLPluginDataAssets = data.assets;
                const jsFiles: string[] = assets.js;
                const cssFiles: string[] = assets.css;
                let html: string = data.html;
                html = TransformHTMLWebpackPlugin.replaceJS(html, jsFiles);
                html = TransformHTMLWebpackPlugin.replaceCSS(html, cssFiles);
                // Remove chunks that were removed
                const chunks = assets.chunks;
                for (let chunkName in chunks) {
                    if (chunks.hasOwnProperty(chunkName)) {
                        const chunk: HTMLPluginDataAssetChunk = chunks[chunkName];
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
    private static replaceJS(html: string, jsFiles: string[]): string {
        return TransformHTMLWebpackPlugin.replace(html, jsFiles, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
    }

    /**
     *
     * @param {string} html
     * @param {string[]} cssFiles
     * @returns {string} The output HTML string.
     */
    private static replaceCSS(html: string, cssFiles: string[]): string {
        return html;
    }

    private static replace(html: string, files: string[], regex: RegExp): string {
        let output: string = "";
        let lastIndex: number = 0;
        let result: RegExpExecArray|null;
        while ((result = regex.exec(html)) !== null) {
            const scriptPrefix: string = result[1];
            const scriptSource: string = result[2];
            const scriptSuffix: string = result[3];
            console.log(scriptPrefix + ":" + scriptSource + ":" + scriptSuffix);
            console.log("Index: " + result.index + ", lastIndex: " + regex.lastIndex);

            lastIndex = regex.lastIndex;
        }
        return output;
    }

}

export = TransformHTMLWebpackPlugin;