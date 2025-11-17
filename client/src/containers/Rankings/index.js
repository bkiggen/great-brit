import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRankings,
  postRankings,
  rankingsSelector,
} from "store/rankingsSlice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  Box,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Paper,
  Alert,
} from "@mui/material";
import {
  EmojiEvents,
  Lock,
  DragIndicator,
  Info,
} from "@mui/icons-material";
import {
  currentEpisodeSelector,
  fetchCurrentEpisode,
  fetchEpisodes,
} from "store/episodesSlice";
import DraggableRankingItem from "./DraggableRankingItem";

const Rankings = () => {
  const dispatch = useDispatch();
  const rankings = useSelector(rankingsSelector);
  const currentEpisode = useSelector(currentEpisodeSelector);
  const episodes = useSelector((state) => state.episodes.list);

  const [items, setItems] = useState([]);
  const [episodeId, setEpisodeId] = useState(null);

  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchCurrentEpisode());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodeId) {
      dispatch(fetchRankings({ episodeId }));
    }
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rankings) {
      setItems(rankings);
    }
  }, [rankings]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentEpisode) {
      setEpisodeId(currentEpisode.number);
    }
  }, [currentEpisode]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    // Update ranks by creating new objects
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    setItems(updatedItems);
  };

  const handleDrop = () => {
    // Save rankings when item is dropped
    dispatch(postRankings({ rankings: items, episodeId }));
  };

  // Check if the selected episode is before the current episode
  const isLocked = currentEpisode && episodeId < currentEpisode.number;

  return items ? (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          paddingTop: { xs: "100px", md: "120px" },
          paddingBottom: "80px",
          paddingX: { xs: 2, md: 4 },
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <EmojiEvents sx={{ fontSize: 48, color: "#e8a23d", mr: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "32px", md: "48px" },
              }}
            >
              Baker Rankings
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {isLocked
              ? "This episode is locked. You can view but not edit rankings."
              : "Drag and drop to rank the bakers from best to worst"}
          </Typography>
        </Box>

        {/* Episode Selector Card */}
        {currentEpisode && (
          <Card sx={{ mb: 4, background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    Select Episode:
                  </Typography>
                  {isLocked && (
                    <Chip
                      icon={<Lock sx={{ color: "white !important" }} />}
                      label="Locked"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
                <FormControl sx={{ minWidth: 200 }}>
                  <Select
                    value={episodeId}
                    onChange={(e) => setEpisodeId(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    {episodes.map((episode) => (
                      <MenuItem key={episode.number} value={episode.number}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Episode {episode.number}
                          {episode.current && (
                            <Chip label="Current" size="small" color="primary" />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Instructions Alert */}
        {!isLocked && items.length > 0 && (
          <Alert
            icon={<DragIndicator />}
            severity="info"
            sx={{ mb: 3 }}
          >
            Drag the <DragIndicator sx={{ fontSize: 16, verticalAlign: "middle" }} /> icon to reorder. Your rankings save automatically!
          </Alert>
        )}

        {/* Rankings List */}
        <Box>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <DraggableRankingItem
                key={item.id}
                item={item}
                index={idx}
                moveItem={moveItem}
                onDrop={handleDrop}
                disabled={isLocked}
              />
            ))
          ) : (
            <Card>
              <CardContent>
                <Typography variant="body1" color="text.secondary" align="center">
                  No rankings available for this episode yet.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </DndProvider>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" color="text.secondary">
        Loading rankings...
      </Typography>
    </Box>
  );
};

export default Rankings;
