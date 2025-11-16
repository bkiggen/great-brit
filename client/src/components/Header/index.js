import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sessionSelector } from "store";
import { useSelector, useDispatch } from "react-redux";
import { getInitials } from "helpers/getInitials";
import {
  Button,
  IconButton,
  Card,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { logoutUser } from "store/sessionSlice";
import LinkItem from "./LinkItem";
import Tent from "components/icons/Tent";
import { styles } from "./styles";

const Header = ({ socket }) => {
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const logout = () => {
    handleClose();
    navigate("/login");
    dispatch(logoutUser());
  };

  return (
    <div className={styles}>
      <Card
        sx={{
          position: "fixed",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#1B7B9F",
          borderRadius: "0px",
          height: "60px",
          zIndex: 1000,
        }}
      >
        <Box>
          <LinkItem to="/" label={<Tent />} />
        </Box>
        {session.sessionToken && (
          <Box sx={{ display: "flex" }}>
            <LinkItem to="/rankings" label="Rankings" />
            <LinkItem to="/bets" label="Bets" />
            <LinkItem to="/episodes" label="Episodes" />
            <LinkItem to="/admin" label="Admin" />
          </Box>
        )}
        <Box>
          {session.sessionToken ? (
            <>
              <IconButton
                variant="text"
                onClick={handleClick}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: "#1B7B9F",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  marginRight: "24px",
                  fontSize: "16px",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                {getInitials(session.user.firstName, session.user.lastName)}
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{ mt: "8px" }}
              >
                <MenuItem sx={{ minWidth: "200px" }} onClick={handleProfile}>
                  Profile
                </MenuItem>
                <MenuItem sx={{ minWidth: "200px" }} onClick={logout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link to={"/login"}>
              <Button variant="text">
                <Typography sx={{ color: "white" }}>Login</Typography>
              </Button>
            </Link>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default Header;
