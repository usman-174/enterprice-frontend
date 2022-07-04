import { Autocomplete, FormHelperText } from "@mui/material";
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

const AddDepartment = ({ fetchDepartments, directions }) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [direction, setDirection] = React.useState("");

  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!title || !description || !direction) {
      return setError("Please provide all details");
    }
    if(!directions.find(x=>x.name===direction)){
      return setError("Select a valid Direction");
    }
    try {
      const { data } = await axios.post("departments/", {
        name: title,
        description,
        direction,
      });
      if (data?.success) {
        fetchDepartments();
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response?.data?.message||"Error while creating the Department.");
    }
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: { md: "20px 60px" } }}
      >
        Add Department
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              label="Title"
              name="title"
              autoFocus
            />
            
            <Autocomplete
              id="directions"
              fullWidth
              freeSolo
             
              onChange={(_,v)=>setDirection(v)}
              options={directions.map((option) => option.name)}
              renderInput={(params) => (
                <TextField {...params} label="Direction" />
              )}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="decription"
              multiline
              minRows={5}
              label="Description"
              name="decription"
              autoFocus
            />

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
              Add Department
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddDepartment;
