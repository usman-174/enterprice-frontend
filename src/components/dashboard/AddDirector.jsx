import {
  Autocomplete,
  FormControl,
  FormHelperText,
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
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [manageList, setManageList] = React.useState([]);
  const [direction, setDirection] = React.useState("");
  const [directions, setDirections] = React.useState(allDirections);

  const [selectedDirections, setSelectedDirections] = React.useState([]);
  const [error, setError] = React.useState("");

  const handleChangeDirection = (_, v) => {
    setError("");

    if (v && !directions.find((x) => x.name === v)) {
      return setError("Select a valid Direction");
    }
    setDirection(v);
    const departments = departmentList.filter((dept) => dept.direction === v);

    setDirections((e) => {
      const data = e.filter((val) => val.name !== v);
      return data;
    });
    if (departments.length) {
      setManageList((e) => [...e, ...departments]);
    }
    if(v?.length){
      
      setSelectedDirections((e) => [...e, v]);
    }

    setDirection("");
  };
  const removeManageDepartment = (val) => {
    setError("")
    setSelectedDirections((old) => old.filter((x) => x !== val));
    const foundDirection = allDirections.find((d) => d.name === val);
    setDirections((e) => [...e, foundDirection]);
    setManageList((list) => list.filter((dept) => dept.direction !== val));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !manageList.length || !directions.length) {
      return setError("Please provide all details X");
    }
 
   

    try {
      const { data } = await axios.post("auth/add_director", {
        email,
        username,
        directions:JSON.stringify(directions),
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
  useEffect(()=>{
    if(allDirections){
      setDirections(allDirections)
    }
    // eslint-disable-next-line 
  },[])
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
                options={directions.map((option) => option?.name)}
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
