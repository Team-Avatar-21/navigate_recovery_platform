// import * as React from "react";
import { ProvideAuth } from "../utils/auth";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { ResourcesProvider } from "../components/ResourcesContext";

//navigate recovery colors: Yellow #f1e70d || rgb(241,231,13)
// BlueMain #00b7be || rgb(0,183,190)
//  BlueSub #5cb8b2 || rgba(92,184,178,255)
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00b7be",
    },
    secondary: {
      main: "#f1e70d",
    },
    danger: {
      main: "#ff1744",
      light: "#ff4569",
    },
  },
});
function App({ Component, pageProps }) {
  return (
    <MuiThemeProvider theme={theme}>
      <ProvideAuth>
        <ResourcesProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </ResourcesProvider>
      </ProvideAuth>
    </MuiThemeProvider>
  );
}
export default App;
