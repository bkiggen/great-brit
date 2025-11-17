import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sessionSelector } from "store/sessionSlice";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
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
        paddingTop: { xs: "100px", md: "120px" },
        paddingBottom: "80px",
        paddingX: { xs: 2, md: 4 },
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <AccountCircle sx={{ fontSize: 48, color: "#5a8f7b", mr: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", md: "48px" },
            }}
          >
            Profile
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      {/* Profile Information */}
      <Card
        sx={{
          padding: { xs: "24px", md: "32px" },
          marginBottom: "24px",
          boxShadow: "0px 4px 12px rgba(45, 41, 38, 0.08)",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: { xs: "20px", md: "24px" },
          }}
        >
          Update Profile Information
        </Typography>
        {profileMessage && (
          <Alert
            severity={profileMessage.type}
            onClose={() => setProfileMessage(null)}
            sx={{ marginBottom: "20px" }}
          >
            {profileMessage.text}
          </Alert>
        )}
        <form onSubmit={handleProfileSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              fullWidth
              required
            />
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "16px",
                background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1a4435 0%, #2c5f4f 100%)",
                },
              }}
            >
              Update Profile
            </Button>
          </Box>
        </form>
      </Card>

      {/* Change Password */}
      <Card
        sx={{
          padding: { xs: "24px", md: "32px" },
          boxShadow: "0px 4px 12px rgba(45, 41, 38, 0.08)",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            fontWeight: 600,
            fontSize: { xs: "20px", md: "24px" },
          }}
        >
          Change Password
        </Typography>
        {passwordMessage && (
          <Alert
            severity={passwordMessage.type}
            onClose={() => setPasswordMessage(null)}
            sx={{ marginBottom: "20px" }}
          >
            {passwordMessage.text}
          </Alert>
        )}
        <form onSubmit={handlePasswordSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
            />
            <Button
              variant="contained"
              type="submit"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "16px",
                background: "linear-gradient(135deg, #614051 0%, #452d39 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #452d39 0%, #614051 100%)",
                },
              }}
            >
              Change Password
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
};

export default Profile;
