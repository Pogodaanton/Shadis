import { IconType } from "react-icons/lib";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Orientation } from "@microsoft/fast-web-utilities";

/**
 * Class name contract for the component
 */
export interface TabBarClassNameContract {
  tabBar: string;
  tab?: string;

  /**
   * Indicator for the currently selected item
   */
  tabBar_indicator: string;
}

/**
 * Object containing all the necessary data for a tab to be displayed
 */
export interface TabItem {
  /**
   * Common identifier of the tab.
   * This is also used to determine the corresponding tab panel.
   */
  id: string;
  title: React.ReactText | React.ReactNode;
  icon: IconType; //| React.ReactNode;
}

/**
 * Props for the component
 */
export interface TabBarProps extends ManagedClasses<TabBarClassNameContract> {
  /**
   * Unique identifier used to establish connection between tabbar and tab-listeners
   */
  id: string;

  /**
   * The list of tabs on the tabbar
   */
  items: TabItem[];

  /**
   * The aria-label applied to the tabbar
   */
  label: string;

  /**
   * The orientation for the tabbar
   */
  orientation?: Orientation;
}
