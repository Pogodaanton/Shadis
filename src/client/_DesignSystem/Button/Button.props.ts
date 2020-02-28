import { IconType } from "react-icons/lib";
import { Omit } from "utility-types";
import {
  ButtonClassNameContract as MSFTButtonClassNameContract,
  ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
  ButtonHandledProps as MSFTButtonHandledProps,
  ButtonUnhandledProps as MSFTButtonUnhandledProps,
} from "@microsoft/fast-components-react-msft/dist/button/button.props";

/**
 * The class name contract for the action trigger component
 */
export interface ButtonClassNameContract extends MSFTButtonClassNameContract {
  /**
   * Icon className
   */
  button_icon?: string;

  /**
   * Class name used when checking icon and content
   */
  button__hasIconAndContent?: string;
}

export interface ButtonManagedClasses extends ManagedClasses<ButtonClassNameContract> {}
export interface ButtonHandledProps
  extends Omit<MSFTButtonHandledProps, keyof ButtonManagedClasses>,
    ButtonManagedClasses {
  /**
   * The action trigger glyph render prop
   */
  icon?: IconType;

  /**
   * The action trigger link address
   */
  href?: string;

  /**
   * The action trigger disabled property
   */
  disabled?: boolean;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ButtonUnhandledProps extends MSFTButtonUnhandledProps {}
export type ButtonProps = ButtonHandledProps & ButtonUnhandledProps;
