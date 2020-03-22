import React, { Component } from "react";
import loadable from "@loadable/component";

const Login = loadable(() => import(/* webpackChunkName: "Login" */ "../Login/Login"));
const Dashboard = loadable(() =>
  import(/* webpackChunkName: "Dashboard" */ "../Dashboard/Dashboard")
);

/**
 * Route Component which finds out whether the user has been logged in or not
 * This Component is currently nothing more than a stand-in dummy.
 *
 * @export
 * @class MainPage
 * @extends {Component}
 */
export default class MainPage extends Component {
  render() {
    const isLoggedIn =
      typeof window.userData !== "undefined" &&
      typeof window.userData.username !== "undefined";
    return isLoggedIn ? <Dashboard /> : <Login />;
  }
}
