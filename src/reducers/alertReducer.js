import { ALERT_HIDE, ALERT_SHOW } from '~/contexts/constants';

export const alertReducer = (state, action) => {
  const { type, payload } = action;
  const { title, data, buttonValue, navigateValue, successFunction } = payload;
  switch (type) {
    case ALERT_SHOW:
      return {
        show: true,
        title: title,
        buttonValue: buttonValue,
        navigateValue: navigateValue,
        data: data,
        successFunction: successFunction,
      };

    case ALERT_HIDE:
      return {
        show: false,
        title: title,
        buttonValue: buttonValue,
        navigateValue: navigateValue,
        data: data,
        successFunction: successFunction,
      };
    default:
      return state;
  }
};
