import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createEpisode } from "store/episodesSlice";
import SetCurrentEpisode from "./SetCurrentEpisode";

const CreateEpisode = ({ episodes }) => {
  const dispatch = useDispatch();
  const [newEpisodeNumber, setNewEpisodeNumber] = useState("");

  const handleCreateEpisode = () => {
    if (newEpisodeNumber !== "") {
      dispatch(createEpisode({ number: parseInt(newEpisodeNumber, 10) }));
      setNewEpisodeNumber("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: "4px",
        padding: "24px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl variant="outlined" sx={{ marginRight: "12px", minWidth: 200 }}>
          <InputLabel id="episode-number-label">Episode Number</InputLabel>
          <Select
            labelId="episode-number-label"
            id="episode-number-select"
            value={newEpisodeNumber}
            onChange={(e) => setNewEpisodeNumber(e.target.value)}
            label="Episode Number"
          >
            <MenuItem value="">
              <em>Select Episode</em>
            </MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <MenuItem key={num} value={num}>
                Episode {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={handleCreateEpisode}
          disabled={newEpisodeNumber === ""}
          sx={{ height: "56px" }}
        >
          Create Episode
        </Button>
      </Box>
      <SetCurrentEpisode episodes={episodes} />
    </Box>
  );
};

export default CreateEpisode;
