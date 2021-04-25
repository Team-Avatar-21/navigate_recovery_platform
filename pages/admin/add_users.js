import { useDebugValue, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
  Checkbox,
} from "@material-ui/core";
import fieldFactory from "../../utils/fieldFactory";

export default function SignIn() {
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  const [successMessage, setSuccessMessage] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [successSnack, setSuccessSnack] = useState({
    open: false,
    message: "",
  });
  const methods = useForm();
  const { register, handleSubmit, reset, control } = methods;
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

  const onSubmit = (data) => {
    const { email, password, admin: isAdmin } = data;
    const displayName = data.name;

    setAwaitingResponse(true);
    let link = "/api/user/add_user";
    if (isAdmin) {
      link = "/api/user/add_superuser";
    }
    axios
      .post(link, {
        email,
        password,
        displayName,
        token: auth.authState.tokenResult.token,
      })
      .then((res) => {
        showSuccessMessage({ message: "User was successfully created" });
        setAwaitingResponse(false);
        reset();
      })
      .catch((err) => {
        handleOpenError(err.response.data);
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
              Add users{" "}
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
                      type="name"
                      name="name"
                      label="name"
                      id="name"
                    />
                  </FormControl>
                  <FormControl margin="normal">
                    <FormInput
                      required
                      autoComplete="off"
                      type="email"
                      name="email"
                      label="email"
                      id="email"
                    />
                  </FormControl>
                  <FormControl margin="normal">
                    <FormInput
                      autoComplete="off"
                      type="password"
                      name="password"
                      label="password"
                      id="password"
                      required
                    />
                  </FormControl>
                  <FormControl margin="normal">
                    {fieldFactory(
                      false,
                      {
                        type: "boolean",
                        value: "admin",
                        name: "is Admin?",
                      },
                      control
                    )}
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
