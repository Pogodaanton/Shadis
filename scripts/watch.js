/**
 * This script uses CRA's Webpack config
 * and spawns a watching Webpack-CLI.
 *
 * Webpack-Dev-Server is useless for us,
 * as it cannot read any
 */
process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

/**
 * Rewire publicPath generator
 *
 * .htaccess reroutes requests of any undefined `static` directory to the `static`
 * folder found in project root. Thus, we can make `publicPath` a relative value.
 */
require("react-dev-utils/getPublicUrlOrPath");
require.cache[require.resolve("react-dev-utils/getPublicUrlOrPath")].exports = (
  isEnvDevelopment,
  homepage
) => {
  const { URL } = require("url");
  const stubDomain = "https://create-react-app.dev";

  if (homepage) {
    // strip last slash if exists
    homepage = homepage.endsWith("/") ? homepage : homepage + "/";

    // validate if `homepage` is a URL or path like and use just pathname
    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return homepage.startsWith(".") ? homepage : validHomepagePathname;
  }

  return "/";
};

const fs = require("fs-extra");
const paths = require("react-scripts/config/paths");
const path = require("path");
const webpack = require("webpack");
const webpackconfig = require("react-scripts/config/webpack.config.js");
const config = webpackconfig("development");
const rewire = require("rewire");
const chalk = require("chalk");

/**
 * Rewire compilation success screen
 */
const webpackDevUtils = rewire("react-dev-utils/WebpackDevServerUtils");
webpackDevUtils.__set__("printInstructions", (appName, urls, useYarn) => {
  console.log();
  console.log(
    chalk.cyan("ℹ️   The development bundle was output to " + chalk.bold("dist"))
  );
  console.log(
    `    To see ${chalk.bold(
      appName
    )} it in action, you need to route a php + mysql web-server to the folder's location.`
  );
  console.log();
  console.log(`    You can read more about this setup in the ${chalk.bold("README")}:`);
  console.log(
    `    ${chalk.underline("https://github.com/pogodaanton/Shadis#available-scripts")}`
  );

  console.log();
  console.log();
  console.log(chalk.cyan("📡  Webpack is in watch mode"));
  console.log(
    `    As soon as it detects a change in the file system,
    it will recompile and reload any pages using this dev build.`
  );

  console.log();
  console.log();
  console.log(chalk.cyan("📊  This development build is not optimized"));
  console.log(
    `    To create a production build, use ` +
      `${chalk.yellow(`${useYarn ? "yarn" : "npm run"} build`)}.`
  );
  console.log();
  console.log(chalk.dim("Last successful build: " + new Date().toLocaleTimeString()));
  console.log();
});

/**
 * Integrate react-app-rewire and customize-cra changes
 */
const overrides = require("react-app-rewired/config-overrides");
overrides.webpack(config, process.env.NODE_ENV);

/**
 * Remove react-dev-utils/webpackHotDevClient.js
 */
config.entry = config.entry.filter(fileName => !fileName.match(/webpackHotDevClient/));
config.plugins = config.plugins.filter(
  plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin)
);

/**
 * Remove optimizations to fasten compilation
 */
config.mode = "development";
config.devtool = "eval-cheap-module-source-map";
delete config.optimization;

// fix publicPath and output path
// config.output.publicPath = pkg.homepage
// config.output.path = paths.appBuild // else it will put the outputs in the dist folder

/**
 * Empty `dist` directory
 * and protect the `uploads` folder
 */
const distPath = path.resolve(__dirname, "../dist");
let distItems;
try {
  distItems = fs.readdirSync(distPath);
} catch {
  return fs.mkdirsSync(distPath);
}

distItems.forEach(item => {
  if (item === "uploads") return;
  item = path.join(distPath, item);
  fs.removeSync(item);
});

/**
 * Use react-script's own compiler instance
 * and assign a watch listener to it.
 */

// Dependency arguments
const appName = require(paths.appPackageJson).name;
const useYarn = fs.existsSync(paths.yarnLockFile);
const useTypeScript = fs.existsSync(paths.appTsConfig);
const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === "true";

// Mock socket: We don't have a dev server running
const devSocket = {
  warnings: warnings => null,
  errors: errors => null,
};

// Mock URLs: We won't run a dev server, this is unnecessary.
const urls = {
  lanUrlForConfig: "",
  lanUrlForTerminal: "",
  localUrlForTerminal: "",
  localUrlForBrowser: "",
};

// Create a webpack compiler that is configured with custom messages.
const compiler = webpackDevUtils.createCompiler({
  appName,
  config,
  devSocket,
  urls,
  useYarn,
  useTypeScript,
  tscCompileOnError,
  webpack,
});

// Watch for changes and copy public folder if compilation is finished
compiler.watch({}, (err, stats) => {
  if (err) console.error(err);
});
