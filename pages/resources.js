import { Grid, Box } from "@material-ui/core";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/auth";
import useSWR from "swr";
import fetch from "../utils/fetch";
import { useState, createContext, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ResourcesComp from "../components/ResourcesComp";
import Filters from "../components/Filters";
import { useResources } from "./../components/ResourcesContext";
import { fetchAllRes } from "../utils/graphql/graphqlHelper";

/**
 * Displays page with resources and filters
 */

/**
 * GraphQL query to fetch all filters with available options
 * TODO: probably will have to rewrite schema to make it more efficient
 */
const GET_ALL_FILTERS = {
  query: `query GET_ALL_FILTERS {
    filters_new {
      filter_human_name
      filter_name
      filter_type
      important
      filter_options {
        option_value
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
  const resContext = useResources();
  const [filtersState, setFiltersState] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [filteredRes, setFilteredRes] = useState([]);

  const buildFiltersObject = (filters_raw, resources) => {
    return filters_raw.map((filter, idx) => {
      const filter_options = new Set();
      resources.forEach((resource) => {
        filter_options.add(resource[filter.filter_name]);
      });
      return { ...filter, filter_options };
    });
  };
  /**
   * Method that fetches all filter values from the DB
   * also sets attributes based of the filters
   * @param  {...any} args not sure what this is here for, just keep it for now
   * @returns {Object} response object from GraphQL endpoint
   */
  const getData = async (...args) => {
    const token = auth.authState.tokenResult.token;
    const { filters_new: fs } = await fetch(GET_ALL_FILTERS, token);
    // setFiltersState(fs);
    let attrs = fs.map((filter) => {
      const {
        filter_name: attribute_name,
        filter_human_name: filter_name,
      } = filter;
      const obj = {
        attribute_name: attribute_name,
        filter_name: filter_name,
      };
      obj[attribute_name] = filter_name;
      return obj;
    });
    setAttributes(attrs);
    let res = await fetchAllRes(attrs, token);
    resContext.dispatch({
      type: "set_filters",
      value: buildFiltersObject(fs, res),
    });
    resContext.dispatch({
      type: "set",
      value: res,
    });
    console.log(fs);
    return fs;
  };
  const { data, error, isValidating } = useSWR(GET_ALL_FILTERS, getData, {
    revalidateOnFocus: false,
  });

  if (!auth.user) {
    return "access deined";
  }
  if (isValidating) {
    return "loading...";
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
          <Filters data={data} setFiltersState={handleSetFilters} />
        </Grid>
        <Grid item>
          <ResourcesComp
            attrs_data={data}
            attrs={attributes}
            filters={filtersState}
            filteredRes={filteredRes}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
