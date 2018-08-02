"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ReplaceUrlHtmlWebpackPlugin = require("../index");
const input = path.resolve(__dirname);
const output = path.resolve(__dirname + "/../test-dist");
const config = {
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
//# sourceMappingURL=test.js.map