import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  fetchEpisodeStars,
  updateEpisodeStars,
  episodeStarsSelector,
} from "store/episodesSlice";
import { starsSelector } from "store/starsSlice";

const ManageStars = ({ episodeId }) => {
  const dispatch = useDispatch();
  const allStars = useSelector(starsSelector);
  const episodeStars = useSelector(episodeStarsSelector);
  const [selectedStarIds, setSelectedStarIds] = useState([]);

  useEffect(() => {
    if (episodeId) {
      dispatch(fetchEpisodeStars(episodeId));
    }
  }, [episodeId, dispatch]);

  useEffect(() => {
    // When episode stars are loaded, set the selected star IDs
    if (episodeStars && episodeStars.length > 0) {
      setSelectedStarIds(episodeStars.map((star) => star.id));
    }
  }, [episodeStars]);

  const handleToggleStar = (starId) => {
    const newSelectedStarIds = selectedStarIds.includes(starId)
      ? selectedStarIds.filter((id) => id !== starId)
      : [...selectedStarIds, starId];

    setSelectedStarIds(newSelectedStarIds);

    // Update the backend
    dispatch(updateEpisodeStars({ episodeId, starIds: newSelectedStarIds }));
  };

  if (!episodeId) {
    return null;
  }

  return (
    <Box sx={{ marginTop: "24px", marginBottom: "24px" }}>
      <Typography variant="h6" sx={{ marginBottom: "12px" }}>
        Manage Stars for Episode {episodeId}
      </Typography>
      <FormGroup>
        {allStars.map((star) => (
          <FormControlLabel
            key={star.id}
            control={
              <Checkbox
                checked={selectedStarIds.includes(star.id)}
                onChange={() => handleToggleStar(star.id)}
              />
            }
            label={`${star.firstName} ${star.lastName}`}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default ManageStars;
