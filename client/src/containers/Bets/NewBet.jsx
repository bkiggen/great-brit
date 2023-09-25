import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, MenuItem, Select, Chip } from "@mui/material";
import { createBet } from "store/betsSlice";
import { fetchUsers } from "store/usersSlice";
import { usersSelector } from "store";

import { styles } from "./styles";

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
      odds: parseFloat(selectedOdds),
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
    <div className={`myClass ${styles}`}>
      <div className="top">
        <span className="title">Propose a New Bet</span>
      </div>
      <div className="bottom">
        <div className="left">
          <TextField
            label="Description"
            multiline
            maxRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="center">
          <div className="formItem oddsContainer">
            <TextField
              select
              label="Odds"
              value={selectedOdds[0]}
              onChange={(e) =>
                setSelectedOdds((prev) => [e.target.value, prev[1]])
              }
              variant="outlined"
              sx={{ width: "40%" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((odds) => (
                <MenuItem key={odds} value={odds}>
                  {odds}
                </MenuItem>
              ))}
            </TextField>
            to
            <TextField
              select
              value={selectedOdds[1]}
              onChange={(e) =>
                setSelectedOdds((prev) => [prev[0], e.target.value])
              }
              variant="outlined"
              sx={{ width: "40%" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((odds) => (
                <MenuItem key={odds} value={odds}>
                  {odds}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="formItem usersContainer">
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
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {`${user.firstName} ${user.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="right">
          <div className="formItem">
            <TextField
              id="standard-basic"
              label="Max You'll Lose"
              variant="outlined"
              value={maxLose}
              onChange={(e) => setMaxLose(e.target.value)}
            />
          </div>
          <div className="formItem">
            <TextField
              id="standard-basic"
              label="Max You'll Win"
              variant="outlined"
              value={maxLose ? maxWin : ""}
              disabled
            />
          </div>
          <div className="submit">
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bets;
