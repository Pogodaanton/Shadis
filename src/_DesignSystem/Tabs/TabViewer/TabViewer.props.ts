import { TabItem } from "../TabBar/TabBar.props";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface TabViewerClassNameContract {
  tabViewer: string;
  tabPanel: string;
  tabPanel__visible?: string;
}

/**
 * Object in which specific content is assigned to a tab
 */
export interface TabPanel {
  /**
   * The id of the tab the panel is referring
   */
  id: TabItem["id"];
  /**
   * The contents of the panel
   */
  children: React.ReactNode | null;
  /**
   * Is triggered if the panel becomes visible
   */
  onLoad?: () => any;
}

/**
 * Props for the component
 */
export interface TabViewerProps extends ManagedClasses<TabViewerClassNameContract> {
  /**
   * Unique identifier used to establish connection with tabbar
   */
  id: string;

  /**
   * The list of tab panels
   */
  items: TabPanel[];
}
