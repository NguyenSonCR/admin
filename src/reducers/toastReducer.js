import { ADD_TOAST, DELETE_TOAST } from '~/contexts/constants';

export const toastReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TOAST:
      return {
        toastList: state.toastList.concat(payload),
      };
    case DELETE_TOAST:
      return {
        toastList: state.toastList.filter((e) => e.id !== payload),
      };
    default:
      return state;
  }
};
