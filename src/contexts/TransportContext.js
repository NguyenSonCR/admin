import { createContext, useReducer } from 'react';
import { transportReducer } from '~/reducers/transportReducer';
import axiosJWT from '~/utils/setAxios';
import { apiUrl, SET_TRANSPORT, ADD_TRANSPORT, DELETE_TRANSPORT } from './constants';

export const TransportContext = createContext();

const TransportContextProvider = ({ children }) => {
  const [transportState, dispatch] = useReducer(transportReducer, {
    transports: [],
    transport: null,
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

  const transportContextData = { transportState, getTransport, addTransport, deleteTransport };
  return <TransportContext.Provider value={transportContextData}>{children}</TransportContext.Provider>;
};
export default TransportContextProvider;
