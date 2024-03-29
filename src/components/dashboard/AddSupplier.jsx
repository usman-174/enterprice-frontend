import { FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";

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

const AddSupplier = ({ fetchSuppliers }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setContact("");
    setUrl("");
    setError("");
  };

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!name || !url || !contact) {
      return setError("Please provide all details");
    }

    try {
      const { data } = await axios.post("suppliers/", {
        name,
        contact,
        url,
      });
      if (data?.success) {
        resetForm();
        fetchSuppliers();
        handleClose();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Error while creating the Supplier.");
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: { md: "20px 60px" } }}
        
      >
        Add Supplier
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
              label="Supplier Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              id="contact"
              label="Supplier Contact"
              name="contact"
              autoComplete="contact"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="url"
              label="Supplier url"
              name="url"
              autoComplete="url"
              autoFocus
            />
            <br />
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
              disabled={!name || !url || !contact}
            >
              Add Supplier
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddSupplier;
