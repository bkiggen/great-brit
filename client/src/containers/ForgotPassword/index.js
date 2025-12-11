import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  Alert,
} from "@mui/material";
import { Cake } from "@mui/icons-material";
import { makeRequest } from "helpers/makeRequest";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await makeRequest.post("/password-reset/request", { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
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
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {submitted
              ? "Check your email for reset instructions"
              : "Enter your email to receive a reset link"}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {submitted ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              If an account with that email exists, you will receive a password
              reset link shortly.
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
              Back to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoFocus
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
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>
          </form>
        )}

        {/* Back to Login */}
        {!submitted && (
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

export default ForgotPassword;
