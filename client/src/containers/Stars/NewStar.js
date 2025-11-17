import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Box, Typography } from "@mui/material";
import { createStar } from "store/starsSlice";

const NewStar = () => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = () => {
    const starData = { firstName, lastName, bio };
    dispatch(createStar(starData));
    setFirstName("");
    setLastName("");
    setBio("");
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "90%" },
        maxWidth: "900px",
        margin: "0 auto",
        marginTop: { xs: "100px", md: "120px" },
        padding: { xs: "20px", md: "30px" },
        background: "white",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "4px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "18px", md: "20px" },
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Add a Baker
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Bio"
          variant="outlined"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: "120px" } }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default NewStar;
