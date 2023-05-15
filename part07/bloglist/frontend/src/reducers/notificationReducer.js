import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setMessage(state, action) {
      return action.payload;
    },
  },
});

let prevTimeoutId = null;

export const { setMessage } = notificationSlice.actions;

export const setNotification = (message) => async (dispatch) => {
  dispatch(setMessage({ message }));
  if (prevTimeoutId) {
    clearTimeout(prevTimeoutId);
  }
  prevTimeoutId = setTimeout(() => {
    dispatch(setMessage(null));
  }, 5000);
};

export default notificationSlice.reducer;
