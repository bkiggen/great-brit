import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

// Thunk to fetch episodes
export const fetchEpisodes = createAsyncThunk(
  "episodes/fetchEpisodes",
  async () => {
    const data = await makeRequest.get("/episodes");
    return data.episodes;
  }
);

// Thunk to fetch events for a specific episode
export const fetchEventsForEpisode = createAsyncThunk(
  "episodes/fetchEventsForEpisode",
  async (episodeId) => {
    const data = await makeRequest.get(`/episodes/${episodeId}/events`);
    return data.events;
  }
);

// Thunk to create a new episode
export const createEpisode = createAsyncThunk(
  "episodes/createEpisode",
  async (episodeData) => {
    const data = await makeRequest.post("/episodes", episodeData);
    return data.episode;
  }
);

const episodesSlice = createSlice({
  name: "episodes",
  initialState: {
    list: [],
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEventsForEpisode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsForEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsForEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEpisode.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default episodesSlice.reducer;
