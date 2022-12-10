import {
  SET_TRANSPORT,
  ADD_TRANSPORT,
  DELETE_TRANSPORT,
  ACTIVE_THEME,
  ADD_THEME,
  GET_THEMES,
  DELETE_THEME,
  DEFAULT_THEME,
} from '~/contexts/constants';
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

    case ADD_THEME:
      return {
        ...state,
        themes: [...state.themes, payload],
      };
    case ACTIVE_THEME:
      return {
        ...state,
        themes: state.themes.map((theme) => {
          if (theme.name === payload.name) {
            return payload;
          }
          if (theme.name !== payload.name && theme.active === 'active') {
            return {
              ...theme,
              active: 'inactive',
            };
          }
          return theme;
        }),
        themeActive: payload,
      };

    case GET_THEMES:
      return {
        ...state,
        themes: payload,
      };
    case DELETE_THEME:
      return {
        ...state,
        themes: state.themes.filter((theme) => theme.name !== payload),
      };

    case DEFAULT_THEME:
      return {
        ...state,
        themeActive: null,
      };
    default:
      return state;
  }
};
