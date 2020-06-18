const CopyWebpackPlugin = require("copy-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const path = require("path");
const chalk = require("chalk");

/**
 * Terminates the process with an error message and alerts the user
 * that the currently installed version of react-scripts might not support this script.
 *
 * @param {string} stepMsg The error message to tell which step of overriding the config failed.
 * @param {Error} err A caught `Error` instance.
 */
function overrideError(stepMsg, err = new Error("Unknown error!")) {
  const color = chalk.default;
  console.log(color.magenta(stepMsg));
  console.log(
    "This might be due to a change in react-scripts' config since the last update of this override function."
  );
  console.log("");
  console.log(err);
  process.exit(1);
}

module.exports = {
  webpack: function (config, env) {
    if (!config.plugins) config.plugins = [];

    /**
     * Use index.php instead of index.html
     */
    try {
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
    } catch (err) {
      overrideError(
        'Error while changing "index.html" to "index.php" in webpack\'s config!',
        err
      );
    }

    /**
     * Excluding PHP from asset bundling.
     *
     * File-loader automatically handles every file that is not
     * explicitly tested for in webpack.config.js
     */
    try {
      const moduleRules = config.module.rules[config.module.rules.length - 1].oneOf;
      const fileLoaderRuleIndex = moduleRules.findIndex(
        obj => typeof obj.loader === "string" && obj.loader.indexOf("file-loader") > -1
      );
      moduleRules[fileLoaderRuleIndex].exclude.push(/\.php$/);
      // Apply modifications to the actual config
      config.module.rules[config.module.rules.length - 1].oneOf = moduleRules;
    } catch (err) {
      overrideError("Error while injecting PHP support to webpack's config!", err);
    }

    /**
     * Force copy everything to build directory
     * and include getID3 & gif.js
     */
    try {
      config.plugins.push(
        new CopyWebpackPlugin([
          /**
           * Copies all files found in /public to the build directory
           * `index.php` won't be copied, as it still needs to be modified by other plugins
           *
           * As an added bonus, Webpack will also keep an eye on these files in watch mode.
           */
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
          {
            from: "submodules/getID3/getid3/*mpeg*",
            to: "protected/getID3",
            flatten: true,
          },
          {
            from: "submodules/getID3/getid3/*audio-video.quicktime*",
            to: "protected/getID3",
            flatten: true,
          },
          {
            from: "submodules/getID3/getid3/*audio.mp3*",
            to: "protected/getID3",
            flatten: true,
          },
          {
            from: "submodules/gif.js/",
            to: "static/js",
            ignore: ["*.old.*"],
            force: true,
          },
        ])
      );
    } catch (err) {
      overrideError("Error while adding CopyWebpackPlugin to webpack's config!", err);
    }

    /**
     * Custom Service Worker support via worker-loader
     *
     * Since both eslint as well as babel need to take care of
     * these scripts, it is far simpler to tell webpack inside the source-code
     * how to cope with service workers. We do this by using `worker-loader!`
     * as an inline import argument.
     *
     * The code below appends additional parameters for the worker-loader.
     * This way, we can avoid many DRY issues.
     */
    try {
      const origEslintLoaderIndex = config.module.rules.findIndex(
        obj =>
          typeof obj.enforce === "string" &&
          obj.enforce.indexOf("pre") > -1 &&
          obj.use[0].loader.indexOf("eslint-loader") > -1
      );
      config.module.rules[origEslintLoaderIndex].use.unshift({
        loader: require.resolve("string-replace-loader"),
        options: {
          search: /worker-loader!/gm,
          replace: match => `${match.slice(0, -1)}?name=static/js/[name].js!`,
        },
      });
    } catch (err) {
      overrideError("Error while injecting worker-loader to webpack's config!", err);
    }

    /**
     * Custom live-reload, since we don't use webpack-dev-server
     */
    if (env === "development") {
      try {
        config.plugins.push(
          new LiveReloadPlugin({
            appendScriptTag: true,
            quiet: true,
          })
        );
      } catch (err) {
        overrideError("Error while injecting LiveReloadPlugin to webpack's config!", err);
      }
    }

    return config;
  },
  paths: function (origPaths, env) {
    return Object.assign(origPaths, {
      appHtml: path.resolve(__dirname, "../public/index.php"),
    });
  },
};
