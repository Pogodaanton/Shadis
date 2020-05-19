import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface ImageViewerClassNameContract {
  imageViewer: string;
  imageViewer__zoomedin?: string;
  imageViewer__dragging?: string;
  imageViewer_imageContainer: string;
}

/**
 * Props for the component
 */
export interface ImageViewerProps extends ManagedClasses<ImageViewerClassNameContract> {
  fileData: Window["fileData"];
  zoomRef?: (ref: React.MouseEventHandler) => void;
  onAnimationComplete?: () => void;
}
