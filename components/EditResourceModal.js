import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import makeField from "../utils/fieldFactory";
import { useState } from "react";
import { useResources } from "../components/ResourcesContext";

const buildFiltersObject = (filters_raw, resources) => {
  return filters_raw.map((filter, idx) => {
    const filter_options = new Set();
    resources.forEach((resource) => {
      filter_options.add(resource[filter.filter_name]);
    });
    return { ...filter, filter_options };
  });
};

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
       id
      }
    }`,
  };
  return query;
};

/**
 * Composes a mutation string for GraphQL request to remove a resource
 * @param {String} orgName name of the org since it is a pk
 * @returns {String}
 */
const REMOVE_RESOURCE = (orgName) => {
  const mutation = {
    query: `mutation REMOVE_RESOURCE {
        delete_Resources(where: {organizationName: {_eq: "${orgName}"}}) {
          returning {
            organizationName
          }
        }
      }
    `,
  };
  return mutation;
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
  const res = useResources();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [successSnack, setSuccessSnack] = useState({
    open: false,
    message: "",
  });
  const { control, handleSubmit } = useForm({
    defaultValues: default_values(),
  });

  if (!open) {
    return <></>;
  }
  const onSubmit = (data) => {
    setLoading(true);
    const edited_data = data;
    console.log(data);
    console.log(auth.authState.tokenResult.token);
    fetch(
      UPDATE_RESOURCES(data, attrs, resource.id),
      auth.authState.tokenResult.token
    )
      .then((data) => {
        console.log(edited_data);
        setLoading(false);
        res.dispatch({
          type: "update",
          value: data.update_resources_new_by_pk,
        });
        res.dispatch({
          type: "update_filters",
          value: { new: edited_data, old: resource },
        });
        showSuccessMessage({ message: "Updated Successfully" });
        setTimeout(() => setSuccessSnack({ open: false, message: "" }), 6000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const showSuccessMessage = (data) => {
    setSuccessSnack({ open: true, message: data.message });
  };
  const handleCloseSuccess = () => {
    setSuccessSnack({ open: false, message: "" });
  };
  const handleOpenError = (err) => {
    setErrorSnack({ open: true, message: err.message });
  };
  const handleCloseError = () => {
    setErrorSnack({ oepn: false, message: "" });
  };
  /**
   *  Deletes a resource from DB
   * displays success/failure message respectively
   * @param {String} orgName pk of the resource to be deleted from DB
   */
  const handleDelete = async (orgName) => {
    setAwaitingResponse(true);
    fetch(REMOVE_RESOURCE(orgName), auth.authState.tokenResult.token)
      .then((res) => {
        setResources(
          resources.filter((resource) => {
            return resource.organizationName != orgName;
          })
        );
        setAwaitingResponse(false);
        showSuccessMessage({
          message: `Resource: ${orgName} was successfully deleted.`,
        });
      })
      .catch((err) => {
        handleOpenError(err[0]);
        setAwaitingResponse(false);
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
      <Snackbar
        open={errorSnack.open}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorSnack.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnack.open}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          <AlertTitle>Success</AlertTitle>
          {successSnack.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
