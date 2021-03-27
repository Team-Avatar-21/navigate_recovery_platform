import { Typography } from "@material-ui/core";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/auth";
import useSWR from "swr";
import fetch from "../utils/fetch";

const GET_ALL_FILTERS = {
  query: `query AllFilters {
    Filters_Names {
      filter_name
      Filters {
        filter_option
        filter_type
      }
    }
  }`,
};

export default function Resources() {
  const auth = useAuth();
  const getData = async (...args) =>
    await fetch(GET_ALL_FILTERS, auth.authState.tokenResult.token);
  const { data, error } = useSWR(GET_ALL_FILTERS, getData);
  if (!auth.user) {
    return "access deined";
  }
  console.log(data);
  return (
    <>
      <Navbar />
      {JSON.stringify(data)}
      <Typography>Resources of NavRec</Typography>
    </>
  );
}
