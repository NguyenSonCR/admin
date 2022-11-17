import { createContext, useReducer, useEffect } from 'react';
import { authReducer } from '~/reducers/authReducer';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME_ACCESS, LOCAL_STORAGE_TOKEN_NAME_REFRESH, PUT_AUTH } from './constants';
import setAuthToken from '~/utils/setAuthToken';
import axiosJWT from '~/utils/setAxios';
import axios from 'axios';

export const AuthContext = createContext();
const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
    accessToken: null,
  });

  // Authenticate user
  const loadUser = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/auth`);
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: { isAuthenticated: true, user: response.data.user },
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME_ACCESS);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME_REFRESH);
      setAuthToken(null);
      dispatch({
        type: 'SET_AUTH',
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // get new access token when expired

  // login
  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userForm);
      if (response.data.success) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_ACCESS, response.data.tokens.accessToken);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_REFRESH, response.data.tokens.refreshToken);
      }
      await loadUser();
      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      console.log(error);
    }
  };

  // register
  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userForm);
      if (response.data.success) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_ACCESS, response.data.tokens.accessToken);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME_REFRESH, response.data.tokens.refreshToken);
      }
      await loadUser();
      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  // logout
  const logoutUser = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME_ACCESS);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME_REFRESH);
    dispatch({
      type: 'SET_AUTH',
      payload: { isAuthenticated: false, user: null },
    });
  };

  // updated info user
  const updatedUser = async (userInfo) => {
    try {
      const response = await axiosJWT.put(`${apiUrl}/auth/updated`, userInfo);
      if (response.data.success) {
        dispatch({
          type: PUT_AUTH,
          payload: { user: response.data.user },
        });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // change password
  const changePassword = async (formValue) => {
    try {
      const response = await axiosJWT.put(`${apiUrl}/auth/changepassword`, formValue);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // context data
  const authContextData = { loginUser, authState, registerUser, logoutUser, updatedUser, changePassword };

  // return provider
  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
