/* eslint-disable jsx-a11y/alt-text */
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
  useContext,
} from "react";
import { ImageViewerProps, ImageViewerClassNameContract } from "./ImageViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager-react";
import {
  motion,
  useMotionValue,
  TapHandlers,
  MotionValue,
  useDomEvent,
} from "framer-motion";
import { headerHeight, useRouteInterception } from "../../../_DesignSystem";
import { classNames } from "@microsoft/fast-web-utilities";
import ImageViewerSlider from "./ImageViewerSlider";
import { TweenProps, spring } from "popmotion";
import { SidebarData } from "../FVSidebar/FVSidebarContext";
import { debounce } from "lodash-es";
import { ThumbnailContext, ssrContainer } from "../ThumbnailViewer/ThumbnailViewer";

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
  managedClasses,
  fileData,
  zoomRef,
}) => {
  fileData = fileData || window.fileData;
  const { id, extension, title, width, height, fromServer } = fileData;

  const {
    isThumbnailVisible,
    viewportWidth,
    viewportHeight,
    defaultScale,
    setThumbnailVisibility,
    addEntryFinishListener,
  } = useContext(ThumbnailContext);

  /**
   * React.Ref of the image element
   */
  const imageRef = useRef<HTMLImageElement>(null);

  /**
   * Listen to the finishing of the thumbnail animation.
   * Load the high-res image afterwards and hide the thumbnail.
   */
  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current;
      const listener = () => setThumbnailVisibility(false);

      addEntryFinishListener(() => {
        image.addEventListener("load", listener);
        image.src = `${window.location.origin}/${id}.${extension}`;

        if (fromServer) {
          if (image.complete) listener();
          if (ssrContainer) ssrContainer.remove();
          return;
        }
      });

      return () => {
        image.removeEventListener("load", listener);
      };
    }
  }, [addEntryFinishListener, extension, fromServer, id, setThumbnailVisibility]);

  /**
   * React.Ref from the draggable component
   */
  const draggableRef = useRef<HTMLDivElement>(null);

  /**
   * Used for detecting the current state of the sidebar
   */
  const { sidebarPos, isSidebarFloating } = useContext(SidebarData);
  const { addNavigationHandler } = useRouteInterception();

  /**
   * Debounce sidebar position changes, so that we can avoid
   * expensive calculations and renderings
   */
  const [debouncedSidebarPos, setSidebarPos] = useState(sidebarPos.get());
  useEffect(() => {
    const listener = () => setSidebarPos(isSidebarFloating ? 0 : sidebarPos.get());
    listener();
    return sidebarPos.onChange(debounce(listener, 20));
  }, [isSidebarFloating, sidebarPos]);

  /**
   * Minimum scale factor.
   *
   * It can be used to determine the default size
   * of the image, hence the name.
   */
  type defaultScale = number;

  /**
   * Current scale factor
   *
   * This number can be manipulated by the user.
   */

  const [scale, setScaleState] = useState(defaultScale);

  /**
   * If activated, <ImageViewerSlider/> appears and the image
   * is draggable
   */
  const [inTransformMode, setTransformState] = useState(false);

  /**
   * Resizes the image based on the wheel direction and
   * toggles transform mode if needed.
   */
  const onDraggableWheel = (e: WheelEvent) => {
    const newScaleFactor = Math.min(
      Math.max(scale + (e.deltaY / 150) * -1, defaultScale),
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
  useDomEvent(draggableRef, "wheel", onDraggableWheel as EventListener, {
    passive: false,
  });

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

  /**
   * Do not navigate away if in transform mode
   */
  useEffect(() => {
    if (inTransformMode) {
      return addNavigationHandler(() => {
        if (inTransformMode) {
          setTransformState(false);
          return false;
        }
        return true;
      });
    } else return () => {};
  }, [addNavigationHandler, inTransformMode]);

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
   * Calling ref function prop to pass on the handleToggle
   * function as a way to externally toggle the transform mode
   */
  useLayoutEffect(() => {
    zoomRef(() => setTransformState(!inTransformMode));
    return () => zoomRef(() => {});
  }, [inTransformMode, zoomRef]);

  /**
   * To keep the image centered if it is bigger than the viewport
   * we adjust the X axis by the delta of the overflowing part
   */
  const posXAdjusted = useMotionValue<number>(0);

  /**
   * The amount of overflow of the image in the x axis that
   * needs to be moved back in order to keep the image centered.
   */
  const deltaX: number = useMemo(() => Math.min(0, (viewportWidth - width) / 2), [
    viewportWidth,
    width,
  ]);

  /**
   * Listen to `deltaX`, `posX` and `sidebarPos` changes and adjust posXAdjusted
   */
  useLayoutEffect(() => {
    const posXAdjustor = () => {
      posXAdjusted.set(
        posX.get() + deltaX - (isSidebarFloating ? 0 : sidebarPos.get()) / 2
      );
    };

    posXAdjustor();
    const cleanup1 = posX.onChange(posXAdjustor);
    const cleanup2 = sidebarPos.onChange(posXAdjustor);

    return () => {
      cleanup1();
      cleanup2();
    };
  }, [deltaX, isSidebarFloating, posX, posXAdjusted, sidebarPos]);

  /**
   * Calculated constraints that only allow to move the image
   * if it is bigger than the viewport
   */
  const dragConstraints = useMemo(() => {
    const overflowX = Math.max(width * scale - (viewportWidth - debouncedSidebarPos), 0);
    const overflowY = Math.max(height * scale - viewportHeight, 0);
    return {
      top: -1 * (overflowY / 2),
      bottom: overflowY / 2,
      left: -1 * (overflowX / 2),
      right: overflowX / 2,
    };
  }, [debouncedSidebarPos, height, scale, viewportHeight, viewportWidth, width]);

  /**
   * Enlargens the image if entering transform mode,
   * resets image size if leaving transform mode.
   *
   * The effect below handles further cleanup tasks.
   */
  useLayoutEffect(() => {
    if (inTransformMode) setScaleState(defaultScale < 1 ? 1 : 1.2);
    else setScaleState(defaultScale);
  }, [defaultScale, inTransformMode, posX, posY]);

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
   * Attributes for all img-Tags in this component
   */
  const sharedImgAttributes = {
    alt: title,
    draggable: false,
  };

  return (
    <div className={managedClasses.imageViewer}>
      <motion.div
        className={classNames(
          managedClasses.imageViewer_imageContainer,
          [managedClasses.imageViewer__zoomedin, inTransformMode],
          [managedClasses.imageViewer__dragging, isDragging]
        )}
        ref={draggableRef}
        initial={false}
        animate={{ scale }}
        transition={{ type: "tween", duration: 0.18 }}
        draggable={false}
        drag={inTransformMode}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragElastic={0.2}
        dragConstraints={dragConstraints}
        onTapStart={onTapStart}
        onTap={onTap}
        style={{
          display: isThumbnailVisible ? "none" : "block",
          width: width,
          height: height,
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
        <img {...sharedImgAttributes} ref={imageRef} />
      </motion.div>
      <ImageViewerSlider
        show={inTransformMode}
        value={scale}
        minFactor={defaultScale}
        maxFactor={3}
        onValueChange={setScaleState}
      />
    </div>
  );
};

export default manageJss(styles)(ImageViewer);
