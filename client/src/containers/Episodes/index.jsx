import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import { styles } from "./styles";
import { fetchEpisodes, createEpisode } from "store/episodesSlice";
import Events from "../../components/Events";
import BetTable from "containers/Bets/BetTable";

const Admin = () => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);

  const handleTabClick = (episodeId) => {
    setActive(episodeId);
  };

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodes.length > 0) {
      setActive(episodes[episodes.length - 1]);
    }
  }, [episodes]);

  return (
    <div className={`episodes ${styles}`}>
      <div className="folder">
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
          {active && (
            <>
              <Events episodeId={active?._id} />
              <div style={{ height: "100px" }} />
              <h2>Bets:</h2>
              <BetTable episodeId={active?._id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
