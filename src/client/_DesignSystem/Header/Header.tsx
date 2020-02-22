import React, { Component } from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL3 } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { parseColorHexARGB } from "@microsoft/fast-colors";
import { HeaderProps, HeaderClassNameContract } from "./Header.props";
import Logo from "../Assets/Logo";
import { Link } from "react-router-dom";

const styles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    background: (designSystem: DesignSystem): string =>
      `linear-gradient(180deg, ${parseColorHexARGB(
        neutralLayerL3(designSystem) + "ff"
      ).toStringHexARGB()} 1%, ${parseColorHexARGB(
        neutralLayerL3(designSystem) + "00"
      ).toStringHexARGB()} 98%)`,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    "&> *": {
      marginRight: "7px",
    },
  },
};

class HeaderBase extends Component<HeaderProps> {
  public render = (): React.ReactNode => (
    <header className={this.props.managedClasses.header}>
      <div className={this.props.managedClasses.headerLeft}>
        <Link to="/" alt="Go to Homepage">
          <Logo size="45" />
        </Link>
        <Paragraph size={2}>Shadis</Paragraph>
      </div>
    </header>
  );
}

export default manageJss(styles)(HeaderBase);
