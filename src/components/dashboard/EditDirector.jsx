import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
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

const UpdateDirector = ({
  user,
  loading,
  fetchUsers,
  departmentList,
  allDirections,
}) => {
  const IDX = React.useId();

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email || "");
  const [username, setUsername] = React.useState(user?.username || "");
  const [directions, setDirections] = React.useState(allDirections || []);
  const [direction, setDirection] = React.useState("");

  const [department, setDepartment] = React.useState("");
  const [departments, setDepartments] = React.useState([]);

  const [error, setError] = React.useState("");
  const [manageList, setManageList] = React.useState(user?.manageList || []);

  const handleChangeDirection = (_, v) => {
    setError("");

    if (v && !directions.find((x) => x.name === v)) {
      return setError("Select a valid Direction");
    }

    setDirection(v);
    const departmentsx = departmentList.filter((dept) => dept.direction === v);
    const res = departmentsx.filter(dept=>!manageList.find(x=>x._id===dept._id))
    console.log({ departmentsx, manageList, res });
   
      setDepartments(res);
    
  };
  const removeManageDepartment = (val) => {
    setError("");
    setDepartment("");
    if(!departments.find(x=>x._id === val._id)){
      setDepartments((e) => [...e, val]);
    }
    setManageList((list) => list.filter((dept) => dept._id !== val._id));
  };
  const handleDepartmentChange = (event) => {
    if (!manageList.find((x) => x._id === event.target.value._id)) {
      setManageList((e) => [...e, event.target.value]);
      const filteredDepartments = departments.filter(
        (dept) => dept._id !== event.target.value._id
      );

      setDepartments(filteredDepartments);
      setDepartment(event.target.value);
    } else {
      setDepartment("");
    }
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

    if (username && username !== user.username) {
      fields.username = username;
    }

    try {
      const { data } = await axios.put(`auth/${user._id}`, {
        ...fields,
        manageList: manageList.map((list) => list._id),
      });
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
  useEffect(() => {
    if (allDirections) {
      setDirections(allDirections);
    }
    // eslint-disable-next-line
  }, [allDirections]);

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
                options={directions.map((option) => option?.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Department Directions" />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: "60%", mt: 2 }}>
              <InputLabel id="Department-id">Department</InputLabel>
              <Select
                disabled={!direction }
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

export default UpdateDirector;
