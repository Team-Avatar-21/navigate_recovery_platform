import { Typography, Button, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import ResourceCard from "../components/ResourceCard";

const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
};

const GET_RESOURCES = (attributes) => {
  let attrs = parseAttrsForGraphQL(attributes);
  const query = {
    query: `query AllFilters {
      Resources {
        ${attrs}
      }
    }`,
  };

  return query;
};

const GET_FILTERED_RESOURCES = (attributes, filters) => {
  if (Object.keys(filters).length == 0) return filters;
  let attrs = parseAttrsForGraphQL(attributes);
  let where = "";
  Object.keys(filters).forEach((filter) => {
    if (filters[filter]) where += `${filter}: {_eq: "${filters[filter]}"},`;
  });
  const query = {
    query: `query GET_FILTERED_RESOURCES{
      Resources(where:{${where}}){
        ${attrs}
      }
    }`,
  };
  return query;
};

export default function ResourcesComp({
  attrs: attributes_obj_arr,
  filters,
  filteredRes,
}) {
  const auth = useAuth();
  const [resources, setResources] = useState(filteredRes);
  const [isFetched, setIsFetched] = useState(false);

  // gets all resources in the db
  const handleFetchRes = async () => {
    const attributes = attributes_obj_arr.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_RESOURCES(attributes),
      auth.authState.tokenResult.token
    );
    setResources(d.Resources);
    setIsFetched(true);
  };
  useEffect(() => {
    if (Object.keys(filters).length > 0) handleFetchFilteredRes();
  }, [filters]);
  //creates an object of attribute_db_name:human_acceptable_name
  // i.e. inPerson : "in Person"
  const attrs_names = () => {
    const names_obj = {};
    attributes_obj_arr.forEach((obj) => {
      const key = obj.attribute_name;
      const value = obj.filter_name;
      names_obj[key] = value;
    });
    return names_obj;
  };

  const buildResourcesComp = (resources) => {
    console.log("inside build resources");
    console.log(resources);
    return resources.map((resource, idx) => {
      console.log("inside build resources");
      console.log(resource);
      return (
        <Grid item key={idx}>
          <ResourceCard resources={resource} attrs={attrs_names()} />
        </Grid>
      );
    });
  };

  //creates an array of resource cards

  let resComp = buildResourcesComp(resources);
  console.log(resComp);
  if (!resources.length && isFetched) {
    resComp = <Grid item>No Resources</Grid>;
  }

  const handleFetchFilteredRes = async () => {
    const attributes = attributes_obj_arr.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_FILTERED_RESOURCES(attributes, filters),
      auth.authState.tokenResult.token
    )
      .then((de) => {
        console.log(de);
        setResources(de.Resources);
      })
      .catch((err) => {
        console.log(err);
        setResources([]);
      });
    // setResources(d.Resources);
  };

  return (
    <>
      <Typography>Resources of NavRec</Typography>
      <Grid container spacint={2}></Grid>
      <Button variant="contained" color="primary" onClick={handleFetchRes}>
        Get All Resources
      </Button>
      <Grid container spacing={3}>
        {resComp}
      </Grid>
    </>
  );
}