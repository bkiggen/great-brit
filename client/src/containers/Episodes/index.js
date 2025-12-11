import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEpisodes,
  calculateDeltas,
  clearDeltas,
} from "store/episodesSlice";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Chip,
  Collapse,
} from "@mui/material";
import {
  MovieFilter,
  Add,
  Calculate,
  Clear,
  Warning,
} from "@mui/icons-material";

import BetTable from "containers/Bets/BetTable";
import CreateEpisode from "./CreateEpisode";
import ManageStars from "./ManageStars";
import SetCurrentEpisode from "./SetCurrentEpisode";
import Events from "../../components/Events";

import { styles } from "./styles";

const Episodes = ({ admin }) => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes.list);

  const [active, setActive] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [usersWithoutRankings, setUsersWithoutRankings] = useState([]);
  const [clearDeltasDialogOpen, setClearDeltasDialogOpen] = useState(false);
  const [showCreateEpisode, setShowCreateEpisode] = useState(false);

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
    <Box
      sx={{
        paddingTop: { xs: "100px", md: "120px" },
        paddingBottom: "80px",
        paddingX: { xs: 2, md: 4 },
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <MovieFilter sx={{ fontSize: 48, color: "#c44536", mr: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", md: "48px" },
            }}
          >
            Episodes
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View episode details, events, and manage bakers
        </Typography>

        {/* Create Episode Button (Admin Only) */}
        {admin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateEpisode(!showCreateEpisode)}
            sx={{
              background: "linear-gradient(135deg, #c44536 0%, #a13627 100%)",
              color: "white",
              px: 4,
              py: 1.5,
              fontSize: "16px",
              "&:hover": {
                background: "linear-gradient(135deg, #a13627 0%, #c44536 100%)",
              },
            }}
          >
            {showCreateEpisode ? "Cancel" : "Create Episode"}
          </Button>
        )}
      </Box>

      {/* Create Episode Form (Collapsible) */}
      {admin && (
        <Collapse in={showCreateEpisode}>
          <Box sx={{ mb: 4 }}>
            <CreateEpisode episodes={episodes} />
          </Box>
        </Collapse>
      )}

      {/* Episode Selector Card */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Select Episode:
            </Typography>
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
              <Select
                value={active?.number || ""}
                onChange={(e) => {
                  const episode = episodes.find(
                    (ep) => ep.number === e.target.value
                  );
                  handleTabClick(episode);
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                {episodes.map((episode) => (
                  <MenuItem key={episode.number} value={episode.number}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Episode {episode.number}
                      {episode.current && (
                        <Chip label="Current" size="small" color="primary" />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Card>

      {/* Episode Content */}
      {active ? (
        <Box>
          {/* Episode Header with Admin Buttons */}
          <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "24px", md: "32px" },
                  }}
                >
                  Episode {active.number}
                </Typography>
                {admin && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      width: { xs: "100%", md: "auto" },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Clear />}
                      onClick={handleClearDeltas}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Clear Deltas
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Calculate />}
                      onClick={() => handleCalculateDeltas()}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Calculate Deltas
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Set Current Episode (Admin Only) */}
              {admin && (
                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
                  <SetCurrentEpisode episodes={episodes} />
                </Box>
              )}
            </Box>
          </Card>

          {/* Events Section */}
          <Events episodeId={active.number} />

          {/* Manage Stars (Admin Only) */}
          {admin && <ManageStars episodeId={active.number} />}

          {/* Bets Section */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              Bets
            </Typography>
            <BetTable episodeId={active.number} readOnly admin={admin} />
          </Box>
        </Box>
      ) : (
        <Card>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Select an episode to view details
            </Typography>
          </Box>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Warning sx={{ color: "#e8a23d" }} />
            Users Haven't Ranked Yet
          </Box>
        </DialogTitle>
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
            This action will remove all calculated delta values for this
            episode. You can recalculate them later.
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
    </Box>
  );
};

export default Episodes;
