import React from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralLayerL3,
  neutralLayerL1,
  acrylicNoise,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { HeaderProps, HeaderClassNameContract, CustomApplyAcrylic } from "./Header.props";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { classNames } from "@microsoft/fast-web-utilities";
import { applyAcrylic } from "@microsoft/fast-jss-utilities";

/**
 * Generates an acrylic backdrop as well as a gradient background.
 */
const applyBackdropBackground = (): CSSRules<DesignSystem> => {
  /**
   * Takes care of generating the gradient.
   *
   * @param opacityHex Opacity value of bottom color in Hexadecimal (2 chars)
   */
  const background = (opacityHex: string) => (designSystem: DesignSystem): string =>
    `linear-gradient(180deg, ${parseColorHexRGBA(
      neutralLayerL3(designSystem) + "ff"
    ).toStringWebRGBA()} 1%, ${parseColorHexRGBA(
      neutralLayerL1(designSystem) + opacityHex
    ).toStringWebRGBA()} 98%)`;

  /**
   * We need to redeclare the type since it does not allow a function as backgroundColor
   * even though that should work fine.
   */
  const customApplyAcrylic: CustomApplyAcrylic<DesignSystem> = applyAcrylic;
  return customApplyAcrylic({
    textureImage: acrylicNoise,
    backgroundColor: background("b0"),
    fallbackBackgroundColor: background("f7"),
  });
};

const styles: ComponentStyles<HeaderClassNameContract, DesignSystem> = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 12px",
    ...applyBackdropBackground(),
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
