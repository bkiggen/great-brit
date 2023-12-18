import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Box } from "@mui/material";
import { createEpisode } from "store/episodesSlice";
import SetCurrentEpisode from "./SetCurrentEpisode";

const CreateEpisode = ({ episodes }) => {
  const dispatch = useDispatch();
  const [newEpisodeNumber, setNewEpisodeNumber] = useState("");

  const handleCreateEpisode = () => {
    dispatch(createEpisode({ number: newEpisodeNumber }));
    setNewEpisodeNumber("");
  };

  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: "4px",
        padding: "24px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        marginTop: "214px",
      }}
    >
      <Box>
        <TextField
          label="New Episode Number"
          variant="outlined"
          value={newEpisodeNumber}
          onChange={(e) => setNewEpisodeNumber(e.target.value)}
          sx={{ marginRight: "12px" }}
        />
        <Button variant="outlined" onClick={handleCreateEpisode}>
          Create Episode
        </Button>
      </Box>
      <SetCurrentEpisode episodes={episodes} />
    </div>
  );
};

export default CreateEpisode;
