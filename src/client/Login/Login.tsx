import React, { Component, Fragment } from "react";
import { Button, ButtonAppearance, Logo, iconToGlyph } from "../_DesignSystem";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { LoginClassNameContract, LoginProps } from "./Login.props";
import { FaSignInAlt, FaUserAlt, FaKey } from "react-icons/fa";
import { TextAction, TextFieldType } from "@microsoft/fast-components-react-msft";

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
    "margin-top": "15px",

    "& > *": {
      width: "100%",
      "margin-bottom": "8px",
    },
    "& > *:nth-child(2)": {
      "margin-bottom": "15px",
    },
  },
};

class Login extends Component<LoginProps> {
  onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
  };

  render(): JSX.Element {
    return (
      <Fragment>
        <div className={this.props.managedClasses.login}>
          <Logo />
          <form
            onSubmit={this.onFormSubmit}
            className={this.props.managedClasses.login_form}
          >
            <TextAction
              name="username"
              placeholder={"Username"}
              beforeGlyph={iconToGlyph(FaUserAlt)}
              autoFocus
              required
            />
            <TextAction
              name="password"
              placeholder={"Password"}
              type={TextFieldType.password}
              beforeGlyph={iconToGlyph(FaKey)}
              required
            />
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
