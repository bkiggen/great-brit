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
} from "@mui/material";
import { createBet } from "store/betsSlice";
import { fetchUsers, usersSelector } from "store/usersSlice";

const Bets = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedOdds, setSelectedOdds] = useState([1, 1]);
  const [maxLose, setMaxLose] = useState("");

  const maxWin =
    parseFloat(maxLose) *
    (parseFloat(selectedOdds[1]) / parseFloat(selectedOdds[0]));

  const handleUserChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleSubmit = () => {
    const betData = {
      description,
      odds: selectedOdds[0] / selectedOdds[1],
      maxLose: parseFloat(maxLose),
      eligibleUsers: selectedUsers,
      maxWin,
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
        width: "90%",
        maxWidth: "900px",
        margin: "0 auto",
        marginTop: "120px",
        padding: "30px",
        background: "white",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "4px",
      }}
    >
      <Box sx={{ fontSize: "20px", fontWeight: "bold" }}>Propose a New Bet</Box>
      <TextField
        label="Description"
        multiline
        maxRows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ display: "flex", alignItems: "center", marginTop: "24px" }}
      />
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginRight: "24px" }}
        >
          <TextField
            select
            label="Odds"
            value={selectedOdds[0]}
            onChange={(e) =>
              setSelectedOdds((prev) => [e.target.value, prev[1]])
            }
            variant="outlined"
            sx={{ minWidth: "100px", marginRight: "12px" }}
          >
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            ].map((odds) => (
              <MenuItem key={odds} value={odds}>
                {odds}
              </MenuItem>
            ))}
          </TextField>
          <span>to</span>
          <TextField
            select
            value={selectedOdds[1]}
            onChange={(e) =>
              setSelectedOdds((prev) => [prev[0], e.target.value])
            }
            variant="outlined"
            sx={{ minWidth: "100px", marginLeft: "12px", marginRight: "12px" }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((odds) => (
              <MenuItem key={odds} value={odds}>
                {odds}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Max Loss"
            variant="outlined"
            value={maxLose}
            onChange={(e) => setMaxLose(e.target.value)}
            sx={{ marginRight: "12px" }}
          />
          <TextField
            label="Max Win"
            variant="outlined"
            value={maxLose ? maxWin : ""}
            disabled
          />
        </Box>
      </Grid>
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
                const user = users.find((user) => user._id === userId);
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
          sx={{ minWidth: "350px", width: "65%" }}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
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
