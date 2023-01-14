import axios from 'axios';
import { LOCAL_STORAGE_TOKEN_NAME_ACCESS, LOCAL_STORAGE_TOKEN_NAME_REFRESH } from '~/contexts/constants';
import { apiUrl } from '~/contexts/constants';
import jwt_decode from 'jwt-decode';

const axiosJWT = axios.create({});

const refreshToken = async () => {
  try {
    const refreshToken = localStorage[LOCAL_STORAGE_TOKEN_NAME_REFRESH];
    const response = await axios.post(`${apiUrl}/token`, { refreshToken: refreshToken });
    localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_ACCESS, response.data.tokens.accessToken);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_REFRESH, response.data.tokens.refreshToken);
    return response.data;
  } catch (error) {
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message };
  }
};

axiosJWT.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage[LOCAL_STORAGE_TOKEN_NAME_ACCESS];
    let currentDate = new Date();
    const decodedToken = jwt_decode(accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const data = await refreshToken();
      config.headers['authorization'] = `Bearer ${data.tokens.accessToken}`;
    } else {
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosJWT;
