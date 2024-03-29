import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  width: { md: "35%", xs: "90%" },
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
  const [selectedDepartment, setSelectedDepartment] = React.useState(
    user?.department?.name || ""
  );

  const [role, setRole] = React.useState(user?.role || "");
  const [error, setError] = React.useState("");

  const [department, setDepartment] = React.useState(
    user?.department?._id || ""
  );
  const [checked, setChecked] = React.useState(user?.seeOnly || false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleDepartmentChange = (e, v) => {
    if (v?.length) {
      setSelectedDepartment(v);
      const result = departmentList.find((x) => x.name === v);
      if (result) {
        setDepartment(result._id);
      } else {
        setError("Invalid Department");
      }
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    setError("");
    if (
      email === user?.email &&
      role === user?.role &&
      department === user?.department?._id &&
      username === user?.username &&
      checked === user?.seeOnly
    ) {
      setError("Please change a field.");
    } else {
      e.preventDefault();
      let fields = {};
      if (email && email !== user?.email) {
        fields.email = email;
      }
      if (role && role !== user?.role) {
        fields.role = role;
      }
      if (role !== "admin" && department && department !== user?.department?._id) {
        fields.department = department;
      }
      if (username && username !== user?.username) {
        fields.username = username;
      }

      if (checked !== user?.seeOnly) {
        fields.seeOnly = checked;
      }

      try {
        const { data } = await axios.put(`auth/${user?._id}`, fields);
        if (data?.success) {
          fetchUsers();
          if (!loading) {
            return handleClose();
          }
        }
      } catch (error) {
        setError(
          error?.response?.data?.message || "Error while Updating the User."
        );
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ margin: "5px" }}
        title="Update User"
        size="small"
        aria-label="delete"
      >
        <BorderColorIcon sx={{ color: "#3D57DB" }} />
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            {role === "user" ? (
              <FormControl sx={{ width: "60%", mt: 2 }}>
                <Autocomplete
                  id="departments"
                  fullWidth
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  options={departmentList?.map((dept) => dept?.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Department" />
                  )}
                />
              </FormControl>
            ) : null}
            {role === "user" ? (
              <Box sx={{ mx: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="View Only"
                />
              </Box>
            ) : null}
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
