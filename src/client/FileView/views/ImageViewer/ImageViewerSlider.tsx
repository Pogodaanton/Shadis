import React, { useCallback, useMemo, useContext } from "react";
import { motion, useTransform } from "framer-motion";
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
import { applyBackdropBackground } from "../../../_DesignSystem";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { SliderTrackItemAnchor } from "@microsoft/fast-components-react-base";
import {
  DesignSystem,
  applyElevation,
  ElevationMultiplier,
  applyPillCornerRadius,
  neutralLayerFloating,
} from "@microsoft/fast-components-styles-msft";
import { SidebarData } from "../FVSidebar/FVSidebarContext";

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
    pointerEvents: "none",
  },
};

const labelStyle: ComponentStyles<SliderLabelClassNameContract, DesignSystem> = {
  sliderLabel: {
    cursor: "pointer",
  },
};

/**
 * Defines the point where the image
 * is in its original size.
 */
const ogPos = 100;

/**
 * A floating slider with procentual labels.
 * Used in conjunction with ImageViewer.
 */
const ImageViewerSlider: React.ComponentType<ImageViewerSliderProps> = ({
  managedClasses,
  show,
  value,
  minFactor,
  maxFactor,
  onValueChange,
}) => {
  const { sidebarPos } = useContext(SidebarData);

  /**
   * Current position on the slider.
   */
  type value = number;
  value = value * 100;

  /**
   * Lowest point on the slider.
   */
  const minValue = useMemo(() => minFactor * 100, [minFactor]);

  /**
   * Highest point on the slider.
   */
  const maxValue = useMemo(() => maxFactor * 100, [maxFactor]);

  /**
   * Tells whether the image needed to be
   * shrunk in order to fit the viewport.
   */
  const isLargeImage = useMemo(() => minValue < 100, [minValue]);

  /**
   * Position of the fixed label that hints
   * either at 1x or 2x depending on the image size.
   */
  const fixedLabelPos = useMemo(() => (isLargeImage ? ogPos : maxValue - 100), [
    isLargeImage,
    maxValue,
  ]);

  /**
   * Decides whether showing the label would be
   * intrusive or unfitting.
   */
  const shouldShowLabel =
    value > minValue + 5 &&
    value < maxValue - 5 &&
    (value < ogPos - 20 || value > ogPos + 20);

  /**
   * Formats the new value and passes it on to the callback prop.
   * @param v THe new value of the slider
   */
  const handleValueChange = useCallback((v: number) => onValueChange(v / 100), [
    onValueChange,
  ]);

  /**
   * Moves the slider if sidebar is opened.
   */
  const sliderPosX = useTransform(sidebarPos, (v: number) => -1 * (v / 2));

  return (
    <motion.div
      className={managedClasses.imageViewerSlider}
      initial={{ y: "200%" }}
      animate={{ y: show ? 0 : "200%" }}
      style={{ x: sliderPosX }}
    >
      <Slider
        range={{ minValue, maxValue }}
        value={value}
        onValueChange={handleValueChange}
      >
        <SliderLabel
          label={isLargeImage ? "100%" : "200%"}
          valuePositionBinding={fixedLabelPos}
          showTickmark={true}
          onClick={() => handleValueChange(fixedLabelPos)}
          jssStyleSheet={labelStyle}
        />
        <motion.div
          className={managedClasses.imageViewerSlider_label}
          initial={{ opacity: 1 }}
          animate={{ opacity: shouldShowLabel ? 1 : 0 }}
          transition={{ default: 0.1 }}
        >
          <SliderLabel
            label={Math.floor((value * (isLargeImage ? 100 : 200)) / ogPos) + "%"}
            valuePositionBinding={SliderTrackItemAnchor.selectedRangeMax}
            showTickmark={true}
          />
        </motion.div>
      </Slider>
    </motion.div>
  );
};

export default manageJss(styles)(ImageViewerSlider);
