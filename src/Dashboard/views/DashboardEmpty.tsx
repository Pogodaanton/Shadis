import React from "react";
import { Heading, HeadingTag } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DashboardEmptyClassNameContract,
  DashboardEmptyProps,
} from "./DashboardEmpty.props";
import { FaFolderOpen } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const styles: ComponentStyles<DashboardEmptyClassNameContract, DesignSystem> = {
  dashboardEmpty: {
    position: "fixed",
    width: "100%",
    height: "100%",
    display: "flex",
    top: "-64px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: "0.3",
  },
  dashboardEmptyIcon: {
    fontSize: "4em",
    color: (designSystem: DesignSystem): string => neutralForegroundRest(designSystem),
  },
};

const DashboardEmpty: React.FC<DashboardEmptyProps> = React.memo(props => {
  const { t } = useTranslation("dashboard");

  return (
    <div className={props.managedClasses.dashboardEmpty}>
      <FaFolderOpen className={props.managedClasses.dashboardEmptyIcon} />
      <Heading tag={HeadingTag.h1} size={2}>
        {t("emptyTitle")}
      </Heading>
      <Heading tag={HeadingTag.h2} size={5}>
        {t("emptyDescription")}
      </Heading>
    </div>
  );
});

export default manageJss(styles)(DashboardEmpty);
