import { getUserBalance } from "./season.js";

// Odds are fractional: odds = a/b for "a-b". 2-1 => 2.
export const MIN_ODDS = 0.1; // 1-10
export const MAX_ODDS = 10; // 10-1
// Players with a low or negative balance can still bet this much.
export const MIN_BET_CAP = 10;

// Returns an error message, or null when the terms are valid.
export const validateBetTerms = async ({ odds, maxLose, userId }) => {
  const o = parseFloat(odds);
  const m = parseFloat(maxLose);
  if (!Number.isFinite(o) || o < MIN_ODDS || o > MAX_ODDS) {
    return "Odds must be between 1-10 and 10-1";
  }
  if (!Number.isFinite(m) || m <= 0) {
    return "Bet amount must be more than 0";
  }
  const balance = await getUserBalance(userId);
  const cap = Math.max(balance, MIN_BET_CAP);
  if (m > cap) {
    return `Bet amount cannot be more than £${cap.toFixed(2)}`;
  }
  return null;
};

// Change in balance for one user from one resolved bet.
// Normal fractional odds: the better stakes maxLose per accepter and wins
// maxLose * odds from each accepter if the bet wins.
export const betDeltaForUser = (bet, userId) => {
  const { better, won, maxLose, odds, acceptedUsers } = bet;
  if (won === null || won === undefined) return 0;
  if (better.id === userId) {
    return won
      ? maxLose * odds * acceptedUsers.length
      : -maxLose * acceptedUsers.length;
  }
  return won ? -maxLose * odds : maxLose;
};
