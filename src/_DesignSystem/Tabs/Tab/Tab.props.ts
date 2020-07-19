import {
  TabProps as BaseTabProps,
  TabsManagedClasses as BaseTabsManagedClasses,
} from "@microsoft/fast-components-react-base";
import { IconType } from "react-icons/lib";
import { TabClassNameContract as BaseTabClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface TabClassNameContract extends BaseTabClassNameContract {
  tab_title: string;
  tab_icon?: string;
}

/**
 * Props for the component
 */
export interface TabProps
  extends ManagedClasses<TabClassNameContract>,
    Omit<BaseTabProps, keyof BaseTabsManagedClasses> {
  /**
   * Custom icon prepended to the tab title
   */
  icon?: IconType;
}
