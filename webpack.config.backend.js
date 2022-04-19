const path = require("path");
const Dotenv = require("dotenv-webpack");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = function (env, argv) {
  const entry = {
    backend: ["./src/backend/index.ts"],
  };

  const mode = (currentMode = argv.mode);
  let globalVarFileName = "dev.global.js";
  if (mode == "production") {
    globalVarFileName = "prod.global.js";
  }
  globalVarFileName = "./GlobalVariables/" + globalVarFileName;

  const output = {
    mode,
    target: "node",
    externals: [nodeExternals()],
    entry,
    output: {
      path: path.resolve(__dirname, "./"),
      filename: "app.js",
    },

    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
             { loader: "ts-loader" }
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new Dotenv(),
      new webpack.ProvidePlugin({
        GlobalVar: "GlobalVar",
      }),
      new webpack.DefinePlugin({
        "process.browser": "true",
      }),
    ],
    node: { __dirname: false },
    resolve: {
      alias: {
        GlobalVar: path.resolve(__dirname, globalVarFileName),
        "express-handlebars": "handlebars/dist/handlebars.js",
        ejs: "ejs.min.js",
      },
      extensions: [".ts", ".tsx", ".js"],
    },
  };

  return output;
};
