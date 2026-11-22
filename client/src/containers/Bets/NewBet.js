import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  Chip,
  Box,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import { createBet } from "store/betsSlice";
import { fetchUsers, usersSelector } from "store/usersSlice";
import { sessionSelector } from "store/sessionSlice";
import BetTerms from "components/BetTerms";

// Allowed odds: 1 to 20 .. 20 to 1 (server checks the same range)
const ODDS_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

const Bets = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);
  const { user: sessionUser } = useSelector(sessionSelector);
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedOdds, setSelectedOdds] = useState([1, 1]);
  const [maxLose, setMaxLose] = useState("");

  const handleUserChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleSubmit = () => {
    const betData = {
      description,
      odds: selectedOdds[0] / selectedOdds[1],
      maxLose: parseFloat(maxLose),
      eligibleUsers: selectedUsers,
    };

    dispatch(createBet(betData));
    setDescription("");
    setSelectedUsers([]);
    setSelectedOdds([1, 1]);
    setMaxLose("");
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        padding: { xs: "20px", md: "30px" },
        background: "white",
        boxShadow: "0px 4px 12px rgba(74, 74, 74, 0.08)",
        borderRadius: "12px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "18px", md: "22px" },
          fontWeight: 600,
          mb: 3,
        }}
      >
        Propose a New Bet
      </Typography>
      <TextField
        label="Description"
        multiline
        maxRows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ display: "flex", alignItems: "center", marginTop: "24px" }}
      />
      <Box sx={{ marginTop: "24px" }}>
        <Typography sx={{ fontSize: "14px", color: "GrayText", mb: 1 }}>
          Odds — how unlikely is it? Pick what you bet and what you win.
          Use a big second number for long shots (e.g. 1 to 10).
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <span>Bet</span>
          <TextField
            select
            size="small"
            value={selectedOdds[0]}
            onChange={(e) =>
              setSelectedOdds((prev) => [e.target.value, prev[1]])
            }
            sx={{ minWidth: "80px" }}
          >
            {ODDS_OPTIONS.map((odds) => (
              <MenuItem key={odds} value={odds}>
                {odds}
              </MenuItem>
            ))}
          </TextField>
          <span>to win</span>
          <TextField
            select
            size="small"
            value={selectedOdds[1]}
            onChange={(e) =>
              setSelectedOdds((prev) => [prev[0], e.target.value])
            }
            sx={{ minWidth: "80px" }}
          >
            {ODDS_OPTIONS.map((odds) => (
              <MenuItem key={odds} value={odds}>
                {odds}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Your stake per person"
          helperText="What you pay each person who accepts if you lose"
          variant="outlined"
          type="number"
          value={maxLose}
          onChange={(e) => setMaxLose(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
          sx={{ mt: 2, width: { xs: "100%", sm: "260px" } }}
        />

        <Box sx={{ mt: 2 }}>
          <BetTerms
            maxLose={maxLose}
            oddsPair={selectedOdds}
            accepterCount={selectedUsers.length || undefined}
          />
          {selectedUsers.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Totals assume all {selectedUsers.length} eligible{" "}
              {selectedUsers.length === 1 ? "person accepts" : "people accept"}.
            </Typography>
          )}
        </Box>
      </Box>
      <Grid
        container
        sx={{ marginTop: "18px", display: "flex", flexDirection: "column" }}
      >
        <Typography sx={{ fontSize: "14px", color: "GrayText" }}>
          Eligible Users
        </Typography>
        <Select
          multiple
          value={selectedUsers}
          onChange={handleUserChange}
          renderValue={(selected) => (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {selected.map((userId) => {
                const user = users.find((user) => user.id === userId);

                return (
                  <Chip
                    key={userId}
                    label={`${user.firstName} ${user.lastName}`}
                    sx={{ margin: "2px" }}
                  />
                );
              })}
            </div>
          )}
          sx={{ width: { xs: "100%", md: "65%" } }}
        >
          {users
            .filter((user) => user.id !== sessionUser?.id)
            .map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Bets;
