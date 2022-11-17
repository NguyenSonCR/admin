import { createContext, useReducer } from 'react';
import { alertReducer } from '~/reducers/alertReducer';
import { ALERT_HIDE, ALERT_SHOW } from '~/contexts/constants';
export const AlertContext = createContext();
function AlertContextProvider({ children }) {
  const [alertState, dispatch] = useReducer(alertReducer, {
    show: false,
    title: '',
    buttonValue: null,
    navigateValue: null,
    data: null,
    successFunction: null,
  });

  const alertShow = (data) => {
    dispatch({ type: ALERT_SHOW, payload: data });
  };

  const alertHide = () => {
    dispatch({
      type: ALERT_HIDE,
      payload: { title: '', data: null, buttonValue: null, navigateValue: null, successFunction: null },
    });
  };

  const alertContextData = { alertState, alertShow, alertHide };
  return <AlertContext.Provider value={alertContextData}> {children}</AlertContext.Provider>;
}

export default AlertContextProvider;
