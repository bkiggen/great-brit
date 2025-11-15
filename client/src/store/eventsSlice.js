import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const eventsSelector = (state) => state.events.list;

const initialState = {
  list: [],
};

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const data = await makeRequest.get("/events");

  return data.events;
});

export const fetchEventsByEpisode = createAsyncThunk(
  "events/fetchEventsByEpisode",
  async (episodeId) => {
    const data = await makeRequest.get(`/episodes/${episodeId}/events`);

    return data.events;
  }
);

export const createEvent = createAsyncThunk(
  "episodes/createEvent",
  async (eventData) => {
    const data = await makeRequest.post(
      `/episodes/${eventData.episodeId}/events`,
      eventData
    );
    return data.event;
  }
);

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchEventsByEpisode.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
  },
});

export default eventsSlice.reducer;
