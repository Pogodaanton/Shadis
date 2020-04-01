import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Heading, HeadingTag } from "@microsoft/fast-components-react-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DropzoneErrorClassNameContract,
  DropzoneErrorProps,
} from "./DropzoneError.props";
import {
  neutralForegroundRest,
  DesignSystem,
} from "@microsoft/fast-components-styles-msft";

const styles: ComponentStyles<DropzoneErrorClassNameContract, DesignSystem> = {
  dropzoneErrorIcon: {
    fontSize: "4em",
    color: (designSystem: DesignSystem): string => neutralForegroundRest(designSystem),
  },
};

const DropzoneError = (props: DropzoneErrorProps) => {
  const { t } = useTranslation("dashboard");
  return (
    <React.Fragment>
      <FaExclamationTriangle className={props.managedClasses.dropzoneErrorIcon} />
      <Heading tag={HeadingTag.h1} size={2}>
        {t("upload.error.title")}
      </Heading>
      <Heading tag={HeadingTag.h2} size={5}>
        {props.error}
      </Heading>
    </React.Fragment>
  );
};

export default manageJss(styles)(DropzoneError);
