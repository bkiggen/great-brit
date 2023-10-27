import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { createStar } from "@/store/starsSlice";

import { styles } from "./styles";

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
    <div className={`myClass ${styles}`}>
      <div className="top">
        <span className="title">Add a Star</span>
      </div>
      <div className="bottom">
        <div className="formItem">
          <TextField
            id="standard-basic"
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="formItem">
          <TextField
            id="standard-basic"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="formItem">
          <TextField
            id="standard-basic"
            label="Bio"
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>
      <div className="submit">
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default NewStar;
