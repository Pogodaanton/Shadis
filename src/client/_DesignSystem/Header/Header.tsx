import React, { Component } from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL3 } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { parseColorHexARGB } from "@microsoft/fast-colors";
import { HeaderProps, HeaderClassNameContract } from "./Header.props";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { classNames } from "@microsoft/fast-web-utilities";

const styles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 12px",
    background: (designSystem: DesignSystem): string =>
      `linear-gradient(180deg, ${parseColorHexARGB(
        neutralLayerL3(designSystem) + "ff"
      ).toStringHexARGB()} 1%, ${parseColorHexARGB(
        neutralLayerL3(designSystem) + "00"
      ).toStringHexARGB()} 98%)`,
  },
  header_fixed: {
    position: "fixed",
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
        <Link to="/" alt="Go to Homepage">
          <Logo size="45" />
        </Link>
        <Paragraph size={2}>Shadis</Paragraph>
      </div>
    </header>
  );
};

export default manageJss(styles)(HeaderBase);
