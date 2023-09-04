import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { createEvent } from "store/eventsSlice";
import { styles } from "./styles";
import { fetchStars, starsSelector } from "store/starsSlice";
import { fetchEvents, eventsSelector } from "store/eventsSlice";

const AdminEvents = () => {
  const dispatch = useDispatch();
  const stars = useSelector(starsSelector);
  const events = useSelector(eventsSelector);

  const [formData, setFormData] = useState({
    description: "",
    time: "",
    baseAmount: "",
    starId: "",
  });

  useEffect(() => {
    dispatch(fetchStars());
    dispatch(fetchEvents());
  }, [dispatch]);

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
    };

    dispatch(createEvent(eventData));

    setFormData({
      description: "",
      time: "",
      baseAmount: "",
      starId: "",
    });
  };

  return (
    <div className={`admin-events ${styles}`}>
      <div className="title">Events:</div>
      <div className="addNew">
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <TextField
              label="Time (MM:SS)"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              sx={{ width: "120px" }}
              inputProps={{
                pattern: "^([0-5]?[0-9]):([0-5][0-9])$",
                title: "Please enter time in MM:SS format",
              }}
            />
            <TextField
              label="Base Amount"
              name="baseAmount"
              value={formData.baseAmount}
              onChange={handleChange}
              required
              type="number"
              sx={{ width: "120px" }}
              inputProps={{
                min: 0,
                step: 1,
              }}
            />
            <Select
              label="Star"
              name="starId"
              value={formData.starId}
              onChange={handleChange}
              required
              sx={{ width: "200px" }}
            >
              <MenuItem value="">Select a star</MenuItem>
              {stars.map((star) => (
                <MenuItem key={star._id} value={star._id}>
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
              sx={{ width: "444px", marginBottom: "12px" }}
            />
          </div>
          <Button type="submit" variant="outlined">
            Add
          </Button>
        </form>
      </div>
      {events.map((event) => {
        return (
          <div key={event.id} className="eventCard">
            <div>{event.description}</div>
            <div>{event.time}</div>
            <div>{event.baseAmount}</div>
            <div>
              {event.star?.firstName} {event.star?.lastName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminEvents;
