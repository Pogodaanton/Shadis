import React from "react";
import { Button, ButtonAppearance } from "../../_DesignSystem";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { EEDropzone } from "../../FullscreenDropzone/FullscreenDropzone";

const signOut = () => window.location.assign(window.location.href + "api/logout.php");
const upload = () => EEDropzone.emit("open");

const DashboardHeaderRight: React.ComponentType<{}> = React.memo(() => {
  const { t } = useTranslation(["common", "dashboard"]);
  const logoutTitle = t("common:logoutButton");
  const uploadTitle = t("dashboard:upload.button");

  return (
    <>
      <Button appearance={ButtonAppearance.lightweight} icon={FaUpload} onClick={upload}>
        {uploadTitle}
      </Button>
      <Button
        appearance={ButtonAppearance.lightweight}
        icon={FaSignOutAlt}
        onClick={signOut}
        aria-label={logoutTitle}
        title={logoutTitle}
      />
    </>
  );
});

export default React.memo(DashboardHeaderRight);
