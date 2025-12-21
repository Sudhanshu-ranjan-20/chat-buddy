import { HTTP_STATUS_CODES } from "@chat-buddy/shared";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error?: AxiosError) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (
      !error.response ||
      error.response.status !== HTTP_STATUS_CODES.UNAUTHORIZED
    )
      return Promise.reject(error);

    // DO NOT RETRY REFRESH ENDPOINTS

    if (originalRequest.url?.includes("/auth/refresh")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // If some other request is already refreshing the token, queue the request

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      // process all the queued requests
      processQueue();
      return api(originalRequest);
    } catch (err) {
      processQueue(err as AxiosError);
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
