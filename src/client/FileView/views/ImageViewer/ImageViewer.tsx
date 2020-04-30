/* eslint-disable jsx-a11y/alt-text */
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ImageViewerProps, ImageViewerClassNameContract } from "./ImageViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
  motion,
  useMotionValue,
  useTransform,
  TapHandlers,
  MotionValue,
  useDomEvent,
} from "framer-motion";
import { headerHeight } from "../../../_DesignSystem";
import { useViewportDimensions } from "./useViewportDimensions";
import { classNames } from "@microsoft/fast-web-utilities";
import ImageViewerSlider from "./ImageViewerSlider";
import { ColdSubscription, tween, TweenProps, spring } from "popmotion";

const applyCenteredAbsolute: CSSRules<DesignSystem> = {
  position: "absolute",
  userSelect: "none",
  top: headerHeight + "px",
  left: "0",
  right: "0",
  bottom: "0",
  margin: "auto",
  "& img": {
    width: "100%",
    height: "100%",
  },
};

const styles: ComponentStyles<ImageViewerClassNameContract, DesignSystem> = {
  imageViewer: {
    flexGrow: "1",
    position: "relative",
    "& > iframe": {
      opacity: 0,
      pointerEvents: "none",
    },
  },
  imageViewer_imageContainer: {
    ...applyCenteredAbsolute,
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

/* eslint-disable react-hooks/exhaustive-deps */
const isMotionValue = (value: any): value is MotionValue => {
  return value instanceof MotionValue;
};
const useTween = (source: MotionValue | number, config: TweenProps = {}) => {
  const activeAnimation = useRef<ColdSubscription | null>(null);
  const value = useMotionValue(isMotionValue(source) ? source.get() : source);

  useMemo(
    () =>
      value.attach((v, set) => {
        if (activeAnimation.current) activeAnimation.current.stop();

        activeAnimation.current = tween({
          duration: 300,
          ...config,
          from: value.get(),
          to: v,
        }).start(set);

        return value.get();
      }),
    Object.values(config)
  );

  return value;
};
/* eslint-enable react-hooks/exhaustive-deps */

/**
 * Animation function to be used with `MotionValue.start()`.
 * It uses popmotion's inbuilt spring function.
 *
 * @param motionValue The `MotionValue` you attach this function to.
 * @param config A custom config for popmotion's tween function.
 */
const animateWithSpring = (motionValue: MotionValue, config: TweenProps) => (
  complete: () => void
) => {
  const animation = spring({
    to: 0,
    ...config,
    velocity: motionValue.getVelocity(),
    from: motionValue.get(),
    stiffness: 400,
    damping: 60,
  }).start({
    complete,
    update: (val: number) => motionValue.set(val),
  });

  return animation.stop;
};

/**
 * The main ImageViewer Component
 */
const ImageViewer: React.ComponentType<ImageViewerProps> = ({
  imageURL,
  managedClasses,
  fileData,
  zoomRef,
}) => {
  fileData = fileData || window.fileData;
  const { id, title, width, height } = fileData;

  // Ref of the draggable component
  const draggableRef = useRef(null);

  // Viewport dimensions
  const [resizeListener, { viewportWidth, viewportHeight }] = useViewportDimensions();

  /**
   * Calculates `defaultScale` so that bigger images
   * can fit in the viewport
   */
  const fitImageToViewport = useCallback(() => {
    let newScaleFactor = 1;
    const aspectRatio = width / height;

    if (width - viewportWidth > 0 || height - viewportHeight > 0) {
      if (viewportHeight * aspectRatio <= viewportWidth) {
        const adaptedWidth = width * (viewportHeight / height);
        newScaleFactor = adaptedWidth / width;
      } else {
        const adaptedHeight = height * (viewportWidth / width);
        newScaleFactor = adaptedHeight / height;
      }
    }

    return newScaleFactor;
  }, [height, viewportHeight, viewportWidth, width]);

  /**
   * Minimum scale factor.
   *
   * It can be used to determine the default size
   * of the image, hence the name.
   */
  const defaultScale = useMemo(() => fitImageToViewport(), [fitImageToViewport]);

  // Scale factor
  // TODO: Reevaluate usefulness of using both state and motionValue
  const [scaleState, setScaleState] = useState(defaultScale);
  const scaleVal = useTween(scaleState, { duration: 200 });
  const scaledWidth = useTransform(scaleVal, (v: number) => v * width);
  const scaledHeight = useTransform(scaleVal, (v: number) => v * height);

  // Adjust scaleVal to scaleState
  useLayoutEffect(() => scaleVal.set(scaleState), [scaleState, scaleVal]);

  /**
   * Resizes the image based on the wheel direction and
   * toggles transform mode if needed.
   */
  const onDraggableWheel = (e: WheelEvent) => {
    const newScaleFactor = Math.min(
      Math.max(scaleState + (e.deltaY / 150) * -1, defaultScale),
      3
    );

    setScaleState(newScaleFactor);
    if (
      (newScaleFactor > defaultScale && !inTransformMode) ||
      (newScaleFactor <= defaultScale && inTransformMode)
    ) {
      setTransformState(!inTransformMode);
    }
  };

  // Assign listener to wheel event
  useDomEvent(draggableRef, "wheel", onDraggableWheel, { passive: false });

  /**
   * Caches the lastDragPoint for onImageTap
   */
  const onTapStart: TapHandlers["onTapStart"] = (_e, { point }) => {
    lastDragPoint = point;
  };

  /**
   * Toggles the transform mode based on whether
   * the user dragged the image.
   */
  const onTap: TapHandlers["onTap"] = (_e, { point }) => {
    if (point.x === lastDragPoint.x && point.y === lastDragPoint.y)
      setTransformState(!inTransformMode);
  };

  // Dragging state
  const [isDragging, setDraggingState] = useState(false);
  // Toggle the dragging state
  const onDragStart = () => !isDragging && setDraggingState(true);
  const onDragEnd = () => isDragging && setDraggingState(false);

  /**
   * Position of the image in the x-axis.
   *
   * Keep in mind that the origin is on the
   * centre of the page.
   */
  const posX = useMotionValue(0);

  /**
   * Position of the image in the y-axis.
   *
   * Keep in mind that the origin is on the
   * centre of the page.
   */
  const posY = useMotionValue(0);

  /**
   * If activated, <ImageViewerSlider/> appears and the image
   * is draggable
   */
  const [inTransformMode, setTransformState] = useState(false);

  /**
   * Calling ref function prop to pass on the handleToggle
   * function as a way to externally toggle the transform mode
   */
  useLayoutEffect(() => {
    zoomRef(() => setTransformState(!inTransformMode));
    return () => zoomRef(() => {});
  }, [inTransformMode, zoomRef]);

  /**
   * Scales the image by 0.2 if entering transform mode,
   * resets image position and size if leaving transform mode
   */
  useLayoutEffect(() => {
    if (inTransformMode) setScaleState(defaultScale + 0.2);
    else setScaleState(defaultScale);
  }, [defaultScale, inTransformMode, posX, posY]);

  /**
   * To keep the image centered if it is bigger than the viewport
   * we adjust the X axis by the delta of the overflowing part
   */
  const posXAdjusted = useMotionValue<number>(0);
  useLayoutEffect(() => {
    const posXAdjustor = () => {
      const deltaX = Math.min(0, (viewportWidth - scaledWidth.get()) / 2);
      posXAdjusted.set(posX.get() + deltaX);
    };

    posXAdjustor();
    const posXListener = posX.onChange(posXAdjustor);
    const scaledWidthListener = scaledWidth.onChange(posXAdjustor);

    // onChange events return a cleanup function
    return () => {
      posXListener();
      scaledWidthListener();
    };
  }, [posX, posXAdjusted, scaledWidth, viewportWidth]);

  /**
   * Calculates `dragConstraints`
   */
  const calcDragConstraints = useCallback(() => {
    const overflowX = Math.max(width * scaleState - viewportWidth, 0);
    const overflowY = Math.max(height * scaleState - viewportHeight, 0);
    const constraints = {
      top: -1 * (overflowY / 2),
      bottom: overflowY / 2,
      left: -1 * (overflowX / 2),
      right: overflowX / 2,
    };

    return constraints;
  }, [height, scaleState, viewportHeight, viewportWidth, width]);

  /**
   * Calculated constraints that only allow to move the image
   * if it is bigger than the viewport
   */
  type dragConstraints = {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  const [dragConstraints, setDragConstraints] = useState(calcDragConstraints());

  // Automatically update constraints after imageDimensions update
  useEffect(() => {
    setDragConstraints(calcDragConstraints());
  }, [calcDragConstraints]);

  /**
   * Move image back to co constraints if it is overflowing.
   * This can happen while scaling down the image.
   */
  useEffect(() => {
    const { top, bottom, left, right } = dragConstraints;
    const y = posY.get();
    const x = posX.get();
    let newY = y;
    let newX = x;

    if (y < top) newY = top;
    if (y > bottom) newY = bottom;
    if (x < left) newX = left;
    if (x > right) newX = right;

    if (newY !== y) {
      posY.stop();
      posY.start(animateWithSpring(posY, { to: newY }));
    }

    if (newX !== x) {
      posX.stop();
      posX.start(animateWithSpring(posX, { to: newX }));
    }
  }, [dragConstraints, posX, posY]);

  /**
   * Used to determine whether a magic animation
   * is running.
   */
  type isMagicAnimRunning = boolean;
  const [isMagicAnimRunning, setMagicAnimState] = useState(false);
  // Toggle `isMagicAnimRunning`
  const onMagicAnimStart = () => !isMagicAnimRunning && setMagicAnimState(true);
  const onMagicAnimEnd = () => isMagicAnimRunning && setMagicAnimState(false);

  /**
   * ATTRIBUTES
   * ==========
   */

  const sharedDraggableAttributes = {
    className: classNames(
      managedClasses.imageViewer_imageContainer,
      [managedClasses.imageViewer__zoomedin, inTransformMode],
      [managedClasses.imageViewer__dragging, isDragging]
    ),
    draggable: false,
    onTapStart,
    onTap,
    drag: inTransformMode,
    onDragStart,
    onDragEnd,
    dragElastic: 0.2,
  };

  const sharedImgAttributes = {
    src: imageURL,
    alt: title,
    draggable: false,
  };

  // Default dimensions used for magic component
  const defaultWidth = useMemo(() => width * defaultScale, [defaultScale, width]);
  const defaultHeight = useMemo(() => height * defaultScale, [defaultScale, height]);

  return (
    <motion.div className={managedClasses.imageViewer}>
      {resizeListener}
      <motion.div
        /**
         * This component is used for magic animations
         * connecting the cards in the dashboard
         * with this ImageViewer.
         *
         * For the sake of simplicity, we use a seperate
         * component for magic animations and only make them
         * visible, if needed.
         */
        layoutId={`card-image-container-${id}`}
        className={managedClasses.imageViewer_imageContainer}
        onAnimationStart={onMagicAnimStart}
        onAnimationComplete={onMagicAnimEnd}
        style={{
          visibility: isMagicAnimRunning ? "visible" : "hidden",
          width: defaultWidth,
          height: defaultHeight,
        }}
      >
        <img {...sharedImgAttributes} />
      </motion.div>
      <motion.div
        {...sharedDraggableAttributes}
        ref={draggableRef}
        dragConstraints={dragConstraints}
        style={{
          display: isMagicAnimRunning ? "none" : "block",
          width: scaledWidth,
          height: scaledHeight,
          x: posXAdjusted,
          y: posY,
        }}
        /**
         * Since `posXAdjusted` is set as the value for `x`,
         * we need to tell the component to modify `posX`
         * so that `posXAdjusted` can be calculated
         */
        _dragValueX={posX}
      >
        <img {...sharedImgAttributes} />
      </motion.div>
      <ImageViewerSlider
        show={inTransformMode}
        value={scaleState}
        minFactor={defaultScale}
        maxFactor={3}
        onValueChange={setScaleState}
      />
    </motion.div>
  );
};

export default manageJss(styles)(ImageViewer);
