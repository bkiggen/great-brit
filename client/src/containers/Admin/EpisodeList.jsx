import React from "react";
import { useSelector } from "react-redux";

import Events from "components/Events";
import BetTable from "containers/Bets/BetTable";

const EpisodeList = ({ active, setActive }) => {
  const episodes = useSelector((state) => state.episodes.list);

  const handleTabClick = (episodeId) => {
    setActive(episodeId);
  };

  return (
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
            <div style={{ height: "100px" }} /> <h2>Bets:</h2>
            <BetTable episodeId={active?._id} />
          </>
        )}
      </div>
    </div>
  );
};

export default EpisodeList;
