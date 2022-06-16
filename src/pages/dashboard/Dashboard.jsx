import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box className="dashboard">
      <Typography
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "30px",
          color: "#3D57DB",
          fontWeight: "bold",
        }}
        variant="h3"
      >
        Dashboard
      </Typography>

      <Box
        sx={{
          marginTop: "30px ",
          padding: { xs: "30px", sm: "0px" },
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="contained"
          sx={{
            margin: "5px 20px",
            backgroundColor: "#f2f232",
            color: "#3D57DB",
            '&:hover': {
              color: "#FFFF00",
           },
            fontSize: "22px",
          }}
          // color="warning"
          component={Link}
          to="users"
        >
          Users
        </Button>
        <Button
          sx={{ margin: "5px 20px", backgroundColor: "#f2f232",
          color: "#3D57DB",
          '&:hover': {
            color: "#FFFF00",
         }, fontSize: "22px" }}
          variant="contained"
        
          component={Link}
          to={"departments"}
        >
          Departments
        </Button>
        <Button
          variant="contained"
          
          sx={{ margin: "5px 20px", backgroundColor: "#f2f232",
          color: "#3D57DB",
          '&:hover': {
            color: "#FFFF00",
         }, fontSize: "22px" }}
          component={Link}
          to={"licenses"}
        >
          Licenses
        </Button>
      </Box>
      <br />
      <Outlet />
    </Box>
  );
};

export default Dashboard;
