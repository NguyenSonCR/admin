import {
  PRODUCTS_LOADED_FAIL,
  PRODUCTS_LOADED_SUCCESS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  FIND_PRODUCT,
  RESTORE_PRODUCT,
  DELETE_FORCE_PRODUCT,
  TRASH_PRODUCTS_LOADED_SUCCESS,
  POST_COMMENT,
  ADD_BOUGHTS,
  DELETE_COMMENT,
} from '~/contexts/constants';

export const productReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCTS_LOADED_SUCCESS:
      return {
        ...state,
        products: payload,
        productsLoading: false,
      };
    case TRASH_PRODUCTS_LOADED_SUCCESS:
      return {
        ...state,
        trashProducts: payload,
        productsLoading: false,
      };
    case PRODUCTS_LOADED_FAIL:
      return {
        ...state,
        product: [],
        products: [],
        productsLoading: false,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, payload],
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((product) => product.slug !== payload),
      };

    case DELETE_FORCE_PRODUCT:
      return {
        ...state,
        trashProducts: state.trashProducts.filter((product) => product.slug !== payload),
      };
    case RESTORE_PRODUCT:
      return {
        ...state,
        trashProducts: state.trashProducts.filter((product) => product.slug !== payload),
      };
    case UPDATE_PRODUCT:
      const newProduct = state.products.map((product) => {
        if (product._id === payload._id) return payload;
        return product;
      });
      return {
        ...state,
        products: newProduct,
      };
    case FIND_PRODUCT:
      return {
        ...state,
        product: payload,
        productsLoading: false,
      };

    case POST_COMMENT:
      return {
        ...state,
        product: payload,
      };

    case DELETE_COMMENT: {
      return {
        ...state,
        product: payload,
      };
    }

    case ADD_BOUGHTS:
      return {
        ...state,
        products: state.products.map((product) => {
          const condition = payload.forEach((item) => {
            if (product._id === item._id) {
              return item;
            } else {
              return false;
            }
          });
          if (condition) {
            return condition;
          } else {
            return product;
          }
        }),
      };
    default:
      return state;
  }
};
