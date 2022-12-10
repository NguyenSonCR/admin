import {
  CATEGORIES_LOADED_FAIL,
  CATEGORIES_LOADED_SUCCESS,
  ADD_CATEGORY,
  FIND_CATEGORY,
  DELETE_CATEGORY,
  ADD_CATEGORY_CHILDREN,
  DELETE_CATEGORY_CHILDREN,
  SET_CATEGORY_CHILD,
  UPDATED_CATEGORY,
} from '~/contexts/constants';

export const categoryReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CATEGORIES_LOADED_SUCCESS:
      return {
        ...state,
        categories: payload,
        categoriesLoading: false,
      };

    case CATEGORIES_LOADED_FAIL:
      return {
        ...state,
        category: [],
        categories: [],
        categoriesLoading: false,
      };

    case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, payload],
      };

    case ADD_CATEGORY_CHILDREN:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category._id === payload._id) return payload;
          return category;
        }),
      };

    case UPDATED_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category._id === payload._id) return payload;
          return category;
        }),
      };

    case DELETE_CATEGORY_CHILDREN:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category._id === payload._id) return payload;
          return category;
        }),
      };

    case SET_CATEGORY_CHILD:
      return {
        ...state,
        categoryChildren: payload,
      };

    case FIND_CATEGORY:
      return {
        ...state,
        category: payload,
        categoriesLoading: false,
      };

    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter((category) => category._id !== payload),
      };
    default:
      return state;
  }
};
