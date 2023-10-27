import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "@/store";
import { css } from "@emotion/css";
import { Button } from "@mui/material";
import { fetchBets, fetchBetsByEpisode } from "@/store/betsSlice";
import { betsSelector } from "@/store/betsSlice";

const Bets = ({ episodeId }) => {
  const dispatch = useDispatch();
  const bets = useSelector(betsSelector);
  const { user: sessionUser } = useSelector(sessionSelector);

  const styles = css`
    display: flex;
    flex-direction: column;
    margin-top: 80px;

    .betCard {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      margin-bottom: 12px;
      border-radius: 4px;
      padding: 18px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
    }

    .eligibleUsers {
      display: flex;
      flex-direction: column;
    }
  `;

  useEffect(() => {
    if (episodeId) {
      dispatch(fetchBetsByEpisode(episodeId));
    } else {
      dispatch(fetchBets());
    }
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const acceptButton = (bet) => {
    if (sessionUser?.id === bet.better.id) {
      return <Button variant="contained">Your Bet</Button>;
    } else if (bet.eligibleUsers?.find((user) => user.id === sessionUser?.id)) {
      <Button variant="contained">Accept Bet</Button>;
    } else {
      return <Button variant="contained">Not Eligible</Button>;
    }
  };

  return (
    <div className={`betTable ${styles}`}>
      {bets?.map((bet) => {
        return (
          <div key={bet.id} className="betCard">
            <div>{bet.description}</div>
            <div>{bet.better.firstName}</div>
            <div>{bet.odds}</div>
            <div>£{bet.maxLose}</div>
            <div className="eligibleUsers">
              {bet.eligibleUsers?.map((user) => {
                return <div>{user.firstName} - £125</div>;
              })}
            </div>
            {acceptButton(bet)}
          </div>
        );
      })}
    </div>
  );
};

export default Bets;
