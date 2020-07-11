import axiosInstance, { AxiosInstance, AxiosError } from "axios";
import { APIMethod } from "./index.types";

export interface CustomError {
  code: number;
  message: string;
  i18n: string;
}

/**
 * A special instance of Axios which has a built-in
 * error handler specifically made for API calls to shadis' backend server.
 */
const axios: AxiosInstance = axiosInstance.create();
axios.interceptors.response.use(
  res => res,
  (err: AxiosError) => {
    if (
      typeof err.response.data !== "undefined" &&
      typeof err.response.data.message !== "undefined" &&
      typeof err.response.data.code !== "undefined"
    ) {
      return Promise.reject(err.response.data);
    } else {
      return Promise.reject(err);
    }
  }
);

/**
 * Retrieves the root path of the client
 */
export const basePath: URL["href"] = window.location.origin + window.baseDirectory;

/**
 * Generates a URL that can be used to request data from the backend API
 */
export const getApiPath = (path: APIMethod): URL["href"] => {
  return basePath + "/api/" + path + ".php";
};

export default axios;
