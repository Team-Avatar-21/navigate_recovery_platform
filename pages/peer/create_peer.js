import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
  const coach = auth?.authState?.tokenResult?.claims?.coach || auth?.authState?.tokenResult?.claims?.admin;
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

  if (!coach) {
    return <>Access Denied</>;
  }

  return (
    <>
      <Navbar />
      <Grid container justify="center">
        <Grid item md={6} xs={10}>
          <StyledPaper>
            <Typography align="center" variant="h2">
              Create Peer Profile{" "}
              {awaitingResponse ? (
                <CircularProgress color="primary" size="0.8em" />
              ) : (
                "    "
              )}
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column">
                  <FormControl margin="dense">
                    <FormInput
                      required
                      autoComplete="off"
                      type="text"
                      id="first_name"
                      name="first_name"
                      label="First Name"
                    />
                  </FormControl>

                  <FormControl margin="dense">
                    <FormInput
                      required
                      autoComplete="off"
                      type="text"
                      id="last_name"
                      name="last_name"
                      label="Last Name"
                    />
                  </FormControl>

                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="nick_name"
                      name="nick_name"
                      label="Nick Name"
                    />
                  </FormControl>
                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="peer_number"
                      name="peer_number"
                      label="Phone"
                    />
                  </FormControl>

                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="peer_email"
                      name="peer_email"
                      label="Email"
                    />
                  </FormControl>
                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="emergency_name"
                      name="emergency_name"
                      label="Emergency Contact"
                    />
                  </FormControl>
                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="emergency_number"
                      name="emergency_number"
                      label="Emergency Phone"
                    />
                  </FormControl>
                  <FormControl margin="dense">
                    <FormInput
                      autoComplete="off"
                      type="text"
                      id="notes"
                      name="notes"
                      label="Notes"
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
