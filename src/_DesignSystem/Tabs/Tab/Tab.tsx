import React from "react";
import {
  DesignSystem,
  neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { Tab as BaseTab } from "@microsoft/fast-components-react-base";
import { TabProps, TabClassNameContract } from "./Tab.props";

const styles: ComponentStyles<TabClassNameContract, DesignSystem> = {
  tab: {
    color: neutralForegroundRest,
    margin: "0px 10px",
    padding: "5px 0 3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  tab__active: {
    cursor: "default",
  },
  tab_title: {},
  tab_icon: {
    marginRight: "5px",
  },
};

/**
 * Custom tab element containing an optional icon prop
 */
const Tab: React.ComponentType<TabProps> = ({
  icon: Icon,
  children,
  managedClasses: { tab_title, tab_icon, ...managedClasses },
  ...props
}) => (
  <BaseTab {...props} managedClasses={managedClasses}>
    {Icon && <Icon className={tab_icon} tabIndex={-1} />}
    <span className={tab_title} tabIndex={-1}>
      {children}
    </span>
  </BaseTab>
);

export default manageJss(styles)(Tab);
