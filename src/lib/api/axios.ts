import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

interface ErrorResponseBody {
  error?: string;
  message?: string;
  fields?: Record<string, string>;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponseBody>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      let message = data?.error || data?.message;
      if (!message) {
        switch (status) {
          case 400:
            message = 'Bad request. Please verify your submitted data.';
            break;
          case 401:
            message = 'Unauthorized. Please sign in to continue.';
            break;
          case 403:
            message = 'Forbidden. You do not have permission to perform this action.';
            break;
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 500:
          default:
            message = 'An unexpected server error occurred. Please try again later.';
            break;
        }
      }

      return Promise.reject(new ApiError(message, status, data?.fields));
    }

    if (error.request) {
      return Promise.reject(
        new ApiError('Network error. Unable to connect to server. Please check your internet connection.', 0)
      );
    }

    return Promise.reject(new ApiError(error.message || 'An unexpected error occurred.', 500));
  }
);

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};
