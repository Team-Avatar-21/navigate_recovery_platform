import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { useForm, FormProvider } from "react-hook-form";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  CircularProgress,
  Snackbar,
  Button,
  withStyles,
  Paper,
  Fab,
  Grid,
  Container,
  InputLabel,
  Input,
} from "@material-ui/core";
import StyledPaper from "../../components/StyledPaper";
import FormInput from "../../components/FormInput";

const styles = (theme) => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 500,
    minWidth: 200,
    flexGrow: 1,
  },
  form: {
    display: "flex",
    flexFlow: "column",
  },
  grid_element: {},
  labelRoot: {
    "&$focused $notchedOutline": {
      color: theme?.palette?.secondary?.light || "#ffff",
      borderColor: theme?.palette?.secondary?.light || "#ffff",
    },
  },
  focused: {},
  notchedOutline: {},
  button: {
    maxWidth: "100px",
  },
});

function SignIn({ classes }) {
  const router = useRouter();
  const auth = useAuth();
  const [errorSnack, setErrorSnack] = useState({ open: false, message: "" });
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const handleOpenError = (err) => {
    setErrorSnack({ open: true, message: err.message });
  };
  const handleCloseError = () => {
    setErrorSnack({ oepn: false, message: "" });
  };
  const methods = useForm();
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    const { email, password } = data;
    setAwaitingResponse(true);
    auth
      .signin(email, password)
      .then((user) => {
        setAwaitingResponse(false);
        router.push("/");
      })
      .catch((err) => {
        setAwaitingResponse(false);
        handleOpenError(err);
      });
  };
  return (
    <>
      <Navbar />
      <Grid container justify="center">
        <Grid container item xl={4} xs={10} sm={10} md={8} justify="center">
          <StyledPaper
            color="secondary"
            className={classes.root}
            variant="outlined"
          >
            <Typography variant="h3" align="center" gutterBottom>
              Sign In{" "}
              {awaitingResponse ? (
                <CircularProgress color="primary" size="0.8em" />
              ) : (
                "    "
              )}
            </Typography>
            <FormProvider {...methods}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <FormControl color="secondary" margin="normal">
                  <FormInput
                    type="email"
                    name="email"
                    label="email"
                    id="email"
                    required
                    autoComplete="off"
                  />
                </FormControl>

                <FormControl margin="normal">
                  <FormInput
                    // InputLabelProps={{
                    //   htmlFor: "password",
                    //   id: "password",
                    //   classes: {
                    //     root: classes.labelRoot,
                    //     focused: classes.focused,
                    //   },
                    // }}
                    // InputProps={{
                    //   classes: {
                    //     root: classes.labelRoot,
                    //     focused: classes.focused,
                    //     notchedOutline: classes.notchedOutline,
                    //   },
                    // }}
                    type="password"
                    name="password"
                    label="password"
                    required
                    id="password"
                  />
                </FormControl>
                <FormControl>
                  <Grid container justify="center">
                    <Button
                      className={classes.button}
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      Sign In{" "}
                    </Button>
                  </Grid>
                </FormControl>
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
    </>
  );
}

export default withStyles(styles)(SignIn);
