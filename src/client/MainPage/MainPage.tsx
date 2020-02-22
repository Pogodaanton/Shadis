import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../Login/Login";

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
    return (
      <Switch>
        <Route>
          <Login />
        </Route>
      </Switch>
    );
  }
}
