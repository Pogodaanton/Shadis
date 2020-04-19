import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface ImageViewerSliderClassNameContract {
  imageViewerSlider?: string;
  imageViewerSlider_label?: string;
}

/**
 * Props for the component
 */
export interface ImageViewerSliderProps
  extends ManagedClasses<ImageViewerSliderClassNameContract> {
  show: boolean;
  maxValue: number;
  value: number;
  onValueChange: (value: number) => any;
}
