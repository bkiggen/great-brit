import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import {
  fetchUserBalanceHistory,
  userBalanceHistorySelector,
} from "store/usersSlice";
import { bankHistoryStyles } from "./styles";

const Home = () => {
  const dispatch = useDispatch();
  const balanceData = useSelector(userBalanceHistorySelector);
  // order based on episode number

  useEffect(() => {
    dispatch(fetchUserBalanceHistory());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`episodes ${bankHistoryStyles}`}>
      <div className="bank-item">
        <div className="episode">Starting Balance:</div>
        <div className="value">£100.00</div>
      </div>
      {balanceData.map((bankItem, idx) => {
        return (
          <div key={bankItem} className="bank-item">
            <div className="episode">Episode: {bankItem.episode.number}</div>
            <Box
              className="value"
              sx={{ color: bankItem.delta > 0 ? "green" : "red" }}
            >
              £{" "}
              {bankItem.delta.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Box>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
