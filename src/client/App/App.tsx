import React, { Suspense } from "react";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { BrowserRouter as Router, Route } from "react-router-dom";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { AppContainerClassNameContract, AppContainerProps } from "./App.props";
import AnimatedRoutes from "./AnimatedRoutes";

const styles: ComponentStyles<AppContainerClassNameContract, DesignSystem> = {
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

class AppContainer extends React.Component<AppContainerProps> {
  public render = (): React.ReactNode => (
    <Background className={this.props.managedClasses.container} value={neutralLayerL1}>
      <Router>
        <Suspense fallback={null}>
          <Route path={["/:id", "/"]} render={props => <AnimatedRoutes {...props} />} />
        </Suspense>
      </Router>
    </Background>
  );
}

export default manageJss(styles)(AppContainer);
