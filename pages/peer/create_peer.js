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

/**
 * This Page shows logic and tools to add peer to the DB.
 * TODO: add new field to already exisitng ones.
 */

const GET_ALL_PEERS = {
  query: `query GET_ALL_PEERS {
    peer {
      emergency_name
      emergency_number
      first_name
      last_name
      nick_name
      notes
      peer_email
      peer_id
      peer_number
      resource_id
    }
    peer_visit {
      peer_id
      visit_ts
    }
  }`,
};

/**
 * Helper method that composes peers in a shape needed for GraphQL query
 * TODO: take this function out to a separate module
 * @param {Array} peer that need to be returned
 * @returns {String}
 */
const parseAttrsForGraphQL = (peer) => {
  let peerAttr = "";
  peer.forEach((element) => {
    peerAttr += element + "\n";
  });
  return peerAttr;
};

/**
 * Composes a mutation string for GraphQL request
 * @param {Object} peer <peer_name>:<value> for a new peer
 * @returns {String}
 */
const ADD_PEER = (peer) => {
  //   let peerAttr = parseAttrsForGraphQL(peer);
  let object = "";
  Object.keys(peer).forEach((field) => {
    object += `${field}: "${peer[field]}", `;
  });
  const mutation = {
    query: `mutation ADD_PEER {
        insert_peer_one(object: {${object}}){
          first_name
        }
      }
    `,
  };
  return mutation;
};

export default function AddPeer() {
  const auth = useAuth();

  const admin = auth?.authState?.tokenResult?.claims?.admin;
  const [successMessage, setSuccessMessage] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [successSnack, setSuccessSnack] = useState({
    open: false,
    message: "",
  });
  const [peer, setPeer] = useState([]);
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
   * handles create peer logic
   * @param {Object} data from the registred fields of the form
   */
  const onSubmit = async (data) => {
    setAwaitingResponse(true);
    fetch(ADD_PEER(data), auth.authState.tokenResult.token)
      .then((res) => {
        showSuccessMessage({ message: "Peer was successfully created" });
        setAwaitingResponse(false);
        reset();
      })
      .catch((err) => {
        // handleOpenError(err[0]);
        console.error(err);
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
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column">
                <FormControl margin="normal">
                    <FormInput
                        required
                        autoComplete="off"
                        type="text"
                        id="first_name"
                    />
                </FormControl>
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
            </FormProvider>
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
