import axios from 'axios';
import qs from 'qs';
// import store from '@/store';

const instance = axios.create({
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

instance.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      if (!config.data) {
        config.data = {};
      }
      config.data.form_key = window.FORM_KEY;
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    console.log('Request error', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return Promise.reject(response);
  },
  (error) => {
    console.log('Response error', error);
    return Promise.reject(error);
  },
);

export default function (options) {
  return instance({
    url: options.url,
    method: options.method,
    data: options.data,
  });
}
