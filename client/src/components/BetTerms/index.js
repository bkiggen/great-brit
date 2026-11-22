import React from "react";
import { Box, Typography } from "@mui/material";
import { betTerms, formatMoney } from "helpers/betMath";

// Plain-English summary of who risks and wins what.
// Pass either odds, or oddsPair [A, B] for "A to B".
const BetTerms = ({ maxLose, odds, oddsPair, accepterCount, betterName = "You" }) => {
  const o = oddsPair ? oddsPair[0] / oddsPair[1] : odds;
  const stake = parseFloat(maxLose);
  if (!stake || stake <= 0 || !o) {
    return (
      <Typography variant="body2" color="text.secondary">
        Enter odds and a stake to see what each person can win or lose.
      </Typography>
    );
  }
  const t = betTerms({ maxLose: stake, odds: o, accepterCount: accepterCount || 1 });
  const you = betterName === "You";
  const n = accepterCount;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f6f1ea",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      <Typography variant="body2">
        ✅ <b>If it happens:</b> {betterName} {you ? "win" : "wins"}{" "}
        <b>{formatMoney(t.betterWinsEach)}</b> from each person who accepts
        {n ? ` (${formatMoney(t.betterWinsTotal)} total from ${n})` : ""}.
      </Typography>
      <Typography variant="body2">
        ❌ <b>If it doesn't:</b> {betterName} {you ? "pay" : "pays"}{" "}
        <b>{formatMoney(t.betterRisksEach)}</b> to each person who accepts
        {n ? ` (${formatMoney(t.betterRisksTotal)} total to ${n})` : ""}.
      </Typography>
      <Typography variant="body2">
        🤝 <b>Each person who accepts</b> risks{" "}
        <b>{formatMoney(t.accepterRisks)}</b> to win{" "}
        <b>{formatMoney(t.accepterWins)}</b>.
      </Typography>
    </Box>
  );
};

export default BetTerms;
