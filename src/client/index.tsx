import React from "react";
import ReactDOM from "react-dom";
import App from "./App/App";
import "./index.scss";
import * as serviceWorker from "./_setup/serviceWorker";
import PogodaDesignToolkitProvider from "./_DesignSystem/Toolkit/DesignSystem";

ReactDOM.render(
  <PogodaDesignToolkitProvider>
    <App />
  </PogodaDesignToolkitProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
