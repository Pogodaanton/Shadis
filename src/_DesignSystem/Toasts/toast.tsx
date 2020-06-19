import React from "react";
import { toast as originalToast, ToastContent, ToastOptions } from "react-toastify";
import ToastManager from "./ToastManager/ToastManager";

/**
 * Our toasts consist of two parts: title and content.
 *
 * Since react-toastify does not support a title value out of the box,
 * we need to manually add the title value to every toast call.
 */
const prepareContent = (title: string, content: ToastContent) => () => (
  <>
    <span>{title}</span>
    {content && <span>{content}</span>}
  </>
);

/**
 * Adds a generic toast to the queue.
 *
 * @param title Title text written in bold.
 * @param content Part of the toast below the title.
 * @param options Custom parameters for this specific toast.
 */
const toast = (title: string, content: ToastContent = "", options?: ToastOptions) =>
  originalToast(prepareContent(title, content), options);

/**
 * Adds a success toast to the queue.
 *
 * @param title Title text written in bold.
 * @param content Part of the toast below the title.
 * @param options Custom parameters for this specific toast.
 */
toast.success = (title: string, content?: ToastContent, options?: ToastOptions) =>
  originalToast.success(prepareContent(title, content), options);

/**
 * Adds an info toast to the queue.
 *
 * @param title Title text written in bold.
 * @param content Part of the toast below the title.
 * @param options Custom parameters for this specific toast.
 */
toast.info = (title: string, content?: ToastContent, options?: ToastOptions) =>
  originalToast.info(prepareContent(title, content), options);

/**
 * Adds an error toast to the queue.
 *
 * @param title Title text written in bold.
 * @param content Part of the toast below the title.
 * @param options Custom parameters for this specific toast.
 */
toast.error = (title: string, content?: ToastContent, options?: ToastOptions) =>
  originalToast.error(prepareContent(title, content), options);

/**
 * Adds a warning toast to the queue.
 *
 * @param title Title text written in bold.
 * @param content Part of the toast below the title.
 * @param options Custom parameters for this specific toast.
 */
toast.warning = toast.warn = (
  title: string,
  content?: ToastContent,
  options?: ToastOptions
) => originalToast.warning(prepareContent(title, content), options);

toast.dismiss = originalToast.dismiss;
toast.clearWaitingQueue = originalToast.clearWaitingQueue;
toast.isActive = originalToast.isActive;
toast.update = originalToast.update;
toast.done = originalToast.done;
toast.onChange = originalToast.onChange;
toast.configure = originalToast.configure;
toast.POSITION = originalToast.POSITION;
toast.TYPE = originalToast.TYPE;

export { toast, ToastManager };
