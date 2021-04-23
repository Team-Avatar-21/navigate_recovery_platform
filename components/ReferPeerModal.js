import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../utils/auth";

export default function ReferPeerModal({ handleClose, open, id, name }) {
  const { handleSubmit, control } = useForm();
  const auth = useAuth();
  const token = auth?.authState?.tokenResult?.token;
  const onSubmit = (data) => {
    axios
      .post("/api/resources/refer", { ...data, token, id })
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Refer a Peer</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              You are about to refer a peer to {name} resource. Please, provide
              peer's email and make sure that the email is in the peers list.
            </DialogContentText>
            <Controller
              defaultValue={""}
              name={"peer_email"}
              control={control}
              render={(props) => {
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    required
                    {...props}
                  />
                );
              }}
            />
            <Controller
              defaultValue={name}
              name={"name"}
              control={control}
              render={(props) => {
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="text"
                    label="Resource Name"
                    type="email"
                    fullWidth
                    disabled
                    {...props}
                  />
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type={"submit"} color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
