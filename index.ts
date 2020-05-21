import * as path from "path";
import { ParsedPath } from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {HtmlTagObject} from "html-webpack-plugin";

function replaceJS(html: string, publicPath: string, assetTags: HtmlTagObject[], compilerOptions: webpack.Configuration): string {
    return replace(html, publicPath, assetTags, "script", "src", compilerOptions, /(<script[\S\s]*?src=['"])(.+?)(['"][^>]*?>)/gi);
}

function replaceCSS(html: string, publicPath: string, assetTags: HtmlTagObject[], compilerOptions: webpack.Configuration): string {
    return replace(html, publicPath, assetTags, "link", "href", compilerOptions, /(<link[\S\s]*?href=['"])(.+?)(['"][^>]*?>)/gi);
}

function replace(html: string, publicPath: string, assetTags: HtmlTagObject[], filterAssetTagName: string, filterAssetTagAttribute: string,
                 compilerOptions: webpack.Configuration, regex: RegExp): string {
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
        const resolvedScriptSource: string = path.join(basePath, scriptSource);
        const scriptSourceName: string = getPathName(resolvedScriptSource);

        // Determine if source should be replaced
        let replaceFile: string|undefined;
        for (let i = assetTags.length - 1; i >= 0; i--) {
            const assetTag: HtmlTagObject = assetTags[i];
            if (assetTag.tagName !== filterAssetTagName) {
                continue;
            }
            if (!(filterAssetTagAttribute in assetTag.attributes)) {
                continue;
            }
            const assetPath: string | boolean = assetTag.attributes[filterAssetTagAttribute];
            if (typeof assetPath !== "string") {
                continue;
            }
            let assetFileName: string;
            if (publicPath && assetPath.startsWith(publicPath)) {
                assetFileName = assetPath.slice(publicPath.length);
            } else {
                assetFileName = assetPath;
            }
            if (scriptSourceName === getPathName(path.join(basePath, assetFileName))) {
                // Replace!
                replaceFile = assetPath;
                // Remove file from files array
                assetTags.splice(i, 1);
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
export class ReplaceUrlHtmlWebpackPlugin {

    /**
     * @override
     */
    public apply(compiler: webpack.Compiler): void {
        const compilerOptions: webpack.Configuration = compiler.options;
        compiler.hooks.compilation.tap(pluginName, (compilation: webpack.compilation.Compilation) => {
            let publicPath: string | undefined;
            HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(pluginName, (data, cb) => {
                publicPath = data.assets.publicPath;
                cb(null, data);
            });
            HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(pluginName, (data, cb) => {
                if (publicPath != null) {
                    // Process both head and body tags
                    for (const assetTags of [data.headTags, data.bodyTags]) {
                        // Replace asset tags in HTML
                        let html: string = data.html;
                        html = replaceJS(html, publicPath, assetTags, compilerOptions);
                        html = replaceCSS(html, publicPath, assetTags, compilerOptions);
                        // Assign HTML back to data object
                        data.html = html;
                    }
                }
                cb(null, data);
            });
        });
    }

}
