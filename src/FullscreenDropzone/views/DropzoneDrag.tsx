import React from "react";
import { FaImages } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Heading, HeadingTag } from "@microsoft/fast-components-react-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DropzoneDragClassNameContract, DropzoneDragProps } from "./DropzoneDrag.props";
import {
  neutralForegroundRest,
  DesignSystem,
  backgroundColor,
} from "@microsoft/fast-components-styles-msft";
import { applyCenteredFlexbox } from "../../_DesignSystem";

const styles: ComponentStyles<DropzoneDragClassNameContract, DesignSystem> = {
  dropzoneDrag: {
    position: "absolute",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    top: "0",
    left: "0",
    textAlign: "center",
    padding: "21px 24px",
    background: backgroundColor,
    borderRadius: "10px",
    zIndex: "100",
    ...applyCenteredFlexbox(),
  },
  dropzoneDragIcon: {
    fontSize: "4em",
    color: (designSystem: DesignSystem): string => neutralForegroundRest(designSystem),
  },
};

const DropzoneDrag = (props: DropzoneDragProps) => {
  const { t } = useTranslation("dashboard");
  return (
    <div className={props.managedClasses.dropzoneDrag}>
      <FaImages className={props.managedClasses.dropzoneDragIcon} />
      <Heading tag={HeadingTag.h1} size={2}>
        {t("upload.dropTitle")}
      </Heading>
      <Heading tag={HeadingTag.h2} size={5}>
        {t("upload.dropDescription")}
      </Heading>
    </div>
  );
};

export default manageJss(styles)(DropzoneDrag);
