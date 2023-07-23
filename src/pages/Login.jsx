import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormHelperText from "@mui/material/FormHelperText";
import { Link, useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useUser } from "../Store";
import axiosInstance from "../axiosInstance";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);
      setError(""); // Clear any previous error
      const { data } = await axiosInstance.post("auth/login", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (data && data.success) {
        setUser(data.user);
        navigate(data.user.role === "admin" ? `/dashboard` : `/`);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error while Logging In, Try Again Later"
      );
    } finally {
      setLoading(false); // Regardless of success or error, stop loading
    }
  };

  return (
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
        <Avatar sx={{ m: 1, bgcolor: "#FFFF00", color: "blue" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <FormHelperText
              sx={{
                fontSize: "14px",
                color: "error.dark",
                textAlign: "left",
                margin: "2px",
              }}
            >
              * {error}
            </FormHelperText>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            defaultValue={"admin@admin.com"}
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            defaultValue={"admin"}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          
          <Grid container>
            <Grid item xs>
              <Button
                sx={{
                  color: "blue",
                  fontSize: "16px",
                }}
                component={Link}
                to={"/forgot_password"}
              >
                Forgot Password?
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            disabled={loading} // Disable the button during loading
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
}
