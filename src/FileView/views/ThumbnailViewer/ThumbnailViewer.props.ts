import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface ThumbnailViewerClassNameContract {
  viewer: string;
  thumbnailViewer: string;
  thumbnailViewer_container?: string;
}

/**
 * Props for the component
 */
export interface ThumbnailViewerProps
  extends ManagedClasses<ThumbnailViewerClassNameContract> {
  fileData: Window["fileData"];
}

export interface ThumbnailContextItems {
  isThumbnailVisible: boolean;
  defaultScale: number;
  viewportWidth: number;
  viewportHeight: number;
  setThumbnailVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  addEntryFinishListener: (listener: () => void) => void;
}
