import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LastMessageState {
    lastMessage: string;
    timestamp: string;
}

const initialState: LastMessageState = {
    lastMessage: '',
    timestamp: '',
};

const lastMessageSlice = createSlice({
    name: 'lastMessage',
    initialState,
    reducers: {
        setLastMessage: (state, action: PayloadAction<{ lastMessage: string; timestamp: string }>) => {
            state.lastMessage = action.payload.lastMessage;
            state.timestamp = action.payload.timestamp;
        },
    },
});

export const { setLastMessage } = lastMessageSlice.actions;
export default lastMessageSlice.reducer;
