// utils/request.ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { showFailToast } from 'vant';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 6000
});

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在这里添加 token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response, '响应拦截');
    const res = response.data;
    // 约定：后端返回 { code, data, message }
    if (response.status !== 200) {
      showFailToast(res.message || '请求出错');
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    showFailToast(error.response?.data?.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
