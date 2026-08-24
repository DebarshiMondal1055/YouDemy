import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1`,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = error.response?.data?.message || error.message;
    return Promise.reject(error);
  }
);

export default axiosClient;
