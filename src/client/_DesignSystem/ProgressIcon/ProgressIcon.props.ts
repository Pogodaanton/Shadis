import { IconType } from "react-icons/lib";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface ProgressIconClassNameContract {
  progressIconContainer: string;
  progressIcon: string;
}

/**
 * Props for the component
 */
export interface ProgressIconProps
  extends ManagedClasses<ProgressIconClassNameContract>,
    React.HTMLAttributes<HTMLDivElement> {
  icon: IconType;
}
