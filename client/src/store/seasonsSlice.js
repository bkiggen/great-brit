import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const currentSeasonSelector = (state) => state.seasons.current;
export const seasonsSelector = (state) => state.seasons.list;

export const fetchSeasons = createAsyncThunk("seasons/fetchSeasons", async () => {
  const data = await makeRequest.get("/seasons");
  return data.seasons;
});

export const fetchCurrentSeason = createAsyncThunk(
  "seasons/fetchCurrentSeason",
  async () => {
    const data = await makeRequest.get("/seasons/current");
    return data.season;
  }
);

export const createSeason = createAsyncThunk(
  "seasons/createSeason",
  async (seasonData, { rejectWithValue }) => {
    try {
      const data = await makeRequest.post("/seasons", seasonData);
      return data.season;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const seasonsSlice = createSlice({
  name: "seasons",
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchCurrentSeason.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createSeason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeason.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.list = [action.payload, ...state.list];
      })
      .addCase(createSeason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create season";
      });
  },
});

export default seasonsSlice.reducer;
