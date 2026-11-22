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
      // In production, use same origin; in development, use localhost:8000
      const baseUrl = process.env.NODE_ENV === 'production'
        ? window.location.origin
        : (process.env.REACT_APP_API_URL || 'http://localhost:8000');

      const response = await fetch(`${baseUrl}/api/login`, {
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

const apiBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : process.env.REACT_APP_API_URL || "http://localhost:8000";

export const logoutUser = createAsyncThunk(
  "session/logoutUser",
  async (_, { getState }) => {
    const { sessionToken } = getState().session;
    try {
      await fetch(`${apiBaseUrl()}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
      });
    } catch (error) {
      // Log out locally even if the server call fails
    }
  }
);

// Refresh the logged-in user (e.g. to pick up isAdmin)
export const fetchMe = createAsyncThunk(
  "session/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const { sessionToken } = getState().session;
    const res = await fetch(`${apiBaseUrl()}/api/users/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (!res.ok) return rejectWithValue(res.status);
    return (await res.json()).user;
  }
);

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    clearSession: (state) => {
      state.user = null;
      state.sessionToken = null;
      state.expiresAt = null;
    },
  },
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
      state.expiresAt = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { clearSession } = sessionSlice.actions;

export const sessionSelector = (state) => state.session;
export const selectUser = (state) => state.session.user;
export const selectIsAdmin = (state) => Boolean(state.session.user?.isAdmin);
export const selectIsAuthenticated = (state) => state.session.isAuthenticated;
export const selectLoading = (state) => state.session.loading;
export const selectError = (state) => state.session.error;

export default sessionSlice.reducer;
