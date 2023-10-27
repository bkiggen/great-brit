import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const betsSelector = (state) => state.bets.list;

const initialState = {
  list: [],
};

export const fetchBets = createAsyncThunk("bets/fetchBets", async () => {
  const data = await makeRequest.get("/bets");

  return data.bets;
});

export const fetchBetsByEpisode = createAsyncThunk(
  "bets/fetchBetsByEpisode",
  async (episodeId) => {
    const data = await makeRequest.get(`/episodes/${episodeId}/bets`);

    return data.bets;
  }
);

export const createBet = createAsyncThunk("bets/createBet", async (betData) => {
  const data = await makeRequest.post("/bets", betData);

  return data.bet;
});

export const betsSlice = createSlice({
  name: "bets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBets.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchBetsByEpisode.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(createBet.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
  },
});

export default betsSlice.reducer;
