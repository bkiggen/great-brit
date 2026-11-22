import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const LinkItem = ({ to, label }) => {
  const { pathname } = useLocation();

  const isActive = pathname === to;

  return (
    <Link to={to}>
      <Button
        variant="text"
        sx={{
          "&:hover": { boxShadow: "none", color: "transparent" },
          "&:hover > *": { color: "#f7d3de" },
        }}
      >
        <Typography
          sx={{
            color: isActive ? "#f7d3de" : "white",
            fontSize: 17,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: isActive ? "2px solid #f7d3de" : "2px solid transparent",
            lineHeight: 1.6,
          }}
        >
          {label}
        </Typography>
      </Button>
    </Link>
  );
};

export default LinkItem;
