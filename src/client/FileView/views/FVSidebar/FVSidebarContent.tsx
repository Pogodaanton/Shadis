import React, { memo } from "react";
import {
  FVSidebarContentProps,
  FVSidebarContentClassNameContract,
} from "./FVSidebarContent.props";
import {
  DesignSystem,
  neutralFillRest,
  neutralForegroundRest,
  neutralForegroundActive,
  neutralForegroundHint,
  neutralForegroundHover,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  Typography,
  TypographyTag,
  TypographySize,
} from "@microsoft/fast-components-react-msft";
import { useTranslation } from "react-i18next";

const styles: ComponentStyles<FVSidebarContentClassNameContract, DesignSystem> = {
  fv_sidebarContent: {
    padding: "20px 25px",
  },
  fv_sidebarContent_list: {
    margin: "0",
    fontSize: "14px",
    "& > dt": {
      color: neutralForegroundRest,
      fontWeight: "600",
      marginBottom: "4px",
    },
    "& > dd": {
      color: neutralForegroundHover,
      fontWeight: "400",
      marginLeft: "0",
      marginBottom: "20px",
    },
  },
};

const FVSidebarContent: React.ComponentType<FVSidebarContentProps> = memo(
  ({ managedClasses, fileData }) => {
    const { t } = useTranslation("fileview");
    const uploaded = new Date(fileData.timestamp * 1000);

    return (
      <div className={managedClasses.fv_sidebarContent}>
        <dl className={managedClasses.fv_sidebarContent_list}>
          <dt>{t("description")}:</dt>
          <dd>{fileData.title === "untitled" ? "-" : fileData.title}</dd>
          <dt>{t("width")}:</dt>
          <dd>{fileData.width}</dd>
          <dt>{t("height")}:</dt>
          <dd>{fileData.height}</dd>
          <dt>{t("format")}:</dt>
          <dd>{fileData.extension}</dd>
          <dt>{t("uploaded")}:</dt>
          <dd>
            {uploaded.toLocaleDateString()} {uploaded.toLocaleTimeString()}
          </dd>
        </dl>
      </div>
    );
  }
);

export default manageJss(styles)(FVSidebarContent);
