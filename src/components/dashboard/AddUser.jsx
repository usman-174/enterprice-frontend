import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  width: { md: "35%", xs: "90%" },

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
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const handleDepartmentChange = (e, v) => {
    if (v?.length) {
      setSelectedDepartment(v);
      const result = departmentList.find((x) => x.name === v);
      if (result) {
        setDepartment(result._id);
      }else{
        setError("Invalid Department")
      }
    }
  };
  const [checked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !role) {
      return setError("Please provide all details");
    }
    if(role !=="admin"&&!department){
      return setError("Please select a valid Department");

    }
    try {
      const { data } = await axios.post("auth/register", {
        email,
        username,
        role,
        department,
        seeOnly: checked,
      });
      if (data?.success) {
        fetchUsers();
        e.target.reset()
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response?.data?.message||"Error while adding the User.");

    }
  };
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: { md: "20px 60px" } }}
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
            {role === "user"?<FormControl sx={{ width: "60%", mt: 2 }}>
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
            </FormControl>:null}       
           {role ==="user" ?<Box sx={{ mx: 1 }}>
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
            </Box>:null}
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
