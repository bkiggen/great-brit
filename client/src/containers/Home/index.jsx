import React from "react";
import { useSelector } from "react-redux";
import { userBalanceHistorySelector } from "store/usersSlice";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BetTable from "containers/Bets/BetTable";
import BankBalance from "./BankBalance";
import { styles } from "./styles";

const Home = () => {
  const balanceData = useSelector(userBalanceHistorySelector);
  // add all balanceData Deltas together to get current balance
  const allDeltas = balanceData.reduce((acc, curr) => {
    return acc + curr.delta;
  }, 0);
  const currentBalance = 100 + allDeltas;

  return (
    <div className={`episodes ${styles}`}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            ".MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <Typography>Bank Account</Typography>
          <Typography
            sx={{
              marginRight: "18px",
              color: currentBalance > 0 ? "green" : "red",
            }}
          >
            £
            {currentBalance.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BankBalance />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            ".MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <Typography>My Bets</Typography>
          {/* <Typography sx={{ marginRight: "18px" }}>$125</Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <BetTable />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Home;
