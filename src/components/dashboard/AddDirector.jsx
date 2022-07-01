import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect } from "react";
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
  const IDX = React.useId();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [manageList, setManageList] = React.useState([]);
  const [direction, setDirection] = React.useState("");
  const [directions, setDirections] = React.useState(allDirections);
  console.log({directions,allDirections});
  const [department, setDepartment] = React.useState("");
  const [departments, setDepartments] = React.useState([]);

  const [error, setError] = React.useState("");

  const handleChangeDirection = (_, v) => {
    setError("");

    if (v && !directions.find((x) => x.name === v)) {
      return setError("Select a valid Direction");
    }

    setDirection(v);
    const departmentsx = departmentList.filter((dept) => dept.direction === v);

    if (departmentsx.length) {
      setDepartments(departmentsx);
    }
  };
  const removeManageDepartment = (val) => {
    setError("");
    setDepartment("");
    setDepartments((e) => [...e, val]);

    setManageList((list) => list.filter((dept) => dept._id !== val._id));
  };
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    if (!manageList.find((x) => x._id === event.target.value_id)) {
      setManageList((e) => [...e, event.target.value]);
      const filteredDepartments = departments.filter(
        (dept) => dept._id !== event.target.value._id
      );

      setDepartments(filteredDepartments);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !manageList.length) {
      return setError("Please provide all details X");
    }
    try {
      const { data } = await axios.post("auth/add_director", {
        email,
        username,
        manageList: manageList.map((list) => list._id),
      });
      if (data?.success) {
        e.target.reset();
        fetchUsers();
        fetchDepartments();
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response.data.message);
    }
  };
  useEffect(() => {
    if(allDirections){

      setDirections(allDirections);
    }
    // eslint-disable-next-line
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
                {departments?.map((val) => {
                  return (
                    <MenuItem key={val._id + val.name + IDX} value={val}>
                      {val.name.toUpperCase()}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Typography
              variant="p"
              component="div"
              sx={{ my: 2, display: "flex" }}
            >
              {manageList.map((val, i) => (
                <Typography
                  varaint="small"
                  key={val + i}
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
