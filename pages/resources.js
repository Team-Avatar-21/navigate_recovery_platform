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
  Box,
} from "@material-ui/core";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/auth";
import useSWR from "swr";
import fetch from "../utils/fetch";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ResourcesComp from "../components/ResourcesComp";

const GET_ALL_FILTERS = {
  query: `query AllFilters {
    Filters_Names {
      attribute_name
      filter_name
      filters {
        filter_option
        filter_type
      }
    }
  }`,
};

const GET_RESOURCES = {
  query: `query AllFilters {
    Resources {
      City
      organizationName
    }
  }`,
};
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  layout: {
    margin: "10px",
  },
}));

export default function Resources() {
  const classes = useStyles();
  const auth = useAuth();
  const [city, setCity] = useState("");
  const [filtersState, setFiltersState] = useState({});
  const [attributes, setAttributes] = useState([]);
  // const [getRes, setGetRes] = useState(false);

  const getData = async (...args) => {
    const { Filters_Names: fs } = await fetch(
      GET_ALL_FILTERS,
      auth.authState.tokenResult.token
    );
    setFiltersState(fs);

    setAttributes(fs.map((filter) => filter.attribute_name));
    return fs;
  };
  const { data, error } = useSWR(GET_ALL_FILTERS, getData);

  if (!auth.user) {
    return "access deined";
  }
  const filters = data
    ? data?.map((filter, idx) => {
        const { filter_name, attribute_name } = filter;
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
                    <MenuItem name={attribute_name} key={idx} value={value}>
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
    : [];
  return (
    <Box className={classes.layout}>
      <Navbar />
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item>
          <Typography>Filters:</Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            as="form"
            spacing={2}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {filters.map((filter, idx) => (
              <Grid key={idx} item>
                {filter}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <ResourcesComp attrs={attributes} />
        </Grid>
      </Grid>
    </Box>
  );
}
