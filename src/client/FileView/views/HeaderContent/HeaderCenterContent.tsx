import React, { useContext } from "react";
import { HeaderCenterContentProps } from "./HeaderCenterContent.props";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { SidebarData } from "../FVSidebar/FVSidebarContext";
import { useTransform, motion } from "framer-motion";

export const HeaderCenterContent: React.ComponentType<HeaderCenterContentProps> = props => {
  let { title } = props.fileData;
  const { sidebarPos } = useContext(SidebarData);
  const headerCenterPos = useTransform(sidebarPos, pos => pos * 0.3 * -1);
  const headerCenterOpacity = useTransform(sidebarPos, pos =>
    Math.max(0, pos * (-1 / 300) + 1)
  );

  return !title || title === "untitled" ? null : (
    <motion.div
      style={{
        x: headerCenterPos,
        opacity: headerCenterOpacity,
      }}
    >
      <Paragraph size={2}>{title}</Paragraph>
    </motion.div>
  );
};
