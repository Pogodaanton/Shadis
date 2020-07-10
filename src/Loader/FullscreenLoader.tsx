import React from "react";
import loadable from "@loadable/component";
import {
  FullscreenLoadingIndicatorProps,
  FullscreenLoadingIndicatorClassNameContract,
} from "./FullscreenLoader.props";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { createPortal } from "react-dom";

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
    background: "rgba(0,0,0,0.6)",
    width: "100%",
    height: "100%",
    zIndex: "100",
    color: "white",
    top: "0",
    left: "0",
    "& span": {
      "font-size": "2em",
    },
  },
};

const FullscreenLoadingIndicator: React.ComponentType<FullscreenLoadingIndicatorProps> = ({
  managedClasses,
}) => {
  return createPortal(
    <div className={managedClasses.fsLoaderBackdrop}>
      <span>Loading...</span>
    </div>,
    document.body
  );
};

const StyledFullscreenLoadingIndicator = manageJss(styles)(FullscreenLoadingIndicator);

export const FullscreenLoader = <T extends unknown>(promise: Promise<any>) =>
  loadable<T>(() => promise, {
    fallback: <StyledFullscreenLoadingIndicator />,
  });
