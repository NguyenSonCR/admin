import { createContext, useReducer } from 'react';
import axiosJWT from '~/utils/setAxios';
import { postReducer } from '~/reducers/postReducer';
import {
  apiUrl,
  ADD_POST,
  POSTS_LOADED_SUCCESS,
  POSTS_LOADED_FAIL,
  FIND_POST,
  UPDATE_POST,
  DELETE_POST,
  GET_POSTS_DELETED,
  GET_POSTS_DELETED_FAIL,
  RESTORE_POST,
  DESTROY_POST,
} from './constants';

export const PostContext = createContext();
function PostContextProvider({ children }) {
  const [postsState, dispatch] = useReducer(postReducer, {
    post: null,
    postLoading: true,
    posts: [],
    postsDeleted: [],
    postsDeletedLoading: true,
    postsLoading: true,
  });

  // get all posts
  const getPosts = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/posts`);
      if (response.data.success) {
        dispatch({ type: POSTS_LOADED_SUCCESS, payload: response.data.posts });
      }
    } catch (error) {
      dispatch({ type: POSTS_LOADED_FAIL });
    }
  };

  // find one post when user click
  const findPost = (slug) => {
    const post = postsState.posts.find((post) => post.slug === slug);
    dispatch({ type: FIND_POST, payload: post });
  };

  // get one post with slug

  const getPost = async (slug) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/posts/${slug}`);
      if (response.data.success) {
        dispatch({ type: FIND_POST, payload: response.data.post });
        return response.data.post;
      }
    } catch (error) {
      dispatch({ type: POSTS_LOADED_FAIL });
    }
  };
  // add post
  const addPost = async (newPost) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/posts/new`, newPost);
      if (response.data.success) {
        dispatch({
          type: ADD_POST,
          payload: response.data.post,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // updatePost
  const updatePost = async (updatePost) => {
    try {
      const response = await axiosJWT.put(`${apiUrl}/posts/${updatePost.slug}/update`, updatePost);
      if (response.data.success) dispatch({ type: UPDATE_POST, payload: response.data.post });
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };
  // delete post
  const deletePost = async (slug) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/posts/${slug}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_POST, payload: slug });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  // get all posts had deleted soft
  const getPostsDeleted = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/posts/trash`);
      if (response.data.success) {
        dispatch({ type: GET_POSTS_DELETED, payload: { postsDeleted: response.data.postsDeleted } });
      } else {
        dispatch({ type: GET_POSTS_DELETED_FAIL, payload: { postsDeleted: [] } });
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const restorePost = async (id) => {
    try {
      const response = await axiosJWT.patch(`${apiUrl}/posts/trash/${id}/restore`);
      if (response.data.success) {
        dispatch({ type: RESTORE_POST, payload: id });
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const destroyPost = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/posts/trash/${id}/delete`);
      if (response.data.success) {
        dispatch({ type: DESTROY_POST, payload: id });
      }
      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };
  const postContextData = {
    postsState,
    addPost,
    getPosts,
    findPost,
    getPost,
    updatePost,
    deletePost,
    getPostsDeleted,
    restorePost,
    destroyPost,
  };

  return <PostContext.Provider value={postContextData}>{children}</PostContext.Provider>;
}

export default PostContextProvider;
