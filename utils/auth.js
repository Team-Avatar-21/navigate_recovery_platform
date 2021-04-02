import React, { useState, useEffect, useContext, createContext } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
import firebase from "firebase/app";

import "firebase/auth";
import axios from "axios";

// Add your Firebase credentials

if (firebase.apps.length == 0) {
  firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: "navigate-recovery-platfom.firebaseapp.com",
    projectId: "navigate-recovery-platfom",
    appId: "1:87822469294:web:0ac70e9469edbaa4c3453f",
  });
}

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...

// ... available to any child component that calls useAuth().

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  if (auth.authState.status === "loading") {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...

// ... and re-render when it changes.

export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state

function useProvideAuth() {
  const [user, setUser] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...

  // ... to save the user to state.

  const signin = (email, password) => {
    return firebase

      .auth()

      .signInWithEmailAndPassword(email, password)

      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password, displayName) => {
    return axios
      .post("/api/signup", {
        email,
        password,
        displayName,
      })
      .then(() => {
        signin(email, password);
      });
  };

  const signout = () => {
    return firebase

      .auth()

      .signOut()

      .then(() => {
        setUser(false);
        setAuthState("out");
      });
  };

  const sendPasswordResetEmail = (email) => {
    return firebase

      .auth()

      .sendPasswordResetEmail(email)

      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return firebase

      .auth()

      .confirmPasswordReset(code, password)

      .then(() => {
        return true;
      });
  };

  // Subscribe to user on mount

  // Because this sets state in the callback it will cause any ...

  // ... component that utilizes this hook to re-render with the ...

  // ... latest auth object.
  const [authState, setAuthState] = useState({ status: "loading" });
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult(true);
        // const idTokenResult = await user.getIdTokenResult(true);
        // const hasuraClaim =
        //   idTokenResult.claims["https://hasura.io/jwt/claims"];
        if (true) {
          setAuthState({ status: "in", user, tokenResult, user_id: user.uid });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
    // Cleanup subscription on unmount

    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods

  return {
    user,

    authState,

    signin,

    signup,

    signout,

    sendPasswordResetEmail,

    confirmPasswordReset,
  };
}
