import React from "react";
import { ToastProps, ToastClassNameContract, ToastGlyphList } from "./Toast.props";
import {
  DesignSystem,
  neutralLayerFloating,
  applyFloatingCornerRadius,
  applyElevation,
  ElevationMultiplier,
  neutralForegroundRest,
  applyFontWeightBold,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { useToast } from "react-toastify";
import { classNames } from "@microsoft/fast-web-utilities";
import { FaCheck, FaInfo, FaExclamationTriangle, FaBan, FaTasks } from "react-icons/fa";
import { Progress } from "@microsoft/fast-components-react-msft";
import DismissButton from "../DismissButton/DismissButton";
import Countdown from "../Countdown/Countdown";

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

/**
 * Icons that are prepended to the content.
 * Their background are colorized according to the type of toast.
 */
const toastGlyphs: ToastGlyphList = {
  info: FaTasks,
  success: FaCheck,
  warning: FaExclamationTriangle,
  error: FaBan,
  default: FaInfo,
};

const styles: ComponentStyles<ToastClassNameContract, DesignSystem> = {
  toast: {
    display: "flex",
    marginBottom: "8px",
    width: "360px",
    alignItems: "center",
    position: "relative",
    maxHeight: "800px",
    backgroundColor: neutralLayerFloating,
    // transition: "transform 220ms cubic-bezier(0.2,0,0,1),opacity 220ms",
    ...applyFloatingCornerRadius(),
    ...applyElevation(ElevationMultiplier.e9),
  },
  toast_icon: {
    display: "flex",
    backgroundColor: "#2684FF",
    padding: "8px 5px",
    color: "#fff",
    flexShrink: "0",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
    justifyContent: "center",
    width: "30px",
    "& > svg": {
      display: "inline-block",
      verticalAlign: "text-top",
      fill: "currentColor",
      zIndex: "1",
    },
    "$toast__success &": {
      backgroundColor: "#36B37E",
    },
    "$toast__warning &": {
      backgroundColor: "#FFAB00",
    },
    "$toast__error &": {
      backgroundColor: "#FF5630",
    },
  },
  toast__default: {},
  toast__info: {},
  toast__success: {},
  toast__warning: {},
  toast__error: {},
  toast_text: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: "1",
    fontSize: "14px",
    lineHeight: "1.2",
    minHeight: "40px",
    padding: "8px 12px",
    color: (des: DesignSystem) => neutralForegroundRest(des),
    "& > span:first-child": {
      ...applyFontWeightBold(),
    },
  },
  toast_progress: {
    marginTop: "5px",
  },
};

/**
 * Custom Toast component that adds glyphs next to the content and
 * uses the progressbar as an additional optional component of the Toast.
 */
const Toast: React.ComponentType<ToastProps> = props => {
  const { isRunning, preventExitTransition, toastRef, eventHandlers } = useToast(props);
  let { progress } = props;
  const {
    autoClose,
    closeButton,
    onClick,
    type,
    hideProgressBar,
    closeToast,
    transition: Transition,
    position,
    className,
    style,
    bodyClassName,
    bodyStyle,
    progressClassName,
    progressStyle,
    updateId,
    role,
    toastId,
    deleteToast,
    content: Content,
    managedClasses,
  } = props;

  const toastTypeName = "toast__" + type;
  const Glyph = toastGlyphs[type];

  const controlledProgress = typeof progress !== "undefined";

  function renderCloseButton(closeButton: any) {
    const props = { closeToast, type };

    if (!closeButton) return <DismissButton {...props} />;
    if (typeof closeButton === "function") return closeButton(props);
    if (React.isValidElement(closeButton)) return React.cloneElement(closeButton, props);
  }

  return (
    <Transition
      in={props.in!}
      appear
      done={deleteToast}
      position={position}
      preventExitTransition={preventExitTransition}
      nodeRef={toastRef}
    >
      <div
        id={toastId as string}
        onClick={onClick}
        className={classNames(
          managedClasses.toast,
          hasKey(managedClasses, toastTypeName) ? managedClasses[toastTypeName] : "",
          className
        )}
        {...eventHandlers}
        style={style}
        ref={toastRef}
      >
        <div className={managedClasses.toast_icon}>
          <Glyph />
          {!controlledProgress && autoClose && !hideProgressBar && (
            <Countdown
              {...(updateId && !controlledProgress ? { key: `pb-${updateId}` } : {})}
              delay={autoClose as number}
              isRunning={isRunning}
              isIn={props.in}
              closeToast={closeToast}
              hide={hideProgressBar}
              type={type}
              style={progressStyle}
              className={progressClassName}
            />
          )}
        </div>
        <div
          {...(props.in && { role: role })}
          className={classNames(managedClasses.toast_text, bodyClassName)}
          style={bodyStyle}
        >
          {Content}
          {controlledProgress && !hideProgressBar && (
            <Progress
              {...(updateId && !controlledProgress ? { key: `pb-${updateId}` } : {})}
              minValue={0}
              maxValue={100}
              className={classNames(managedClasses.toast_progress, progressClassName)}
              style={progressStyle}
              // To satisfy Typescript, we need to make sure `progress` is indeed typeof number
              {...(progress > 0 ? { value: parseInt(progress.toString()) } : {})}
            />
          )}
        </div>
        {renderCloseButton(closeButton)}
      </div>
    </Transition>
  );
};

export default manageJss(styles)(Toast);
