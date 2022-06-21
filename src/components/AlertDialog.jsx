import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

export default function AlertDialog({ handleDelete,id }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleDeleteItem = () => {
    handleDelete(id);
    handleClose();
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <IconButton
        title="Delete"
        size="small"
        aria-label="delete"
        onClick={handleClickOpen}
      >
        <DeleteIcon color="error" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to Delete?
        </DialogTitle>

        <DialogActions>
          <Button color="error" onClick={handleClose}>No</Button>
          <Button sx={{color:"#FF400"}}onClick={handleDeleteItem} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
