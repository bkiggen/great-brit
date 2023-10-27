import React from "react";
import { bankHistoryStyles } from "./styles";

const mockBankHistory = [123, 344, 555, 233, 111, 0, 125];
const currentBalance = 125;

const Home = () => {
  return (
    <div className={`episodes ${bankHistoryStyles}`}>
      <div className="bank-item">
        <div className="episode">Current</div>
        <div className="value">{currentBalance}</div>
      </div>
      {mockBankHistory.map((bankItem, idx) => {
        return (
          <div key={bankItem} className="bank-item">
            <div className="episode">Episode: {idx + 1}</div>
            <div className="value">{bankItem}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
