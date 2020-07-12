// Running modifications that are shared across watch.js and build.js
require("./common");

// Running react-app-rewired to monkey-patch webpack-config
require("react-app-rewired/scripts/build");
