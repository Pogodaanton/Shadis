import React from "react";
import { DefaultToastContainer } from "react-toast-notifications";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import {
  ToastContainerProps,
  ToastContainerClassNameContract,
} from "./ToastContainer.props";

const toastContainerStyles: ComponentStyles<
  ToastContainerClassNameContract,
  DesignSystem
> = {
  toast_container: {
    "& > div": {
      overflowY: "visible",
      overflowX: "visible",
    },
  },
};

const BaseToastContainer = (props: ToastContainerProps) => {
  let defaultToastContainerProps = { ...props };
  delete defaultToastContainerProps.managedClasses;

  return (
    <div className={props.managedClasses.toast_container}>
      <DefaultToastContainer {...defaultToastContainerProps}>
        {props.children}
      </DefaultToastContainer>
    </div>
  );
};

export default manageJss(toastContainerStyles)(BaseToastContainer);
