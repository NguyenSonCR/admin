import { SET_TRANSPORT, ADD_TRANSPORT, DELETE_TRANSPORT } from '~/contexts/constants';
export const transportReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TRANSPORT:
      return {
        ...state,
        transports: payload,
      };

    case ADD_TRANSPORT:
      return {
        ...state,
        transports: [...state.transports, payload],
      };

    case DELETE_TRANSPORT:
      return {
        ...state,
        transports: state.transports.filter((transport) => transport._id !== payload),
      };
    default:
      return state;
  }
};
