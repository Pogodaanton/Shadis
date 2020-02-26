import React, { Component } from "react";

/**
 * A custom logo can be inserted by creating the module /src/client/_DesignSystem/Assets/Logo.tsx
 *
 * export: default
 * props:
 *  - size?: string
 * return: React.ComponentClass | React.FunctionComponent
 */
const CustomLogoImport: {
  default?: React.ComponentClass<any, any> | React.FunctionComponent<any>;
} = require("../Assets/Logo");
const CustomLogo: React.ComponentClass<any, any> | React.FunctionComponent<any> =
  CustomLogoImport.default;

// Falling back to a filler image if no module can be found
export default class Logo extends Component<{ size?: string }> {
  render() {
    return typeof CustomLogo !== "undefined" ? (
      <CustomLogo {...this.props} />
    ) : (
      <img
        src={
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAG1BMVEXMzMyWlpa+vr6cnJy3t7fFxcWjo6OxsbGqqqqN7EKtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAcklEQVRIiWNgGAWjYBSMglEwsoCysUJzAxoLKzBiMi9oR2NhBSYhxgHBDOVsClAWTqAoqMjAyMDsAWPhBOnhiUBpFlEYCycQZRUGWsguBGPhBCks6UAvBKvBWDhBmFkAMFBa2BygrFEwCkbBKBgFgxoAAFYVFqKYGZ7+AAAAAElFTkSuQmCC"
        }
        alt="Logo"
        width={this.props.size || "80"}
        height={this.props.size || "80"}
      />
    );
  }
}
