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
  Select,
  Checkbox,
  MenuItem,
  TextField,
  InputLabel,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useForm, Controller, appendErrors, useWatch } from "react-hook-form";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import makeField from "../utils/fieldFactory";
import { useEffect, useState } from "react";
import { useResources } from "./ResourcesContext";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";

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

export default function AddResourceAttrModal({ open, handleClose, append }) {
  const auth = useAuth();
  const token = auth.authState.tokenResult.token;
  const [loading, setLoading] = useState(false);
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [successSnack, setSuccessSnack] = useState({
    open: false,
    message: "",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [filterType, setFilterType] = useState("select");
  if (!open) {
    return <></>;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    axios
      .post("/api/resources/", {
        data,
        token,
      })
      .then((res) => {
        res?.data?.insert_filters_new?.returning[0]
          ? append(res.data.insert_filters_new.returning[0])
          : "";
        showSuccessMessage({ message: "Attribute Successfull Added" });
        setLoading(false);
        reset();
        setFilterType("select");
      })
      .catch((err) => {
        handleOpenError(err.response.data[0]);
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

  const buildDefaultBasedOnFilterType = (type) => {
    if (type == "select") {
      return (
        <Controller
          name={"default_val"}
          control={control}
          defaultValue={""}
          rules={{
            required: {
              value: true,
              message: "Default value is required",
            },
          }}
          render={(props) => (
            <TextField
              {...props}
              required
              label={"Default Value"}
              margin="dense"
              placeholder="default value"
            />
          )}
        />
      );
    } else {
      return (
        <>
          <InputLabel> Default Value</InputLabel>
          <Controller
            name={"default_val"}
            control={control}
            defaultValue={true}
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Default value is required",
            //   },
            // }}
            render={(props) => (
              <Select {...props}>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            )}
          />
        </>
      );
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add New Attribute</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            Add a new attribute that you will be able to filter resources by.
          </DialogContentText>
          {/* <ErrorMessage errors={errors} name="singleErrorInput" />
          <ErrorMessage
            errors={errors}
            name="singleErrorInput"
            render={({ message }) => <p>{message}</p>}
          /> */}
          <FormControl margin="dense" fullWidth>
            <Controller
              name={"filter_human_name"}
              control={control}
              defaultValue={""}
              rules={{ required: true }}
              render={(props) => (
                <TextField
                  {...props}
                  label={"Name"}
                  fullWidth
                  margin="dense"
                  required
                />
              )}
            />
          </FormControl>
          <FormControl margin="dense" fullWidth>
            <InputLabel> Filter Type </InputLabel>
            <Controller
              name={"filter_type"}
              control={control}
              defaultValue={"select"}
              rules={{ required: true }}
              render={({ onChange, ...props }) => {
                return (
                  <Select
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      onChange(e);
                    }}
                    {...props}
                  >
                    <MenuItem value={"select"}>Select</MenuItem>
                    <MenuItem value={"checkbox"}>Checkbox</MenuItem>
                    <MenuItem value={"boolean"}>Yes/No</MenuItem>
                  </Select>
                );
              }}
            />
          </FormControl>
          <FormControl margin="dense">
            <section>
              <label>Important Filter</label>
              <Controller
                name={`important`}
                control={control}
                defaultValue={true}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
            </section>
          </FormControl>
          <FormControl margin="dense">
            <section>
              <label>Important Attribute</label>
              <Controller
                name={`important_attr`}
                control={control}
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
            </section>
          </FormControl>
          <FormControl margin="dense">
            <section>
              <label>Nullable</label>
              <Controller
                name={`nullable`}
                control={control}
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
            </section>
          </FormControl>
          <FormControl margin="dense" fullWidth>
            {buildDefaultBasedOnFilterType(filterType)}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type={"submit"} color="primary">
            Add
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
