import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserBalanceHistory,
  userBalanceHistorySelector,
  fetchLeaderboard,
  leaderboardSelector,
  fetchAllBalanceHistory,
  allBalanceHistorySelector,
} from "store/usersSlice";
import {
  fetchCurrentEpisode,
  currentEpisodeSelector,
} from "store/episodesSlice";
import { fetchBets, betsSelector } from "store/betsSlice";
import { sessionSelector } from "store/sessionSlice";
import { getLowestFraction } from "helpers/getLowestFraction";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  LocalOffer,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const balanceData = useSelector(userBalanceHistorySelector);
  const currentEpisode = useSelector(currentEpisodeSelector);
  const bets = useSelector(betsSelector);
  const { user: sessionUser } = useSelector(sessionSelector);
  const leaderboard = useSelector(leaderboardSelector);
  const allBalanceHistory = useSelector(allBalanceHistorySelector);

  // State to manage which users' lines are visible
  const [visibleUsers, setVisibleUsers] = useState({});

  useEffect(() => {
    dispatch(fetchUserBalanceHistory());
    dispatch(fetchCurrentEpisode());
    dispatch(fetchLeaderboard());
    dispatch(fetchAllBalanceHistory());
    if (currentEpisode) {
      dispatch(fetchBets({ episodeId: currentEpisode.number }));
    }
  }, [currentEpisode?.number]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize visible users - show only session user by default
  useEffect(() => {
    if (allBalanceHistory.length > 0 && sessionUser && Object.keys(visibleUsers).length === 0) {
      const initialVisible = {};
      allBalanceHistory.forEach((user) => {
        initialVisible[user.id] = user.id === sessionUser.id;
      });
      setVisibleUsers(initialVisible);
    }
  }, [allBalanceHistory, sessionUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate current balance
  const allDeltas = balanceData.reduce((acc, curr) => acc + curr.delta, 0);
  const currentBalance = 100 + allDeltas;

  // Color palette for different users
  const userColors = useMemo(() => {
    const colors = [
      "#2c5f4f", // Primary green
      "#614051", // Secondary purple
      "#c23b22", // Red
      "#d4af37", // Gold
      "#4682b4", // Steel blue
      "#8b4513", // Saddle brown
      "#2f4f4f", // Dark slate gray
      "#8b008b", // Dark magenta
      "#ff8c00", // Dark orange
      "#20b2aa", // Light sea green
    ];

    const colorMap = {};
    allBalanceHistory.forEach((user, index) => {
      colorMap[user.id] = colors[index % colors.length];
    });
    return colorMap;
  }, [allBalanceHistory]);

  // Prepare chart data for all users
  const chartData = useMemo(() => {
    if (allBalanceHistory.length === 0) return [];

    // Get all unique episodes
    const episodeSet = new Set();
    allBalanceHistory.forEach((user) => {
      user.userDeltas.forEach((delta) => {
        episodeSet.add(delta.episode.number);
      });
    });
    const episodes = Array.from(episodeSet).sort((a, b) => a - b);

    // Build chart data
    const data = [{ episode: "Start" }];

    // Initialize start balances for all users
    allBalanceHistory.forEach((user) => {
      data[0][user.id] = 100;
    });

    // Calculate running balances for each episode
    episodes.forEach((episodeNumber) => {
      const episodeData = { episode: `Ep ${episodeNumber}` };

      allBalanceHistory.forEach((user) => {
        // Find delta for this user and episode
        const delta = user.userDeltas.find((d) => d.episode.number === episodeNumber);

        // Get previous balance
        const previousBalance = data[data.length - 1][user.id];

        // Calculate new balance
        episodeData[user.id] = previousBalance + (delta ? delta.delta : 0);
      });

      data.push(episodeData);
    });

    return data;
  }, [allBalanceHistory]);

  // Filter bets
  const myBets = useMemo(() => {
    return bets.filter((bet) => bet.better?.id === sessionUser?.id);
  }, [bets, sessionUser]);

  const eligibleBets = useMemo(() => {
    return bets.filter(
      (bet) =>
        bet.better?.id !== sessionUser?.id &&
        bet.eligibleUsers?.some((user) => user.id === sessionUser?.id) &&
        !bet.acceptedUsers?.some((user) => user.id === sessionUser?.id)
    );
  }, [bets, sessionUser]);

  const balanceChange =
    balanceData.length > 0 ? balanceData[balanceData.length - 1]?.delta : 0;
  const isPositive = balanceChange >= 0;

  // Toggle user visibility in chart
  const toggleUserVisibility = (userId) => {
    setVisibleUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <Box
      sx={{
        paddingTop: { xs: "100px", md: "120px" },
        paddingBottom: "40px",
        paddingX: { xs: 2, md: 4 },
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Top Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Current Balance Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountBalance sx={{ mr: 1 }} />
                <Typography variant="h6">Current Balance</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                £{currentBalance.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isPositive ? (
                  <TrendingUp sx={{ mr: 0.5, fontSize: 20 }} />
                ) : (
                  <TrendingDown sx={{ mr: 0.5, fontSize: 20 }} />
                )}
                <Typography variant="body2">
                  {isPositive ? "+" : ""}£{balanceChange.toFixed(2)} last
                  episode
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Episode Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalOffer sx={{ mr: 1, color: "#614051" }} />
                <Typography variant="h6">Current Episode</Typography>
              </Box>
              {currentEpisode ? (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    Episode {currentEpisode.number}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/episodes")}
                  >
                    View Details
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No active episode
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bets Summary Card */}
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bets Overview
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#2c5f4f" }}
                  >
                    {myBets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    My Bets
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#614051" }}
                  >
                    {eligibleBets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Balance History Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Balance History
          </Typography>

          {/* User toggle controls */}
          {allBalanceHistory.length > 0 && (
            <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {allBalanceHistory.map((user) => (
                <Chip
                  key={user.id}
                  label={`${user.firstName} ${user.lastName}`}
                  onClick={() => toggleUserVisibility(user.id)}
                  sx={{
                    backgroundColor: visibleUsers[user.id]
                      ? userColors[user.id]
                      : "#e8e3dc",
                    color: visibleUsers[user.id] ? "white" : "#6b6562",
                    fontWeight: visibleUsers[user.id] ? 600 : 400,
                    "&:hover": {
                      backgroundColor: visibleUsers[user.id]
                        ? userColors[user.id]
                        : "#d3cfc7",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                <XAxis dataKey="episode" stroke="#6b6562" />
                <YAxis stroke="#6b6562" />
                <Tooltip
                  formatter={(value, name) => {
                    const user = allBalanceHistory.find((u) => u.id === name);
                    return [
                      `£${parseFloat(value).toFixed(2)}`,
                      user ? `${user.firstName} ${user.lastName}` : name,
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: "#faf7f2",
                    border: "1px solid #e8e3dc",
                    borderRadius: "8px",
                  }}
                />
                {allBalanceHistory.map((user) =>
                  visibleUsers[user.id] ? (
                    <Line
                      key={user.id}
                      type="monotone"
                      dataKey={user.id}
                      stroke={userColors[user.id]}
                      strokeWidth={user.id === sessionUser?.id ? 3 : 2}
                      dot={user.id === sessionUser?.id}
                      activeDot={{ r: 6 }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No balance history yet. Complete an episode to see your progress!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Leaderboard
          </Typography>
          {leaderboard.length > 0 ? (
            <Box>
              {leaderboard.map((user, index) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor:
                      user.id === sessionUser?.id
                        ? "#f5f5dc"
                        : index === 0
                        ? "#fff9e6"
                        : "transparent",
                    border: "1px solid",
                    borderColor:
                      user.id === sessionUser?.id
                        ? "#2c5f4f"
                        : index === 0
                        ? "#ffd700"
                        : "#e8e3dc",
                    boxShadow:
                      user.id === sessionUser?.id
                        ? "0 2px 4px rgba(44, 95, 79, 0.1)"
                        : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        minWidth: "40px",
                        textAlign: "center",
                        color:
                          index === 0
                            ? "#d4af37"
                            : index === 1
                            ? "#c0c0c0"
                            : index === 2
                            ? "#cd7f32"
                            : "#6b6562",
                        fontSize: index === 0 ? "24px" : "20px",
                      }}
                    >
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `${index + 1}.`}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: user.id === sessionUser?.id ? 600 : 400,
                      }}
                    >
                      {user.firstName} {user.lastName}
                      {user.id === sessionUser?.id && (
                        <Chip
                          label="You"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color:
                        user.balance > 100
                          ? "#2c5f4f"
                          : user.balance < 100
                          ? "#c23b22"
                          : "#6b6562",
                    }}
                  >
                    £{user.balance.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No leaderboard data available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Bets Sections */}
      <Grid container spacing={3}>
        {/* Eligible Bets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Available Bets
                {eligibleBets.length > 0 && (
                  <Chip
                    label={eligibleBets.length}
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
                {eligibleBets.length > 0 ? (
                  eligibleBets.slice(0, 5).map((bet) => (
                    <Paper
                      key={bet.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 1,
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        {bet.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Odds: {getLowestFraction(bet.odds)} | Max: £
                            {bet.maxLose?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Chip
                          label="Accept"
                          size="small"
                          color="primary"
                          clickable
                          onClick={() => navigate("/bets")}
                        />
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4, textAlign: "center" }}
                  >
                    No bets available to accept
                  </Typography>
                )}
              </Box>
              {eligibleBets.length > 5 && (
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/bets")}
                >
                  View All ({eligibleBets.length})
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Bets */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                My Bets
                {myBets.length > 0 && (
                  <Chip
                    label={myBets.length}
                    color="secondary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
                {myBets.length > 0 ? (
                  myBets.slice(0, 5).map((bet) => (
                    <Paper
                      key={bet.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ mb: 1, fontWeight: 500 }}
                      >
                        {bet.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Odds: {getLowestFraction(bet.odds)} | Max: £
                          {bet.maxLose?.toFixed(2)}
                        </Typography>
                        <Chip
                          label={
                            bet.acceptedUsers?.length > 0
                              ? `${bet.acceptedUsers.length} Accepted`
                              : "Pending"
                          }
                          size="small"
                          color={
                            bet.acceptedUsers?.length > 0
                              ? "success"
                              : "default"
                          }
                        />
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4, textAlign: "center" }}
                  >
                    You haven't created any bets yet
                  </Typography>
                )}
              </Box>
              {myBets.length > 5 && (
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/bets")}
                >
                  View All ({myBets.length})
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
