import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import { fetchEpisodes } from "store/episodesSlice";
import CreateEpisode from "../../Episodes/CreateEpisode";

import AdminEvents from "components/Events";

// WHAT VALUE DOES THIS COMPONENT HAVE?

const Episodes = () => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);

  useEffect(() => {
    if (episodes.length > 0) {
      setActive(episodes[episodes.length - 1]);
    }
  }, [episodes]);

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabClick = (episodeId) => {
    setActive(episodeId);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "blue",
          borderRadius: "0 4px 4px 0",
          minHeight: "900px",
          display: "flex",

          ".tabs": {
            width: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "var(--baby-blue)",

            ".tab": {
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px 0 0 4px",
              cursor: "pointer",
              marginBottom: "-4px",
              transition: "0.2s all",
            },

            ".inactive": {
              backgroundColor: "var(--manilla-dark)",
              minHeight: "70px",
            },

            ".active": {
              backgroundColor: "var(--manilla)",
              zIndex: "2",
              minHeight: "110px",
            },
          },
          ".main": {
            width: "calc(100% - 90px)",
            margin: "30px",
            background: "white",
            padding: "24px",

            ".eventCard": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "white",
              marginBottom: "12px",
              borderRadius: "4px",
              padding: "18px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
            },
          },
        }}
      >
        <CreateEpisode />
        <div className="tabs">
          {episodes.map((episode) => {
            const tabClass =
              episode._id === active?._id ? "tab active" : "tab inactive";

            return (
              <div
                key={episode._id}
                className={tabClass}
                onClick={() => handleTabClick(episode)}
              >
                {episode.number}
              </div>
            );
          })}
        </div>
        <div className="main">
          <h1>Episode {active?.number}</h1>
          {active && <AdminEvents episodeId={active?._id} />}
        </div>
      </Box>
    </>
  );
};

export default Episodes;
