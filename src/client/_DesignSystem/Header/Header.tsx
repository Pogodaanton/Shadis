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
  header_fixed: {
    position: "fixed",
    zIndex: "1",
    "& ~ *": {
      paddingTop: "64px",
    },
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    "&> *": {
      marginRight: "7px",
    },
  },
};

const HeaderBase: React.FC<HeaderProps> = props => {
  return (
    <header
      className={classNames(props.managedClasses.header, [
        props.managedClasses.header_fixed,
        props.fixed,
      ])}
    >
      <div className={props.managedClasses.headerLeft}>
        <Link to="/">
          <Logo size="45" alt="Go to Homepage" />
        </Link>
        <Paragraph size={2}>Shadis</Paragraph>
      </div>
    </header>
  );
};

export default manageJss(styles)(HeaderBase);
