import React from "react";
import { FVSidebarFooterProps } from "./FVSidebarFooter.props";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import axios from "../../../_interceptedAxios";
import { Button, ButtonAppearance, useToasts } from "../../../_DesignSystem";
import { FaTrash } from "react-icons/fa";

/**
 * Button in FVSidebar: Deletes the currently inspected file.
 */
const FVSidebarDeleteButton: React.ComponentType<FVSidebarFooterProps> = ({
  fileData,
}) => {
  const { t } = useTranslation("dashboard");
  const { addToast } = useToasts();
  const history = useHistory();

  const onDelete = async () => {
    try {
      await axios.post(window.location.origin + "/api/edit.php", {
        selection: fileData.id,
        action: "delete",
      });

      addToast("", {
        appearance: "success",
        title: t("selectedDeleted", { count: 1 }),
      });

      history.replace("/");
    } catch (err) {
      addToast(t(err.i18n, err.message), {
        appearance: "error",
        title: t("error.requestGeneric") + ":",
      });
      console.log(`${t("error.requestGeneric")}:\n`, `(${err.code}) - ${err.message}`);
    }
  };

  return (
    <Button appearance={ButtonAppearance.stealth} icon={FaTrash} onClick={onDelete}>
      {t("delete")}
    </Button>
  );
};

export default FVSidebarDeleteButton;
