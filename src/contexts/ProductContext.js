import { createContext, useReducer } from 'react';
import { productReducer } from '~/reducers/productReducer';
import {
  apiUrl,
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
  DELETE_COMMENT,
} from './constants';
import axiosJWT from '~/utils/setAxios';

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  // state
  const [productState, dispatch] = useReducer(productReducer, {
    product: null,
    trashProducts: [],
    products: [],
    productsLoading: true,
  });

  // gets all products
  const getProducts = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/products`);
      if (response.data.success) {
        dispatch({ type: PRODUCTS_LOADED_SUCCESS, payload: response.data.products });
      }
    } catch (error) {
      dispatch({ type: PRODUCTS_LOADED_FAIL });
    }
  };

  // gets all products
  const getTrashProducts = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/products/trash`);
      if (response.data.success) {
        dispatch({ type: TRASH_PRODUCTS_LOADED_SUCCESS, payload: response.data.products });
      }
    } catch (error) {
      dispatch({ type: PRODUCTS_LOADED_FAIL });
    }
  };

  const uploadFile = async (data) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/upload/server`, data);
      if (response.data.success) return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // multiple
  const uploadFiles = async (data) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/upload/server/multiple`, data);
      if (response.data.success) return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // delete image
  const deleteImage = async (path) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/image/delete/single`, path);
      if (response.data.success) return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // delete images
  const deleteImages = async (path) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/image/delete/multiple`, path);
      if (response.data.success) return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // get one product with slug
  const getProduct = async (slug) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/products/${slug}`);
      if (response.data.success) {
        dispatch({ type: FIND_PRODUCT, payload: response.data.product });
      } else {
        dispatch({ type: PRODUCTS_LOADED_FAIL });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: PRODUCTS_LOADED_FAIL });
    }
  };

  // add product
  const addProduct = async (newProduct) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/products/create`, newProduct);
      if (response.data.success) {
        dispatch({
          type: ADD_PRODUCT,
          payload: response.data.product,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // delete sort product
  const deleteProduct = async (slug) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/products/${slug}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_PRODUCT, payload: response });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete force product
  const deleteForceProduct = async (slug) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/products/trash/${slug}/destroy`);
      if (response.data.success) {
        dispatch({ type: DELETE_FORCE_PRODUCT, payload: slug });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // restore product
  const restoreProduct = async (slug) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/trash/${slug}/restore`);
      if (response.data.success) {
        dispatch({ type: RESTORE_PRODUCT, payload: slug });
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // find post when user click update
  const findProduct = (slug) => {
    const product = productState.products.find((product) => product.slug === slug);
    dispatch({ type: FIND_PRODUCT, payload: product });
  };

  // update product
  const updateProduct = async (updateProduct) => {
    try {
      const response = await axiosJWT.put(`${apiUrl}/products/${updateProduct.slug}/update`, updateProduct);
      if (response.data.success) dispatch({ type: UPDATE_PRODUCT, payload: response.data.product });
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // send comment
  const sendComment = async (comment) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/comment/post`, comment);
      if (response.data.success) {
        dispatch({ type: POST_COMMENT, payload: response.data.product });
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // send comment children
  const sendCommentChildren = async (comment) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/comment/children/post`, comment);
      if (response.data.success) {
        dispatch({ type: POST_COMMENT, payload: response.data.product });
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // delete comment
  const deleteComment = async (data) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/comment/delete`, data);
      if (response.data.success) {
        dispatch({ type: DELETE_COMMENT, payload: response.data.product });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add bought
  const addBought = async (checkout) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/addbought`, checkout);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  //  product context data
  const productContextData = {
    productState,
    getProducts,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    findProduct,
    getTrashProducts,
    restoreProduct,
    deleteForceProduct,
    sendComment,
    addBought,
    deleteComment,
    sendCommentChildren,
    uploadFile,
    uploadFiles,
    deleteImage,
    deleteImages,
  };

  return <ProductContext.Provider value={productContextData}>{children}</ProductContext.Provider>;
};
export default ProductContextProvider;
