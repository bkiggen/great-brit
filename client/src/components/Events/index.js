import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  createEvent,
  fetchEventTypes,
  eventTypesSelector,
} from "store/eventsSlice";
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
  const eventTypes = useSelector(eventTypesSelector);

  const isAdminView = useLocation().pathname === "/admin";

  const [formData, setFormData] = useState({
    eventTypeId: "",
    time: "",
    starId: "",
  });

  useEffect(() => {
    dispatch(fetchStars());
    dispatch(fetchEventTypes());
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
      eventTypeId: formData.eventTypeId,
      time: formData.time,
      starId: formData.starId,
      episodeId,
    };

    dispatch(createEvent(eventData));

    setFormData({
      eventTypeId: "",
      time: "",
      starId: "",
    });
  };

  const columns = [
    {
      field: "eventType",
      headerName: "Event Type",
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.eventType) return "—";
        return params.row.eventType.description;
      },
    },
    {
      field: "value",
      headerName: "Value",
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.eventType) return "—";
        return params.row.eventType.value;
      },
    },
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

  // Render a single event as a mobile card
  const renderEventCard = (event) => {
    return (
      <Card key={event.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Event Type:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {event.eventType?.description || "—"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Value:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: event.eventType?.value > 0 ? "success.main" : event.eventType?.value < 0 ? "error.main" : "text.primary",
              }}
            >
              {event.eventType?.value > 0 ? "+" : ""}
              {event.eventType?.value || "—"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Baker:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {event.star
                ? `${event.star.firstName} ${event.star.lastName}`
                : "—"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

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
      <Box sx={{ mb: 3 }}>
        {isAdminView && (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Select
                name="eventTypeId"
                value={formData.eventTypeId}
                onChange={handleChange}
                required
                displayEmpty
                sx={{ flex: 1 }}
              >
                <MenuItem value="">Select event type</MenuItem>
                {eventTypes.map((eventType) => (
                  <MenuItem key={eventType.id} value={eventType.id}>
                    {eventType.description} ({eventType.value > 0 ? "+" : ""}
                    {eventType.value})
                  </MenuItem>
                ))}
              </Select>
              <Select
                name="starId"
                value={formData.starId}
                onChange={handleChange}
                required
                displayEmpty
                sx={{ flex: 1 }}
              >
                <MenuItem value="">Select a baker</MenuItem>
                {stars.map((star) => (
                  <MenuItem key={star.id} value={star.id}>
                    {`${star.firstName} ${star.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Button type="submit" variant="outlined" fullWidth sx={{ maxWidth: { md: "200px" } }}>
              Add Event
            </Button>
          </form>
        )}
      </Box>

      {/* Desktop Table - Hidden on mobile */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
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
      </Box>

      {/* Mobile Cards - Hidden on desktop */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {events.length > 0 ? (
          events.map((event) => renderEventCard(event))
        ) : (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                No events available
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

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
                  <div key={ranking.id}>
                    {ranking.rank} - {ranking.star?.firstName}{" "}
                    {ranking.star?.lastName}
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
