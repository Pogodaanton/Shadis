import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ProgressIconClassNameContract, ProgressIconProps } from "./ProgressIcon.props";
import {
  DesignSystem,
  neutralForegroundRest,
  accentFillRest,
} from "@microsoft/fast-components-styles-msft";
import { FunctionComponent } from "react";
import React from "react";
import { applyCenteredFlexbox } from "../utilities";

const styles: ComponentStyles<ProgressIconClassNameContract, DesignSystem> = {
  progressIconContainer: {
    ...applyCenteredFlexbox(),
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    background: accentFillRest,
  },
  progressIcon: {
    color: neutralForegroundRest,
  },
};

const ProgressIcon: FunctionComponent<ProgressIconProps> = props => {
  return (
    <div className={props.managedClasses.progressIconContainer}>
      <props.icon className={props.managedClasses.progressIcon} />
    </div>
  );
};

export default manageJss(styles)(ProgressIcon);
