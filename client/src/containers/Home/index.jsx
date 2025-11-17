import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserBalanceHistory,
  userBalanceHistorySelector,
} from "store/usersSlice";
import {
  fetchCurrentEpisode,
  currentEpisodeSelector,
} from "store/episodesSlice";
import { fetchBets, betsSelector } from "store/betsSlice";
import { sessionSelector } from "store/sessionSlice";

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

  useEffect(() => {
    dispatch(fetchUserBalanceHistory());
    dispatch(fetchCurrentEpisode());
    if (currentEpisode) {
      dispatch(fetchBets({ episodeId: currentEpisode.number }));
    }
  }, [currentEpisode?.number]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate current balance
  const allDeltas = balanceData.reduce((acc, curr) => acc + curr.delta, 0);
  const currentBalance = 100 + allDeltas;

  // Prepare chart data
  const chartData = useMemo(() => {
    let runningBalance = 100;
    const data = [{ episode: "Start", balance: 100, delta: 0 }];

    balanceData.forEach((item) => {
      runningBalance += item.delta;
      data.push({
        episode: `Ep ${item.episode.number}`,
        balance: runningBalance,
        delta: item.delta,
      });
    });

    return data;
  }, [balanceData]);

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

  const balanceChange = balanceData.length > 0 ? balanceData[balanceData.length - 1]?.delta : 0;
  const isPositive = balanceChange >= 0;

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
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 700,
          fontSize: { xs: "28px", md: "40px" },
        }}
      >
        Dashboard
      </Typography>

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
                  {isPositive ? "+" : ""}£{balanceChange.toFixed(2)} last episode
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
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#2c5f4f" }}>
                    {myBets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    My Bets
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#614051" }}>
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
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Balance History
          </Typography>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a8f7b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#5a8f7b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dc" />
                <XAxis dataKey="episode" stroke="#6b6562" />
                <YAxis stroke="#6b6562" />
                <Tooltip
                  formatter={(value, name) => [
                    `£${parseFloat(value).toFixed(2)}`,
                    name === "balance" ? "Balance" : "Change",
                  ]}
                  contentStyle={{
                    backgroundColor: "#faf7f2",
                    border: "1px solid #e8e3dc",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#2c5f4f"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No balance history yet. Complete an episode to see your progress!
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
                            Odds: {bet.odds} | Max: £{bet.maxLose?.toFixed(2)}
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
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
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
                          Odds: {bet.odds} | Max: £{bet.maxLose?.toFixed(2)}
                        </Typography>
                        <Chip
                          label={
                            bet.acceptedUsers?.length > 0
                              ? `${bet.acceptedUsers.length} Accepted`
                              : "Pending"
                          }
                          size="small"
                          color={
                            bet.acceptedUsers?.length > 0 ? "success" : "default"
                          }
                        />
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
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
