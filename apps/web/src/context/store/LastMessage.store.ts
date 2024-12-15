import { configureStore } from '@reduxjs/toolkit';
import lastMessageReducer from '../slices/lastMessage.slice'
// Configure the store
export const store = configureStore({
    reducer: {
        lastMessage: lastMessageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
