import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ToastProps as OriginalToastProps } from "react-toast-notifications";

/**
 * Class name contract for the Toast component
 */
export interface ToastClassNameContract {
  toast_element: string;
  toast_title: string;
  toast_content: string;
}

/**
 * Props for the Toast component
 */
export interface ToastProps
  extends ManagedClasses<ToastClassNameContract>,
    OriginalToastProps {
  title: string;
}
