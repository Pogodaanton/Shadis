import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { ProgressBarProps } from "react-toastify/dist/components";

/**
 * Class name contract for the component
 */
export interface CountdownClassNameContract {
  toastCountdown: string;
}

/**
 * Props for the component
 */
export interface CountdownProps
  extends ManagedClasses<CountdownClassNameContract>,
    ProgressBarProps {}
