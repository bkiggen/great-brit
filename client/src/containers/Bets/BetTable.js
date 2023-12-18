import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "store";
import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchBets } from "store/betsSlice";
import { betsSelector, updateBet } from "store/betsSlice";

const Bets = ({ episodeId, readOnly = false, admin }) => {
  const dispatch = useDispatch();
  const bets = useSelector(betsSelector);
  const { user: sessionUser } = useSelector(sessionSelector);

  const renderBetAcceptButton = (params) => {
    const { better, eligibleUsers } = params.row;

    const yourBet = sessionUser?.id === better?._id;
    const eligibleBet = eligibleUsers?.find(
      (user) => user._id === sessionUser?.id
    );

    if (yourBet) {
      return (
        <Button variant="contained" disabled>
          Your Bet
        </Button>
      );
    } else if (eligibleBet) {
      return <Button variant="contained">Accept Bet</Button>;
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
    { field: "odds", headerName: "Odds", flex: 1 },
    { field: "maxLose", headerName: "Max Bet", flex: 1 },
    {
      field: "eligibleUsers",
      headerName: "Suckers",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ padding: "12px" }}>
          {params.row.eligibleUsers?.map((user) => (
            <div key={user._id}>{user.firstName}</div>
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
            renderCell: renderBetAcceptButton,
          },
        ]),
    {
      field: "won",
      headerName: "Won",
      flex: 1,
      renderCell: (params) => {
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
  ];

  useEffect(() => {
    dispatch(fetchBets({ episodeId }));
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box style={{ marginTop: "80px", background: "white" }}>
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
  );
};

export default Bets;
