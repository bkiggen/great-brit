import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const betsSelector = (state) => state.bets.list;

const initialState = {
  list: [],
};

export const fetchBets = createAsyncThunk(
  "bets/fetchBets",
  async ({ episodeId }) => {
    try {
      const data = await makeRequest.get("/bets", { episodeId });
      return data.bets;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
);

export const createBet = createAsyncThunk("bets/createBet", async (betData) => {
  const data = await makeRequest.post("/bets", betData);

  return data.bet;
});

export const updateBet = createAsyncThunk("bets/updateBet", async (betData) => {
  const data = await makeRequest.put(`/bets/${betData.betId}`, betData);

  return data.bet;
});

export const deleteBet = createAsyncThunk("bets/deleteBet", async (betId) => {
  await makeRequest.delete(`/bets/${betId}`);
  return betId;
});

export const acceptBet = createAsyncThunk("bets/acceptBet", async (betId) => {
  const data = await makeRequest.post(`/bets/${betId}/accept`);
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
    builder.addCase(createBet.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
    builder.addCase(updateBet.fulfilled, (state, action) => {
      const index = state.list.findIndex((bet) => bet.id === action.payload.id);
      state.list[index] = action.payload;
    });
    builder.addCase(deleteBet.fulfilled, (state, action) => {
      const index = state.list.findIndex((bet) => bet.id === action.payload);

      if (index !== -1) {
        state.list.splice(index, 1);
      }
    });
    builder.addCase(acceptBet.fulfilled, (state, action) => {
      const index = state.list.findIndex((bet) => bet.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    });
  },
});

export default betsSlice.reducer;
