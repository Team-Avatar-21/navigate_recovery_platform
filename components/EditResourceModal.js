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
import { useAuth } from "../utils/auth";
import makeField from "../utils/fieldFactory";
import { useState } from "react";

const prepareSet = (values) => {
  let set = ``;
  Object.keys(values).forEach((attr) => {
    set += `${attr}: "${values[attr]}", `;
  });
  return set;
};

const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  Object.keys(attributes).forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
};

const UPDATE_RESOURCES = (values, attrs, id) => {
  let set = prepareSet(values);
  let attributes = parseAttrsForGraphQL(attrs);
  const query = {
    query: `mutation UPDATE_RESOURCE {
      update_resources_new_by_pk(pk_columns: {id: ${id}}, _set: {${set}}) {
       ${attributes}
      }
    }`,
  };
  return query;
};
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
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: default_values(),
  });
  if (!open) {
    return <></>;
  }
  const onSubmit = (data) => {
    setLoading(true);
    console.log(auth.authState.tokenResult.token);
    fetch(
      UPDATE_RESOURCES(data, attrs, resource.id),
      auth.authState.tokenResult.token
    )
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
          {Object.keys(attrs).map((attr, idx) => {
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
          {loading ? "loading..." : ""}
        </DialogActions>
      </form>
    </Dialog>
  );
}
