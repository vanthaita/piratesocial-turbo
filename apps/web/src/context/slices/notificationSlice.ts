import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  count: number;
}

const initialState: NotificationState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.count += 1; // Increment notification count
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload; // Set count explicitly
    },
    clearNotificationCount: (state) => {
      state.count = 0; // Reset count
    },
  },
});

export const { incrementNotification, setNotificationCount, clearNotificationCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
