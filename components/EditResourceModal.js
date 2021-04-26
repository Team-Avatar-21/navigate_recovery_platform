import {
  Button,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextareaAutosize,
  TextField,
  InputLabel,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useForm, Controller } from "react-hook-form";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import makeField from "../utils/fieldFactory";
import { useState } from "react";
import { useResources } from "../components/ResourcesContext";

const buildFiltersObject = (filters_raw, resources) => {
  return filters_raw.map((filter, _) => {
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
       notes
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
        delete_resources_new(where: {name: {_eq: "${orgName}"}}) {
          returning {
            name
          }
        }
      }
    `,
  };
  return mutation;
};

export default function EditResourceModal({
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
    fetch(
      UPDATE_RESOURCES(data, attrs, resource.id),
      auth.authState.tokenResult.token
    )
      .then((data) => {
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
        setLoading(false);
        console.log(err);
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
    setLoading(true);
    fetch(REMOVE_RESOURCE(orgName), auth.authState.tokenResult.token)
      .then((response) => {
        const newRes = res.state.resources.filter((resource) => {
          return resource.name != orgName;
        });
        res.dispatch({ type: "set", value: newRes });
        setLoading(false);
        showSuccessMessage({
          message: `Resource: ${orgName} was successfully deleted.`,
        });
        handleClose();
      })
      .catch((err) => {
        handleOpenError(err);
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
          {Object.keys(attrs).map((attr, _) => {
            const field = makeField(resource[attr], attrs[attr], control);
            return <div>{field}</div>;
          })}
          <div>
            <Controller
              name={"notes"}
              control={control}
              defaultValue={resource.notes}
              render={(props) => (
                <TextField
                  {...props}
                  label={"Notes"}
                  margin="dense"
                  fullWidth
                  multiline
                  rows={5}
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type={"submit"} color="primary">
            Save
          </Button>
          <Button
            onClick={() => handleDelete(resource.name)}
            variant="contained"
            color="secondary"
          >
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
