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
    {
      field: "bio",
      headerName: "Bio",
      flex: 1,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          lineHeight: '1.5',
          padding: '8px 0'
        }}>
          {params.value}
        </div>
      )
    },
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
        getRowHeight={() => 'auto'}
        autoHeight
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        }}
      />
    </Box>
  );
};

export default StarsList;
