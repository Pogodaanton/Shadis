import React, { useState } from "react";
import { FVSidebarFooterProps } from "./FVSidebarFooter.props";
import { useTranslation } from "react-i18next";
import { Button, ButtonAppearance } from "../../../_DesignSystem";
import { FaMagic } from "react-icons/fa";
import { generateGifFromVideo } from "../../../_Workers/VideoGifGenerator/VideoGifGeneratorEvents";

/**
 * Button in FVSidebar: Adds the currently insepcted video to the GIF generation queue.
 */
const FVSidebarConvertButton: React.ComponentType<FVSidebarFooterProps> = ({
  fileData,
}) => {
  const { t } = useTranslation("dashboard");
  const [isDisabled, setDisabledState] = useState<boolean>(false);

  const onDelete = (e: React.MouseEvent<HTMLElement>) => {
    setDisabledState(true);
    generateGifFromVideo(fileData);
  };

  return (
    <Button
      appearance={ButtonAppearance.stealth}
      icon={FaMagic}
      onClick={onDelete}
      disabled={isDisabled}
    >
      {t("generate")}
    </Button>
  );
};

export default FVSidebarConvertButton;
