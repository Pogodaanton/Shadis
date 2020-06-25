import React, { useState, useEffect, useCallback, Fragment, useRef } from "react";
import { FaExclamation, FaCheck, FaRegFrownOpen } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  Progress,
  Label,
  ProgressClassNameContract,
  Hypertext,
} from "@microsoft/fast-components-react-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DropzoneUploadClassNameContract,
  DropzoneUploadProps,
} from "./DropzoneUpload.props";
import {
  neutralForegroundRest,
  DesignSystem,
  neutralLayerCard,
  applyAcrylicMaterial,
  applyElevation,
  ElevationMultiplier,
  backgroundColor,
} from "@microsoft/fast-components-styles-msft";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { ProgressIcon, getScaleFactorByConstraints } from "../../_DesignSystem";
import axios from "../../_interceptedAxios";

const DropzoneUploadStyles: ComponentStyles<
  DropzoneUploadClassNameContract,
  DesignSystem
> = {
  dropzoneUpload: {
    position: "relative",
    overflow: "hidden",
    width: "200px",
    height: "200px",
    background: neutralLayerCard,
    ...applyElevation(ElevationMultiplier.e5),
    "&:hover > footer": {
      transform: "translateY(0%)",
    },
  },
  dropzoneUpload_preview: {
    position: "absolute",
    left: "0",
    top: "0",
  },
  dropzoneUpload_background: {
    filter: "blur(14px)",
    transform: "scale(1.1)",
    opacity: ".8",
  },
  dropzoneUpload_details: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "10px 50px 10px 10px",
    boxSizing: "border-box",
    display: "flex",
    textAlign: "left",
    lineBreak: "anywhere",
    transform: "translateY(100%)",
    transition: "transform .15s",
    minHeight: "57px",
    ...applyAcrylicMaterial("#000000", 0.8),
    background: des => parseColorHexRGBA(backgroundColor(des) + "cc").toStringWebRGBA(),
    "&.focus-visible, &:focus-within": {
      transform: "translateY(0%)",
    },
  },
  dropzoneUpload_progress: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
  },
  dropzoneUpload_error: {
    lineBreak: "initial",
  },
  dropzoneUploadIcon: {
    fontSize: "4em",
    color: neutralForegroundRest,
  },
  dropzoneUpload_rejectIcon: {
    width: "55px",
    height: "55px",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
  },
};

const ProgressStyles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
  progress_circularSVG__container: {
    ...applyElevation(ElevationMultiplier.e8),
    borderRadius: "50%",
  },
  progress_circularSVG__control: {},
  progress_circularSVG__page: {},
};

/**
 * Centers and scales a given ImageSource,
 * so that it fits onto a specified canvas
 */
const alignImageToCanvas = (
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  ctx: CanvasRenderingContext2D
) => {
  const canvas = ctx.canvas;
  const factor = getScaleFactorByConstraints(
    srcWidth,
    srcHeight,
    canvas.width,
    canvas.height
  );
  const deltaX = (canvas.width - srcWidth * factor) / 2;
  const deltaY = (canvas.height - srcHeight * factor) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    source,
    0,
    0,
    srcWidth,
    srcHeight,
    deltaX,
    deltaY,
    srcWidth * factor,
    srcHeight * factor
  );
};

/**
 * Centers and scales a given ImageSource,
 * so that it fills the entire canvas space
 */
const coverCanvasWithImage = (
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  ctx: CanvasRenderingContext2D
) => {
  const canvas = ctx.canvas;
  let factor = 0;

  if (srcHeight > srcWidth) factor = canvas.width / srcWidth;
  else factor = canvas.height / srcHeight;

  const deltaX = (canvas.width - srcWidth * factor) / 2;
  const deltaY = (canvas.height - srcHeight * factor) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    source,
    0,
    0,
    srcWidth,
    srcHeight,
    deltaX,
    deltaY,
    srcWidth * factor,
    srcHeight * factor
  );
};

