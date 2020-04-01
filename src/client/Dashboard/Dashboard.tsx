import React, { Fragment, useState } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { DashboardClassNameContract, DashboardProps } from "./Dashboard.props";
import { Header } from "../_DesignSystem";
import DashboardEmpty from "./DashboardEmpty";
import { withDropzone } from "../FullscreenDropzone/FullscreenDropzone";

const styles: ComponentStyles<DashboardClassNameContract, DesignSystem> = {
  dashboard: {},
};

const Dashboard: React.FC<DashboardProps> = props => {
  const [isListEmpty, showListEmptyError] = useState(false);

  return (
    <Fragment>
      <Header />
      {isListEmpty ? (
        <DashboardEmpty />
      ) : (
        /*
        <div className={props.managedClasses.dashboard}>
          We haven't come to this point yet. TODO: Do this part.
        </div>
        */
        <DashboardEmpty />
      )}
    </Fragment>
  );
};

export default withDropzone(manageJss(styles)(Dashboard));
