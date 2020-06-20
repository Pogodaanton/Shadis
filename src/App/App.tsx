import React, { Suspense } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
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

//const VideoGifGenerator: LoadableComponent<{}> = loadable(() =>
//  import(
//    /* webpackChunkName: "VideoGifGenerator" */ "../_Workers/VideoGifGenerator/VideoGifGenerator"
//  )
//);

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
  <div className={managedClasses.container}>
    <Router>
      <Suspense fallback={null}>
        <Route path={["/:id", "/"]} component={AnimatedRoutes} />
      </Suspense>
    </Router>
    {isLoggedIn && <VideoThumbnailGenerator />}
    {/*isLoggedIn && <VideoGifGenerator />*/}
  </div>
);

export default manageJss(styles)(AppContainer);
