import React, { Fragment, useState, useEffect } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DashboardClassNameContract, DashboardProps } from "./Dashboard.props";
import { Header, useToasts } from "../_DesignSystem";
import DashboardEmpty from "./views/DashboardEmpty";
import { withDropzone } from "../FullscreenDropzone/FullscreenDropzone";
import { axios } from "../_interceptedAxios";
import { useTranslation } from "react-i18next";
import { ListDataItem } from "../DashboardList/DashboardList.props";
import { FullscreenLoader } from "../Loader";

const DashboardList = FullscreenLoader(import("../DashboardList/DashboardList"));

const styles: ComponentStyles<DashboardClassNameContract, DesignSystem> = {
  dashboard: {},
};

const Dashboard: React.FC<DashboardProps> = props => {
  const [listData, setListData] = useState<ListDataItem[]>(null);
  const { addToast } = useToasts();
  const { t } = useTranslation("dashboard");

  useEffect(() => {
    const updateFileList = async () => {
      try {
        const res = await axios.get(window.location.origin + "/api/getAll.php");
        setListData(res.data);
      } catch (err) {
        addToast(t(err.i18n, err.message), {
          appearance: "error",
          title: t("error.listGeneric") + ":",
        });
        console.log(`${t("error.listGeneric")}:\n`, `(${err.code}) - ${err.message}`);
      }
    };

    updateFileList();
  }, [addToast, t]);

  return (
    <Fragment>
      <Header fixed />
      {listData === null ? null : listData.length === 0 ? (
        <DashboardEmpty />
      ) : (
        /*
        <div className={props.managedClasses.dashboard}>
          We haven't come to this point yet. TODO: Do this part.
        </div>
        */
        <DashboardList listData={listData} />
      )}
    </Fragment>
  );
};

export default withDropzone(manageJss(styles)(Dashboard));
