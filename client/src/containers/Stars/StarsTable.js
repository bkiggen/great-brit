import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { fetchStars, updateStar, starsSelector } from "store/starsSlice";

const StarsList = () => {
  const dispatch = useDispatch();
  const stars = useSelector(starsSelector);

  const columns = [
    { field: "firstName", headerName: "First Name", minWidth: 100, flex: 1 },
    {
      field: "active",
      headerName: "Active",
      align: "center",
      headerAlign: "center",
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
      flex: 4,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
            padding: "8px 0",
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  const renderStarCard = (star) => {
    return (
      <Card key={star.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {star.firstName} {star.lastName}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Status:
            </Typography>
            <Button
              variant="contained"
              color={star.active ? "success" : "error"}
              onClick={() => {
                dispatch(
                  updateStar({
                    starId: star.id,
                    active: !star.active,
                  })
                );
              }}
              fullWidth
            >
              {star.active ? "Active" : "Sent Home"}
            </Button>
          </Box>

          {star.bio && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Bio:
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {star.bio}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <Box
        sx={{
          marginTop: "80px",
          background: "white",
          display: { xs: "none", md: "block" },
        }}
      >
        <DataGrid
          rows={stars}
          columns={columns}
          disableColumnMenu
          disableColumnFilter
          sortingOrder={["desc", "asc", null]}
          hideFooterPagination
          hideFooter
          checkboxSelection={false}
          getRowHeight={() => "auto"}
          autoHeight
          sx={{
            "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
              py: "8px",
            },
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "15px",
            },
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "22px",
            },
          }}
        />
      </Box>

      {/* Mobile Cards - Hidden on desktop */}
      <Box
        sx={{
          marginTop: "80px",
          paddingX: 2,
          display: { xs: "block", md: "none" },
        }}
      >
        {stars.length > 0 ? (
          stars.map((star) => renderStarCard(star))
        ) : (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                No bakers available
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default StarsList;
