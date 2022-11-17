import { GUESTS_LOADED_FAIL, GUESTS_LOADED_SUCCESS, FIND_GUEST, ADD_GUEST, DELETE_GUEST } from '~/contexts/constants';
export const guestReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GUESTS_LOADED_SUCCESS:
      return {
        ...state,
        users: payload,
        usersLoading: false,
      };

    case GUESTS_LOADED_FAIL:
      return {
        ...state,
        user: [],
        users: [],
        usersLoading: false,
      };
    case ADD_GUEST:
      return {
        ...state,
        users: [...state.users, payload],
      };
    case FIND_GUEST:
      return {
        ...state,
        user: payload,
      };

    case DELETE_GUEST:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== payload),
      };
    default:
      return state;
  }
};
