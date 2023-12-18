import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const currentEpisodeSelector = (state) => state.episodes.currentEpisode;
export const episodesSelector = (state) => state.episodes.list;

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

export const setCurrentEpisode = createAsyncThunk(
  "episodes/setCurrentEpisode",
  async ({ episodeId }) => {
    const data = await makeRequest.post("/episodes/current", { episodeId });
    return data.episode;
  }
);

export const fetchCurrentEpisode = createAsyncThunk(
  "episodes/fetchCurrentEpisode",
  async () => {
    const data = await makeRequest.get("/episodes/current");
    return data.episode;
  }
);

const episodesSlice = createSlice({
  name: "episodes",
  initialState: {
    list: [],
    events: [],
    currentEpisode: null,
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
      })
      .addCase(setCurrentEpisode.pending, (state) => {
        state.loading = true;
      })
      .addCase(setCurrentEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEpisode = action.payload;
      })
      .addCase(setCurrentEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCurrentEpisode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEpisode = action.payload;
      })
      .addCase(fetchCurrentEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default episodesSlice.reducer;
