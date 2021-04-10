import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import fetch from "../utils/fetch";
import makeField from "../utils/fieldFactory";

export default function EditResourceModel({
  resource,
  open,
  handleClose,
  attrs,
}) {
  if (!open) {
    return <></>;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        {Object.keys(resource).map((attr) => {
          return makeField(resource[attr], attrs[attr]);
          // return (
          //   <TextField
          //     margin="dense"
          //     id={attr}
          //     label={attrs[attr]["name"]}
          //     type="text"
          //     defaultValue={resource[attr]}
          //     fullWidth
          //   />
          // );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
