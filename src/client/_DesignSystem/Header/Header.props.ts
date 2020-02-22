import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the header component
 */
export interface HeaderClassNameContract {
  /**
   * Root of the header component
   */
  header?: string;
  /**
   * Left-side logo section
   */
  headerLeft?: string;
  /**
   * Left-side info which could be used for simple notifications.
   * Currently it has no other use than being a fancy title for the app.
   */
  headerLeftInfo?: string;
}

/**
 * Props for the header component
 */
export interface HeaderProps extends ManagedClasses<HeaderClassNameContract> {}
