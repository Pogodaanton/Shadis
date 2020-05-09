const CopyWebpackPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const path = require("path");

module.exports = {
  webpack: function (config, env) {
    if (!config.plugins) config.plugins = [];

    /**
     * Use index.php instead of index.html
     */
    const htmlPluginIndex = config.plugins.findIndex(
      obj =>
        obj.options !== "undefined" &&
        obj.options.filename !== "undefined" &&
        obj.options.template !== "undefined"
    );
    if (htmlPluginIndex > -1) {
      config.plugins[htmlPluginIndex].options = Object.assign(
        config.plugins[htmlPluginIndex].options,
        {
          template: config.plugins[htmlPluginIndex].options.template.replace(
            ".html",
            ".php"
          ),
          filename: "index.php",
        }
      );
    }

    /**
     * Excluding PHP from asset bundling.
     *
     * File-loader automatically handles every file that is not
     * explicitly tested for in webpack.config.js
     */
    const moduleRules = config.module.rules[config.module.rules.length - 1].oneOf;
    const fileLoaderRuleIndex = moduleRules.findIndex(
      obj => typeof obj.loader === "string" && obj.loader.indexOf("file-loader") > -1
    );
    moduleRules[fileLoaderRuleIndex].exclude.push(/\.php$/);
    config.module.rules[config.module.rules.length - 1].oneOf = moduleRules;

    /*
    var util = require("util");
    var fs = require("fs");
    fs.writeFileSync("./data.json", util.inspect(moduleRules), "utf-8");
    */

    /**
     * Custom Webpack plugins
     */
    config.plugins.push(
      // Copies all files found in /public to the build directory
      // `index.php` won't be copied, as it is still being modified by webpack by other plugins
      // This way, Webpack will also keep an eye on these files in watch mode.
      new CopyWebpackPlugin([
        {
          from: "public/",
          ignore: ["index.php", "*.old.*"],
          force: true,
        },
        {
          from: "submodules/getID3/getid3/*gif*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*jpg*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*png*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*svg*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*getid3*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*audio-video.mpeg*",
          to: "protected/getID3",
          flatten: true,
        },
        {
          from: "submodules/getID3/getid3/*tag*",
          to: "protected/getID3",
          flatten: true,
        },
      ])
    );

    if (process.env.NODE_ENV === "development") {
      config.plugins.push(
        new LiveReloadPlugin({
          appendScriptTag: true,
          quiet: true,
        })
      );
    }

    return config;
  },
  paths: function (origPaths, env) {
    return Object.assign(origPaths, {
      appHtml: path.resolve(__dirname, "../public/index.php"),
    });
  },
};
