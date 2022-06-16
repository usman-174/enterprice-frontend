import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {md : "35%",xs:"90%"},

  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid crimson",
  boxShadow: 24,
  p: 4,
};

const AddUser = ({ departmentList, fetchUsers }) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const [role, setRole] = React.useState("");
  const [error, setError] = React.useState("");

  const [department, setDepartment] = React.useState("");
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !department || !role) {
      return setError("Please provide all details");
    }
    console.log({ email, department, role });
    try {
      const { data } = await axios.post("auth/register", {
        email,
        username,
        role,
        department,
      });
      if (data?.success) {
        fetchUsers();
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response.data.message);
    }
  };
  return (
    <Box sx={{position:"relative"}}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: {md:"20px 60px"} }}
      >
        Add User
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <FormControl sx={{ width: "60%", mt: 2 }}>
              <InputLabel id="Department-id">Department</InputLabel>
              <Select
                labelId="Department-id"
                id="demo-simple-select"
                value={department}
                label="Department"
                onChange={handleDepartmentChange}
              >
                {departmentList?.map((val) => {
                  return (
                    <MenuItem key={val._id + val.name} value={val._id}>
                      {val.name.toUpperCase()}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ width: "60%", mt: 2 }}>
              <InputLabel id="Role-id">Role</InputLabel>
              <Select
                labelId="Role-id"
                id="demo-simple-selectx"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem selected value="admin">
                  Admin
                </MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <br />
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddUser;
