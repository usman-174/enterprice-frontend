import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  FormControl,
  FormHelperText,
  IconButton,
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

const UpdateDirector = ({ user, loading, fetchUsers, departmentList }) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email || "");
  const [username, setUsername] = React.useState(user?.username || "");

  const [error, setError] = React.useState("");
  const [manageList, setManageList] = React.useState(user?.manageList || []);
  const [departments, setDepartments] = React.useState([]);

  const handleDepartmentChange = (ex) => {
    setManageList((e) => {
      const data = [...e, ex.target.value];
      return data;
    });
    setDepartments((e) => {
      const data = e.filter((val) => val._id !== ex.target.value._id);
      return data;
    });
  };
  const removeManageDepartment = (val) => {
    setManageList((e) => e.filter((x) => x._id !== val._id));
    setDepartments((e) => {
      if (!e.find((dept) => dept._id === val._id)) {
        return [...e, val];
      }
    });
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
        manageList,
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
    const filteredDepartments = [];
    departmentList.forEach((dept1) => {
      const found = manageList.find((dept2) => dept2._id === dept1._id);
      console.log({found});
      if (!found) filteredDepartments.push(dept1);
    });
    console.log({
      filteredDepartments,
      departmentList,
      manageList: user.manageList,
    });
    setDepartments(filteredDepartments);
    // eslint-disable-next-line
  }, []);
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
              <InputLabel id="Department-id">Manage Departments</InputLabel>
              <Select
                labelId="Department-id"
                id="demo-simple-select"
                value={""}
                label="Department"
                disabled={!departments.length}
                onChange={handleDepartmentChange}
              >
                {departments?.map((val) => {
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
              >
                {manageList.map((val) => (
                  <Typography
                    varaint="small"
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

export default UpdateDirector;
