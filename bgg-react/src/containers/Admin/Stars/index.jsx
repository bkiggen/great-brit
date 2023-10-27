import React from "react";
import { Container } from "@mui/material";
import NewBet from "./NewStar";
import StarsList from "./StarsList";

const Stars = () => {
  return (
    <Container sx={{ paddingBottom: "80px" }}>
      <NewBet />
      <StarsList />
    </Container>
  );
};

export default Stars;
