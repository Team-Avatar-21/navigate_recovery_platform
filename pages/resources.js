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

/**
 * Displays page with resources and filters
 */

/**
 * GraphQL query to fetch all filters with available options
 * TODO: probably will have to rewrite schema to make it more efficient
 */
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

/**
 * Method that composes a GraphQL query  targeted to get resources based
 * on filter values
 * @param {Array} attributes array of attributes (names of attributes in the db) that need to be fetched.
 * @param {Object} filters object with attribute_name:value to filter the attribute
 * @returns {String} which represents GraphQL query to fetch resources based on filters provided.
 */
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

/**
 * Helper method that composes attributes in a shape needed for GraphQL query
 * @param {Array} attributes that need to be returned
 * @returns {String}
 */
const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
};

/**
 * Styling classes for Material UI components
 */
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

  /**
   * Method that fetches all filter values from the DB
   * also sets attributes based of the filters
   * @param  {...any} args not sure what this is here for, just keep it for now
   * @returns {Object} response object from GraphQL endpoint
   */
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