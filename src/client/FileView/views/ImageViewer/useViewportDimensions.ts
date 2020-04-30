import { headerHeight } from "../../../_DesignSystem";
import useResizeAware from "react-resize-aware";

/**
 * The dimensions of the parent element
 * or the dimensions of the window.
 */
export interface ViewportDimensions {
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Returns the width and height of the enclosing element,
 * as well as a React node you need to place inside the measured
 * element in order to handle resize events.
 */
export const useViewportDimensions = (): [React.ReactNode, ViewportDimensions] => {
  const reportDimensions = (target: HTMLObjectElement): ViewportDimensions => ({
    viewportWidth: target !== null ? target.clientWidth : window.innerWidth,
    viewportHeight:
      (target !== null ? target.clientHeight : window.innerHeight) - headerHeight,
  });
  const [resizeListener, dimensions] = useResizeAware(reportDimensions);

  return [resizeListener, dimensions];
};
