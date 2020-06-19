import React from "react";
import {
  DismissButtonProps,
  DismissButtonClassNameContract,
} from "./DismissButton.props";
import {
  DesignSystem,
  neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { FaTimes } from "react-icons/fa";

const styles: ComponentStyles<DismissButtonClassNameContract, DesignSystem> = {
  dismissButton: {
    color: neutralForegroundRest,
    cursor: "pointer",
    flexShrink: "0",
    opacity: "0.5",
    padding: "8px 12px",
    transition: "opacity .15s",
    background: "none",
    border: "none",
    "&:hover, &.focus-visible:focus": {
      opacity: "1",
    },
    "&:focus:not(.focus-visible)": {
      outline: "none",
    },
  },
};

const DismissButton: React.ComponentType<DismissButtonProps> = ({
  managedClasses,
  closeToast,
  ariaLabel = "close",
}) => (
  <button
    className={managedClasses.dismissButton}
    type="button"
    onClick={e => {
      e.stopPropagation();
      closeToast(e);
    }}
    aria-label={ariaLabel}
  >
    <FaTimes />
  </button>
);

export default manageJss(styles)(DismissButton);
