import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import fetch from "../utils/fetch";
import makeField from "../utils/fieldFactory";

export default function EditResourceModel({
  resource,
  open,
  handleClose,
  attrs,
}) {
  const default_values = () => {
    const defaults = {};
    Object.keys(resource).forEach((attr) => (defaults[attr] = resource[attr]));
    return defaults;
  };
  const { control, handleSubmit } = useForm({
    defaultValues: default_values(),
  });
  if (!open) {
    return <></>;
  }
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          {Object.keys(resource).map((attr, idx) => {
            const field = makeField(resource[attr], attrs[attr], control);
            return <div>{field}</div>;
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type={"submit"} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
