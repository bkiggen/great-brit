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

// Add the new async thunks for delete and sendHome
export const deleteStar = createAsyncThunk("stars/deleteStar", async (id) => {
  await makeRequest.delete(`/stars/${id}`);
  return id;
});

export const sendHomeStar = createAsyncThunk(
  "stars/sendHomeStar",
  async (id) => {
    const data = await makeRequest.put(`/stars/sendHome/${id}`);
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

    // Add reducers for delete and sendHome actions
    builder.addCase(deleteStar.fulfilled, (state, action) => {
      state.list = state.list.filter((star) => star._id !== action.payload);
    });
    builder.addCase(sendHomeStar.fulfilled, (state, action) => {
      state.list = state.list.map((star) =>
        star.id === action.payload.id ? action.payload : star
      );
    });
  },
});

export default starsSlice.reducer;
