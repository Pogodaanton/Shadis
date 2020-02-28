import React from "react";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { AppClassNameContract, AppProps } from "./App.props";
import MainPage from "../MainPage/MainPage";

const NotFound = loadable(() =>
  import(/* webpackChunkName: "404" */ "../NotFound/NotFound")
);
const View = loadable(() => import(/* webpackChunkName: "View" */ "../View/View"));

const styles: ComponentStyles<AppClassNameContract, DesignSystem> = {
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    "& > div": {
      flexGrow: "1",
    },
  },
};

class App extends React.Component<AppProps> {
  public render = (): React.ReactNode => (
    <Background className={this.props.managedClasses.container} value={neutralLayerL1}>
      <Router>
        <Switch>
          <Route path="/404" component={NotFound} />
          <Route path="/:id" component={View} />
          <Route component={MainPage} />
        </Switch>
      </Router>
    </Background>
  );
}

export default manageJss(styles)(App);
