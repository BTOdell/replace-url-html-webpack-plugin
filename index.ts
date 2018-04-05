import webpack = require("webpack");
import {AsyncSeriesWaterfallHook} from "tapable";
import * as path from "path";
import {ParsedPath} from "path";

// Added by the HtmlWebpackPlugin
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

function replaceJS(html: string, jsFiles: string[], compilerOptions: webpack.Configuration): string {
    return replace(html, jsFiles, compilerOptions, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
}

function replaceCSS(html: string, cssFiles: string[], compilerOptions: webpack.Configuration): string {
    return replace(html, cssFiles, compilerOptions, /(<link[\S\s]*?href=['"])(.+?)(['"][^>]*?>)/gi);
}

function replace(html: string, files: string[], compilerOptions: webpack.Configuration, regex: RegExp): string {
    const basePath: string = getBasePath(compilerOptions);
    let output: string = "";
    let lastIndex: number = 0;
    let result: RegExpExecArray | null;
    while ((result = regex.exec(html)) !== null) {
        const scriptPrefix: string = result[1];
        const scriptSource: string = result[2];
        const scriptSuffix: string = result[3];

        output += html.substring(lastIndex, result.index);
        output += scriptPrefix;
        
        // Resolve script source path
        const resolvedScriptSource: string = path.resolve(basePath, scriptSource);
        const scriptSourceName: string = getPathName(resolvedScriptSource);
        
        // Determine if source should be replaced
        let replaceFile: string|undefined;
        for (let i = files.length - 1; i >= 0; i--) {
            const file: string = files[i];
            const resolvedFile: string = path.resolve(basePath, file);
            const fileName: string = getPathName(resolvedFile);
            if (scriptSourceName == fileName) {
                // Replace!
                replaceFile = path.relative(basePath, resolvedFile);
                // Remove file from files array
                files.splice(i, 1);
            }
        }
        if (replaceFile != null) {
            output += replaceFile.split(path.win32.sep).join(path.posix.sep);
        } else {
            output += scriptSource;
        }
        
        output += scriptSuffix;

        lastIndex = regex.lastIndex;
    }
    output += html.substring(lastIndex);
    return output;
}

function getBasePath(compilerOptions: webpack.Configuration): string {
    let base: string;
    if (compilerOptions.output && compilerOptions.output.path) {
        base = compilerOptions.output.path;
    } else if (compilerOptions.context) {
        base = compilerOptions.context;
    } else {
        base = __dirname;
    }
    return base;
}

function getPathName(filePath: string): string {
    let parsedPath: ParsedPath = path.parse(filePath);
    const dir: string = parsedPath.dir;
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
    constructor() {}

    /**
     * @override
     */
    public apply(compiler: webpack.Compiler): void {
        const compilerOptions: webpack.Configuration = compiler.options;
        compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, (data: HTMLPluginData) => {
                // Replace asset elements in HTML
                const assets: HTMLPluginDataAssets = data.assets;
                const jsFiles: string[] = assets.js;
                const cssFiles: string[] = assets.css;
                let html: string = data.html;
                html = replaceJS(html, jsFiles, compilerOptions);
                html = replaceCSS(html, cssFiles, compilerOptions);
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
    
}

export = ReplaceUrlHtmlWebpackPlugin;