import React from "react";
import { Container } from "@mui/material";
import NewBet from "./NewBet";
import BetTable from "./BetTable";

const Bets = ({ episodeId }) => {
  return (
    <Container sx={{ paddingBottom: "80px" }}>
      <NewBet />
      <BetTable episodeId={episodeId} />
    </Container>
  );
};

export default Bets;
