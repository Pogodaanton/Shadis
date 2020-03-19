import {
  useToasts as originalUseToasts,
  RemoveToast,
  RemoveAllToasts,
  AppearanceTypes,
  UpdateToast,
  Options,
} from "react-toast-notifications";
import { ReactNode } from "react";

/**
 * Since a custom "title" prop is available in the toast,
 * The type definition needs to be updated.
 *
 * @interface CustomOptions
 * @extends {Options}
 */
interface CustomOptions extends Options {
  title?: string;
}

type AddToast = (
  content: ReactNode,
  options?: CustomOptions,
  callback?: (id: string) => void
) => void;

type UseToasts = () => {
  addToast: AddToast;
  removeToast: RemoveToast;
  removeAllToasts: RemoveAllToasts;
  toastStack: Array<{
    content: ReactNode;
    id: string;
    appearance: AppearanceTypes;
  }>;
  updateToast: UpdateToast;
};

const useToasts: UseToasts = originalUseToasts;
export default useToasts;
