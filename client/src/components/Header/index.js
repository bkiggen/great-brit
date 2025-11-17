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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUser } from "store/sessionSlice";
import LinkItem from "./LinkItem";
import Tent from "components/icons/Tent";
import { styles } from "./styles";

const Header = ({ socket }) => {
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
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
        {/* Desktop navigation - hidden on mobile */}
        {session.sessionToken && (
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <LinkItem to="/rankings" label="Rankings" />
            <LinkItem to="/bets" label="Bets" />
            <LinkItem to="/episodes" label="Episodes" />
            <LinkItem to="/admin" label="Admin" />
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {session.sessionToken ? (
            <>
              {/* Hamburger menu icon - only visible on mobile */}
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "white",
                  mr: 2,
                }}
              >
                <MenuIcon />
              </IconButton>
              {/* User avatar - hidden on mobile */}
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
                  display: { xs: "none", md: "flex" },
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#faf7f2",
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              px: 2,
              mb: 2,
              fontWeight: 600,
              color: "#2c5f4f",
            }}
          >
            Navigation
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigate("/")}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigate("/rankings")}>
                <ListItemText primary="Rankings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigate("/bets")}>
                <ListItemText primary="Bets" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigate("/episodes")}>
                <ListItemText primary="Episodes" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigate("/admin")}>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Header;
