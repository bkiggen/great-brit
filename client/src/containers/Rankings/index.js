import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRankings,
  postRankings,
  rankingsSelector,
} from "store/rankingsSlice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Box, Button, Select, MenuItem } from "@mui/material";
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

    // Auto-save rankings after reordering
    dispatch(postRankings({ rankings: updatedItems, episodeId }));
  };

  // Check if the selected episode is before the current episode
  const isLocked = currentEpisode && episodeId < currentEpisode.number;

  return items ? (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ paddingTop: "150px", paddingBottom: "80px" }}>
        {currentEpisode && (
          <Select
            value={episodeId}
            onChange={(e) => {
              setEpisodeId(e.target.value);
            }}
            sx={{ marginLeft: "12px", minWidth: "100px" }}
          >
            {episodes.map((episode) => (
              <MenuItem key={episode.number} value={episode.number}>
                {episode.number}
              </MenuItem>
            ))}
          </Select>
        )}
        {items.map((item, idx) => (
          <DraggableRankingItem
            key={item.id}
            item={item}
            index={idx}
            moveItem={moveItem}
            disabled={isLocked}
          />
        ))}
      </Box>
    </DndProvider>
  ) : (
    <div>loading...</div>
  );
};

export default Rankings;
