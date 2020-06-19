import React, { useMemo } from "react";
import {
  ToastTransitionProps,
  ToastTransitionClassNameContract,
} from "./Transition.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { cssTransition } from "react-toastify";

const styles: ComponentStyles<ToastTransitionClassNameContract, DesignSystem> = {
  transition__enter: {
    animationName: "transition__slideIn",
  },
  transition__exit: {
    animationName: "transition__out",
  },
  "@keyframes transition__slideIn": {
    from: {
      transform: "translate3d(110%, 0, 0)",
      visibility: "visible",
    },
    to: {
      transform: "translate3d(0%, 0, 0)",
    },
  },
  "@keyframes transition__bounceIn": {
    "from, 60%, 75%, 90%, to": {
      animationTimingFunction: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
    },
    from: {
      opacity: "0",
      transform: "translate3d(3000px, 0, 0)",
    },
    "60%": {
      opacity: "1",
      transform: "translate3d(-25px, 0, 0)",
    },
    "75%": {
      transform: "translate3d(10px, 0, 0)",
    },
    "90%": {
      transform: "translate3d(-5px, 0, 0)",
    },
    to: {
      transform: "none",
    },
  },
  "@keyframes transition__out": {
    from: {
      opacity: "1",
    },
    "80%": {
      opacity: "0",
      transform: "scale3d(0.3, 0.3, 0.3)",
    },
    to: {
      opacity: "0",
    },
  },
};

const ToastTransition: React.ComponentType<ToastTransitionProps> = ({
  managedClasses,
  ...props
}) => {
  const Transition = useMemo(
    () =>
      cssTransition({
        enter: managedClasses.transition__enter,
        exit: managedClasses.transition__exit,
        duration: 300,
      }),
    [managedClasses.transition__enter, managedClasses.transition__exit]
  );

  return <Transition {...props} />;
};

export default manageJss(styles)(ToastTransition);
