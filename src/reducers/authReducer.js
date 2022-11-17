import { SET_ACCESS_TOKEN, PUT_AUTH } from '~/contexts/constants';
export const authReducer = (state, action) => {
  const {
    type,
    payload: { isAuthenticated, user, accessToken },
  } = action;
  switch (type) {
    case 'SET_AUTH':
      return {
        ...state,
        authLoading: false,
        isAuthenticated,
        user,
      };
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: accessToken,
      };

    case PUT_AUTH:
      return {
        ...state,
        user,
      };
    default:
      return state;
  }
};
