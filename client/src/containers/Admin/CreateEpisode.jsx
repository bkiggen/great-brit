import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { createEpisode } from "@/store/episodesSlice";

const CreateEpisode = () => {
  const dispatch = useDispatch();

  const [newEpisodeNumber, setNewEpisodeNumber] = useState("");

  const handleCreateEpisode = () => {
    dispatch(createEpisode({ number: newEpisodeNumber }));
    setNewEpisodeNumber("");
  };

  return (
    <div className="createForm">
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
    </div>
  );
};

export default CreateEpisode;
