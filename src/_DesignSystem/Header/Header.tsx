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
import { applyBackdropBackground } from "../Utils/stylesheetModifiers";
import { useTranslation } from "react-i18next";

/**
 * Hardcoded height of the header.
 */
export const headerHeight: number = 64;

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
    height: headerHeight + "px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0 12px",
    boxSizing: "border-box",
    justifyContent: "space-between",
    ...applyBackdropGradient,
  },
  header__fixed: {
    position: "fixed",
    zIndex: "1",
    "& ~ *": {
      paddingTop: headerHeight + "px",
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
  header_right: {
    textAlign: "right",
    marginRight: "3px",
  },
  "@media (max-width: 1000px)": {
    header_center: {
      position: "initial",
    },
  },
  "@media (max-width: 690px)": {
    header_center: {
      display: "none",
    },
  },
};

const HeaderBase: React.FC<HeaderProps> = props => {
  const { t } = useTranslation("common");
  return (
    <header
      className={classNames(
        props.managedClasses.header,
        [props.managedClasses.header__fixed, props.position === "fixed"],
        [props.managedClasses.header__absolute, props.position === "absolute"]
      )}
    >
      <div className={"header-left " + props.managedClasses.header_left}>
        <Link to="/" title={t("gotoDashboard")}>
          <Logo size="45" alt={t("gotoDashboard")} />
        </Link>
        <Paragraph size={2}>Shadis</Paragraph>
        {props.leftContent || null}
      </div>
      {props.centerContent && (
        <div
          className={"header-center " + props.managedClasses.header_center}
          children={props.centerContent}
        />
      )}
      {props.rightSideContent && (
        <div
          className={"header-right " + props.managedClasses.header_right}
          children={props.rightSideContent}
        />
      )}
    </header>
  );
};

export default manageJss(styles)(HeaderBase);
