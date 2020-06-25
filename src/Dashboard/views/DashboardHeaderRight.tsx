import React from "react";
import { Button, ButtonAppearance } from "../../_DesignSystem";
import { FaSignOutAlt } from "react-icons/fa";

const signOut = () => {
  window.location.assign(window.location.href + "api/logout.php");
};

const DashboardHeaderRight: React.ComponentType<{}> = props => {
  return (
    <Button
      appearance={ButtonAppearance.lightweight}
      icon={FaSignOutAlt}
      onClick={signOut}
    />
  );
};

export default DashboardHeaderRight;
