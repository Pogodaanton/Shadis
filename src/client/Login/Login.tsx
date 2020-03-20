import React, { Fragment, useState } from "react";
import { Button, ButtonAppearance, Logo, iconToGlyph } from "../_DesignSystem";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import { LoginClassNameContract, LoginProps } from "./Login.props";
import { FaSignInAlt, FaUserAlt, FaKey } from "react-icons/fa";
import { TextAction, TextFieldType } from "@microsoft/fast-components-react-msft";
import { AxiosResponse } from "axios";
import axios from "../_interceptedAxios";
import { useToasts } from "../_DesignSystem";

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

const Login: React.FC<LoginProps> = props => {
  const { addToast } = useToasts();
  const [isDebounced, setDebounce] = useState(false);

  /**
   * Handles user submitting their login credentials.
   * Since each form input has a name assigned, the FormData may derive from the <form/> Element.
   *
   * @memberof Login
   */
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const postOperation = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      const formData = new FormData(e.currentTarget);
      try {
        let res: AxiosResponse = await axios.post(
          window.location.href + "api/login.php",
          formData
        );
        addToast(res.data.message, { appearance: "success", title: "Welcome!" });
      } catch (err) {
        setTimeout(() => {
          setDebounce(false);
          addToast(err.message, { appearance: "error", title: "Couldn't log you in:" });
          console.error("User could not log in:\n", `(${err.code}) - ${err.message}`);
        }, 1000);
      }
    };

    if (isDebounced) return;
    setDebounce(true);
    postOperation(e);
  };

  return (
    <Fragment>
      <div className={props.managedClasses.login}>
        <Logo />
        <form onSubmit={onFormSubmit} className={props.managedClasses.login_form}>
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
          <Button
            appearance={ButtonAppearance.primary}
            icon={FaSignInAlt}
            disabled={isDebounced}
          >
            Log in
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default manageJss(styles)(Login);
