/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState, useEffect, useCallback } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  FullscreenDropzoneClassNameContract,
  FullscreenDropzoneProps,
} from "./FullscreenDropzone.props";
import { classNames } from "@microsoft/fast-web-utilities";
import { useDropzone } from "react-dropzone";
import DropzoneDrag from "./views/DropzoneDrag";
import {
  Dialog,
  DialogClassNameContract,
  Typography,
  TypographyTag,
  TypographySize,
  ButtonAppearance,
} from "@microsoft/fast-components-react-msft";
import { Button } from "../_DesignSystem";
import DropzoneUploadManager from "./views/DropzoneUploadManager";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

const FullscreenDropzoneStyles: ComponentStyles<
  FullscreenDropzoneClassNameContract,
  DesignSystem
> = {
  fullscreenDropzone: {
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)",
    zIndex: "3",
    paddingTop: "0",
  },
  // The dialog can also be opened with a button
  fullscreenDropzone_visisble: {
    display: "block",
  },
  // While dragging, only fullscreenDropzone should be accessable
  fullscreenDropzone_dragging: {
    pointerEvents: "none",
  },
  fullscreenDropzoneDialogContent_header: {
    display: "flex",
    justifyContent: "space-between",
    outline: "none",
    marginBottom: "20px",
  },
  fullscreenDropzoneDialogContent_buttons: {
    display: "flex",
    alignItems: "center",
    "& > *:first-child": {
      marginRight: "10px",
    },
  },
};

const DialogStyles: ComponentStyles<DialogClassNameContract, DesignSystem> = {
  dialog_contentRegion: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: "21px 24px",
    borderRadius: "10px",
    width: "50vw !important",
    height: "auto !important",
    maxHeight: "70vh",
    minHeight: "480px",
    "& > h1": {
      cursor: "default",
    },
  },
  "@media (max-width: 920px)": {
    dialog_contentRegion: {
      width: "80vw !important",
    },
  },
};

/**
 * Component for setting up a fullscreen dropzone.
 * It consists of the dragover-logic and a modal that shows the upload progress afterwards.
 */
const FullscreenDropzone = (
  WrappedComponent: React.ComponentClass | React.FunctionComponent
): React.FC<FullscreenDropzoneProps> => {
  return props => {
    const [isUploadDialogVisible, setDialogVisibility] = useState(false);
    const [isDragActive, setDragState] = useState(false);
    const [preventDialogHiding, setDialogHidingPrevention] = useState(false);
    const [dropData, setDropData] = useState({ acceptedFiles: [], rejectedFiles: [] });
    const { t } = useTranslation("dashboard");
    let lastDropTarget = null;

    /**
     * Callback function for showing the upload modal if a draggable appears in the viewport.
     *
     * @param {DragEvent} e The provided DragEvent object.
     */
    const onDocumentDragOver = (e: DragEvent) => {
      const { dataTransfer, target } = e;

      if (dataTransfer.types && dataTransfer.types.indexOf("Files") !== -1) {
        lastDropTarget = target;
        if (!isUploadDialogVisible) setDialogVisibility(true);
        if (!isDragActive) setDragState(true);
      }
    };

    /**
     * Callback function for hiding the upload modal if nothing is dragged into anymore.
     *
     * We additionally check, whether we lost contact with ```lastDropTarget```,
     * which should always be ```.fullscreenDropzone```.
     * This way, we make sure that the dragged item is still in the viewport.
     *
     * @param {DragEvent} e The provided DragEvent object.
     */
    const onDocumentDragLeave = (e: DragEvent) => {
      if (e.target === lastDropTarget || e.target === document) {
        if (isDragActive) setDragState(false);
        if (!preventDialogHiding) setDialogVisibility(false);
      }
    };

    /**
     * We send the data down to a separate component which handles all uploads.
     */
    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: File[]) => {
        if (!preventDialogHiding) setDialogHidingPrevention(true);
        setDragState(false);
        setDropData({ acceptedFiles, rejectedFiles });
      },
      [preventDialogHiding]
    );

    const close = () => {
      setDialogHidingPrevention(false);
      setDragState(false);
      setDialogVisibility(false);
    };

    /**
     * Setting up and removing event listeners on mounting and demounting
     */
    useEffect(() => {
      window.addEventListener("dragover", onDocumentDragOver);
      window.addEventListener("dragleave", onDocumentDragLeave);

      return () => {
        window.removeEventListener("dragover", onDocumentDragOver);
        window.removeEventListener("dragleave", onDocumentDragLeave);
      };
    });

    const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      noClick: true,
      accept: ["image/jpeg", "image/png", "image/gif"],
    });

    return (
      <Fragment>
        <WrappedComponent {...props} />
        <div
          className={classNames(props.managedClasses.fullscreenDropzone, [
            props.managedClasses.fullscreenDropzone_visisble,
            isUploadDialogVisible,
          ])}
          {...getRootProps()}
        >
          <input type="hidden" {...getInputProps()} />
          <Dialog
            className={classNames([
              props.managedClasses.fullscreenDropzone_dragging,
              isDragActive,
            ])}
            jssStyleSheet={DialogStyles}
            visible={true}
            label={t("upload.aria.dialogLabel")}
            modal={true}
            tabIndex={-1}
          >
            {isDragActive && <DropzoneDrag />}
            <header
              tabIndex={-1}
              className={props.managedClasses.fullscreenDropzoneDialogContent_header}
            >
              <Typography role="title" tag={TypographyTag.h1} size={TypographySize._4}>
                {t("upload.title")}
              </Typography>
              <section
                className={props.managedClasses.fullscreenDropzoneDialogContent_buttons}
              >
                <Button appearance={ButtonAppearance.primary} onClick={open}>
                  {t("upload.select")}
                </Button>
                <Button
                  icon={FaTimes}
                  appearance={ButtonAppearance.stealth}
                  onClick={close}
                />
              </section>
            </header>
            <DropzoneUploadManager dropData={dropData} />
          </Dialog>
        </div>
      </Fragment>
    );
  };
};

export const withDropzone = (
  WrappedComponent: React.ComponentClass | React.FunctionComponent
) => manageJss(FullscreenDropzoneStyles)(FullscreenDropzone(WrappedComponent));
