import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createEvent } from "store/eventsSlice";
import { fetchStars, starsSelector } from "store/starsSlice";
import { fetchEventsByEpisode, eventsSelector } from "store/eventsSlice";
import {
  fetchUsersWithRankingsByEpisode,
  usersSelector,
} from "store/usersSlice";

import { styles } from "./styles";

const AdminEvents = ({ episodeId }) => {
  const dispatch = useDispatch();
  const stars = useSelector(starsSelector);
  const events = useSelector(eventsSelector);
  const users = useSelector(usersSelector);

  const isAdminView = useLocation().pathname === "/admin";

  const [formData, setFormData] = useState({
    description: "",
    time: "",
    baseAmount: "",
    starId: "",
  });

  useEffect(() => {
    dispatch(fetchStars());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodeId) {
      dispatch(fetchUsersWithRankingsByEpisode(episodeId));
    }
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (episodeId) {
      dispatch(fetchEventsByEpisode(episodeId));
    }
  }, [episodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      description: formData.description,
      time: formData.time,
      baseAmount: formData.baseAmount,
      starId: formData.starId,
      episodeId,
    };

    dispatch(createEvent(eventData));

    setFormData({
      description: "",
      time: "",
      baseAmount: "",
      starId: "",
    });
  };

  const columns = [
    { field: "description", headerName: "Description", flex: 1 },
    // { field: "time", headerName: "Time", flex: 1 },
    { field: "baseAmount", headerName: "Base Amount", flex: 1 },
    {
      field: "star",
      headerName: "Star",
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.star) return "—";
        return `${params.row.star.firstName} ${params.row.star.lastName}`;
      },
    },
  ];

  return (
    <div className={`admin-events ${styles}`}>
      <Typography
        variant="h5"
        sx={{
          marginTop: "48px",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "500",
        }}
      >
        Events:
      </Typography>
      <div className="addNew">
        {isAdminView && (
          <form onSubmit={handleSubmit}>
            <div className="formRow">
              {/* <TextField
                label="Time (MM:SS)"
                name="time"
                value={formData.time}
                onChange={handleChange}
                sx={{ width: "30%" }}
                inputProps={{
                  pattern: "^([0-5]?[0-9]):([0-5][0-9])$",
                  title: "Please enter time in MM:SS format",
                }}
                fullWidth
              /> */}
              <TextField
                label="Base Amount"
                name="baseAmount"
                value={formData.baseAmount}
                onChange={handleChange}
                required
                type="number"
                sx={{ width: "48%" }}
                inputProps={{
                  step: 1,
                }}
              />
              <Select
                // label="Star"
                name="starId"
                value={formData.starId}
                onChange={handleChange}
                required
                sx={{ width: "50%" }}
              >
                <MenuItem value="">Select a star</MenuItem>
                {stars.map((star) => (
                  <MenuItem key={star.id} value={star.id}>
                    {`${star.firstName} ${star.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                sx={{ marginBottom: "12px" }}
              />
            </div>
            <Button type="submit" variant="outlined">
              Add
            </Button>
          </form>
        )}
      </div>

      <DataGrid
        rows={events}
        columns={columns}
        autoHeight
        disableColumnMenu
        disableColumnFilter
        sortingOrder={["desc", "asc", null]}
        hideFooterPagination
        hideFooter
        checkboxSelection={false}
        className="bg-white border-0 rounded-0"
        getRowId={(event) => event.id}
      />

      <Box sx={{ marginTop: "62px", fontSize: "24px", fontWeight: "600" }}>
        Rankings for this Episode:
      </Box>
      {users.map((user) => {
        return (
          <Accordion sx={{ margin: "16px 0" }} key={user.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                ".MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, position: "inline" }}>
                  {user.firstName}:
                </Typography>

                <Box sx={{ fontWeight: 600, position: "inline" }}>
                  {/* {user.balance} */}
                </Box>
              </Box>
              <Box>
                {user.delta && (
                  <Box
                    sx={{
                      color: user.delta > 0 ? "green" : "red",
                      fontWeight: 600,
                      marginRight: "12px",
                    }}
                  >
                    {user.delta > 0 ? "+" : ""}
                    {user.delta}
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {user.rankings?.map((ranking) => {
                return (
                  <div>
                    {ranking.rank} - {ranking.starId.firstName}
                  </div>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default AdminEvents;
