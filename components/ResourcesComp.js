import { Typography, Button, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import { useEffect, useState, useContext } from "react";
import ResourceCard from "../components/ResourceCard";
import EditIcon from "@material-ui/icons/Edit";
import EditResourceModal from "../components/EditResourceModal";
import { useResources } from "../components/ResourcesContext";
/**
 * Component that displays available resources
 * TODO: refactor component to resue in remove_resource, edit resources, and resources pages.
 */

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
    query: `query GET_ALL_RESROUCES {
      resources_new {
        ${attrs}
        id
      }
    }`,
  };

  return query;
};

/**
 * Composes a query to fetch resources based on filters
 * @param {Array} attributes
 * @param {Object} filters
 * @returns
 */
const GET_FILTERED_RESOURCES = (attributes, filters) => {
  if (Object.keys(filters).length == 0) return filters;
  let attrs = parseAttrsForGraphQL(attributes);
  let where = "";
  Object.keys(filters).forEach((filter) => {
    if (filters[filter]) where += `${filter}: {_eq: "${filters[filter]}"},`;
  });
  const query = {
    query: `query GET_FILTERED_RESOURCES{
      resources_new(where:{${where}}){
        ${attrs}
        id
      }
    }`,
  };
  return query;
};

export default function ResourcesComp({
  attrs,
  filters,
  filteredRes,
  attrs_data,
}) {
  const auth = useAuth();
  const admin = auth.authState.tokenResult.claims.admin;
  const res = useResources();
  const [resources, setResources] = useState(filteredRes);
  const [isFetched, setIsFetched] = useState(false);
  const [editingResource, setEditingResource] = useState("");
  const [open, setOpen] = useState(false);

  // gets all resources in the db
  const handleFetchRes = async () => {
    const attributes = attrs.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_RESOURCES(attributes),
      auth.authState.tokenResult.token
    );
    // console.log(d);
    setResources(d.resources_new);
    res.dispatch({ type: "set", value: d.resources_new });
    setIsFetched(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  // console.log(attrs);
  /**
   * Helps to fetch resources from the db when filters state gets updated.
   */
  useEffect(() => {
    if (Object.keys(filters).length > 0) handleFetchFilteredRes();
  }, [filters]);
  //creates an object of attribute_db_name:human_acceptable_name
  // i.e. inPerson : "in Person"
  const attrs_names = () => {
    const names_obj = {};
    attrs_data.forEach((obj) => {
      const value = obj.filter_human_name;
      const key = obj.filter_name;
      names_obj[key] = {};
      names_obj[key]["value"] = key;
      names_obj[key]["name"] = value;
      names_obj[key]["type"] = obj.filter_type;
    });
    return names_obj;
  };
  const onEdit = (resource) => {
    setEditingResource(resource);
    setOpen(true);
  };

  const buildResourcesComp = (resources) => {
    console.log(resources);
    return resources.map((resource, idx) => {
      return (
        <Grid item key={idx}>
          <ResourceCard
            resource={resource}
            onEdit={admin ? onEdit : undefined}
            attrs={attrs_names()}
          />
        </Grid>
      );
    });
  };

  //creates an array of resource cards

  let resComp = buildResourcesComp(res.state.resources);

  if (!resources.length && isFetched) {
    resComp = <Grid item>No Resources</Grid>;
  }

  /**
   * helper method to handle fetching of resources based on
   * current filter state
   */
  const handleFetchFilteredRes = async () => {
    const attributes = attrs.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_FILTERED_RESOURCES(attributes, filters),
      auth.authState.tokenResult.token
    )
      .then((de) => {
        // console.log(de);
        setResources(de.resources_new);
      })
      .catch((err) => {
        console.log(err);
        setResources([]);
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleFetchRes}>
        Get All Resources
      </Button>
      <Grid container spacing={3}>
        {resComp}
      </Grid>
      <EditResourceModal
        resource={editingResource}
        attrs={attrs_names()}
        open={open}
        handleClose={handleCloseDialog}
      />
    </>
    /*<>
      <Grid container spacint={2}></Grid>
      <Button variant="contained" color="primary" onClick={handleFetchRes}>
        Get All Resources
      </Button>
      <Grid container spacing={3}>
        {resComp}
      </Grid>
    </>*/
  );
}
