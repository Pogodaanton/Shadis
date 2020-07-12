import React, { useContext } from "react";
import {
  FVSidebarFooterProps,
  FVSidebarFooterClassNameContract,
} from "./FVSidebarFooter.props";
import {
  DesignSystem,
  neutralForegroundRest,
  neutralLayerL2,
  neutralFillStealthHover,
} from "@microsoft/fast-components-styles-msft";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { Button, ButtonAppearance, isLoggedIn } from "../../../_DesignSystem";
import { FaDownload, FaLink, FaImage, FaVideo } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Hypertext } from "@microsoft/fast-components-react-msft";
import { designSystemContext } from "@microsoft/fast-jss-manager-react/dist/context";
import loadable from "@loadable/component";
import { IconType } from "react-icons/lib";
import FVSidebarConvertButton from "./FVSidebarConvertButton";
import { basePath } from "../../../_interceptedAxios";

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
      display: "flex",
      background: "transparent",
      fontWeight: "600",
      flex: "1 1 0px",
      padding: "45px 15px 45px 15px",
      flexDirection: "column",
      alignContent: "center",
      borderRadius: "0",
      "& > svg, & > div": {
        marginBottom: "12px",
        marginLeft: "8px",
        width: "25px",
        height: "25px",
      },
    },
  },
};

const overlapIconButtonStyles: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button__disabled: {},
  button: {
    "& > div": {
      position: "relative",
      "& > svg": {
        width: "25px",
        height: "25px",
        "&:last-child": {
          backgroundColor: neutralLayerL2,
          padding: "0px 2px",
          position: "absolute",
          width: "16px",
          height: "16px",
          right: "-8px",
          bottom: "-6px",
        },
      },
    },
    "&:hover:enabled, a&:not($button__disabled):hover": {
      "& > div > svg:last-child": {
        backgroundColor: neutralFillStealthHover,
      },
    },
  },
};

// Other possible color for later use:
// #1399dc

const OverlapIcon: (overlappingIcon: IconType) => IconType = Icon => props => (
  <div className={props.className}>
    <FaLink />
    <Icon />
  </div>
);

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
  const { t } = useTranslation(["fileview", "common"]);
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
        <Hypertext href="https://github.com/Pogodaanton/Shadis#readme">
          {t("common:hyperlinks.about")}
        </Hypertext>
        <Hypertext href="https://github.com/Pogodaanton/Shadis/raw/master/NOTICES">
          {t("common:hyperlinks.thirdParty")}
        </Hypertext>
        {/*}
        <Hypertext href={window.location.origin}>
          {t("common:hyperlinks.changeLanguage")}
        </Hypertext>
    {*/}
      </div>
      <div className={managedClasses.fv_sidebarFooter_buttons}>
        {isLoggedIn && <FVSidebarDeleteButton fileData={fileData} />}
        <Button
          appearance={ButtonAppearance.stealth}
          icon={FaDownload}
          href={`${basePath}/${fileData.id}.${fileData.extension}`}
          target="_blank"
          download
        >
          {t("download")}
        </Button>
        <Button
          jssStyleSheet={fileData.has_gif ? overlapIconButtonStyles : null}
          appearance={ButtonAppearance.stealth}
          icon={fileData.has_gif ? OverlapIcon(FaVideo) : FaLink}
          href={`${basePath}/${fileData.id}.${fileData.extension}`}
          target="_blank"
        >
          {fileData.has_gif ? t("sourceVideo") : t("source")}
        </Button>
        {fileData.has_gif ? (
          <Button
            jssStyleSheet={overlapIconButtonStyles}
            appearance={ButtonAppearance.stealth}
            icon={OverlapIcon(FaImage)}
            href={`${basePath}/${fileData.id}.gif`}
            target="_blank"
          >
            {t("sourceGif")}
          </Button>
        ) : (
          isLoggedIn &&
          fileData.extension === "mp4" && <FVSidebarConvertButton fileData={fileData} />
        )}
      </div>
    </footer>
  );
};

export default manageJss(styles)(FVSidebarFooter);
