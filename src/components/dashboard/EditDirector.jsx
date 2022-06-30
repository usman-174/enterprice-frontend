import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  Typography,
} from "@mui/material";
import _ from "underscore";
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
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email || "");
  const [username, setUsername] = React.useState(user?.username || "");
  const [directions, setDirections] = React.useState(allDirections || []);
  const [direction, setDirection] = React.useState("");

  const [selectedDirections, setSelectedDirections] = React.useState([]);

  const [error, setError] = React.useState("");
  const [manageList, setManageList] = React.useState(user?.manageList || []);
  // const [departments, setDepartments] = React.useState([]);

  const handleChangeDirection = (_, v) => {
    setError("");

    if (v && !directions.find((x) => x === v)) {
      return setError("Select a valid Direction");
    }
    setDirection(v);
    const departments = departmentList.filter((dept) => dept.direction === v);
  
    setDirections((e) => {
      const data = e.filter((val) => val !== v);
      return data;
    });
    if (departments.length) {
      // alert("Adding" + JSON.stringify(departments))
      setManageList((e) => [...e, ...departments]);
    }
    if (v?.length) {
      setSelectedDirections((e) => [...e, v]);
    }

    setDirection("");
  };
  const removeManageDepartment = (val) => {
    setError("");
    setSelectedDirections((old) => old.filter((x) => x !== val));
    const foundDirection = allDirections.find((d) => d.name === val);
    setDirections((e) => [...e, foundDirection.name]);
    setManageList((list) => list.filter((dept) => dept.direction !== val));
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
    if (
      directions.length &&
      JSON.stringify(directions) !== JSON.stringify(user.directions)
    ) {
      const data = [];
      selectedDirections.forEach((directionX) => {
        const found = allDirections.find((direction) => {

          return direction.name === directionX;
        });
        if (found) data.push(found);
      });
      fields.directions = JSON.stringify(data);
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
    let usedDirections = [];

    JSON.parse(user?.directions).forEach((direction) => {
      manageList.forEach((dept) => {
        if (
          direction.name === dept.direction &&
          !usedDirections.find((x) => x === direction.name)
        ) {

          usedDirections.push(direction.name);
        }
      });
    });

    
    setSelectedDirections(usedDirections);
    const available = _.without(
      allDirections.map((x) => x.name),
      ...usedDirections
    );
   
    setDirections(available);
    // eslint-disable-next-line
  }, []);
  // useEffect(() => {
  //   const filteredDepartments = [];
  //   departmentList.forEach((dept1) => {
  //     const found = manageList.find((dept2) => dept2._id === dept1._id);
  //     if (!found) filteredDepartments.push(dept1);
  //   });

  //   setDepartments(filteredDepartments);
  //   // eslint-disable-next-line
  // }, []);
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
                options={directions.map((option) => option)}
                renderInput={(params) => (
                  <TextField {...params} label="Department Directions" />
                )}
              />
              <Typography
                variant="p"
                component="div"
                sx={{ my: 2, display: "flex" }}
              >
                {selectedDirections.map((val, i) => (
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
                    {val}
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
