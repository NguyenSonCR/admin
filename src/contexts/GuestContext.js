import { createContext, useReducer } from 'react';
import axiosJWT from '~/utils/setAxios';
import { apiUrl, GUESTS_LOADED_FAIL, GUESTS_LOADED_SUCCESS, FIND_GUEST, DELETE_GUEST } from '~/contexts/constants';
import { guestReducer } from '~/reducers/guestReducer';

export const GuestContext = createContext();
function GuestContextProvider({ children }) {
  const [userState, dispatch] = useReducer(guestReducer, {
    user: null,
    users: [],
    usersLoading: true,
  });

  const findUser = (_id) => {
    const user = userState.users.find((user) => user._id === _id);
    dispatch({ type: FIND_GUEST, payload: user });
  };

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/guests`);
      if (response.data.success) {
        dispatch({ type: GUESTS_LOADED_SUCCESS, payload: response.data.users });
      }
    } catch (error) {
      dispatch({ type: GUESTS_LOADED_FAIL });
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const getUser = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/guests/${id}`);
      if (response.data.success) {
        dispatch({ type: FIND_GUEST, payload: response.data.user });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axiosJWT.delete(`${apiUrl}/guests/${id}/delete`);
      if (response.data.success) {
        dispatch({ type: DELETE_GUEST, payload: response.data.user });
        return response.data;
      }
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: 'server error' };
    }
  };

  const guestContextData = { userState, getUsers, findUser, getUser, deleteUser };
  return <GuestContext.Provider value={guestContextData}>{children}</GuestContext.Provider>;
}

export default GuestContextProvider;
