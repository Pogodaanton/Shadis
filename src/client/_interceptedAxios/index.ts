import axios, { AxiosInstance, AxiosError } from "axios";

export interface CustomError {
  code: number;
  message: string;
  i18n: string;
}

const interceptedAxios: AxiosInstance = axios.create();
interceptedAxios.interceptors.response.use(
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

export { interceptedAxios as axios };
