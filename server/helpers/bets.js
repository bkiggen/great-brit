import { getUserBalance } from "./season.js";

// Odds are written "A to B": the better bets A to win B. Stored as odds = A / B.
// "1 to 12" => 0.0833 (long shot, big win). "2 to 1" => 2 (likely, small win).
export const MIN_ODDS = 1 / 20; // 1 to 20
export const MAX_ODDS = 20; // 20 to 1
// Players with a low or negative balance can still bet this much.
export const MIN_BET_CAP = 10;

// Returns an error message, or null when the terms are valid.
export const validateBetTerms = async ({ odds, maxLose, userId }) => {
  const o = parseFloat(odds);
  const m = parseFloat(maxLose);
  if (!Number.isFinite(o) || o < MIN_ODDS || o > MAX_ODDS) {
    return "Odds must be between 1 to 20 and 20 to 1";
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
// The better stakes maxLose per accepter. If the bet wins, each accepter pays
// the better maxLose / odds (= maxLose * B / A). If it loses, the better pays
// each accepter maxLose. Same rule as client/src/helpers/betMath.js.
export const betDeltaForUser = (bet, userId) => {
  const { better, won, maxLose, odds, acceptedUsers } = bet;
  if (won === null || won === undefined) return 0;
  const winEach = maxLose / odds;
  if (better.id === userId) {
    return won ? winEach * acceptedUsers.length : -maxLose * acceptedUsers.length;
  }
  return won ? -winEach : maxLose;
};