const DropzoneUpload: React.ComponentType<DropzoneUploadProps> = React.memo(
  ({ managedClasses, rejected, file, onRemoveRequest, preview }) => {
    const { t } = useTranslation("dashboard");
    const [hasStartedUpload, setUploadState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [resData, setResData] = useState({ id: null, file_url: null });

    /**
     * Ref of the canvas that is used to depict the currently uploaded item
     */
    const canvasRef = useRef<HTMLCanvasElement>();

    /**
     * Ref of the canvas that is used as a background element
     */
    const canvasBgRef = useRef<HTMLCanvasElement>();

    const onUploadProgress = (prog: ProgressEvent) =>
      setProgress(Math.round((prog.loaded * 100) / prog.total));

    const uploadFile = useCallback(async () => {
      const formData = new FormData();
      formData.set("data", file);
      setUploadState(true);

      try {
        const res = await axios.post(
          window.location.origin + "/api/upload.php",
          formData,
          { onUploadProgress }
        );
        setResData(res.data);
      } catch (err) {
        console.log("An error happened!\n", err);
        setErrorMessage(err.i18n ? t(err.i18n) : err.message || "Unknkown Error!");
        return null;
      }
    }, [file, t]);

    useEffect(() => {
      // Request umounting if upload has been rejected
      if (rejected) {
        let savedTimeout = setTimeout(onRemoveRequest, 6000);
        return () => clearTimeout(savedTimeout);
      }

      // Abort if upload has already started
      if (hasStartedUpload) return;
      uploadFile();
    }, [hasStartedUpload, onRemoveRequest, rejected, uploadFile]);

    /**
     * Preview image generation.
     */
    useEffect(() => {
      if (rejected || !preview) return;

      const type = file.type.split("/")[0];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const ctxBg = canvasBgRef.current.getContext("2d");

      console.log(preview, file.type, canvasRef.current, type);

      if (type === "image") {
        const img = new Image();
        img.addEventListener("load", () => {
          alignImageToCanvas(img, img.width, img.height, ctx);
          coverCanvasWithImage(img, img.width, img.height, ctxBg);
        });
        img.src = preview;
        return;
      }

      if (type === "video") {
        const video = document.createElement("video");
        video.style.position = "fixed";
        video.autoplay = false;
        video.addEventListener("loadeddata", () => {
          const seekHandler = () => {
            video.removeEventListener("seeked", seekHandler);
            video.pause();
            console.log("seeked!");
            alignImageToCanvas(video, video.videoWidth, video.videoHeight, ctx);
            coverCanvasWithImage(video, video.videoWidth, video.videoHeight, ctxBg);
          };
          video.addEventListener("seeked", seekHandler);
          video.currentTime = 0;
          video.play();
        });
        video.src = preview;
        document.body.appendChild(video);
      }
    }, [file.type, preview, rejected]);

    return (
      <div className={managedClasses.dropzoneUpload}>
        {!rejected ? (
          preview && (
            <>
              <canvas
                ref={canvasBgRef}
                className={managedClasses.dropzoneUpload_background}
                width="200"
                height="200"
              />
              <canvas
                ref={canvasRef}
                className={managedClasses.dropzoneUpload_preview}
                width="200"
                height="200"
              />
            </>
          )
        ) : (
          <FaRegFrownOpen className={managedClasses.dropzoneUpload_rejectIcon} />
        )}
        <footer className={managedClasses.dropzoneUpload_details} tabIndex={0}>
          <Label
            className={
              rejected || errorMessage || resData.id
                ? managedClasses.dropzoneUpload_error
                : ""
            }
            tabIndex={-1}
          >
            {rejected ? (
              t("upload.error.unsupported")
            ) : errorMessage ? (
              errorMessage
            ) : resData.id ? (
              <Fragment>
                {t("upload.finished", { filename: resData.id })}
                <br />
                <Hypertext href={resData.file_url} target="_">
                  {t("upload.visit")}
                </Hypertext>
              </Fragment>
            ) : (
              file.name
            )}
          </Label>
        </footer>
        <div className={managedClasses.dropzoneUpload_progress}>
          {rejected || errorMessage.length > 0 ? (
            <ProgressIcon icon={FaExclamation} />
          ) : progress === 100 ? (
            <ProgressIcon icon={FaCheck} />
          ) : (
            <Progress
              jssStyleSheet={ProgressStyles}
              circular={true}
              minValue={0}
              maxValue={100}
              value={progress}
            />
          )}
        </div>
      </div>
    );
  }
);

export default manageJss(DropzoneUploadStyles)(DropzoneUpload);
