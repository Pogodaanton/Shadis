import React, { useContext } from "react";
import {
  FVSidebarFooterProps,
  FVSidebarFooterClassNameContract,
} from "./FVSidebarFooter.props";
import {
  DesignSystem,
  neutralForegroundRest,
  neutralLayerL2,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { Button, ButtonAppearance, isLoggedIn } from "../../../_DesignSystem";
import { FaDownload, FaExternalLinkSquareAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Hypertext } from "@microsoft/fast-components-react-msft";
import { designSystemContext } from "@microsoft/fast-jss-manager-react/dist/context";
import loadable from "@loadable/component";

const FVSidebarDeleteButton = loadable(() => import("./FVSidebarDeleteButton"));

const styles: ComponentStyles<FVSidebarFooterClassNameContract, DesignSystem> = {
  fv_sidebarFooter: {
    display: "flex",
    flexDirection: "column",
  },
  fv_sidebarFooter_links: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px 15px 10px 15px",
    flexWrap: "wrap",
    "& > a::before": {
      content: "'•'",
      pointerEvents: "none",
      paddingLeft: "5px",
      paddingRight: "5px",
      color: neutralForegroundRest,
      borderBottom: "1px solid",
      borderBottomColor: neutralLayerL2,
    },
    "& > *:first-child::before": {
      display: "none",
    },
  },
  fv_sidebarFooter_buttons: {
    display: "flex",
    fontSize: "14px",
    "& > button, & > a": {
      background: "transparent",
      fontWeight: "600",
      flexGrow: "1",
      padding: "45px 15px 45px 15px",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      borderRadius: "0",
      "& > svg": {
        marginBottom: "12px",
        marginLeft: "8px",
        width: "25px",
        height: "25px",
      },
    },
  },
};

// Other possible color for later use:
// #1399dc

/**
 * Footer part of FVSidebar.
 *
 * It consists of a Hyperlink and a Button row,
 * former used to access generic routes,
 * latter used to execute an action.
 */
const FVSidebarFooter: React.ComponentType<FVSidebarFooterProps> = ({
  managedClasses,
  fileData,
}) => {
  const { t } = useTranslation("fileview");
  const desCtx = useContext(designSystemContext) as DesignSystem;

  return (
    <footer
      className={managedClasses.fv_sidebarFooter}
      style={{
        // We do this, so the component updates on theme change
        background: neutralLayerL2(desCtx),
      }}
    >
      <div className={managedClasses.fv_sidebarFooter_links}>
        {/**
         * TODO: This is still a filler, it needs to be finalised.
         */}
        <Hypertext href={window.location.origin}>
          {isLoggedIn ? "Dashboard" : "Login"}
        </Hypertext>
        <Hypertext href={window.location.origin}>About</Hypertext>
        <Hypertext href={window.location.origin}>Third-Party Notices</Hypertext>
      </div>
      <div className={managedClasses.fv_sidebarFooter_buttons}>
        {isLoggedIn && <FVSidebarDeleteButton fileData={fileData} />}
        <Button
          appearance={ButtonAppearance.stealth}
          icon={FaDownload}
          href={`${window.location.origin}/${fileData.id}.${fileData.extension}`}
          target="_blank"
          download
        >
          {t("download")}
        </Button>
        <Button
          appearance={ButtonAppearance.stealth}
          icon={FaExternalLinkSquareAlt}
          href={`${window.location.origin}/${fileData.id}.${fileData.extension}`}
          target="_blank"
        >
          {t("source")}
        </Button>
      </div>
    </footer>
  );
};

export default manageJss(styles)(FVSidebarFooter);
