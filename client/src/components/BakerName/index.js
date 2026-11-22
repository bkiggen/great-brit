import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

export const bakerFullName = (star) =>
  star ? `${star.firstName || ""} ${star.lastName || ""}`.trim() : "";

// Round baker photo. Falls back to the first initial when there is no photo.
export const BakerAvatar = ({ star, size = 32, sx }) => (
  <Avatar
    src={star?.imageUrl || undefined}
    alt={bakerFullName(star)}
    sx={{
      width: size,
      height: size,
      fontSize: size * 0.45,
      bgcolor: "#614051",
      "& img": { objectPosition: "center 15%" },
      ...sx,
    }}
  >
    {star?.firstName?.[0]}
  </Avatar>
);

// Baker photo + name in one line. Pass Typography props through.
const BakerName = ({ star, size = 28, gap = 1, fallback = "—", ...typographyProps }) => {
  if (!star) return <Typography {...typographyProps}>{fallback}</Typography>;
  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap, minWidth: 0 }}
    >
      <BakerAvatar star={star} size={size} />
      <Typography component="span" noWrap {...typographyProps}>
        {bakerFullName(star)}
      </Typography>
    </Box>
  );
};

export default BakerName;
