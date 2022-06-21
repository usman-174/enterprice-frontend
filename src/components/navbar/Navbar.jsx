import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Store";
import logo from "../../assests/logo.png";
import { Tooltip } from "@mui/material";
const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const logout = async () => {
    await axios.post("auth/logout");

    window.location.reload();
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/auth/getUser");
        setUser(data);
      } catch (error) {}
    };
    if (!user) {
      checkUser();
    }

    // eslint-disable-next-line
  }, [navigate]);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#3d57db" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              padding: "5px 0 ",
            }}
          >
            <img src={logo} alt="logo" style={{ maxWidth: "75px" }} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {user ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "black",
                      textDecoration: "none",
                    }}
                    onClick={handleCloseNavMenu}
                  >
                    {user?.email}
                  </Typography>
                </MenuItem>
              ) : null}
              {user?.role === "user" ? (
                <MenuItem
                  component={Link}
                  to={"/"}
                  onClick={handleCloseNavMenu}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "black",
                      textDecoration: "none",
                    }}
                    onClick={handleCloseNavMenu}
                  >
                    Home
                  </Typography>
                </MenuItem>
              ) : null}

              {user?.role === "admin" ? (
                <MenuItem
                  component={Link}
                  to={"/dashboard"}
                  onClick={handleCloseNavMenu}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "larger",
                      textDecoration: "none",

                      color: "black",
                    }}
                    onClick={handleCloseNavMenu}
                  >
                    Dashboard
                  </Typography>
                </MenuItem>
              ) : null}

              {!user && (
                <MenuItem
                  component={Link}
                  to={"/login"}
                  onClick={handleCloseNavMenu}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "black",
                      fontSize: "larger",
                      textDecoration: "none",
                    }}
                    onClick={handleCloseNavMenu}
                  >
                    Login
                  </Typography>
                </MenuItem>
              )}

              {user && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={logout}
                  >
                    Logout
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 800,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src={logo} alt="logo" style={{ maxWidth: "80px" }} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: { md: "right" },
              alignItems: "center",
            }}
          >
            {user ? (
              <Tooltip title={user?.role.toUpperCase()}>
                <Typography
                  variant="p"
                  component="small"
                  sx={{
                    marginRight: 4,
                    display: "block",
                    color: "#FFF",
                    fontSize: "17px",
                  }}
                  onClick={handleCloseNavMenu}
                >
                  {user.email}
                </Typography>
              </Tooltip>
            ) : null}
            {user?.role === "user" ? (
              <Button
                sx={{
                  my: 2,

                  display: "block",
                  color: "#FFFF00",
                  fontSize: "24px",
                }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/"}
              >
                Home
              </Button>
            ) : null}

            {user?.role === "admin" ? (
              <Button
                sx={{
                  my: 2,

                  display: "block",
                  color: "#FFFF00",
                  fontSize: "24px",
                }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/dashboard"}
              >
                Dashboard
              </Button>
            ) : null}

            {!user && (
              <Button
                sx={{
                  my: 2,

                  display: "block",
                  color: "#FFFF00",
                  fontSize: "24px",
                }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/login"}
              >
                Login
              </Button>
            )}

            {user && (
              <Button
                sx={{
                  my: 2,

                  display: "block",
                  color: "#FFFF00",
                  fontSize: "24px",
                }}
                onClick={logout}
              >
                logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
