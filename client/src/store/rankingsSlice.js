import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const rankingsSelector = (state) => state.rankings.list;

const initialState = {
  list: [],
};

export const fetchRankings = createAsyncThunk(
  "rankings/fetchRankings",
  async ({ episodeId }) => {
    const data = await makeRequest.get("/rankings", { episodeId });

    return data.rankings;
  }
);

export const postRankings = createAsyncThunk(
  "rankings/postRankings",
  async ({ rankings, episodeId }) => {
    const data = await makeRequest.post("/rankings", { rankings, episodeId });

    return data.rankings;
  }
);

export const rankingsSlice = createSlice({
  name: "rankings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRankings.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(postRankings.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default rankingsSlice.reducer;
