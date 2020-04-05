import React from "react";
import {
  DashboardListToolbarProps,
  DashboardListToolbarClassNameContract,
} from "./DashboardListToolbar.props";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Button, ButtonAppearance } from "../../_DesignSystem";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { classNames } from "@microsoft/fast-web-utilities";

const styles: ComponentStyles<DashboardListToolbarClassNameContract, DesignSystem> = {
  dashboardListToolbar: {
    position: "fixed",
    top: "0",
    left: "50%",
    zIndex: "3",
    transform: "translateX(-50%) translateY(-100%)",
    transition: "transform .2s cubic-bezier(0.9, 0.1, 1, 0.2)",
  },
  dashboardListToolbar__visible: {
    transform: "translateX(-50%) translateY(15px)",
    transition: "transform .2s cubic-bezier(0.1, 0.9, 0.2, 1)",
  },
};

const DahboardListToolbar: React.FC<DashboardListToolbarProps> = props => {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className={classNames(props.managedClasses.dashboardListToolbar, [
        props.managedClasses.dashboardListToolbar__visible,
        props.visible,
      ])}
    >
      <Button
        icon={FaTrash}
        appearance={ButtonAppearance.justified}
        onClick={props.onDelete}
      >
        {t("deleteItems")}
      </Button>
    </div>
  );
};

export default manageJss(styles)(DahboardListToolbar);
