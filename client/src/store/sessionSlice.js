import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  sessionToken: null,
};

export const loginUser = createAsyncThunk(
  "session/loginUser",
  async (credentials, { getState }) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // const state = getState();
        // const { socket } = state.socket;

        // if (socket) {
        //   socket.emit("new-room-created", {
        //     roomId: data.sessionToken,
        //     userId: data.user.id,
        //   });
        // }
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("session/logoutUser", async () => {
  await fetch("/api/logout");
});

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.sessionToken = action.payload.sessionToken;
      state.loading = false;
      state.expiresAt = action.payload.expiresAt;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.sessionToken = null;
    });
  },
});

export const selectUser = (state) => state.session.user;
export const selectIsAuthenticated = (state) => state.session.isAuthenticated;
export const selectLoading = (state) => state.session.loading;
export const selectError = (state) => state.session.error;

export default sessionSlice.reducer;
