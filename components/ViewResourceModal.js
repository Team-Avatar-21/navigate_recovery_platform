import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import makeField from "../utils/fieldFactory";

export default function ViewResourceModal({
  resource,
  open,
  handleClose,
  attrs,
}) {
  if (!open) {
    return <></>;
  }
  console.log(resource);
  console.log(attrs);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{resource.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This is infromation that we have on {resource.name}.
        </DialogContentText>
        {Object.keys(attrs).map((attr_name, idx) => {
          return (
            <p>
              {attrs[attr_name].name} : {String(resource[attr_name])}
            </p>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} variant="contained" color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}
