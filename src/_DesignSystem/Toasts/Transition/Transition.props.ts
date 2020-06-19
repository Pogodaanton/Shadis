import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ToastTransitionProps as OrigTransitionProps } from "react-toastify/dist/types";

/**
 * Class name contract for the component
 */
export interface ToastTransitionClassNameContract {
  transition__enter: string;
  transition__exit: string;
}

/**
 * Props for the component
 */
export interface ToastTransitionProps
  extends ManagedClasses<ToastTransitionClassNameContract>,
    OrigTransitionProps {}
