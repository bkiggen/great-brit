import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import usersReducer from "./usersSlice";
import socketReducer from "./socketSlice";
import sessionSlice from "./sessionSlice";
import betsSlice from "./betsSlice";
import eventsSlice from "./eventsSlice";
import starsSlice from "./starsSlice";
import thunk from "redux-thunk";
import rankingsSlice from "./rankingsSlice";
import episodesSlice from "./episodesSlice";

export const usersSelector = (state) => state.users.list;
export const sessionSelector = (state) => state.session;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["session"], // Specify which reducer(s) you want to persist
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    users: usersReducer,
    socket: socketReducer,
    session: sessionSlice,
    bets: betsSlice,
    events: eventsSlice,
    stars: starsSlice,
    rankings: rankingsSlice,
    episodes: episodesSlice,
  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

const persistor = persistStore(store);

export { store, persistor };
