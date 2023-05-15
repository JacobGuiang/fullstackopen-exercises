import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/user';
import loginService from '../services/login';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser, setUsers } = userSlice.actions;

export const checkLoggedUser = () => async (dispatch) => {
  const userFromStorage = userService.getLoggedUser();
  if (userFromStorage) {
    dispatch(setUser(userFromStorage));
  }
};

export const loginUser = (username, password) => async (dispatch) => {
  const loggedUser = await loginService.login({
    username,
    password,
  });
  userService.setLoggedUser(loggedUser);
  dispatch(setUser(loggedUser));
};

export const logoutUser = () => async (dispatch) => {
  userService.clearUser();
  dispatch(setUser(null));
};

export default userSlice.reducer;
