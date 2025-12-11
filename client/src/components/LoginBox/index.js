import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sessionSelector } from "store";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "store/sessionSlice";
import { registerUser } from "store/usersSlice";
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
import {
  Visibility,
  VisibilityOff,
  Cake,
} from "@mui/icons-material";

const LoginBox = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  const loginError = useSelector((state) => state.session.error);

  const handleRegister = async () => {
    dispatch(registerUser({ email, password, firstName, lastName, secret }));
    navigate("/");
  };

  const handleLogin = async () => {
    dispatch(loginUser({ email, password }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  useEffect(() => {
    if (session.sessionToken) {
      navigate("/");
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loginError) {
      setShowError(true);
    }
  }, [loginError]);

  const loginText = isLogin
    ? "Need to create an account?"
    : "Already have an account?";

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
            Great British Bet Off
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isLogin ? "Welcome back!" : "Create your account"}
          </Typography>
        </Box>

        {/* Error Alert */}
        {showError && loginError && (
          <Alert
            severity="error"
            onClose={() => setShowError(false)}
            sx={{ mb: 3 }}
          >
            {loginError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            {!isLogin && (
              <>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Secret Code"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  fullWidth
                  required
                  helperText="Ask an admin for the secret code"
                />
              </>
            )}

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
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

            {isLogin && (
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Button
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    color: "#2c5f4f",
                    textTransform: "none",
                    fontSize: "14px",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
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
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Box>
        </form>

        {/* Toggle Login/Register */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {loginText}
          </Typography>
          <Button
            onClick={() => setIsLogin((prev) => !prev)}
            sx={{
              color: "#2c5f4f",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(44, 95, 79, 0.08)",
              },
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginBox;
