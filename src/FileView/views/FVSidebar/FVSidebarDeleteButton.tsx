import React from "react";
import { FVSidebarFooterProps } from "./FVSidebarFooter.props";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import axios, { getApiPath } from "../../../_interceptedAxios";
import { Button, ButtonAppearance, toast } from "../../../_DesignSystem";
import { FaTrash } from "react-icons/fa";

/**
 * Button in FVSidebar: Deletes the currently inspected file.
 */
const FVSidebarDeleteButton: React.ComponentType<FVSidebarFooterProps> = ({
  fileData,
}) => {
  const { t } = useTranslation("dashboard");
  const history = useHistory();

  const onDelete = async () => {
    try {
      await axios.post(getApiPath("edit"), {
        selection: fileData.id,
        action: "delete",
      });

      toast.success(t("selectedDeleted", { count: 1 }));
      history.replace("/");
    } catch (err) {
      toast.error(t("error.requestGeneric") + ":", t(err.i18n, err.message));
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
