import React from "react";
import { Button, ButtonAppearance } from "../../_DesignSystem";
import { FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const signOut = () => {
  window.location.assign(window.location.href + "api/logout.php");
};

const DashboardHeaderRight: React.ComponentType<{}> = props => {
  const { t } = useTranslation("common");
  const title = t("logoutButton");

  return (
    <>
      <Button
        appearance={ButtonAppearance.lightweight}
        icon={FaSignOutAlt}
        onClick={signOut}
        aria-label={title}
        title={title}
      />
    </>
  );
};

export default React.memo(DashboardHeaderRight);
