import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Class name contract for the component
 */
export interface LoginClassNameContract {
  login: string;
  login_form: string;
}

/**
 * Props for the component
 */
export interface LoginProps extends ManagedClasses<LoginClassNameContract> {}

/**
 * Custom change event, since all targets are inputs
 *
 * @export
 * @interface LoginInputChangeEvent
 * @extends {React.ChangeEvent}
 */
export interface LoginInputChangeEvent extends React.ChangeEvent {
  target: EventTarget & HTMLInputElement;
}
