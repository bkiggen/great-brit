import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "store";
import {
  Box,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchBets } from "store/betsSlice";
import {
  betsSelector,
  updateBet,
  deleteBet,
  acceptBet,
  editBet,
} from "store/betsSlice";
import { usersSelector } from "store/usersSlice";
import { getLowestFraction } from "helpers/getLowestFraction";

const Bets = ({ episodeId, readOnly = false, admin, filterType = "all" }) => {
  const dispatch = useDispatch();
  const allBets = useSelector(betsSelector);
  const { user: sessionUser } = useSelector(sessionSelector);
  const users = useSelector(usersSelector);

  // Filter bets based on filterType
  const bets = React.useMemo(() => {
    if (filterType === "myBets") {
      return allBets.filter((bet) => bet.better?.id === sessionUser?.id);
    }
    if (filterType === "availableToAccept") {
      return allBets.filter(
        (bet) =>
          bet.better?.id !== sessionUser?.id &&
          bet.eligibleUsers?.some((user) => user.id === sessionUser?.id) &&
          !bet.acceptedUsers?.some((user) => user.id === sessionUser?.id)
      );
    }
    return allBets;
  }, [allBets, filterType, sessionUser]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBet, setEditingBet] = useState(null);
  const [editFormData, setEditFormData] = useState({
    description: "",
    selectedOdds: [1, 1],
    maxLose: "",
    eligibleUsers: [],
  });

  // Helper function to convert decimal odds to ratio (approximation)
  const decimalToRatio = (decimal) => {
    // Try to find a simple ratio that equals the decimal
    for (let denominator = 1; denominator <= 12; denominator++) {
      for (let numerator = 1; numerator <= 18; numerator++) {
        if (Math.abs(numerator / denominator - decimal) < 0.01) {
          return [numerator, denominator];
        }
      }
    }
    // Default fallback
    return [Math.round(decimal), 1];
  };

  const handleEditClick = (bet) => {
    setEditingBet(bet);
    setEditFormData({
      description: bet.description,
      selectedOdds: decimalToRatio(bet.odds),
      maxLose: bet.maxLose,
      eligibleUsers: bet.eligibleUsers.map((user) => user.id),
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    dispatch(
      editBet({
        betId: editingBet.id,
        description: editFormData.description,
        odds: editFormData.selectedOdds[0] / editFormData.selectedOdds[1],
        maxLose: editFormData.maxLose,
        eligibleUsers: editFormData.eligibleUsers,
      })
    );
    setEditDialogOpen(false);
    setEditingBet(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingBet(null);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderBetAcceptButton = (params) => {
    const { better, eligibleUsers, acceptedUsers } = params.row;

    const yourBet = sessionUser?.id === better?.id;
    const eligibleBet = eligibleUsers?.find(
      (user) => user.id === sessionUser?.id
    );
    const alreadyAccepted = acceptedUsers?.find(
      (user) => user.id === sessionUser?.id
    );

    if (yourBet) {
      const hasAcceptedUsers = acceptedUsers && acceptedUsers.length > 0;

      if (hasAcceptedUsers) {
        return (
          <Tooltip title="Cannot edit - bet has been accepted by other users">
            <span>
              <Button variant="contained" color="primary" disabled>
                Edit Bet
              </Button>
            </span>
          </Tooltip>
        );
      }

      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEditClick(params.row)}
        >
          Edit Bet
        </Button>
      );
    } else if (alreadyAccepted) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{
            backgroundColor: "#614051",
            color: "white",
            "&:disabled": {
              backgroundColor: "#614051",
              color: "white",
            },
          }}
        >
          Accepted
        </Button>
      );
    } else if (eligibleBet) {
      return (
        <Button
          variant="contained"
          onClick={() => {
            dispatch(acceptBet(params.row.id));
          }}
        >
          Accept Bet
        </Button>
      );
    } else {
      return (
        <Button variant="contained" disabled>
          Not Eligible
        </Button>
      );
    }
  };

  const columns = [
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      renderCell: (params) => {
        if (!params.row.description) return "";
        return (
          <Tooltip title={params.row.description}>
            {params.row.description}
          </Tooltip>
        );
      },
    },
    {
      field: "better.firstName",
      headerName: "Better",
      flex: 1,
      renderCell: (params) => {
        if (!params.row.better) return "";
        return <div>{params.row.better.firstName}</div>;
      },
    },
    {
      field: "odds",
      headerName: "Odds",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const decimal = params.row.odds;

        return getLowestFraction(decimal);
      },
    },
    {
      field: "maxLose",
      headerName: "Max Bet",
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return <div>£{params.row.maxLose}</div>;
      },
    },
    {
      field: "acceptedUsers",
      headerName: "Accepted",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const acceptedUsers = params.row.acceptedUsers || [];
        if (acceptedUsers.length === 0) {
          return <Box sx={{ padding: "12px", color: "#999" }}>None</Box>;
        }
        return (
          <Box sx={{ padding: "12px" }}>
            {acceptedUsers.map((user) => {
              const acceptedAmount = (
                parseFloat(params.row.maxLose) * parseFloat(params.row.odds)
              ).toFixed(2);
              return (
                <div key={user.id}>
                  {user.firstName} (£{acceptedAmount})
                </div>
              );
            })}
          </Box>
        );
      },
    },
    {
      field: "eligibleUsers",
      headerName: "Eligible",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const eligibleUsers = params.row.eligibleUsers || [];
        const acceptedUsers = params.row.acceptedUsers || [];
        const acceptedUserIds = new Set(acceptedUsers.map((u) => u.id));
        const notAcceptedEligible = eligibleUsers.filter(
          (user) => !acceptedUserIds.has(user.id)
        );

        if (notAcceptedEligible.length === 0) {
          return <Box sx={{ padding: "12px", color: "#999" }}>None</Box>;
        }

        return (
          <Box sx={{ padding: "12px" }}>
            {notAcceptedEligible.map((user) => (
              <div key={user.id}>{user.firstName}</div>
            ))}
          </Box>
        );
      },
    },
    ...(readOnly
      ? []
      : [
          {
            field: "action",
            headerName: "Action",
            flex: 1,
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            renderCell: renderBetAcceptButton,
          },
        ]),
    {
      field: "won",
      headerName: "Won",
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        if (params.row.won === null) {
          if (!admin) return null;

          return (
            <Button
              variant="outlined"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(
                  updateBet({
                    betId: params.row.id,
                    won: true,
                  })
                );
              }}
            >
              Mark Result
            </Button>
          );
        }

        return (
          <Button
            variant="contained"
            color={params.row.won ? "success" : "error"}
            sx={{ cursor: admin ? "pointer" : "default" }}
            onClick={() => {
              if (admin) {
                dispatch(
                  updateBet({
                    betId: params.row.id,
                    won: !params.row.won,
                  })
                );
              }
            }}
          >
            {params.row.won ? "Won" : "Lost"}
          </Button>
        );
      },
    },
    ...(admin
      ? [
          {
            field: "delete",
            headerName: "Delete",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
              return (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (admin) {
                      dispatch(deleteBet(params.row.id));
                    }
                  }}
                >
                  X
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  useEffect(() => {
    dispatch(fetchBets({ episodeId }));
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render a single bet as a mobile card
  const renderBetCard = (bet) => {
    const yourBet = sessionUser?.id === bet.better?.id;
    const eligibleBet = bet.eligibleUsers?.find(
      (user) => user.id === sessionUser?.id
    );
    const alreadyAccepted = bet.acceptedUsers?.find(
      (user) => user.id === sessionUser?.id
    );
    const hasAcceptedUsers = bet.acceptedUsers && bet.acceptedUsers.length > 0;

    return (
      <Card key={bet.id} sx={{ mb: 2 }}>
        <CardContent>
          {/* Description */}
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {bet.description}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Better and Odds */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Better:
            </Typography>
            <Typography variant="body2">{bet.better?.firstName}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Odds:
            </Typography>
            <Typography variant="body2">
              {getLowestFraction(bet.odds)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Max Bet:
            </Typography>
            <Typography variant="body2">£{bet.maxLose}</Typography>
          </Box>

          {/* Accepted Users */}
          {bet.acceptedUsers && bet.acceptedUsers.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Accepted:
              </Typography>
              {bet.acceptedUsers.map((user) => {
                const acceptedAmount = (
                  parseFloat(bet.maxLose) * parseFloat(bet.odds)
                ).toFixed(2);
                return (
                  <Typography key={user.id} variant="body2" sx={{ pl: 1 }}>
                    {user.firstName} (£{acceptedAmount})
                  </Typography>
                );
              })}
            </Box>
          )}

          {/* Eligible Users */}
          {bet.eligibleUsers &&
            bet.eligibleUsers.filter(
              (user) => !bet.acceptedUsers?.find((au) => au.id === user.id)
            ).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Eligible:
                </Typography>
                {bet.eligibleUsers
                  .filter(
                    (user) =>
                      !bet.acceptedUsers?.find((au) => au.id === user.id)
                  )
                  .map((user) => (
                    <Typography key={user.id} variant="body2" sx={{ pl: 1 }}>
                      {user.firstName}
                    </Typography>
                  ))}
              </Box>
            )}

          <Divider sx={{ mb: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {/* Accept/Edit Button */}
            {!readOnly && (
              <>
                {yourBet ? (
                  hasAcceptedUsers ? (
                    <Tooltip title="Cannot edit - bet has been accepted by other users">
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled
                          fullWidth
                        >
                          Edit Bet
                        </Button>
                      </span>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(bet)}
                      fullWidth
                    >
                      Edit Bet
                    </Button>
                  )
                ) : alreadyAccepted ? (
                  <Button
                    variant="contained"
                    disabled
                    fullWidth
                    sx={{
                      backgroundColor: "#614051",
                      color: "white",
                      "&:disabled": {
                        backgroundColor: "#614051",
                        color: "white",
                      },
                    }}
                  >
                    Accepted
                  </Button>
                ) : eligibleBet ? (
                  <Button
                    variant="contained"
                    onClick={() => dispatch(acceptBet(bet.id))}
                    fullWidth
                  >
                    Accept Bet
                  </Button>
                ) : (
                  <Button variant="contained" disabled fullWidth>
                    Not Eligible
                  </Button>
                )}
              </>
            )}

            {/* Won/Lost Button */}
            {bet.won === null ? (
              admin && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(updateBet({ betId: bet.id, won: true }))
                  }
                  fullWidth
                >
                  Mark Result
                </Button>
              )
            ) : (
              <Button
                variant="contained"
                color={bet.won ? "success" : "error"}
                onClick={() => {
                  if (admin) {
                    dispatch(updateBet({ betId: bet.id, won: !bet.won }));
                  }
                }}
                fullWidth
                disabled={!admin}
              >
                {bet.won ? "Won" : "Lost"}
              </Button>
            )}

            {/* Delete Button */}
            {admin && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => dispatch(deleteBet(bet.id))}
                fullWidth
              >
                Delete
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <Box
        sx={{
          marginTop: "20px",
          background: "white",
          display: { xs: "none", md: "block" },
        }}
      >
        <DataGrid
          rows={bets}
          columns={columns}
          disableColumnMenu
          disableColumnFilter
          sortingOrder={["desc", "asc", null]}
          hideFooterPagination
          hideFooter
          checkboxSelection={false}
          rowHeight={120}
          autoHeight
        />
      </Box>

      {/* Mobile Cards - Hidden on desktop */}
      <Box
        sx={{
          marginTop: "20px",
          display: { xs: "block", md: "none" },
        }}
      >
        {bets.length > 0 ? (
          bets.map((bet) => renderBetCard(bet))
        ) : (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                {filterType === "myBets"
                  ? "You haven't created any bets yet"
                  : filterType === "availableToAccept"
                  ? "No bets available for you to accept"
                  : "No bets available"}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Bet</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Description"
              value={editFormData.description}
              onChange={(e) =>
                handleEditFormChange("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                select
                label="Odds"
                value={editFormData.selectedOdds[0]}
                onChange={(e) =>
                  handleEditFormChange("selectedOdds", [
                    e.target.value,
                    editFormData.selectedOdds[1],
                  ])
                }
                sx={{ minWidth: "100px" }}
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
                value={editFormData.selectedOdds[1]}
                onChange={(e) =>
                  handleEditFormChange("selectedOdds", [
                    editFormData.selectedOdds[0],
                    e.target.value,
                  ])
                }
                sx={{ minWidth: "100px" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((odds) => (
                  <MenuItem key={odds} value={odds}>
                    {odds}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Max Loss"
                type="number"
                value={editFormData.maxLose}
                onChange={(e) =>
                  handleEditFormChange("maxLose", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">£</InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max Win"
                type="number"
                value={
                  editFormData.maxLose
                    ? (
                        parseFloat(editFormData.maxLose) *
                        (parseFloat(editFormData.selectedOdds[1]) /
                          parseFloat(editFormData.selectedOdds[0]))
                      ).toFixed(2)
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">£</InputAdornment>
                  ),
                }}
                disabled
                sx={{ flex: 1 }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Eligible Users</InputLabel>
              <Select
                multiple
                value={editFormData.eligibleUsers}
                onChange={(e) =>
                  handleEditFormChange("eligibleUsers", e.target.value)
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return (
                        <Chip
                          key={userId}
                          label={
                            user ? `${user.firstName} ${user.lastName}` : userId
                          }
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {users
                  .filter((user) => user.id !== sessionUser?.id)
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {`${user.firstName} ${user.lastName}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bets;
