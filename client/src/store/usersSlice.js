import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const usersSelector = (state) => state.users.list;

const initialState = {
  list: [],
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const data = await makeRequest.get("/users");
  return data.users;
});

export const fetchUsersWithRankingsByEpisode = createAsyncThunk(
  "users/fetchUsersWithRankingsByEpisode",
  async (episodeId) => {
    const data = await makeRequest.get(`/users/usersWithRankings/${episodeId}`);

    return data.users;
  }
);

export const registerUser = createAsyncThunk(
  "session/registerUser",
  async (userData, { getState }) => {
    const state = getState();
    const { sessionToken } = state.session;

    const data = await makeRequest.post("/users", userData, sessionToken);

    return data;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.sessionToken = action.sessionToken;
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(
      fetchUsersWithRankingsByEpisode.fulfilled,
      (state, action) => {
        state.list = action.payload;
      }
    );
  },
});

export default usersSlice.reducer;
