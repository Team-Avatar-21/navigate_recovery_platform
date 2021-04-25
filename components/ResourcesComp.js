import { Button, Grid } from "@material-ui/core";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import { useEffect, useState } from "react";
import ResourceCard from "../components/ResourceCard";
import EditResourceModal from "../components/EditResourceModal";
import { useResources } from "../components/ResourcesContext";
import ViewResourceModal from "../components/ViewResourceModal";
import Link from "next/link";

/**
 * Component that displays available resources
 * TODO: refactor component to resue in remove_resource, edit resources, and resources pages.
 */

const buildFiltersObject = (filters_raw, resources) => {
  return filters_raw.map((filter, idx) => {
    const filter_options = new Set();
    resources.forEach((resource) => {
      filter_options.add(resource[filter.filter_name]);
    });
    return { ...filter, filter_options };
  });
};

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
        notes
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
    if (typeof filters[filter] === "object") {
      if (filters[filter]?.value) {
        where += `${filter}: {_eq: "${filters[filter].value}"},`;
      }
    } else if (filters[filter]) {
      where += `${filter}: {_eq: "${filters[filter]}"},`;
    }
  });
  const query = {
    query: `query GET_FILTERED_RESOURCES{
      resources_new(where:{${where}}){
        ${attrs}
        id
        notes
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
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewingResource, setViewingResource] = useState("");

  // gets all resources in the db
  const handleFetchRes = async () => {
    const attributes = attrs.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_RESOURCES(attributes),
      auth.authState.tokenResult.token
    );
    setResources(d.resources_new);
    res.dispatch({ type: "set", value: d.resources_new });
    setIsFetched(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };
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
    res.state.filters.forEach((obj) => {
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
  const onView = (resource) => {
    setViewingResource(resource);
    setOpenViewModal(true);
  };

  const buildResourcesComp = (resources) => {
    const new_res = resources.sort((a, b) => {
      a = a.name;
      b = b.name;
      if (a === b) {
        return 0;
      }
      return a > b ? 1 : -1;
    });
    return new_res.map((resource, idx) => {
      return (
        <Grid item key={idx}>
          <ResourceCard
            resource={resource}
            onEdit={admin ? onEdit : undefined}
            attrs={attrs_names()}
            onView={onView}
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
        setResources(de.resources_new);
        res.dispatch({ type: "set", value: de.resources_new });
      })
      .catch((err) => {
        setResources([]);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFetchRes}
        style={{ marginLeft: "0.5rem" }}
      >
        Get All Resources
      </Button>
      <span> Found: {res?.state.resources.length}</span>
      <Link href="/resources/usage">
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchRes}
          style={{ marginLeft: "0.5rem" }}
        >
          View Usage
        </Button>
      </Link>
      <Grid
        container
        spacing={3}
        justify="space-around"
        style={{ marginTop: "1rem" }}
      >
        {resComp}
      </Grid>
      <EditResourceModal
        resource={editingResource}
        attrs={attrs_names()}
        open={open}
        handleClose={handleCloseDialog}
      />
      <ViewResourceModal
        resource={viewingResource}
        open={openViewModal}
        handleClose={handleCloseViewModal}
        attrs={attrs_names()}
      />
    </>
  );
}
