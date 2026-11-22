import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import {
  createSeason,
  currentSeasonSelector,
  fetchCurrentSeason,
  fetchSeasons,
  seasonsSelector,
} from "store/seasonsSlice";
import { fetchEpisodes, fetchCurrentEpisode } from "store/episodesSlice";
import { fetchStars } from "store/starsSlice";

// One baker per line: "First" or "First Last"
const parseBakers = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [firstName, ...rest] = line.split(/\s+/);
      return { firstName, lastName: rest.join(" ") };
    });

const Seasons = () => {
  const dispatch = useDispatch();
  const currentSeason = useSelector(currentSeasonSelector);
  const seasons = useSelector(seasonsSelector);
  const { loading, error } = useSelector((state) => state.seasons);

  const [number, setNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [bakersText, setBakersText] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentSeason());
    dispatch(fetchSeasons());
  }, [dispatch]);

  useEffect(() => {
    if (currentSeason && number === "") {
      setNumber(currentSeason.number + 1);
    }
  }, [currentSeason]); // eslint-disable-line react-hooks/exhaustive-deps

  const bakers = parseBakers(bakersText);

  const handleSubmit = async () => {
    setSuccess(null);
    const confirmed = window.confirm(
      `Start Season ${number} with ${bakers.length} bakers? It becomes the current season.`
    );
    if (!confirmed) return;

    const result = await dispatch(createSeason({ number, year, bakers }));
    if (createSeason.fulfilled.match(result)) {
      setSuccess(`Season ${result.payload.number} started.`);
      setBakersText("");
      dispatch(fetchEpisodes());
      dispatch(fetchCurrentEpisode());
      dispatch(fetchStars());
    }
  };

  return (
    <Container sx={{ paddingBottom: "80px", paddingTop: "24px" }}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Current Season
        </Typography>
        {currentSeason ? (
          <Typography variant="body1">
            Season {currentSeason.number}
            {currentSeason.year ? ` (${currentSeason.year})` : ""}
          </Typography>
        ) : (
          <Typography color="text.secondary">No season yet.</Typography>
        )}
        {seasons.length > 1 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            {seasons.map((s) => (
              <Chip
                key={s.id}
                label={`Season ${s.number}`}
                color={s.current ? "primary" : "default"}
                size="small"
              />
            ))}
          </Box>
        )}
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Start a New Season
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Old seasons stay saved. Scores, bets and rankings start fresh. After
          this, create Episode 1 in the Episodes tab.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <TextField
            label="Season number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </Box>

        <TextField
          label="Bakers (one per line)"
          multiline
          minRows={8}
          fullWidth
          value={bakersText}
          onChange={(e) => setBakersText(e.target.value)}
          placeholder={"Clara\nConnie\n..."}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          disabled={loading || !number || bakers.length === 0}
          onClick={handleSubmit}
          sx={{ backgroundColor: "#2c5f4f" }}
        >
          Start Season {number} ({bakers.length} bakers)
        </Button>
      </Card>
    </Container>
  );
};

export default Seasons;
