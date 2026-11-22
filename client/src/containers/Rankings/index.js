import React, { useState, useEffect, useRef } from "react";
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
  Alert,
} from "@mui/material";
import { EmojiEvents, Lock, DragIndicator } from "@mui/icons-material";
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
  // Latest order, updated synchronously on every move so a save never
  // sends a stale order (state/effects can lag behind fast drags)
  const itemsRef = useRef(items);
  // Order at drag start, to skip saving when nothing changed
  const dragStartOrderRef = useRef(null);

  const orderKey = (list) => list.map((i) => i.star?.id).join(",");

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
      itemsRef.current = rankings;
      setItems(rankings);
    }
  }, [rankings]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentEpisode) {
      setEpisodeId(currentEpisode.id);
    }
  }, [currentEpisode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragStart = () => {
    dragStartOrderRef.current = orderKey(itemsRef.current);
  };

  const moveItem = (fromIndex, toIndex) => {
    // Work from the ref, not the render-time `items`, so quick successive
    // hovers build on each other instead of on an old order
    const newItems = [...itemsRef.current];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    itemsRef.current = updatedItems;
    setItems(updatedItems);
  };

  // Called when a drag ends anywhere (on a card, in a gap, or outside)
  const handleDragEnd = () => {
    const changed = orderKey(itemsRef.current) !== dragStartOrderRef.current;
    dragStartOrderRef.current = null;
    if (!changed) return;
    dispatch(postRankings({ rankings: itemsRef.current, episodeId }));
  };

  // Check if the selected episode is before the current episode
  const selectedEpisode = episodes.find((ep) => ep.id === episodeId);
  const isLocked =
    currentEpisode &&
    selectedEpisode &&
    selectedEpisode.number < currentEpisode.number;

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
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
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #197b9f 0%, #156988 100%)",
            }}
          >
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
                      <MenuItem key={episode.id} value={episode.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          Episode {episode.number}
                          {episode.current && (
                            <Chip
                              label="Current"
                              size="small"
                              color="primary"
                            />
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
          <Alert icon={<DragIndicator />} severity="info" sx={{ mb: 3 }}>
            Drag the{" "}
            <DragIndicator sx={{ fontSize: 16, verticalAlign: "middle" }} />{" "}
            icon to reorder. Your rankings save automatically!
          </Alert>
        )}

        {/* Rankings List */}
        <Box>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <DraggableRankingItem
                key={item.star?.id ?? idx}
                item={item}
                index={idx}
                moveItem={moveItem}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                disabled={isLocked}
              />
            ))
          ) : (
            <Card>
              <CardContent>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
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
