import { createContext, useReducer } from 'react';
import { toastReducer } from '~/reducers/toastReducer';
import { ADD_TOAST, DELETE_TOAST } from './constants';
export const ToastContext = createContext();
function ToastContextProvider({ children }) {
  const [toastState, dispatch] = useReducer(toastReducer, {
    toastList: [],
  });

  const addToast = (toast) => {
    dispatch({ type: ADD_TOAST, payload: toast });
  };

  const deleteToast = (toastId) => {
    dispatch({ type: DELETE_TOAST, payload: toastId });
  };

  const alertContextData = { toastState, addToast, deleteToast };
  return <ToastContext.Provider value={alertContextData}> {children} </ToastContext.Provider>;
}

export default ToastContextProvider;
