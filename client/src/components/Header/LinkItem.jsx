import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const LinkItem = ({ to, label }) => {
  const { pathname } = useLocation();

  const isActive = pathname === to;

  return (
    <Link to={to}>
      <Button variant="text">
        <Typography sx={{ color: isActive ? "lightpink" : "white" }}>
          {label}
        </Typography>
      </Button>
    </Link>
  );
};

export default LinkItem;
