import React from "react";
import { CountdownProps, CountdownClassNameContract } from "./Countdown.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";

const styles: ComponentStyles<CountdownClassNameContract, DesignSystem> = {
  toastCountdown: {
    animationName: "toast-countdown",
    animationTimingFunction: "linear",
    backgroundColor: "rgba(0,0,0,0.2)",
    bottom: "0",
    height: "0",
    left: "0",
    position: "absolute",
    width: "100%",
  },
  "@keyframes toast-countdown": {
    from: {
      height: "100%",
    },
    to: {
      height: "0%",
    },
  },
};

const Countdown: React.ComponentType<CountdownProps> = ({
  managedClasses,
  closeToast,
  isRunning,
  delay,
  hide,
  style: userStyle,
  isIn,
  className,
}) => {
  return (
    <div
      className={classNames(managedClasses.toastCountdown, className)}
      style={{
        ...userStyle,
        animationDuration: `${delay}ms`,
        animationPlayState: isRunning ? "running" : "paused",
        opacity: hide ? 0 : 1,
      }}
      onAnimationEnd={() => {
        isIn && closeToast();
      }}
    />
  );
};

Countdown.defaultProps = {
  type: "default",
  hide: false,
};

export default manageJss(styles)(Countdown);
