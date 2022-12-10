import { createContext, useReducer } from 'react';
import { transportReducer } from '~/reducers/transportReducer';
import axiosJWT from '~/utils/setAxios';
import {
  apiUrl,
  SET_TRANSPORT,
  ADD_TRANSPORT,
  DELETE_TRANSPORT,
  ACTIVE_THEME,
  ADD_THEME,
  GET_THEMES,
  DELETE_THEME,
  DEFAULT_THEME,
} from './constants';

export const TransportContext = createContext();

const TransportContextProvider = ({ children }) => {
  const [transportState, dispatch] = useReducer(transportReducer, {
    transports: [],
    transport: null,
    themes: [],
    themeActive: null,
  });

  const getTransport = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/transport`);
      if (response.data.success) {
        dispatch({ type: SET_TRANSPORT, payload: response.data.transports });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTransport = async (formValue) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/transport/new`, formValue);
      if (response.data.success) {
        dispatch({ type: ADD_TRANSPORT, payload: response.data.transport });
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const deleteTransport = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/transport/${id}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_TRANSPORT, payload: id });
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const getThemes = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/theme`);
      if (response.data.success) {
        dispatch({ type: GET_THEMES, payload: response.data.theme });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const getThemeActive = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/theme/active`);
      if (response.data.success) {
        dispatch({ type: ACTIVE_THEME, payload: response.data.theme });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const addTheme = async (data) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/theme/new`, data);
      if (response.data.success) {
        dispatch({ type: ADD_THEME, payload: response.data.theme });
        return response.data;
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const deleteTheme = async (name) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/theme/${name}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_THEME, payload: name });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const activeTheme = async (name) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/theme/${name}/active`);

      if (response.data.success) {
        dispatch({ type: ACTIVE_THEME, payload: response.data.theme });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const defaultTheme = async () => {
    const response = await axiosJWT.patch(`${apiUrl}/theme/default`);
    if (response.data.success) {
      dispatch({ type: DEFAULT_THEME });
    }
  };

  const transportContextData = {
    transportState,
    getTransport,
    addTransport,
    deleteTransport,
    addTheme,
    activeTheme,
    getThemes,
    getThemeActive,
    deleteTheme,
    defaultTheme,
  };
  return <TransportContext.Provider value={transportContextData}>{children}</TransportContext.Provider>;
};
export default TransportContextProvider;
