const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const { optimize } = require("webpack");

module.exports = function (env, argv) {
	const entry = {
		Orama: [
			"./src/frontend/Typescripts/index.tsx",
			"./src/frontend/Stylesheets/entry.scss",
		],
	};

	const mode = (currentMode = argv.mode);
	let globalVarFileName = "dev.global.js";
	if (mode == "production") {
		globalVarFileName = "prod.global.js";
	}
	const output = {
		mode,
		entry,
		output: {
			path: path.resolve(__dirname, "build"),
			filename: "bundle.js",
			publicPath:
				mode == "production" ? "https://www.oramaprojects.com.au/" : "/",
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
					exclude: /node_modules/,
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						{
							loader: "url-loader",
							options: {
								mimetype: "image/jpg",
							},
						},
					],
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					use: [
						{
							loader: "url-loader",
							options: { limit: 10000, minetype: "application/font-woff" },
						},
					],
				},
				{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]",
							},
						},
					],
				},
				{
					test: /\.(sc|sa|c)ss$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader },
						{ loader: "css-loader" },
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true,
								postcssOptions: {
									plugins: (loader) => [
										require("postcss-smart-import")(),
										require("precss")(),
										require("autoprefixer")(),
									],
								},
							},
						},
					],
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name]-[hash:8].[ext]",
								publicPath: "/",
								outputPath: "images/",
							},
						},
					],
				},
				{
					test: /\.(eot|woff|ttf|woff2|svg)$/,
					loader: "file-loader",
				},
			],
		},
		plugins: [
			new Dotenv(),
			new MiniCssExtractPlugin({
				filename: "./css/[name].css",
				chunkFilename: "./css/[name].[id].css",
			}),
			new webpack.ProvidePlugin({
				GlobalVar: "GlobalVar",
			}),
			new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
		],
		resolve: {
			alias: {
				GlobalVar: path.resolve(
					__dirname,
					"GlobalVariables/" + globalVarFileName
				),
				"express-handlebars": "handlebars/dist/handlebars.js",
				ejs: "ejs.min.js",
			},
			extensions: [".ts", ".tsx", ".js", ".jsx"],
		},
	};
	return output;
};
