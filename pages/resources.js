import {
  Typography,
  Select,
  Container,
  Grid,
  Button,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/auth";
import useSWR from "swr";
import fetch from "../utils/fetch";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const GET_ALL_FILTERS = {
  query: `query AllFilters {
    Filters_Names {
      filter_name
      filters {
        filter_option
        filter_type
      }
    }
  }`,
};
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Resources() {
  const classes = useStyles();
  const auth = useAuth();
  const [city, setCity] = useState({});
  const getData = async (...args) =>
    await fetch(GET_ALL_FILTERS, auth.authState.tokenResult.token);
  const { data, error } = useSWR(GET_ALL_FILTERS, getData);
  if (!auth.user) {
    return "access deined";
  }

  const filters = data
    ? data?.Filters_Names?.map((filter, idx) => {
        const { filter_name } = filter;
        const options = filter.filters || [];
        const { filter_type } = options.length > 0 ? options[0] : "";
        return (
          <FormControl className={classes.formControl} key={idx}>
            <InputLabel>{filter_name}</InputLabel>
            {filter_type == "SELECT" ? (
              <Select value={city}>
                {options.map((option, idx) => {
                  const value = option.filter_option;
                  return (
                    <MenuItem key={idx} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </Select>
            ) : (
              <Select value="none">
                <MenuItem value={"none"}>None</MenuItem>
              </Select>
            )}
          </FormControl>
        );
      })
    : "";
  return (
    <>
      <Navbar />
      <form style={{ display: "flex" }}>{filters}</form>
      <Typography>Resources of NavRec</Typography>
    </>
  );
}
