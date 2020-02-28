import React, { Component, Fragment } from "react";
import { Button, ButtonAppearance, Logo } from "../_DesignSystem";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { LoginClassNameContract, LoginProps } from "./Login.props";
import { FaSignInAlt } from "react-icons/fa";
import { TextField, TextFieldType } from "@microsoft/fast-components-react-msft";

const styles: ComponentStyles<LoginClassNameContract, DesignSystem> = {
  login: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  login_form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "margin-top": "10px",

    "& > *": {
      width: "100%",
      "margin-bottom": "4px",
    },
    "& > *:nth-child(2)": {
      "margin-bottom": "10px",
    },
  },
};

class Login extends Component<LoginProps> {
  render(): JSX.Element {
    return (
      <Fragment>
        <div className={this.props.managedClasses.login}>
          <Logo />
          <form className={this.props.managedClasses.login_form}>
            <TextField placeholder={"Username"} />
            <TextField placeholder={"Password"} type={TextFieldType.password} />
            <Button appearance={ButtonAppearance.primary} icon={FaSignInAlt}>
              Log in
            </Button>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default manageJss(styles)(Login);
