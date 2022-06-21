import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
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

const AddDirector = ({ departmentList, setDepartmentList, fetchUsers,fetchDepartments }) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [manageList, setManageList] = React.useState([]);

  const [error, setError] = React.useState("");

  // const [department, setDepartment] = React.useState("");
  const handleDepartmentChange = (ex) => {
    setManageList((e) => {
      const data = [...e, ex.target.value];
      return data;
    });
    setDepartmentList((e) => {
      const data = e.filter((val) => val._id !== ex.target.value._id);
      return data;
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !manageList.length) {
      return setError("Please provide all details");
    }
    // return
    try {
      const { data } = await axios.post("auth/add_director", {
        email,
        username,
        manageList:manageList.map(list=>list._id),
      });
      if (data?.success) {
        e.target.reset()
        fetchUsers();
        fetchDepartments()
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response.data.message);
    }
  };
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: { md: "20px 60px" } }}
      >
        Add Director
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
              <InputLabel id="Department-id">
                Select Departments to Manage
              </InputLabel>
              <Select
                labelId="Department-id"
                id="demo-simple-select"
                value={""}
                disabled={!departmentList?.length}
                label="Department"
                onChange={handleDepartmentChange}
              >
                {departmentList?.map((val) => {
                  return (
                    <MenuItem key={val._id + val.name} value={val}>
                      {val.name.toUpperCase()}
                    </MenuItem>
                  );
                })}
              </Select>
              <Typography
                variant="p"
                component="div"
                sx={{ my: 2, display: "flex" }}
              >{
                manageList.map(val=>
                  <Typography varaint="small"  key={val._id} component="small" sx={{ mx: 2,fontSize:"12px" }}>
                    {val.name}
                  </Typography>)
              }
              </Typography>
            </FormControl>
            <br />

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
              Add Director
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddDirector;
