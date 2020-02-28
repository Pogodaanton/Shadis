import React from "react";
import loadable from "@loadable/component";
import {
  FullscreenLoadingIndicatorProps,
  FullscreenLoadingIndicatorClassNameContract,
} from "./FullscreenLoader.props";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64 } from "@microsoft/fast-colors";

const styles: ComponentStyles<
  FullscreenLoadingIndicatorClassNameContract,
  DesignSystem
> = {
  fsLoaderBackdrop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    background: new ColorRGBA64(0, 0, 0, 0.6).toStringWebRGBA(),
    width: "100%",
    height: "100%",
    "& span": {
      "font-size": "2em",
    },
  },
};

class FullscreenLoadingIndicator extends React.Component<
  FullscreenLoadingIndicatorProps
> {
  render(): JSX.Element {
    return (
      <div className={this.props.managedClasses.fsLoaderBackdrop}>
        <span>Loading...</span>
      </div>
    );
  }
}

const StyledFullscreenLoadingIndicator = manageJss(styles)(FullscreenLoadingIndicator);

export const FullscreenLoader = (promise: Promise<any>) =>
  loadable(() => promise, {
    fallback: <StyledFullscreenLoadingIndicator />,
  });
