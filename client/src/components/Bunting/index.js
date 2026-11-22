import React from "react";
import { Box } from "@mui/material";

// Simple bunting strip (original SVG): a string with alternating flags.
const FLAG_COLORS = ["#c73d67", "#f4f2ed", "#238ab0", "#f2c14e", "#f7d3de", "#3f8f6b"];
const FLAG_W = 28;
const COUNT = FLAG_COLORS.length;

const pattern = (() => {
  const w = FLAG_W * COUNT;
  const flags = FLAG_COLORS.map((c, i) => {
    const x = i * FLAG_W;
    return `<path d='M${x + 2} 3 L${x + FLAG_W - 2} 3 L${x + FLAG_W / 2} 17 Z' fill='${c}' stroke='rgba(0,0,0,0.12)' stroke-width='0.6'/>`;
  }).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='18' viewBox='0 0 ${w} 18'><path d='M0 3 Q${w / 4} 5 ${w / 2} 3 T${w} 3' stroke='#4a4a4a' stroke-width='1' fill='none' opacity='0.5'/>${flags}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
})();

const Bunting = ({ sx }) => (
  <Box
    aria-hidden
    sx={{
      height: 18,
      width: "100%",
      backgroundImage: pattern,
      backgroundRepeat: "repeat-x",
      backgroundSize: `${FLAG_W * COUNT}px 18px`,
      pointerEvents: "none",
      ...sx,
    }}
  />
);

export default Bunting;
