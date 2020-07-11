import React, { useState, useContext } from "react";
import {
  FVSidebarDescEditorProps,
  FVSidebarDescEditorClassNameContract,
} from "./FVSidebarDescEditor.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  TextAction,
  Progress,
  ProgressClassNameContract,
} from "@microsoft/fast-components-react-msft";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import axios, { getApiPath } from "../../../_interceptedAxios";
import { toast } from "../../../_DesignSystem";
import { useTranslation } from "react-i18next";
import { SidebarData } from "./FVSidebarContext";

const styles: ComponentStyles<FVSidebarDescEditorClassNameContract, DesignSystem> = {
  "@keyframes fadeAway": {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
  fv_sidebar_descEditor: {
    marginTop: "5px",
  },
  fv_sidebar_descEditor_check: {
    animationName: "fadeAway",
    animationDuration: "5s",
    animationDelay: "2s",
    animationFillMode: "forwards",
    animationTimingFunction: "linear",
  },
};

const progressStyles: ComponentStyles<ProgressClassNameContract, DesignSystem> = {
  progress_circularSVG__container: {
    width: "auto",
    height: "auto",
  },
  progress_circularSVG__control: {},
  progress_circularSVG__page: {},
};

const FVSidebarDescEditor: React.ComponentType<FVSidebarDescEditorProps> = ({
  managedClasses,
  fileData,
}) => {
  const { t } = useTranslation("common");
  const { setFileTitle, fileTitle } = useContext(SidebarData);
  const [loadingState, setLoadingState] = useState<
    "loading" | "success" | "error" | null
  >(null);

  const onFocus = () => loadingState !== "error" && setLoadingState(null);

  /**
   * Saves changes to title if user leaves the input element.
   */
  const onBlur: React.FocusEventHandler<HTMLInputElement> = async ({ currentTarget }) => {
    let { value } = currentTarget;
    value = value.trim();

    // Avoid saving the same
    if (value === fileTitle) return;

    // If the request takes too long, <Progress/> should appear
    const deferredLoading = setTimeout(() => setLoadingState("loading"), 500);

    try {
      await axios.post(getApiPath("edit"), {
        selection: fileData.id,
        value,
        action: "editTitle",
      });

      clearTimeout(deferredLoading);
      setLoadingState("success");
      setFileTitle(value);
    } catch (err) {
      clearTimeout(deferredLoading);
      setLoadingState("error");
      toast.error(t("error.requestGeneric") + ":", t(err.i18n, err.message));
      console.log(`${t("error.requestGeneric")}:\n`, `(${err.code}) - ${err.message}`);
    }
  };

  return (
    <TextAction
      className={managedClasses.fv_sidebar_descEditor}
      name="description"
      placeholder={"-"}
      defaultValue={!fileTitle || fileTitle === "untitled" ? "" : fileTitle}
      onBlur={onBlur}
      onFocus={onFocus}
      maxLength={255}
      afterGlyph={name =>
        loadingState === "loading" ? (
          <Progress
            className={name}
            circular={true}
            minValue={0}
            maxValue={100}
            value={0}
            jssStyleSheet={progressStyles}
          />
        ) : loadingState === "success" ? (
          <FaCheck className={name + " " + managedClasses.fv_sidebar_descEditor_check} />
        ) : (
          loadingState === "error" && <FaExclamationTriangle className={name} />
        )
      }
    />
  );
};

export default manageJss(styles)(FVSidebarDescEditor);
