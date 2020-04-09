import React, { Fragment, useState, useEffect } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DashboardClassNameContract, DashboardProps } from "./Dashboard.props";
import { Header, useToasts } from "../_DesignSystem";
import DashboardEmpty from "./views/DashboardEmpty";
import { withDropzone } from "../FullscreenDropzone/FullscreenDropzone";
import axios from "../_interceptedAxios";
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

  const onDeleteSelected = async (selection: string[]) => {
    try {
      await axios.post(window.location.origin + "/api/editMultiple.php", {
        selection,
        action: "delete",
      });

      addToast("", {
        appearance: "success",
        title: t("itemsDeleted", { count: selection.length }),
      });
      setListData(
        listData.filter(obj => selection.findIndex(id => id === obj.id) === -1)
      );
    } catch (err) {
      addToast(t(err.i18n, err.message), {
        appearance: "error",
        title: t("error.requestGeneric") + ":",
      });
      console.log(`${t("error.requestGeneric")}:\n`, `(${err.code}) - ${err.message}`);
    }
  };

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
        <DashboardList listData={listData} onDeleteSelected={onDeleteSelected} />
      )}
    </Fragment>
  );
};

export default withDropzone(manageJss(styles)(Dashboard));
