import {
  Autocomplete,
    FormHelperText, IconButton
} from "@mui/material";
import Box from "@mui/material/Box";
import BorderColorIcon from '@mui/icons-material/BorderColor';

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
  width: {md : "35%",xs:"90%"},
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid crimson",
  boxShadow: 24,
  p: 4,
};

const UpdateDepartment = ({  loading,fetchDepartments ,department,directions}) => {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState(department?.description || "");
  const [name, setName] = React.useState(department?.name || "");
  const [direction, setDirection] = React.useState(department?.direction||"");

  const [error, setError] = React.useState("");

 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    let fields = {};
    if (name && name !== department.name) {
      fields.name = name;
    }
    if (description && description !== department.description) {
      fields.description = description;
    }
    if (direction && direction !== department.direction) {
      fields.direction = direction;
    }
    if(!directions.find(x=>x.name===direction)){
      return setError("Select a valid Direction");
    }
    
   
    try {
      const { data } = await axios.put(`departments/${department._id}`, fields);
      if (data?.success) {
        fetchDepartments();
        if(!loading){
            return handleClose();
          }
      }
    } catch (error) {
      return setError(error?.response?.data?.message||"Error while Updating the Department.");

    }
  };
  return (
    <>
     
      <IconButton onClick={handleOpen} sx={{margin:"5px"}} title="Update User" size="small" aria-label="delete">
        <BorderColorIcon  sx={{color:"#3D57DB"}} />
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
             {/* <TextField
                margin="normal"
                required
                fullWidth
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                id="direction"
                label="Direction"
                name="direction"
           
                autoFocus
              /> */}
                <Autocomplete
              id="directions"
              fullWidth
            
              value={direction}
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
              multiline
              value={description}
              minRows={5}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
            />
          
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
            {loading ? "Updating..." :" Update Department"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateDepartment;
