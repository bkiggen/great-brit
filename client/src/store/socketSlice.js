import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
};

export const initializeSocket = createAsyncThunk(
  "socket/initialize",
  async (_, { dispatch }) => {
    // In production, use same origin; in development, use localhost:8000
    const socketUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin
      : (process.env.REACT_APP_API_URL || "http://localhost:8000");
    const socket = io(socketUrl);

    socket.io.on("new-room-created-from-server", (message) => {
      dispatch(receiveMessage(message));
    });

    return socket;
  }
);

export const receiveMessage = (message) => ({
  type: "socket/receiveMessage",
  payload: message,
});

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeSocket.fulfilled, (state, action) => {
      state.socket = action.payload;
    });
    builder.addCase(receiveMessage, (state, action) => {
      state.messages.push(action.payload);
    });
  },
});

export const selectSocket = (state) => state.socket.socket;
export const selectMessages = (state) => state.socket.messages;

export default socketSlice.reducer;
