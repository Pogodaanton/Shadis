import { MotionValue } from "framer-motion";

/**
 * This context contains an array of useful
 * positional data about the sidebar which can be
 * subscribed to, so that affected elements can
 * move along the sidebar smoothly.
 */
export interface ISidebarData {
  /**
   * The width of the sidebar
   */
  sidebarWidth: MotionValue<number>;
  /**
   * The current position of the sidebar.
   * `sidebarPos` <= 0 := closed / `sidebarPos` > 0 := visible
   *
   * We assume that the sidebar cannot be opened
   * in a size smaller than 100
   */
  sidebarPos: MotionValue<number>;
  /**
   * True, already while it's opening.
   * False, already while closing.
   */
  isSidebarVisible: boolean;
  setSidebarVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarFloating: boolean;
  fileTitle: string;
  setFileTitle: React.Dispatch<React.SetStateAction<string>>;
  debouncedSidebarPos: number;
}
