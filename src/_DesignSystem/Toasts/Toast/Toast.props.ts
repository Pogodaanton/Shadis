import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ToastProps as OriginalToastProps, TypeOptions } from "react-toastify";

/**
 * Class name contract for the component
 */
export interface ToastClassNameContract {
  toast: string;
  toast__info?: string;
  toast__success?: string;
  toast__warning?: string;
  toast__error?: string;
  toast__default?: string;
  toast_icon: string;
  toast_text: string;
  toast_progress: string;
}

export type ToastGlyphList = {
  [K in TypeOptions]: React.ComponentType;
};

/**
 * Props for the component
 */
export interface ToastProps
  extends ManagedClasses<ToastClassNameContract>,
    OriginalToastProps {
  content?: React.ComponentType<ToastProps>;
}
