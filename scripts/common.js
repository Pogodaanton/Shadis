/**
 * Rewire publicPath generator
 *
 * .htaccess reroutes requests of any undefined `static` directory to the `static`
 * folder found in project root. Thus, we can make `publicPath` a relative value.
 *
 * Preferably, the project should be written with subdirectory support in mind, as
 * re-building the code because of a different directory placement is inconvenient.
 */
require("react-dev-utils/getPublicUrlOrPath");
require.cache[require.resolve("react-dev-utils/getPublicUrlOrPath")].exports = () => "./";
