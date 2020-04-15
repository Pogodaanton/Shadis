import React from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralLayerL3,
  neutralLayerL1,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { HeaderProps, HeaderClassNameContract } from "./Header.props";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { classNames } from "@microsoft/fast-web-utilities";
import { applyBackdropBackground } from "../utilities";

/**
 * Generates an acrylic backdrop as well as a gradient background.
 */
const applyBackdropGradient = applyBackdropBackground(
  (opacityHex: string) => (designSystem: DesignSystem): string =>
    `linear-gradient(180deg, ${parseColorHexRGBA(
      neutralLayerL3(designSystem) + "ff"
    ).toStringWebRGBA()} 1%, ${parseColorHexRGBA(
      neutralLayerL1(designSystem) + opacityHex
    ).toStringWebRGBA()} 98%)`
);

const styles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 12px",
    boxSizing: "border-box",
    ...applyBackdropGradient,
  },
  header__fixed: {
    position: "fixed",
    zIndex: "1",
    "& ~ *": {
      paddingTop: "64px",
    },
  },
  header__absolute: {
    position: "absolute",
    zIndex: "1",
  },
  header_left: {
    display: "flex",
    alignItems: "center",
    "&> *": {
      marginRight: "7px",
    },
  },
  header_center: {
    position: "absolute",
    left: "0",
    right: "0",
    zIndex: "-1",
    margin: "auto",
    maxWidth: "50%",
    maxHeight: "70%",
    overflow: "hidden",
    textAlign: "center",
  },
};

const HeaderBase: React.FC<HeaderProps> = props => {
  return (
    <header
      className={classNames(
        props.managedClasses.header,
        [props.managedClasses.header__fixed, props.position === "fixed"],
        [props.managedClasses.header__absolute, props.position === "absolute"]
      )}
    >
      <div className={props.managedClasses.header_left}>
        <Link to="/">
          <Logo size="45" alt="Go to Homepage" />
        </Link>
        <Paragraph size={2}>Shadis</Paragraph>
        {props.leftContent || null}
      </div>
      {props.centerContent && (
        <div
          className={props.managedClasses.header_center}
          children={props.centerContent}
        />
      )}
      {props.rightSideContent && (
        <div
          className={props.managedClasses.header_right}
          children={props.rightSideContent}
        />
      )}
    </header>
  );
};

export default manageJss(styles)(HeaderBase);
