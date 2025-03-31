import * as React from "react";
import { useLogin, useNotify } from "react-admin";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../loginPage/ForgotPassword";
import { GoogleIcon } from "../shared_theme/CustomIcons";
import { Link as RouterLink } from "react-router-dom";

// for sign card connection
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  backgroundColor: "#002157",
  boxShadow:
    "hsla(225, 100.00%, 83.90%, 0.05) 0px 5px 15px 0px, hsla(222, 97.00%, 73.90%, 0.05) 0px 15px 35px -5px",
}));

// login container
const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "url(/loginPage.jpg)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
}));

const RegisterPage: React.FC = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");

  const login = useLogin();
  const notify = useNotify();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //use state handler
  const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const handleOnChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handleOnChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, password }).catch(() => notify("Invalid email or password"));
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!username || username.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                type="name"
                name="name"
                autoComplete="name"
                autoFocus
                required
                fullWidth
                id="outlined-basic"
                label="Email"
                variant="outlined"
                color={nameError ? "error" : "primary"}
                value={username}
                onChange={handleOnChangeName}
              />
            </FormControl>
            <FormControl>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                id="outlined-basic"
                label="Email"
                variant="outlined"
                color={emailError ? "error" : "primary"}
                value={email}
                onChange={handleOnChangeEmail}
              />
            </FormControl>
            <FormControl>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="outlined-basic"
                label="Password"
                variant="outlined"
                autoComplete="current-password"
                required
                fullWidth
                color={passwordError ? "error" : "primary"}
                value={password}
                onChange={handleOnChangePassword}
              />
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                style={{ textDecoration: "none", color: "primary" }}
                sx={{ alignSelf: "center" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </React.Fragment>
  );
};

export default RegisterPage;
