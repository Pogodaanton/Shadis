import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ToastContainerProps as OriginalToastContainerProps } from "react-toast-notifications";

/**
 * Class name contract for the ToastContainer component
 */
export interface ToastContainerClassNameContract {
  toast_container: string;
}

/**
 * Props for the ToastContainer component
 */
export interface ToastContainerProps
  extends ManagedClasses<ToastContainerClassNameContract>,
    OriginalToastContainerProps {}
