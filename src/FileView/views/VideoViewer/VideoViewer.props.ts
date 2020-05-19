import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface VideoViewerClassNameContract {
  videoViewer: string;
  videoViewer_thumbnailContainer?: string;
}

/**
 * Props for the component
 */
export interface VideoViewerProps extends ManagedClasses<VideoViewerClassNameContract> {
  fileData: Window["fileData"];
}
