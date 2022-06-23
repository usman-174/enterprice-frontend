import { FormHelperText, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import BorderColorIcon from "@mui/icons-material/BorderColor";

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

const EditSupplier = ({ loading, fetchSuppliers, supplier }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(supplier?.name || "");
  const [contact, setContact] = React.useState(supplier?.contact || "");
  const [url, setUrl] = React.useState(supplier?.url || "");

  const [error, setError] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    if (
      name === supplier.name &&
      contact === supplier.contact &&
      url === supplier.url
    ) {
      setError("Please change a field.");
    }
    e.preventDefault();
    let fields = {};
    if (name && name !== supplier.name) {
      fields.name = name;
    }
    if (contact && contact !== supplier.contact) {
      fields.contact = contact;
    }
    if (url && url !== supplier.url) {
      fields.url = url;
    }
    try {
      const { data } = await axios.put(`suppliers/${supplier._id}`, fields);
      if (data?.success) {
        fetchSuppliers();
        if (!loading) {
          return handleClose();
        }
      }
    } catch (error) {
      console.log(error.message);
      return setError(error?.response.data.message);
    }
  };
  return (
    <>
      <IconButton
        sx={{ margin: "5px" }}
        title="Update User"
        size="small"
        aria-label="delete"
        onClick={handleOpen}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="Name"
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
              label="Suplier Contact"
              name="contact"
              autoComplete="contact"
              autoFocus
            />{" "}
            <TextField
              margin="normal"
              required
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="url"
              label="Suplier Url"
              name="url"
              autoComplete="url"
              autoFocus
            />
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
              {loading ? "Updating..." : " Update Supplier"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditSupplier;
