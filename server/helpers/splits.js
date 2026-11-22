// Scoring multipliers, keyed by the number of bakers ranked in the episode.
// Index 0 = multiplier for the lowest rank; last index = rank 1.
// Keyed by baker count (not episode number) so weeks where nobody leaves,
// or two bakers leave, still score correctly.
export const splitsByBakerCount = {
  12: [-3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3],
  11: [-3, -2, -2, -1, -1, 0, 1, 1, 2, 2, 3],
  10: [-3, -2, -2, -1, -1, 1, 1, 2, 2, 3],
  9: [-3, -2, -2, -1, 0, 1, 2, 2, 3],
  8: [-3, -2, -2, -1, 1, 2, 2, 3],
  7: [-3, -2, -2, 1, 2, 2, 3],
  6: [-3, -2, -2, 2, 2, 3],
  5: [-3, -2, 1, 2, 3],
  4: [-3, -2, 2, 3],
  3: [-3, 1, 3],
};

export const getSplit = (bakerCount) => splitsByBakerCount[bakerCount];
