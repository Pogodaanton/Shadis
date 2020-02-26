import React, { Component, Fragment } from "react";
import { Button, ButtonAppearance, Logo } from "../_DesignSystem";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { LoginClassNameContract, LoginProps } from "./Login.props";
import { FaHelicopter } from "react-icons/fa";

const styles: ComponentStyles<LoginClassNameContract, DesignSystem> = {
  login: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

class Login extends Component<LoginProps> {
  render() {
    return (
      <Fragment>
        <div className={this.props.managedClasses.login}>
          <Logo />
          <form>
            <Button appearance={ButtonAppearance.primary}>
              <FaHelicopter />
              Log in
            </Button>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default manageJss(styles)(Login);
