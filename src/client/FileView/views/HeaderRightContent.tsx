import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralForegroundHint,
} from "@microsoft/fast-components-styles-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { FaAdjust, FaCaretLeft, FaSearchPlus, FaShareAlt, FaInfo } from "react-icons/fa";
import { Button } from "../../_DesignSystem";
import { ButtonClassNameContract } from "../../_DesignSystem/Button/Button.props";
import { HeaderRightContentProps } from "./HeaderRightContent.props";

/**
 * Custom styling for sidebar toggle.
 */
const customCaretStyle: ComponentStyles<ButtonClassNameContract, DesignSystem> = {
  button: {
    marginRight: "-23px",
    borderRadius: "0",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    paddingRight: "33px",
    paddingLeft: "8px",
    paddingTop: "6px",
    border: "1px solid",
    borderColor: neutralForegroundHint,
    "&:hover": {
      transform: "translateX(-3px)",
    },
    "& svg:first-child": {
      paddingTop: "2px",
    },
  },
};

export const HeaderRightContent: React.ComponentType<HeaderRightContentProps> = () => {
  return (
    <>
      <Button appearance={ButtonAppearance.lightweight} icon={FaAdjust} />
      <Button appearance={ButtonAppearance.lightweight} icon={FaSearchPlus} />
      <Button appearance={ButtonAppearance.lightweight} icon={FaShareAlt} />
      <Button
        beforeContent={classname => (
          <>
            <FaCaretLeft className={classname} />
            <FaInfo className={classname} />
          </>
        )}
        jssStyleSheet={customCaretStyle}
      />
    </>
  );
};
