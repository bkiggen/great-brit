import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Box,
  Card,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Cake } from "@mui/icons-material";
import { makeRequest } from "helpers/makeRequest";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await makeRequest.post("/password-reset/verify", {
        token,
        newPassword: password,
      });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #faf7f2 0%, #f5f1ea 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: "500px",
          width: "100%",
          padding: { xs: "32px 24px", md: "48px 40px" },
          boxShadow: "0px 8px 32px rgba(45, 41, 38, 0.12)",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Cake sx={{ fontSize: 64, color: "#2c5f4f", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "28px", md: "36px" },
              mb: 1,
            }}
          >
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {success ? "Your password has been reset" : "Enter your new password"}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset successfully! Redirecting to login...
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1a4435 0%, #2c5f4f 100%)",
                },
              }}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #2c5f4f 0%, #1a4435 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1a4435 0%, #2c5f4f 100%)",
                  },
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          </form>
        )}

        {/* Back to Login */}
        {!success && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "#2c5f4f",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(44, 95, 79, 0.08)",
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ResetPassword;
