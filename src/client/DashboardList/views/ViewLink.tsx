import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ViewLinkProps } from "./ViewLink.props";
import { LocationDescriptor } from "history";
import { useTranslation } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import axios from "../../_interceptedAxios";

/**
 * This is only used for linking to the view route.
 * This way, we can preload the data JSON.
 */
export const ViewLink: React.FC<ViewLinkProps> = props => {
  const { t } = useTranslation("common");
  const { addToast } = useToasts();
  const [shouldRedirect, changeRedirect] = useState(false);
  const id = props.to.toString().substr(1, props.to.toString().length - 2);

  const onClick: React.MouseEventHandler = async e => {
    e.preventDefault();
    if (!props.disabled) {
      try {
        const res = await axios.get(window.location.origin + "/api/get.php", {
          params: { id },
        });
        window.fileData = res.data;
        changeRedirect(true);
      } catch (err) {
        addToast(t("error.requestFile", { id }), { appearance: "error" });
        console.log(t("error.requestFile", { id }), "\n", err.message);
      }
    }
  };

  return (
    <>
      <Link {...props} title={t("goto", { name: id })} onClick={onClick} />
      {shouldRedirect && <Redirect push to={props.to as LocationDescriptor} />}
    </>
  );
};
