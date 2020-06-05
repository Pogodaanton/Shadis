import React, { Suspense } from "react";
import { Background } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { BrowserRouter as Router, Route } from "react-router-dom";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { AppContainerClassNameContract, AppContainerProps } from "./App.props";
import AnimatedRoutes from "./AnimatedRoutes";
import loadable, { LoadableComponent } from "@loadable/component";
import { isLoggedIn } from "../_DesignSystem";

const VideoThumbnailGenerator: LoadableComponent<{}> = loadable(() =>
  import(
    /* webpackChunkName: "VideoThumbnailGenerator" */ "../_Workers/VideoThumbnailGenerator/VideoThumbnailGenerator"
  )
);

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

const AppContainer: React.ComponentType<AppContainerProps> = ({ managedClasses }) => (
  <Background className={managedClasses.container} value={neutralLayerL1}>
    <Router>
      <Suspense fallback={null}>
        <Route path={["/:id", "/"]} component={AnimatedRoutes} />
      </Suspense>
    </Router>
    {isLoggedIn && <VideoThumbnailGenerator />}
  </Background>
);

export default manageJss(styles)(AppContainer);
