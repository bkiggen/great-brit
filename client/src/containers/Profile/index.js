import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "store/sessionSlice";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import { makeRequest } from "helpers/makeRequest";

const Profile = () => {
  const { user } = useSelector(sessionSelector);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.put("/user/profile", profileData);
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      // Optionally refresh user data in Redux
    } catch (error) {
      setProfileMessage({ type: "error", text: error.message || "Failed to update profile" });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      await makeRequest.put("/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message || "Failed to update password" });
    }
  };

  return (
    <Box
      sx={{
        paddingTop: "100px",
        paddingBottom: "80px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "24px", textAlign: "center" }}>
        Profile
      </Typography>

      {/* Profile Information */}
      <Card sx={{ padding: "24px", marginBottom: "24px" }}>
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Update Profile Information
        </Typography>
        {profileMessage && (
          <Alert severity={profileMessage.type} sx={{ marginBottom: "16px" }}>
            {profileMessage.text}
          </Alert>
        )}
        <form onSubmit={handleProfileSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={profileData.firstName}
            onChange={handleProfileChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={profileData.lastName}
            onChange={handleProfileChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Update Profile
          </Button>
        </form>
      </Card>

      <Divider sx={{ marginBottom: "24px" }} />

      {/* Change Password */}
      <Card sx={{ padding: "24px" }}>
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Change Password
        </Typography>
        {passwordMessage && (
          <Alert severity={passwordMessage.type} sx={{ marginBottom: "16px" }}>
            {passwordMessage.text}
          </Alert>
        )}
        <form onSubmit={handlePasswordSubmit}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Change Password
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Profile;
