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
import { motion } from "framer-motion";

const styles: ComponentStyles<NotFoundClassNameContract, DesignSystem> = {
  notFound: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    width: "100%",
    height: "100%",
  },
  notFound_container: {
    flexGrow: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  notFound_icon: {
    fontSize: "4em",
    color: neutralForegroundRest,
  },
};

const NotFound: React.ComponentType<NotFoundProps> = ({ managedClasses }) => {
  const { t } = useTranslation("common");

  return (
    <motion.div
      className={managedClasses.notFound}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <div className={managedClasses.notFound_container}>
        <FaHeartBroken className={managedClasses.notFound_icon} />
        <Heading tag={HeadingTag.h1} size={2}>
          {t("notFound.title")}
        </Heading>
        <Heading tag={HeadingTag.h2} size={5}>
          {t("notFound.description")}
        </Heading>
      </div>
    </motion.div>
  );
};

export default manageJss(styles)(NotFound);
