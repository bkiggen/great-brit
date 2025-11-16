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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchBets } from "store/betsSlice";
import { betsSelector, updateBet, deleteBet, acceptBet, editBet } from "store/betsSlice";
import { usersSelector } from "store/usersSlice";
import { getLowestFraction } from "helpers/getLowestFraction";

const Bets = ({ episodeId, readOnly = false, admin }) => {
  const dispatch = useDispatch();
  const bets = useSelector(betsSelector);
  const { user: sessionUser } = useSelector(sessionSelector);
  const users = useSelector(usersSelector);

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
              <Button
                variant="contained"
                color="primary"
                disabled
              >
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
        <Button variant="contained" color="success" disabled>
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
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "eligibleUsers",
      headerName: "Suckers",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ padding: "12px" }}>
          {params.row.eligibleUsers?.map((user) => (
            <div key={user.id}>{user.firstName}</div>
          ))}
        </Box>
      ),
    },
    ...(readOnly
      ? []
      : [
          {
            field: "action",
            headerName: "Action",
            flex: 1,
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
      flex: 1,
      renderCell: (params) => {
        if (params.row.won === null) {
          return null;
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

  return (
    <>
      <Box style={{ marginTop: "20px", background: "white" }}>
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

      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="md" fullWidth>
        <DialogTitle>Edit Bet</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Description"
              value={editFormData.description}
              onChange={(e) => handleEditFormChange("description", e.target.value)}
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
                  (odds) => (
                    <MenuItem key={odds} value={odds}>
                      {odds}
                    </MenuItem>
                  )
                )}
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
                onChange={(e) => handleEditFormChange("maxLose", e.target.value)}
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
                disabled
                sx={{ flex: 1 }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Eligible Users</InputLabel>
              <Select
                multiple
                value={editFormData.eligibleUsers}
                onChange={(e) => handleEditFormChange("eligibleUsers", e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return (
                        <Chip
                          key={userId}
                          label={user ? `${user.firstName} ${user.lastName}` : userId}
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
