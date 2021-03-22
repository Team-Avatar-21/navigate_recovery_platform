import Link from "next/link";
import Navbar from "../components/Navbar";
import { Typography, CssBaseLine } from "@material-ui/core";

export default function Index() {
  return (
    <>
      <Navbar />
      <Typography variant="h3" align="center" gutterBottom>
        Navigate Recovery Home
      </Typography>
    </>
  );
}
