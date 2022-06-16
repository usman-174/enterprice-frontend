import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select
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

const UpdateUser = ({ user, loading, fetchUsers, departmentList }) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email || "");
  const [username, setUsername] = React.useState(user?.username || "");

  const [role, setRole] = React.useState(user?.role || "");
  const [error, setError] = React.useState("");

  const [department, setDepartment] = React.useState(
    user?.department._id || ""
  );
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    let fields = {};
    if (email && email !== user.email) {
      fields.email = email;
    }
    if (role && role !== user.role) {
      fields.role = role;
    }
    if (department && department !== user.department) {
      fields.department = department;
    }
    if (username && username !== user.username) {
      fields.username = username;
    }
    try {
      const { data } = await axios.put(`auth/${user._id}`, fields);
      if (data?.success) {
        fetchUsers();
        if (!loading) {
          return handleClose();
        }
      }
    } catch (error) {
      console.log(error.message);
      return setError(error?.response.data.message);
    }
  };
  return (
    <>
     
      <IconButton sx={{margin:"5px"}} title="Update User" size="small" aria-label="delete">
        <BorderColorIcon onClick={handleOpen} sx={{color:"#3D57DB"}} />
      </IconButton>
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
              {loading ? "Updating..." : "Update User"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateUser;
