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
import Filters from "../components/Filters";
import { createContext, useContext } from "react";

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
const GET_FILTERED_RESOURCES = (attributes, filters) => {
  if (!filters) return filters;
  let attrs = parseAttrsForGraphQL(attributes);
  let where = "";
  Object.keys(filters).forEach((filter) => {
    if (filters[filter]) where += `{${filter}: {_eq: "${filters[filter]}"},}`;
  });
  const query = {
    query: `query GET_FILTERED_RESOURCES{
      Resources(where:${where}){
        ${attrs}
      }
    }`,
  };
  return query;
};

const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
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
  const [filtersState, setFiltersState] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [filteredRes, setFilteredRes] = useState([]);

  const getData = async (...args) => {
    const { Filters_Names: fs } = await fetch(
      GET_ALL_FILTERS,
      auth.authState.tokenResult.token
    );
    // setFiltersState(fs);

    setAttributes(
      fs.map((filter) => {
        const { attribute_name, filter_name } = filter;
        const obj = {
          attribute_name: attribute_name,
          filter_name: filter_name,
        };
        obj[attribute_name] = filter_name;
        return obj;
      })
    );
    return fs;
  };
  const { data, error } = useSWR(GET_ALL_FILTERS, getData);

  if (!auth.user) {
    return "access deined";
  }
  const handleSetFilters = (data) => {
    setFiltersState(data);
    // const attrs = attributes.map((obj) => obj.attribute_name);
    // const d = await fetch(
    //   GET_FILTERED_RESOURCES(attrs, filtersState),
    //   auth.authState.tokenResult.token
    // );
    // console.log(d);
    // setFilteredRes(d.Resources);
  };
  // const handleFetchFilteredRes = async () => {
  //   const attributes = attributes_obj_arr.map((obj) => obj.attribute_name);
  //   const d = await fetch(
  //     GET_FILTERED_RESOURCES(attributes, filters),
  //     auth.authState.tokenResult.token
  //   );
  //   console.log(d);
  //   setResources(d.Resources);
  // };
  return (
    <Box className={classes.layout}>
      <Navbar />
      <Grid container justify="center" direction="column" spacing={4}>
        <Grid item>
          <Typography>Filters:</Typography>
        </Grid>
        <Grid item>
          <Filters data={data} setFiltersState={handleSetFilters} />
        </Grid>
        <Grid item>
          <ResourcesComp
            attrs={attributes}
            filters={filtersState}
            filteredRes={filteredRes}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
