import React, { Component } from "react";
import { LogoProps } from "./Logo.props";

let CustomLogo: React.ComponentClass<any, any> | React.FunctionComponent<any> = undefined;

/**
 * A custom logo can be inserted by creating the module /src/client/_DesignSystem/Assets/Logo.tsx
 *
 * export: default
 * props:
 *  - size?: string
 * return: React.ComponentClass | React.FunctionComponent
 */
try {
  const CustomLogoImport: {
    default?: React.ComponentClass<any, any> | React.FunctionComponent<any>;
  } = require("../Assets/Logo");
  CustomLogo = CustomLogoImport.default;
} catch (error) {}

// Falling back to a filler image if no module can be found
export default class Logo extends Component<LogoProps> {
  render() {
    return typeof CustomLogo !== "undefined" ? (
      <CustomLogo {...this.props} />
    ) : (
      <img
        src={"./static/media/logo.svg"}
        alt={this.props.alt || "Shadis Logo"}
        width={this.props.size || "80"}
        height={this.props.size || "80"}
      />
    );
  }
}
