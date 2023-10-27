import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BetTable from "@/containers/Bets/BetTable";
import BankBalance from "./BankBalance";
import { styles } from "./styles";

const Home = () => {
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
          <Typography sx={{ marginRight: "18px" }}>$125</Typography>
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
          <Typography sx={{ marginRight: "18px" }}>$125</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BetTable />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Home;
