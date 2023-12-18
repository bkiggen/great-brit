import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import {
  setCurrentEpisode,
  currentEpisodeSelector,
  fetchCurrentEpisode,
} from "store/episodesSlice";

const SetCurrentEpisode = ({ episodes }) => {
  const dispatch = useDispatch();
  const currentEpisode = useSelector(currentEpisodeSelector);

  useEffect(() => {
    dispatch(fetchCurrentEpisode());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      Current Episode:
      {currentEpisode && (
        <Select
          value={currentEpisode?._id}
          onChange={(e) => {
            dispatch(setCurrentEpisode({ episodeId: e.target.value }));
          }}
          sx={{ marginLeft: "12px", minWidth: "100px" }}
        >
          {episodes.map((episode) => (
            <MenuItem key={episode._id} value={episode._id}>
              {episode.number}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
};

export default SetCurrentEpisode;
