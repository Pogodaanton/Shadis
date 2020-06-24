import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface HeaderRightContentClassNameContract {}

/**
 * Props for the component
 */
export interface HeaderRightContentProps
  extends ManagedClasses<HeaderRightContentClassNameContract> {
  onMagnify?: React.MouseEventHandler;
  onShare?: React.MouseEventHandler;
  isVideo?: boolean;
  hasGif?: boolean;
}
