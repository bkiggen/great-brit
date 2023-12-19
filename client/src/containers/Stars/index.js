import React from "react";
import { Container } from "@mui/material";
import NewBet from "./NewStar";
import StarsList from "./StarsTable";

const Stars = () => {
  return (
    <Container sx={{ paddingBottom: "80px", paddingTop: "160px" }}>
      <NewBet />
      <StarsList />
    </Container>
  );
};

export default Stars;
