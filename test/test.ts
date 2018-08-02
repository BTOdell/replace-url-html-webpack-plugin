import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import ReplaceUrlHtmlWebpackPlugin = require("../index");

const input: string = path.resolve(__dirname);
const output: string = path.resolve(__dirname + "/../test-dist");

const config: webpack.Configuration = {
    context: input,
    entry: [
        "./bundle.js",
    ],
    mode: "production",
    output: {
        filename: "bundle.js?[chunkhash]",
        path: output,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "template.html",
        }),
        new ReplaceUrlHtmlWebpackPlugin(),
    ],
    target: "web",
};

module.exports = config;
