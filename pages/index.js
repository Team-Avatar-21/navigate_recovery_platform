import Link from "next/link";
import Navbar from "../components/Navbar";
import { Typography, CssBaseLine } from "@material-ui/core";


  

export default function Index() {
  return (
    <>
      <Navbar />
      <div>
        <img src="/NavRecPic.jpg" style={{ width:1500, height:500}}/>
      </div>
    </>
  );
}
