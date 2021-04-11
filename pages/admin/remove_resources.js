import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
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
import ResourceCard from "../../components/ResourceCard";

/**
 * This Page shows logic and tools to remove resources from the DB.
 */

/**
 * needed to define all attributes of the resources in the db
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
    attrs += element.attribute_name + "\n";
  });
  return attrs;
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

/**
 * Makes a query to fetch all resources
 * @param {Array<Object>} attributes each attribute is an object
 * @returns
 */
const GET_ALL_RESOURCES = (attributes) => {
  let attrs = parseAttrsForGraphQL(attributes);
  console.log(attrs);
  const query = {
    query: `query AllFilters {
        Resources {
          ${attrs}
        }
      }`,
  };

  return query;
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
  const [resources, setResources] = useState([]);
  const methods = useForm();
  const { register, handleSubmit, reset } = methods;
  const showSuccessMessage = (data) => {
    console.log("inside success");
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
   * Method to fetch initial attributes and resources with the fetched attributes
   * sets up attributes var
   * sets up resources var
   * @param  {...any} args
   * @returns {void}
   */
  const getData = async (...args) => {
    const { Filters_Names: fs } = await fetch(
      GET_ALL_FILTERS,
      auth.authState.tokenResult.token
    );
    let attrs = fs.map((filter) => {
      const { attribute_name, filter_name } = filter;
      const obj = {
        attribute_name: attribute_name,
        filter_name: filter_name,
      };
      obj[attribute_name] = filter_name;
      return obj;
    });
    setAttributes(attrs);
    const { Resources: r } = await fetch(
      GET_ALL_RESOURCES(attrs),
      auth.authState.tokenResult.token
    );
    setResources(r);
  };
  const { data, err } = useSWR(GET_ALL_FILTERS, getData);

  if (!admin) {
    return <>Access Denied</>;
  }

  /**
   * helper method to prepare attributes object for resource cards component
   * @returns {Object} with attribute names and appropriate values
   */
  const attrs_names = () => {
    const names_obj = {};
    attributes.forEach((obj) => {
      const key = obj.attribute_name;
      const value = obj.filter_name;
      names_obj[key] = value;
    });
    return names_obj;
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

  /**
   * Helper method to build ResourceCard components for each resource
   * @param {Array<Object>} resources
   * @returns {Array<Grid>} grid components
   */
  const buildResourcesComp = (resources) => {
    return resources.map((resource, idx) => {
      return (
        <Grid item key={idx}>
          <ResourceCard
            resources={resource}
            attrs={attrs_names()}
            onDelete={handleDelete}
          />
        </Grid>
      );
    });
  };
  let resComp = buildResourcesComp(resources);
  return (
    <>
      <Navbar />
      <Grid container justify="center">
        <Grid item md={10} xs={10} lg={11}>
          <>
            <Typography>Resources of NavRec</Typography>
            <Grid container spacing={3}>
              {resComp}
            </Grid>
          </>
        </Grid>
      </Grid>
      {/* code below really just for success/failure messages */}
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
