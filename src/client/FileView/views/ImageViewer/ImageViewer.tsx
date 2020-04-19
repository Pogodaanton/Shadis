import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ImageViewerClassNameContract, ImageViewerProps } from "./ImageViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { motion, TapHandlers, useMotionValue, useSpring } from "framer-motion";
import { SpringProps } from "popmotion/lib/animations/spring/types";
import { debounce } from "lodash-es";
import { classNames } from "@microsoft/fast-web-utilities";
import ImageViewerSlider from "./ImageViewerSlider";
import { AutoSizer, Size } from "react-virtualized";

const styles: ComponentStyles<ImageViewerClassNameContract, DesignSystem> = {
  imageViewerContainer: {
    flexGrow: "1",
    position: "relative",
  },
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

/**
 * @see window.userData
 */
const isLoggedIn =
  typeof window.userData !== "undefined" &&
  typeof window.userData.username !== "undefined";

// Used to determine whether user clicked or panned
let lastDragPoint = { x: 0, y: 0 };

// Spring config for useSpring()
const springConfig: SpringProps = {
  stiffness: 800,
  damping: 2000,
};

const ImageViewer: React.FC<ImageViewerProps> = memo(
  ({ managedClasses, fileData, imageURL, zoomRef }: ImageViewerProps) => {
    fileData = fileData || window.fileData;
    const { id, title } = fileData;
    const onWindowResize = useRef<(info?: Size) => any>(() => null);
    const containerRef = useRef<HTMLDivElement>();

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
     * Some functions are called before the ref is
     * defined. Thus, we need to fall back to `window`.
     *
     * We cannot wait for the ref, since SharedAnimation
     * expects immediately rendered components.
     */
    const getViewport = (): Size => {
      if (!containerRef.current)
        return {
          width: window.innerWidth,
          height: window.innerHeight - 64,
        };

      return {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight - 64,
      };
    };

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
        const viewport = getViewport();
        const initialWidth = width;
        const maxWidth = viewport.width;
        const maxHeight = viewport.height;
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
        const ogFactor = (initialWidth / width) * 100 + 200;
        if (ogFactor !== maxValue) setMaxValue(ogFactor);

        width *= sliderVal / 100;
        height *= sliderVal / 100;
        marginLeft = (maxWidth - width) / 2;

        return { width, height, marginLeft };
      },
      [maxValue, sliderVal]
    );
    const [imageDimensions, setImageDimensions] = useState(calcImageSize(fileData));

    // Resize image based on range slider change
    useEffect(() => setImageDimensions(calcImageSize(fileData)), [
      calcImageSize,
      fileData,
    ]);

    /**
     * Initiate resize function that is used by <AutoSizer/>.
     * The function is debounced by 80ms to save system resources.
     *
     * Since there are no resize events for HTML Tags, we use
     * <AutoSizer/> to register any size changes in the div.
     */
    useEffect(() => {
      onWindowResize.current = debounce((sizes: Size) => {
        // Prevent re-render if there are no size changes
        if (!sizes) return;
        setImageDimensions(calcImageSize(fileData));
      }, 80);
    }, [calcImageSize, fileData]);

    /**
     * Toggles transform mode and resets the x and y coordinates
     * to center the image.
     */
    const handleToggle = useCallback(() => {
      if (!inTransformMode) setSliderVal(120);
      else {
        setSliderVal(100);
        dragX.stop();
        dragX.set(0);
        dragY.stop();
        dragY.set(0);
      }

      setTransformMode(!inTransformMode);
    }, [dragX, dragY, inTransformMode]);

    /**
     * Calling ref function prop to pass on the handleToggle
     * function as a way to externally toggle the transform mode
     */
    useEffect(() => {
      zoomRef(handleToggle);
      return () => zoomRef(() => {});
    }, [handleToggle, zoomRef, inTransformMode, sliderVal]);

    /**
     * Caches the lastDragPoint for onImageTap
     */
    const onImageTapStart: TapHandlers["onTapStart"] = (_e, { point }) => {
      lastDragPoint = point;
    };

    /**
     * Toggles the transform mode based on whether
     * the user dragged the image.
     */
    const onImageTap: TapHandlers["onTap"] = (_e, { point }) => {
      if (point.x === lastDragPoint.x && point.y === lastDragPoint.y) handleToggle();
    };

    /**
     * Calculated constraints that only allow to move the image
     * if it is bigger than the viewport
     */
    const calculateDragConstraints = useCallback(() => {
      const viewport = getViewport();
      const { width, height } = imageDimensions;
      const overflowX = Math.max(width - viewport.width, 0);
      const overflowY = Math.max(height - viewport.height, 0);
      const constraints = {
        top: -1 * (overflowY / 2),
        bottom: overflowY / 2,
        left: -1 * (overflowX / 2),
        right: overflowX / 2,
      };

      return constraints;
    }, [imageDimensions]);

    // Automatically update constraints after imageDimensions update
    useEffect(() => {
      setDragConstraints(calculateDragConstraints());
    }, [calculateDragConstraints, imageDimensions]);

    // Resizes the image based on the wheel direction
    const onImageWheel: React.WheelEventHandler<HTMLDivElement> = ({ deltaY }) => {
      const newVal = Math.min(Math.max(sliderVal + deltaY * -1, 100), maxValue);
      setSliderVal(newVal);

      // Toggle transform mode automatically on scroll
      if ((newVal > 100 && !inTransformMode) || (newVal <= 100 && inTransformMode)) {
        setTransformMode(!inTransformMode);
      }
    };

    // Move image back to constraints if it is overflowing
    // This can be the case when scaling down the image
    useEffect(() => {
      const { top, bottom, left, right } = dragConstraints;
      const y = dragY.get();
      const x = dragX.get();
      let newY = y;
      let newX = x;

      if (y < top) newY = top;
      if (y > bottom) newY = bottom;
      if (x < left) newX = left;
      if (x > right) newX = right;

      if (newY !== y) {
        dragY.stop();
        dragY.set(newY);
      }

      if (newX !== x) {
        dragX.stop();
        dragX.set(newX);
      }
    }, [dragConstraints, dragX, dragY]);

    return (
      <motion.div
        className={managedClasses.imageViewerContainer}
        initial={!isLoggedIn && { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ default: 0.1 }}
        exit={!isLoggedIn && { opacity: 0 }}
        ref={containerRef}
      >
        <AutoSizer onResize={onWindowResize.current}>{() => null}</AutoSizer>
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
          onWheel={onImageWheel}
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
          onValueChange={setSliderVal}
        />
      </motion.div>
    );
  }
);

export default manageJss(styles)(ImageViewer);
