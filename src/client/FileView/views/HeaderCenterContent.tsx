import React from "react";
import { HeaderCenterContentProps } from "./HeaderCenterContent.props";
import { Paragraph } from "@microsoft/fast-components-react-msft";

export const HeaderCenterContent: React.ComponentType<HeaderCenterContentProps> = props => {
  let { title } = props.fileData;
  return title === "untitled" ? null : <Paragraph size={2}>{title}</Paragraph>;
};
