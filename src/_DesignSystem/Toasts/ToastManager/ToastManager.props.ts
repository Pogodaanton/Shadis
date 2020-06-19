import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ToastContainerProps } from "react-toastify";

/**
 * Class name contract for the component
 */
export interface ToastManagerClassNameContract {
  toastManager: string;
}

/**
 * Props for the component
 */
export interface ToastManagerProps
  extends ManagedClasses<ToastManagerClassNameContract>,
    ToastContainerProps {}
