import React from "react";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FullscreenLoader } from "../Loader";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { AppClassNameContract, AppProps } from "./App.props";
import MainPage from "../MainPage/MainPage";

const NotFound = FullscreenLoader(
  import(/* webpackChunkName: "NotFound" */ "../NotFound/NotFound")
);
const View = FullscreenLoader(import(/* webpackChunkName: "View" */ "../View/View"));

const styles: ComponentStyles<AppClassNameContract, DesignSystem> = {
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100%",
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
          <Route path="/" exact component={MainPage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Background>
  );
}

export default manageJss(styles)(App);
