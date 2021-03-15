// import * as React from "react";
import { ProvideAuth } from "../utils/auth";
function App({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <Component {...pageProps} />
    </ProvideAuth>
  );
}
export default App;
