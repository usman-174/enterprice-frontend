import {
    FormHelperText
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
  
  const AddDirection = ({   fetchDirections }) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
   
  
    const [error, setError] = React.useState("");
  
   
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = async (e) => {
      setError("");
      e.preventDefault();
      if (!name) {
        return setError("Please enter Donor name");
      }
      // return
      try {
        const { data } = await axios.post("directions/", {
         name
        });
        if (data?.success) {
          e.target.reset()
          fetchDirections();
     
          return handleClose();
        }
      } catch (error) {
        return setError(error?.response?.data?.message||"Error while creating the Direction.");

      }
    };
    return (
      <Box sx={{ position: "relative" }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ margin: { md: "20px 60px" } }}
        >
          Add Direction
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                label="Direction Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
             
             
              <Button
                type="submit"
                size="large"
                variant="contained"
                sx={{ margin: "20px auto", textAlign: "center" }}
              >
                Add Direction
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    );
  };
  
  export default AddDirection;
  