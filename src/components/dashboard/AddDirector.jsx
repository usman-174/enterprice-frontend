import {
  Autocomplete,
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
import React, { useEffect, useState } from "react";

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

const AddDirector = ({
  departmentList,
  fetchUsers,
  allDirections,
  fetchDepartments,
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [manageList, setManageList] = useState([]);
  const [direction, setDirection] = useState("");
  const [directions, setDirections] = useState([]);

  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  const handleChangeDirection = (_, v) => {
    setError("");
    if (!v || !directions.find((x) => x.name === v)) {
      return setError("Select a valid Direction");
    }
    setDirection(v);
    const departmentsx = departmentList.filter((dept) => dept.direction === v);
    setDepartments(departmentsx);
  };

  const removeManageDepartment = (val) => {
    setError("");
    setDepartment("");
    setDepartments((prevDepartments) => [...prevDepartments, val]);
    setManageList((prevManageList) =>
      prevManageList.filter((dept) => dept._id !== val._id)
    );
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    if (!manageList.find((x) => x._id === event.target.value._id)) {
      setManageList((prevManageList) => [...prevManageList, event.target.value]);
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept._id !== event.target.value._id)
      );
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setManageList([]);
    setDirection("");
    setDepartment("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !manageList.length) {
      return setError("Please provide all details");
    }

    try {
      const { data } = await axios.post("auth/add_director", {
        email,
        username,
        manageList: manageList.map((list) => list._id),
      });
      if (data?.success) {
        resetForm();
        fetchUsers();
        fetchDepartments();
        handleClose();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Error while creating the Director.");
    }
  };

  useEffect(() => {
    if (allDirections) {
      setDirections(allDirections);
    }
  }, [allDirections]);

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
              <Autocomplete
                id="directions"
                fullWidth
                value={direction}
                onChange={handleChangeDirection}
                options={directions?.map((option) => option?.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Department Directions" />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: "60%", mt: 2 }}>
              <InputLabel id="Department-id">Department</InputLabel>
              <Select
                labelId="Department-id"
                id="demo-simple-select"
                value={department}
                label="Department"
                onChange={handleDepartmentChange}
              >
                {departments?.map((val) => (
                  <MenuItem key={val._id} value={val}>
                    {val.name.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="p"
              component="div"
              sx={{ my: 2, display: "flex" }}
            >
              {manageList.map((val) => (
                <Typography
                  key={val._id}
                  onClick={() => removeManageDepartment(val)}
                  component="small"
                  sx={{
                    mx: 2,
                    fontSize: "12px",
                    p: 1.15,
                    borderRadius: 5,
                    background: "yellow",
                    cursor: "pointer",
                    "&:hover": {
                      background: "red",
                      p: 1.157,
                      textDecoration: "line-through",
                    },
                  }}
                >
                  {val.name}
                </Typography>
              ))}
            </Typography>
            <br />
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={!manageList.length}
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
