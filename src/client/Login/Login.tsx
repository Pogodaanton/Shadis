import React, { Component, Fragment } from "react";
import { Button, ButtonAppearance, Logo, iconToGlyph } from "../_DesignSystem";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { LoginClassNameContract, LoginProps, LoginInputChangeEvent } from "./Login.props";
import { FaSignInAlt, FaUserAlt, FaKey } from "react-icons/fa";
import { TextAction, TextFieldType } from "@microsoft/fast-components-react-msft";
import { AxiosError, AxiosResponse } from "axios";
import axios, { CustomError } from "../_interceptedAxios";

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
  state = {
    username: "",
    password: "",
  };

  /**
   * Handles user submitting their login credentials.
   * Since each form input has a name assigned, the FormData may derive from the <form/> Element.
   *
   * @memberof Login
   */
  onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    axios({
      method: "post",
      url: window.location.href + "api/login.php",
      data: formData,
    })
      .then((res: AxiosResponse) => {
        console.log(res);
      })
      .catch((err: CustomError) => {
        console.dir(err.message);
      });
  };

  /**
   * Handles an input change.
   * Since each input has a name assigned, we can use that for changing the state, too.
   *
   * @memberof Login
   */
  onInputChange = (e: LoginInputChangeEvent): void => {
    const { target } = e;
    this.setState({
      [target.name]: target.value,
    });
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
              value={this.state.username}
              onChange={this.onInputChange}
              autoFocus
              required
            />
            <TextAction
              name="password"
              placeholder={"Password"}
              type={TextFieldType.password}
              beforeGlyph={iconToGlyph(FaKey)}
              value={this.state.password}
              onChange={this.onInputChange}
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
