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

const styles: ComponentStyles<DashboardEmptyClassNameContract, DesignSystem> = {
  dashboardEmpty: {
    display: "flex",
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

const DashboardEmpty: React.FC<DashboardEmptyProps> = props => {
  return (
    <div className={props.managedClasses.dashboardEmpty}>
      <FaFolderOpen className={props.managedClasses.dashboardEmptyIcon} />
      <Heading tag={HeadingTag.h1} size={2}>
        You haven't uploaded anything yet!
      </Heading>
      <Heading tag={HeadingTag.h2} size={5}>
        You can drag-and-drop an image into here in order to upload it.
      </Heading>
    </div>
  );
};

export default manageJss(styles)(DashboardEmpty);
