import React from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { DesignSystem, neutralLayerL4 } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { parseColorHexARGB } from "@microsoft/fast-colors";
import { HeaderProps, HeaderClassNameContract } from "./Header.props";

const styles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    background: (designSystem: DesignSystem): string =>
      `linear-gradient(180deg, ${parseColorHexARGB(
        neutralLayerL4(designSystem) + "ff"
      ).toStringHexARGB()} 0%, ${parseColorHexARGB(
        neutralLayerL4(designSystem) + "ff"
      ).toStringHexARGB()} 1%, ${parseColorHexARGB(
        neutralLayerL4(designSystem) + "00"
      ).toStringHexARGB()} 100%)`,
  },
};

class HeaderBase extends React.Component<HeaderProps> {
  public render = (): React.ReactNode => (
    <header className={this.props.managedClasses.header}>
      <Paragraph size={1}>Lorem ipsum, dolor sit amet, etc.</Paragraph>
    </header>
  );
}

export const Header: React.ComponentClass = manageJss(styles)(HeaderBase);
