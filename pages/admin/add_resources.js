import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";
import StyledPaper from "../../components/StyledPaper";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  Typography,
  FormControl,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import fetch from "../../utils/fetch";
import useSWR from "swr";
import { fetchAllAttrs } from "../../utils/graphql/graphqlHelper";
import makeField from "../../utils/fieldFactory";

/**
 * This Page shows logic and tools to add resources to the DB.
 * TODO: add new field to already exisitng ones.
 * TODO: Cleanup, lot's of code copied from add_users.js
 * TODO: add form validation
 */

const GET_ALL_FILTERS = {
  query: `query AllFilters {
      Filters_Names {
        attribute_name
        filter_name
        filters {
          filter_option
          filter_type
        }
      }
    }`,
};

/**
 * Helper method that composes attributes in a shape needed for GraphQL query
 * TODO: take this function out to a separate module
 * @param {Array} attributes that need to be returned
 * @returns {String}
 */
const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
};

/**
 * Composes a mutation string for GraphQL request
 * @param {Object} attributes <attribute_name>:<value> for a new resource
 * @returns {String}
 */
const ADD_RESOURCE = (attributes) => {
  //   let attrs = parseAttrsForGraphQL(attributes);
  let object = "";
  Object.keys(attributes).forEach((field) => {
    object += `${field}: "${attributes[field]}", `;
  });
  const mutation = {
    query: `mutation ADD_RESOURCES {
      insert_resources_new_one(object: {${object}}){
          city
        }
      }
    `,
  };
  return mutation;
};

export default function AddResources() {
  const auth = useAuth();

  const admin = auth?.authState?.tokenResult?.claims?.admin;
  const [successMessage, setSuccessMessage] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [successSnack, setSuccessSnack] = useState({
    open: false,
    message: "",
  });
  const [attributes, setAttributes] = useState([]);
  const methods = useForm();
  const { register, control, handleSubmit, reset } = methods;
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

  const attrs_names = (attrs) => {
    const names_obj = {};
    attrs?.forEach((obj) => {
      const value = obj.filter_human_name;
      const key = obj.filter_name;
      names_obj[key] = {};
      names_obj[key]["value"] = key;
      names_obj[key]["name"] = value;
      names_obj[key]["type"] = obj.filter_type;
    });
    return names_obj;
  };
  /**
   * Method to fetch initial attributes
   * @param  {...any} args
   * @returns
   */
  const getData = async (...args) => {
    const attrs = await fetchAllAttrs(auth.authState.tokenResult.token);
    const fs = attrs;
    const attributes = attrs_names(fs);
    setAttributes(attributes);
    return fs;
  };
  const { data, err } = useSWR(GET_ALL_FILTERS, getData, {
    revalidateOnFocus: false,
  });

  /**
   * handles add resource logic
   * @param {Object} data from the registred fields of the form
   */
  const onSubmit = async (data) => {
    setAwaitingResponse(true);
    fetch(ADD_RESOURCE(data), auth.authState.tokenResult.token)
      .then((res) => {
        showSuccessMessage({ message: "Resource was successfully created" });
        setAwaitingResponse(false);
        reset();
      })
      .catch((err) => {
        handleOpenError(err[0]);
        setAwaitingResponse(false);
      });
  };

  if (!admin) {
    return <>Access Denied</>;
  }

  return (
    <>
      <Navbar />
      <Grid container justify="center">
        <Grid item md={6} xs={10}>
          <StyledPaper>
            <Typography align="center" variant="h2">
              Add Resources{" "}
              {awaitingResponse ? (
                <CircularProgress color="primary" size="0.8em" />
              ) : (
                "    "
              )}
            </Typography>
            {/* <FormProvider {...methods}> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                {Object.keys(attributes).map((attr, idx) => {
                  const field = makeField("", attributes[attr], control);
                  return <FormControl key={idx}>{field}</FormControl>;
                })}
                <FormControl margin="normal">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Submit
                  </Button>
                  {successMessage ? <p>Success</p> : ""}
                </FormControl>
              </Grid>
            </form>
            {/* </FormProvider> */}
          </StyledPaper>
        </Grid>
      </Grid>
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
    </>
  );
}
