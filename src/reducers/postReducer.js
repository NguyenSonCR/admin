import {
  POSTS_LOADED_FAIL,
  POSTS_LOADED_SUCCESS,
  ADD_POST,
  FIND_POST,
  DELETE_POST,
  UPDATE_POST,
  GET_POSTS_DELETED,
  GET_POSTS_DELETED_FAIL,
  RESTORE_POST,
  DESTROY_POST,
} from '~/contexts/constants';

export const postReducer = (state, action) => {
  const { type, payload } = action;
  const { postsDeleted } = payload;
  switch (type) {
    case POSTS_LOADED_SUCCESS:
      return {
        ...state,
        posts: payload,
        postsLoading: false,
      };

    case POSTS_LOADED_FAIL:
      return {
        ...state,
        post: [],
        posts: [],
        postsLoading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, payload],
      };

    case FIND_POST:
      return {
        ...state,
        post: payload,
        postLoading: false,
        postsLoading: false,
      };
    case UPDATE_POST:
      const newPosts = state.posts.map((post) => {
        if (post._id === payload._id) return payload;
        return post;
      });
      return {
        ...state,
        posts: newPosts,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post.slug !== payload),
      };

    case GET_POSTS_DELETED:
      return {
        ...state,
        postsDeleted: postsDeleted,
        postsDeletedLoading: false,
      };

    case GET_POSTS_DELETED_FAIL:
      return {
        ...state,
        postsDeleted: [],
        postsDeletedLoading: false,
      };

    case RESTORE_POST:
      return {
        ...state,
        posts: state.posts.concat(payload),
        postsDeleted: state.postsDeleted.filter((post) => post._id !== payload),
      };

    case DESTROY_POST:
      return {
        ...state,
        postsDeleted: state.postsDeleted.filter((post) => post._id !== payload),
      };
    default:
      return state;
  }
};
