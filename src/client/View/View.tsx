import React, { Component, Fragment } from "react";
import { Heading, HeadingTag } from "@microsoft/fast-components-react-msft";
import {
  DesignSystem,
  neutralForegroundRest,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { ViewClassNameContract, ViewProps } from "./View.props";
import { Header } from "../_DesignSystem";
import { FaHelicopter } from "react-icons/fa";

const styles: ComponentStyles<ViewClassNameContract, DesignSystem> = {
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  viewIcon: {
    fontSize: "4em",
    color: (designSystem: DesignSystem): string => neutralForegroundRest(designSystem),
  },
};

class View extends Component<ViewProps> {
  render() {
    return (
      <Fragment>
        <Header />
        <div className={this.props.managedClasses.view}>
          <FaHelicopter className={this.props.managedClasses.viewIcon} />
          <Heading tag={HeadingTag.h1} size={2}>
            Alright, you've found me...
          </Heading>
          <Heading tag={HeadingTag.h2} size={5}>
            This page should be somewhat more useful soon.
          </Heading>
        </div>
      </Fragment>
    );
  }
}

export default manageJss(styles)(View);
