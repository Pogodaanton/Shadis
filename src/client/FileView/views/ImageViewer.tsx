import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ImageViewerClassNameContract, ImageViewerProps } from "./ImageViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { motion, TapHandlers, useMotionValue, useSpring } from "framer-motion";
import { SpringProps } from "popmotion/lib/animations/spring/types";
import { debounce } from "lodash-es";
import { classNames } from "@microsoft/fast-web-utilities";
import ImageViewerSlider from "./ImageViewerSlider";

const styles: ComponentStyles<ImageViewerClassNameContract, DesignSystem> = {
  imageViewer: {
    position: "absolute",
    userSelect: "none",
    top: "64px",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    cursor: "zoom-in",
  },
  imageViewer__zoomedin: {
    cursor: "grab",
  },
  imageViewer__dragging: {
    cursor: "grabbing",
  },
};

// Used to determine whether user clicked or panned
let lastDragPoint = { x: 0, y: 0 };

// Spring config for useSpring()
const springConfig: SpringProps = {
  stiffness: 800,
  damping: 2000,
};

const ImageViewer: React.FC<ImageViewerProps> = memo(
  ({ managedClasses, fileData, imageURL }: ImageViewerProps) => {
    fileData = fileData || window.fileData;
    const { id, title } = fileData;
    const onWindowResize = useRef<() => void>(null);

    // Boolean states
    const [inTransformMode, setTransformMode] = useState(false);
    const [inDragMode, setDragMode] = useState(false);

    // maxValue Depends on the image width and height
    // and is thus modified in calcImageSize()
    const [maxValue, setMaxValue] = useState(300);
    const [sliderVal, setSliderVal] = useState(100);

    // Motion values for framer-motion
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);
    const defaultX = useSpring(dragX, springConfig);
    const defaultY = useSpring(dragY, springConfig);

    // We need to redefine the type,
    // as the original one from Framer also accepts a boolean
    const [dragConstraints, setDragConstraints] = useState<{
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    }>({});

    /**
     * Sizes the given image to fit the boundaries of the page
     * This is needed, as the image needs absolute dimensions
     * in order to become independently resizable and movable.
     *
     * @param dimensions An object with the true width and height of the image.
     */
    const calcImageSize = useCallback(
      ({
        width,
        height,
      }: Window["fileData"]): {
        width: number;
        height: number;
        marginLeft: number;
      } => {
        let marginLeft = null;
        const initialWidth = width;
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight - 64;
        const factor = width / height;

        if (width - maxWidth > 0 || height - maxHeight > 0) {
          if (maxHeight * factor <= maxWidth) {
            width = width * (maxHeight / height);
            height = maxHeight;
          } else {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        }

        // Setting max value for <Slider/>
        const ogFactor = Math.max((initialWidth / width) * 100, 200) + 100;
        if (ogFactor !== maxValue) setMaxValue(ogFactor);

        width *= sliderVal / 100;
        height *= sliderVal / 100;
        marginLeft = (maxWidth - width) / 2;

        return { width, height, marginLeft };
      },
      [maxValue, sliderVal]
    );
    const [imageDimensions, setImageDimensions] = useState(calcImageSize(fileData));

    /**
     * Resize image if window resizes
     */
    useEffect(() => {
      onWindowResize.current = debounce(
        () => setImageDimensions(calcImageSize(fileData)),
        80
      );
      window.addEventListener("resize", onWindowResize.current);
      return () => window.removeEventListener("resize", onWindowResize.current);
    }, [calcImageSize, fileData]);

    /**
     * Caches the lastDragPoint for onImageTap
     */
    const onImageTapStart: TapHandlers["onTapStart"] = (_e, { point }) => {
      lastDragPoint = point;
    };

    /**
     * Toggles the transform mode based on whether
     * the user dragged the image.
     *
     * It then proceeds to reset the x and y coordinates
     * to center the image.
     */
    const onImageTap: TapHandlers["onTap"] = (_e, { point }) => {
      if (point.x === lastDragPoint.x && point.y === lastDragPoint.y) {
        if (!inTransformMode) setSliderVal(120);
        else {
          setSliderVal(100);
          dragX.set(0);
          dragY.set(0);
        }

        setTransformMode(!inTransformMode);
      }
    };

    /**
     * Calculated constraints that only allow to move the image
     * if it is bigger than the viewport
     */
    const calculateDragConstraints = useCallback(() => {
      const { width, height } = imageDimensions;
      const overflowX = Math.max(width - window.innerWidth, 0);
      const overflowY = Math.max(height - (window.innerHeight - 64), 0);

      return {
        top: -1 * (overflowY / 2),
        bottom: overflowY / 2,
        left: -1 * (overflowX / 2),
        right: overflowX / 2,
      };
    }, [imageDimensions]);

    // Automatically update constraints after imageDimensions update
    useEffect(() => {
      setDragConstraints(calculateDragConstraints());
    }, [calculateDragConstraints, imageDimensions]);

    // Handling slider change
    const onSliderChange = (newVal: number) => {
      if (dragY.get() < dragConstraints.top || dragY.get() > dragConstraints.bottom)
        dragY.set(0);
      if (dragX.get() < dragConstraints.left || dragX.get() > dragConstraints.right)
        dragX.set(0);
      setSliderVal(newVal);
    };

    // Resize image based on range slider change
    useEffect(() => setImageDimensions(calcImageSize(fileData)), [
      calcImageSize,
      fileData,
    ]);

    return (
      <>
        <motion.div
          className={classNames(
            managedClasses.imageViewer,
            [managedClasses.imageViewer__zoomedin, inTransformMode],
            [managedClasses.imageViewer__dragging, inDragMode]
          )}
          layoutId={`card-image-container-${id}`}
          drag={inTransformMode}
          initial={imageDimensions}
          animate={imageDimensions}
          transition={{
            default: { type: "tween", ease: "easeOut", duration: 0.2 },
          }}
          draggable={false}
          onTapStart={onImageTapStart}
          onTap={onImageTap}
          onDragStart={() => setDragMode(true)}
          onDragEnd={() => setDragMode(false)}
          dragConstraints={dragConstraints}
          dragElastic={0.2}
          style={{
            x: inTransformMode ? dragX : defaultX,
            y: inTransformMode ? dragY : defaultY,
          }}
        >
          <img
            alt={title}
            src={imageURL}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              display: "inline-block",
            }}
          />
        </motion.div>
        <ImageViewerSlider
          show={inTransformMode}
          value={sliderVal}
          maxValue={maxValue}
          onValueChange={onSliderChange}
        />
      </>
    );
  }
);

export default manageJss(styles)(ImageViewer);
