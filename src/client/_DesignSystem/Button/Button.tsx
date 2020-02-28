/**
 * Code taken from "@microsoft/fast-components-react-msft"
 *
 * This component is similar to the original button component from the library. Changes made:
 *  - An "icon" prop was added, so that it is easier to prepend an icon to the button.
 *  - Custom style from "ButtonStyle.ts" is applied
 */
import React from "react";
import {
  ButtonProps,
  ButtonClassNameContract,
  ButtonHandledProps,
  ButtonUnhandledProps,
} from "./Button.props";
import { ButtonAppearance } from "@microsoft/fast-components-react-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import manageJss from "@microsoft/fast-jss-manager-react";
import MSFTButton from "@microsoft/fast-components-react-msft/dist/button/button";
import { classNames } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import ButtonStyle from "./ButtonStyle";
import { iconToGlyph } from "../utilities";

class CustomButton extends Foundation<ButtonHandledProps, ButtonUnhandledProps, {}> {
  public static displayName: string = `Button`;

  public static defaultProps: Partial<ButtonProps> = {
    managedClasses: {},
  };

  protected handledProps: HandledProps<ButtonHandledProps> = {
    href: void 0,
    managedClasses: void 0,
    disabled: void 0,
    icon: void 0,
  };

  /**
   * Renders the component
   */
  public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
    return (
      <MSFTButton
        {...this.unhandledProps()}
        className={this.generateClassNames()}
        disabled={this.props.disabled}
        href={this.props.href}
        beforeContent={this.generateIcon}
      >
        {this.props.children}
      </MSFTButton>
    );
  }

  /**
   * Generates class names
   */
  protected generateClassNames(): string {
    const {
      button,
      button__disabled,
      button__hasIconAndContent,
    }: ButtonClassNameContract = this.props.managedClasses;

    return super.generateClassNames(
      classNames(
        button,
        [button__disabled, this.props.disabled],
        [
          this.props.managedClasses[`button__${this.props.appearance}`],
          typeof this.props.appearance === "string",
        ],
        [button__hasIconAndContent, this.hasIconAndContent()]
      )
    );
  }

  private generateIcon = (): React.ReactNode => {
    return isNil(this.props.icon)
      ? null
      : iconToGlyph(this.props.icon)(classNames(this.props.managedClasses.button_icon));
  };

  /**
   * Checks whether the button is displaying both icon and content or not
   */
  private hasIconAndContent(): boolean {
    return !isNil(this.props.icon) && !isNil(this.props.children);
  }
}

const StyledButton = manageJss(ButtonStyle)(CustomButton);
type StyledButton = InstanceType<typeof StyledButton>;

export { StyledButton as Button, ButtonAppearance };
