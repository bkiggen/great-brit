import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../helpers/makeRequest";

export const starsSelector = (state) => state.stars.list;

const initialState = {
  list: [],
};

export const fetchStars = createAsyncThunk("stars/fetchStars", async () => {
  const data = await makeRequest.get("/stars");

  return data.stars;
});

export const createStar = createAsyncThunk(
  "stars/createStar",
  async (starData) => {
    const data = await makeRequest.post("/stars", starData);

    return data.star;
  }
);

export const updateStar = createAsyncThunk(
  "stars/updateStar",
  async (starData) => {
    const data = await makeRequest.put(`/stars/${starData.starId}`, starData);

    return data.star;
  }
);

export const starsSlice = createSlice({
  name: "stars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStars.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(createStar.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
    builder.addCase(updateStar.fulfilled, (state, action) => {
      const index = state.list.findIndex(
        (star) => star.id === action.payload.id
      );
      state.list[index] = action.payload;
    });
  },
});

export default starsSlice.reducer;
