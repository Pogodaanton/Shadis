import React from "react";
import { DefaultToast } from "react-toast-notifications";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DesignSystem,
  neutralLayerFloating,
  applyElevation,
  ElevationMultiplier,
  applyFloatingCornerRadius,
  neutralForegroundRest,
  applyFontWeightBold,
} from "@microsoft/fast-components-styles-msft";
import { ToastProps, ToastClassNameContract } from "./Toast.props";
import { useTranslation } from "react-i18next";

const toastStyles: ComponentStyles<ToastClassNameContract, DesignSystem> = {
  toast_element: {
    "& > div > div": {
      alignItems: "center",
      backgroundColor: (des: DesignSystem) => neutralLayerFloating(des),
      ...applyFloatingCornerRadius(),
      ...applyElevation(ElevationMultiplier.e9),
      "& > .react-toast-notifications__toast__icon-wrapper": {
        "border-top-left-radius": "0",
        "border-bottom-left-radius": "0",
        "padding-left": "5px",
        "padding-right": "5px",
        "& > .react-toast-notifications__toast__countdown": {
          backgroundColor: "rgba(0,0,0,0.12)",
        },
      },
      "& > .react-toast-notifications__toast__content": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        lineHeight: "1.2",
      },
      "& > .react-toast-notifications__toast__dismiss-button": {
        color: (des: DesignSystem) => neutralForegroundRest(des),
      },
    },
  },
  toast_title: {
    color: (des: DesignSystem) => neutralForegroundRest(des),
    ...applyFontWeightBold(),
  },
  toast_content: {
    color: (des: DesignSystem) => neutralForegroundRest(des),
  },
};

const BaseToast = (props: ToastProps) => {
  const { t } = useTranslation("common");

  let defaultToastProps = { ...props };
  delete defaultToastProps.managedClasses;
  delete defaultToastProps.title;

  defaultToastProps.appearance = props.appearance || "info";

  const title = () => {
    switch (props.appearance) {
      case "error":
        return t("notification.error");
      case "warning":
        return t("notification.warning");
      default:
        return t("notification.info");
    }
  };

  return (
    <div className={props.managedClasses.toast_element}>
      <DefaultToast {...defaultToastProps}>
        <span className={props.managedClasses.toast_title}>{props.title || title()}</span>
        <span
          className={props.managedClasses.toast_content}
          data-content={typeof props.children === "string" ? props.children : ""}
        >
          {props.children}
        </span>
      </DefaultToast>
    </div>
  );
};

export default manageJss(toastStyles)(BaseToast);
