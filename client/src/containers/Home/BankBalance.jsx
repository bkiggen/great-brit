import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import {
  fetchUserBalanceHistory,
  userBalanceHistorySelector,
} from "store/usersSlice";
import { fetchEpisodes, episodesSelector } from "store/episodesSlice";
import { bankHistoryStyles } from "./styles";

const Home = () => {
  const dispatch = useDispatch();
  const balanceData = useSelector(userBalanceHistorySelector);
  const episodes = useSelector(episodesSelector);

  useEffect(() => {
    dispatch(fetchUserBalanceHistory());
    dispatch(fetchEpisodes());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge episodes with balance data
  const episodesWithDeltas = useMemo(() => {
    return episodes.map((episode) => {
      const deltaData = balanceData.find(
        (bd) => bd.episode.number === episode.number
      );
      return {
        episode,
        delta: deltaData?.delta,
        hasDelta: !!deltaData,
      };
    });
  }, [episodes, balanceData]);

  return (
    <div className={`episodes ${bankHistoryStyles}`}>
      <div className="bank-item">
        <div className="episode">Starting Balance:</div>
        <div className="value">£100.00</div>
      </div>
      {episodesWithDeltas.map((item, idx) => {
        return (
          <div key={item.episode.number} className="bank-item">
            <div className="episode">Episode: {item.episode.number}</div>
            {item.hasDelta ? (
              <Box
                className="value"
                sx={{ color: item.delta > 0 ? "green" : "red" }}
              >
                £{" "}
                {item.delta.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Box>
            ) : (
              <Box className="value" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                Not yet calculated
              </Box>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Home;
