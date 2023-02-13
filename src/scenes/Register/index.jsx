import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { ColorModeContext, useMode } from "../../Theme";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      BITS IT SERVICES {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const Register = () => {
  const [theme, colorMode] = useMode();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup, createUser } = useAuth();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirm-password"))
      return setError("Password do not match");

    try {
      setError("");
      setLoading(true);
      await signup(data.get("email"), data.get("password"));
      await createUser(
        data.get("firstName"),
        data.get("lastName"),
        data.get("role"),
        data.get("email")
      );
      navigate("/profile");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              REGISTER
            </Typography>

            {error && (
              <Alert severity="warning" sx={{ background: "none" }}>
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate={false}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="secondary"
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="secondary"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>{" "}
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="select-label" color="secondary">
                      Role
                    </InputLabel>
                    <Select
                      labelId="select-label"
                      color="secondary"
                      name="role"
                      id="role"
                      value={role}
                      label="Role"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value={"Admin"}>Admin</MenuItem>
                      <MenuItem value={"User"}>User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign In
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    to="/"
                    variant="body2"
                    style={{
                      color: "white",
                    }}
                  >
                    {"Already have an account? SignIn"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Register;
