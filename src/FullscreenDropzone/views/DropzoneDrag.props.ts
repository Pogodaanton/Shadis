import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface DropzoneDragClassNameContract {
  dropzoneDrag: string;
  dropzoneDragIcon: string;
}

/**
 * Props for the component
 */
export interface DropzoneDragProps
  extends ManagedClasses<DropzoneDragClassNameContract> {}
