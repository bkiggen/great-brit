import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpisodes, calculateDeltas } from "store/episodesSlice";
import { fetchStars } from "store/starsSlice";
import { Button, Typography, Box } from "@mui/material";

import BetTable from "containers/Bets/BetTable";
import CreateEpisode from "./CreateEpisode";
import ManageStars from "./ManageStars";
import Events from "../../components/Events";

import { styles } from "./styles";

const Episodes = ({ admin }) => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);

  const handleTabClick = (episodeId) => {
    setActive(episodeId);
  };

  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodes.length > 0) {
      const currentEpisode = episodes.find((ep) => ep.current);
      if (currentEpisode) {
        setActive(currentEpisode);
        return;
      }
    }
  }, [episodes]);

  return (
    <div className={`episodes ${styles}`}>
      {admin && <CreateEpisode episodes={episodes} />}
      <div className="folder">
        <div className="tabs">
          {episodes.map((episode) => {
            const tabClass =
              episode.number === active?.number ? "tab active" : "tab inactive";

            return (
              <div
                key={episode.number}
                className={tabClass}
                onClick={() => handleTabClick(episode)}
              >
                {episode.number}
              </div>
            );
          })}
        </div>
        <div className="main">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>Episode {active?.number}</h1>
            {admin && (
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(calculateDeltas({ episodeId: active?.number }));
                }}
              >
                Calculate Deltas
              </Button>
            )}
          </Box>
          {active && <Events episodeId={active?.number} />}
          {active && admin && <ManageStars episodeId={active?.number} />}
          {active && (
            <>
              <Typography
                variant="h5"
                sx={{ marginTop: "48px", fontSize: "24px", fontWeight: "500" }}
              >
                Bets:
              </Typography>
              <BetTable episodeId={active?.number} readOnly admin={admin} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Episodes;
