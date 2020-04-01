import React, { useState, useEffect, useCallback, Fragment } from "react";
import { FaExclamation, FaCheck } from "react-icons/fa";
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
import { ProgressIcon } from "../../_DesignSystem";
import { axios } from "../../_interceptedAxios";

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
  dropzoneUpload_image: {
    objectFit: "contain",
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
};

const ProgressStyles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
  progress_circularSVG__container: {
    ...applyElevation(ElevationMultiplier.e8),
    borderRadius: "50%",
  },
  progress_circularSVG__control: {},
  progress_circularSVG__page: {},
};

const DropzoneUpload = (props: DropzoneUploadProps) => {
  const { t } = useTranslation("dashboard");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [resData, setResData] = useState({ id: null, file_url: null });

  const onUploadProgress = (prog: ProgressEvent) =>
    setProgress(Math.round((prog.loaded * 100) / prog.total));

  const uploadFile = useCallback(async () => {
    const formData = new FormData();
    formData.set("data", props.file);

    try {
      const res = await axios.post(window.location.origin + "/api/upload.php", formData, {
        onUploadProgress,
      });
      setResData(res.data);
    } catch (err) {
      console.log("An error happened!\n", err);
      setErrorMessage(err.code ? t(err.code) : err.message || "Unknkown Error!");
      return null;
    }
  }, [props.file, t]);

  // onMount
  useEffect(() => {
    console.log("updated!");
    if (props.rejected) {
      let savedTimeout = setTimeout(props.onRemoveRequest, 6000);
      return () => clearTimeout(savedTimeout);
    }

    // Uploading process
    if (resData.id) return () => {};
    uploadFile();
    return () => {};
  }, [props.onRemoveRequest, props.rejected, resData.id, uploadFile]);

  return (
    <div className={props.managedClasses.dropzoneUpload}>
      {!props.rejected && props.preview && (
        <img
          src={props.preview}
          alt={props.file.name}
          className={props.managedClasses.dropzoneUpload_image}
          width="200"
          height="200"
        />
      )}
      <footer className={props.managedClasses.dropzoneUpload_details} tabIndex={0}>
        <Label
          className={
            props.rejected || errorMessage || resData.id
              ? props.managedClasses.dropzoneUpload_error
              : ""
          }
          tabIndex={-1}
        >
          {props.rejected ? (
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
            props.file.name
          )}
        </Label>
      </footer>
      <div className={props.managedClasses.dropzoneUpload_progress}>
        {props.rejected || errorMessage.length > 0 ? (
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
};

export default manageJss(DropzoneUploadStyles)(DropzoneUpload);
