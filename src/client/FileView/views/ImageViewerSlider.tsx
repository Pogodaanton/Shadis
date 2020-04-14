import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  ImageViewerSliderProps,
  ImageViewerSliderClassNameContract,
} from "./ImageViewerSlider.props";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  Slider,
  SliderLabel,
  SliderLabelClassNameContract,
} from "@microsoft/fast-components-react-msft";
import { applyBackdropBackground } from "../../_DesignSystem";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { SliderTrackItemAnchor } from "@microsoft/fast-components-react-base";
import {
  DesignSystem,
  applyElevation,
  ElevationMultiplier,
  applyPillCornerRadius,
  neutralLayerFloating,
} from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<ImageViewerSliderClassNameContract, DesignSystem> = {
  imageViewerSlider: {
    position: "absolute",
    width: "30%",
    left: "0",
    right: "0",
    bottom: "20px",
    margin: "auto",
    padding: "15px 15px 20px 15px",
    ...applyPillCornerRadius(),
    ...applyBackdropBackground(
      opacity => des =>
        parseColorHexRGBA(neutralLayerFloating(des) + opacity).toStringWebRGBA(),
      "ba"
    ),
    ...applyElevation(ElevationMultiplier.e10),
  },
  imageViewerSlider_label: {
    display: "inline-grid",
  },
};

const labelStyle: ComponentStyles<SliderLabelClassNameContract, DesignSystem> = {
  sliderLabel: {
    cursor: "pointer",
  },
};

/**
 * A floating slider with procentual labels.
 * Used in conjunction with ImageViewer.
 */
const ImageViewerSlider: React.ComponentType<ImageViewerSliderProps> = memo(
  ({ managedClasses, show, value, maxValue, onValueChange }) => {
    /**
     * If `maxValue` is not bigger than 300 we can assume
     * that the image is already full-size
     */
    const isLargeImage = maxValue > 300;
    const shouldShowLabel =
      value < 120 || (value > maxValue - 120 && value < maxValue - 80);

    return (
      <motion.div
        className={managedClasses.imageViewerSlider}
        initial={{ y: "200%" }}
        animate={{ y: show ? 0 : "200%" }}
      >
        <Slider
          range={{ minValue: 100, maxValue }}
          value={value}
          onValueChange={onValueChange}
        >
          <SliderLabel
            label={isLargeImage ? "100%" : "200%"}
            valuePositionBinding={maxValue - 100}
            showTickmark={true}
            onClick={() => onValueChange(maxValue - 100)}
            jssStyleSheet={labelStyle}
          />
          <motion.div
            className={managedClasses.imageViewerSlider_label}
            initial={{ opacity: 1 }}
            animate={{ opacity: shouldShowLabel ? 0 : 1 }}
            transition={{ default: 0.1 }}
          >
            <SliderLabel
              label={
                Math.floor((value * (isLargeImage ? 100 : 200)) / (maxValue - 100)) + "%"
              }
              valuePositionBinding={SliderTrackItemAnchor.selectedRangeMax}
              showTickmark={true}
            />
          </motion.div>
        </Slider>
      </motion.div>
    );
  }
);

export default manageJss(styles)(ImageViewerSlider);
