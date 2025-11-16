import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpisodes, calculateDeltas, clearDeltas } from "store/episodesSlice";
import { fetchStars } from "store/starsSlice";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import BetTable from "containers/Bets/BetTable";
import CreateEpisode from "./CreateEpisode";
import ManageStars from "./ManageStars";
import Events from "../../components/Events";

import { styles } from "./styles";

const Episodes = ({ admin }) => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [usersWithoutRankings, setUsersWithoutRankings] = useState([]);
  const [clearDeltasDialogOpen, setClearDeltasDialogOpen] = useState(false);

  const handleTabClick = (episodeId) => {
    setActive(episodeId);
  };

  const handleCalculateDeltas = async (force = false) => {
    const result = await dispatch(
      calculateDeltas({ episodeId: active?.number, force })
    );

    if (calculateDeltas.rejected.match(result)) {
      // Check if it's the validation error
      if (result.payload?.error === "USERS_WITHOUT_RANKINGS") {
        setUsersWithoutRankings(result.payload.usersWithoutRankings);
        setConfirmDialogOpen(true);
      }
    } else if (calculateDeltas.fulfilled.match(result)) {
      // Close dialog on success
      setConfirmDialogOpen(false);
    }
  };

  const handleForceCalculate = () => {
    handleCalculateDeltas(true);
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
    setUsersWithoutRankings([]);
  };

  const handleClearDeltas = () => {
    setClearDeltasDialogOpen(true);
  };

  const handleConfirmClearDeltas = () => {
    dispatch(clearDeltas(active?.number));
    setClearDeltasDialogOpen(false);
  };

  const handleCancelClearDeltas = () => {
    setClearDeltasDialogOpen(false);
  };

  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodes.length > 0) {
      const currentEpisode = episodes.find((ep) => ep.current);
      if (currentEpisode) {
        setActive(currentEpisode);
        return;
      }
    }
  }, [episodes]);

  return (
    <div className={`episodes ${styles}`}>
      {admin && <CreateEpisode episodes={episodes} />}
      <div className="folder">
        <div className="tabs">
          {episodes.map((episode) => {
            const tabClass =
              episode.number === active?.number ? "tab active" : "tab inactive";

            return (
              <div
                key={episode.number}
                className={tabClass}
                onClick={() => handleTabClick(episode)}
              >
                {episode.number}
              </div>
            );
          })}
        </div>
        <div className="main">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>Episode {active?.number}</h1>
            {admin && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearDeltas}
                >
                  Clear Deltas
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleCalculateDeltas()}
                >
                  Calculate Deltas
                </Button>
              </Box>
            )}
          </Box>
          {active && <Events episodeId={active?.number} />}
          {active && admin && <ManageStars episodeId={active?.number} />}
          {active && (
            <>
              <Typography
                variant="h5"
                sx={{ marginTop: "48px", fontSize: "24px", fontWeight: "500" }}
              >
                Bets:
              </Typography>
              <BetTable episodeId={active?.number} readOnly admin={admin} />
            </>
          )}
        </div>
      </div>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Users Haven't Ranked Yet</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The following users have not set their rankings for Episode{" "}
            {active?.number}:
          </Typography>
          <List>
            {usersWithoutRankings.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Do you want to calculate deltas anyway?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancel</Button>
          <Button
            onClick={handleForceCalculate}
            variant="contained"
            color="warning"
          >
            Force Calculate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={clearDeltasDialogOpen}
        onClose={handleCancelClearDeltas}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Clear Deltas</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Are you sure you want to clear all deltas for Episode{" "}
            {active?.number}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action will remove all calculated delta values for this episode.
            You can recalculate them later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearDeltas}>Cancel</Button>
          <Button
            onClick={handleConfirmClearDeltas}
            variant="contained"
            color="error"
          >
            Clear Deltas
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Episodes;
