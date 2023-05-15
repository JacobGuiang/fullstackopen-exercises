import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/user';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const initializeUsers = () => async (dispatch) => {
  const users = await userService.getAllUsers();
  dispatch(setUsers(users));
};

export default usersSlice.reducer;
