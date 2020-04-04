import React, { Fragment } from "react";
import { Heading, HeadingTag } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { NotFoundClassNameContract, NotFoundProps } from "./NotFound.props";
import { Header } from "../_DesignSystem";
import { FaHeartBroken } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const styles: ComponentStyles<NotFoundClassNameContract, DesignSystem> = {
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundIcon: {
    fontSize: "4em",
    color: neutralForegroundRest,
  },
};

const NotFound: React.FC<NotFoundProps> = props => {
  const { t } = useTranslation("common");

  return (
    <Fragment>
      <Header />
      <div className={props.managedClasses.notFound}>
        <FaHeartBroken className={props.managedClasses.notFoundIcon} />
        <Heading tag={HeadingTag.h1} size={2}>
          {t("notFound.title")}
        </Heading>
        <Heading tag={HeadingTag.h2} size={5}>
          {t("notFound.description")}
        </Heading>
      </div>
    </Fragment>
  );
};

export default manageJss(styles)(NotFound);
