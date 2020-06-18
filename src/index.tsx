import React from "react";
import ReactDOM from "react-dom";
import App from "./App/App";
import "./index.scss";
import "./i18n";
import PogodaDesignToolkitProvider from "./_DesignSystem/Toolkit/DesignSystem";
import { ToastProvider } from "react-toast-notifications";
import Toast from "./_DesignSystem/Toast/StaticToast/Toast";
import ToastContainer from "./_DesignSystem/Toast/ToastContainer/ToastContainer";
// import loadable from "@loadable/component";

//const Toast = loadable(() =>
//  import(/* webpackChunkName: "Toast" */ "./_DesignSystem/Toast/StaticToast/Toast")
//);
//const ToastContainer = loadable(() =>
//  import(
//    /* webpackChunkName: "Toast" */ "./_DesignSystem/Toast/ToastContainer/ToastContainer"
//  )
//);*/

ReactDOM.render(
  <PogodaDesignToolkitProvider>
    <ToastProvider
      autoDismiss={true}
      autoDismissTimeout={4500}
      components={{ Toast, ToastContainer }}
    >
      <App />
    </ToastProvider>
  </PogodaDesignToolkitProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// import * as serviceWorker from "./serviceWorker";
// serviceWorker.unregister();
