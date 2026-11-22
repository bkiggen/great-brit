// Bet odds are written "A to B": the better bets A to win B.
// Stored as odds = A / B. maxLose is the better's stake per accepter.
//
// If the bet WINS:  each accepter pays the better  maxLose * B / A
// If the bet LOSES: the better pays each accepter  maxLose
// So each accepter risks maxLose * B / A to win maxLose.

const round2 = (n) => Math.round(n * 100) / 100;

export const formatMoney = (n) =>
  Number.isFinite(n) ? `£${round2(n).toFixed(2).replace(/\.00$/, "")}` : "£–";

// What the better wins from each accepter (= what each accepter risks)
export const winPerAccepter = (maxLose, odds) =>
  parseFloat(maxLose) / parseFloat(odds);

export const betTerms = ({ maxLose, odds, accepterCount = 1 }) => {
  const stake = parseFloat(maxLose);
  const win = winPerAccepter(stake, odds);
  return {
    betterRisksEach: stake,
    betterWinsEach: win,
    betterRisksTotal: stake * accepterCount,
    betterWinsTotal: win * accepterCount,
    accepterRisks: win,
    accepterWins: stake,
  };
};
