import React from "react";
import { ToastManagerProps, ToastManagerClassNameContract } from "./ToastManager.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { useToastContainer } from "react-toastify";
import Toast from "../Toast/Toast";
import { ToastContainer } from "react-toastify";
import { createPortal } from "react-dom";
import Transition from "../Transition/Transition";
import { classNames } from "@microsoft/fast-web-utilities";
// import { ToastPositioner } from 'react-toastify/dist/components/ToastPositioner'

const styles: ComponentStyles<ToastManagerClassNameContract, DesignSystem> = {
  // Do note that this implementation hard-codes the "position" option from react-toastify
  toastManager: {
    boxSizing: "border-box",
    maxHeight: "100%",
    //overflowX: "hidden",
    //overflowY: "auto",
    padding: "8px",
    //pointerEvents: "none",
    position: "fixed",
    zIndex: "1000",
    top: "64px",
    right: "0",
  },
};

/**
 * A custom container for react-toastify toasts. This method allows
 * the usage of a custom Toast component, too. We need this in order to
 * style and arrange the toasts properly.
 */
const ToastManager: React.ComponentType<ToastManagerProps> = props => {
  const { containerId, managedClasses } = props;
  const { getToastToRender, containerRef, isToastActive } = useToastContainer(props);

  return createPortal(
    <div
      ref={containerRef}
      className={classNames("toastManager", managedClasses.toastManager)}
      id={containerId as string}
    >
      {getToastToRender((position, toastList) =>
        toastList.map(({ props: toastProps, content }) => (
          <Toast
            {...toastProps}
            content={content as any}
            in={isToastActive(toastProps.toastId)}
            key={`toast-${toastProps.key}`}
            closeButton={!!toastProps.closeButton ? null : toastProps.closeButton}
          />
        ))
      )}
    </div>,
    document.body
  );
};

ToastManager.defaultProps = ToastContainer.defaultProps as any;
ToastManager.defaultProps.transition = Transition;
ToastManager.defaultProps.closeOnClick = false;

export default manageJss(styles)(ToastManager);
