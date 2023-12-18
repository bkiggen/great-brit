import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRankings,
  postRankings,
  rankingsSelector,
} from "store/rankingsSlice";

import { cloneDeep } from "lodash";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { Box, Button, Select, MenuItem } from "@mui/material";
import {
  currentEpisodeSelector,
  fetchCurrentEpisode,
  fetchEpisodes,
} from "store/episodesSlice";

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
      setEpisodeId(currentEpisode._id);
    }
  }, [currentEpisode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    dispatch(postRankings(items));
  };

  const handleMove = (item, direction) => {
    const oldIdx = items.findIndex((i) => i._id === item._id);
    const newItems = cloneDeep(items);
    const oldItem = newItems[oldIdx];

    const changedIdx = direction === "up" ? oldIdx - 1 : oldIdx + 1;

    if (changedIdx >= 0 && changedIdx < newItems.length) {
      newItems[oldIdx] = newItems[changedIdx];
      newItems[changedIdx] = { ...oldItem };

      newItems.forEach((item, idx) => {
        item.rank = idx + 1;
      });

      setItems(newItems);
    }
  };

  return items ? (
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
            <MenuItem key={episode._id} value={episode._id}>
              {episode.number}
            </MenuItem>
          ))}
        </Select>
      )}
      <Button
        onClick={handleSubmit}
        variant="contained"
        sx={{ position: "absolute", top: "100px", right: "20px" }}
      >
        Submit
      </Button>
      {items.map((item, idx) => {
        return (
          <Box
            key={item._id}
            sx={{
              height: "20px",
              width: "300px",
              margin: "0 auto",
              background: "white",
              marginBottom: "12px",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px",
              borderRadius: "4px",
            }}
          >
            <Box sx={{ fontSize: "24px", fontWeight: 700 }}>
              {idx + 1}: {item.starId?.firstName}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <ArrowCircleUpIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "24px",
                  marginBottom: "6px",

                  "&:hover": {
                    color: "blue",
                  },
                }}
                onClick={() => handleMove(item, "up")}
              />
              <ArrowCircleDownIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "24px",

                  "&:hover": {
                    color: "blue",
                  },
                }}
                onClick={() => handleMove(item, "down")}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  ) : (
    <div>loading...</div>
  );
};

export default Rankings;
