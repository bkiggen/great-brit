import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import { fetchStars, updateStar, starsSelector } from "store/starsSlice";

const StarsList = () => {
  const dispatch = useDispatch();
  const stars = useSelector(starsSelector);

  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    {
      field: "active",
      headerName: "Active",
      width: 160,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color={params.row.active ? "success" : "error"}
            onClick={() => {
              dispatch(
                updateStar({
                  starId: params.row.id,
                  active: !params.row.active,
                })
              );
            }}
          >
            {params.row.active ? "Active" : "Sent Home"}
          </Button>
        );
      },
    },
    { field: "bio", headerName: "Bio", width: 300, flex: 1 },
  ];

  useEffect(() => {
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box style={{ marginTop: "80px", background: "white" }}>
      <DataGrid
        rows={stars}
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

export default StarsList;
