import React, { useContext } from "react";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { SidebarData } from "../FVSidebar/FVSidebarContext";
import { useTransform, motion } from "framer-motion";

export const HeaderCenterContent: React.ComponentType<{}> = () => {
  const { sidebarPos, fileTitle } = useContext(SidebarData);
  const headerCenterPos = useTransform(sidebarPos, pos => pos * 0.3 * -1);
  const headerCenterOpacity = useTransform(sidebarPos, pos =>
    Math.max(0, pos * (-1 / 300) + 1)
  );

  return !fileTitle || fileTitle === "untitled" ? null : (
    <motion.div
      style={{
        x: headerCenterPos,
        opacity: headerCenterOpacity,
      }}
    >
      <Paragraph size={2}>{fileTitle}</Paragraph>
    </motion.div>
  );
};
