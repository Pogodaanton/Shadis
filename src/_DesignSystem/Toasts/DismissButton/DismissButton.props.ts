import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CloseButtonProps } from "react-toastify/dist/components";

/**
 * Class name contract for the component
 */
export interface DismissButtonClassNameContract {
  dismissButton: string;
}

/**
 * Props for the component
 */
export interface DismissButtonProps
  extends ManagedClasses<DismissButtonClassNameContract>,
    CloseButtonProps {}
