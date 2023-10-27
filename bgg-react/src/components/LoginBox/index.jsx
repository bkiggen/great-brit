import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionSelector } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "@/store/sessionSlice";
import { registerUser } from "@/store/usersSlice";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";

import * as S from "./styles";
import { Button, Typography } from "@mui/material";

const LoginBox = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [snackOpen, setSnackOpen] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);

  const handleRegister = async () => {
    dispatch(registerUser({ email, password, firstName, lastName }));

    navigate("/");
  };

  const handleLogin = async () => {
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (session.sessionToken) {
      navigate("/");
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const inputProps = {
    type: "text",
    sx: { marginRight: "24px" },
  };

  const loginText = isLogin
    ? "Need to create an account? Click here."
    : "Already have an account? Click here.";

  return (
    <>
      <S.Container>
        <div>
          <Input
            {...inputProps}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isLogin && (
            <>
              <Input
                {...inputProps}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                {...inputProps}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          <Input
            type={showPassword ? "test" : "password"}
            placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          variant="contained"
          sx={{ marginTop: "42px" }}
          onClick={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? "Login" : "Register"}
        </Button>
        <Typography
          sx={{ marginTop: "30px", color: "skyblue", cursor: "pointer" }}
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {loginText}
        </Typography>
      </S.Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={setSnackOpen}
        message="Something went wrong"
      />
    </>
  );
};

export default LoginBox;
