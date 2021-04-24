import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useState } from "react";
import ReferPeerModal from "./ReferPeerModal";

export default function ViewResourceModal({
  resource,
  open,
  handleClose,
  attrs,
}) {
  if (!open) {
    return <></>;
  }
  const [openPeer, setOpenPeer] = useState(false);

  const handleClickOpenPeer = () => {
    setOpenPeer(true);
  };

  const handleClosePeer = () => {
    setOpenPeer(false);
  };
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
        <p>Notes: {resource.notes}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} variant="contained" color="primary">
          Okay
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClickOpenPeer}
        >
          Refer a Peer
        </Button>
      </DialogActions>
      <ReferPeerModal
        id={resource.id}
        name={resource.name}
        open={openPeer}
        handleClose={handleClosePeer}
      />
    </Dialog>
  );
}
