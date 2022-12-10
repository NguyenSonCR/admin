import { createContext, useReducer } from 'react';
import { categoryReducer } from '~/reducers/categoryReducer';
import {
  apiUrl,
  CATEGORIES_LOADED_FAIL,
  CATEGORIES_LOADED_SUCCESS,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  FIND_CATEGORY,
  ADD_CATEGORY_CHILDREN,
  DELETE_CATEGORY_CHILDREN,
  SET_CATEGORY_CHILD,
  UPDATED_CATEGORY,
} from './constants';
import axiosJWT from '~/utils/setAxios';

export const CategoryContext = createContext();
function CategoryContextProvider({ children }) {
  const [categoryState, dispatch] = useReducer(categoryReducer, {
    category: null,
    categoryChildren: [],
    categories: [],
    categoriesLoading: true,
  });

  // gets all categories
  const getCategories = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/products/category`);
      if (response.data.success) {
        dispatch({ type: CATEGORIES_LOADED_SUCCESS, payload: response.data.categories });
      } else {
        dispatch({ type: CATEGORIES_LOADED_FAIL });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setCategoryChildren = (category) => {
    dispatch({
      type: SET_CATEGORY_CHILD,
      payload: category.children,
    });
  };

  // choose category
  const chooseCategory = (category) => {
    dispatch({
      type: FIND_CATEGORY,
      payload: category,
    });
  };

  // add category
  const addCategory = async (newCategory) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/products/category/new`, newCategory);
      if (response.data.success) {
        dispatch({
          type: ADD_CATEGORY,
          payload: response.data.category,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // updated category
  const updatedCategory = async (data) => {
    const { id } = updatedCategory;
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/category/${id}/updated`, data);
      if (response.data.success) {
        dispatch({ type: UPDATED_CATEGORY, payload: response.data.category });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // add category children
  const addCategoryChild = async ({ slug, newCategoryChildren }) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/category/${slug}/addchildren`, {
        newCategoryChildren,
      });
      if (response.data.success) {
        dispatch({
          type: ADD_CATEGORY_CHILDREN,
          payload: response.data.category,
        });
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // delete category children
  const deleteCategoryChild = async ({ slug, categoryChildren }) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/products/category/${slug}/deletechildren`, categoryChildren);
      if (response.data.success) {
        dispatch({
          type: DELETE_CATEGORY_CHILDREN,
          payload: response.data.category,
        });
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // delete category
  const deleteCategory = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/products/category/${id}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_CATEGORY, payload: id });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const categoryContextData = {
    categoryState,
    getCategories,
    addCategory,
    deleteCategory,
    addCategoryChild,
    chooseCategory,
    deleteCategoryChild,
    setCategoryChildren,
    updatedCategory,
  };

  return <CategoryContext.Provider value={categoryContextData}>{children}</CategoryContext.Provider>;
}

export default CategoryContextProvider;
