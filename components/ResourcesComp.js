import { Typography, Button, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import fetch from "../utils/fetch";
import { useAuth } from "../utils/auth";
import { useState } from "react";
import ResourceCard from "../components/ResourceCard";

const GET_RESOURCES = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  const query = {
    query: `query AllFilters {
      Resources {
        ${attrs}
      }
    }`,
  };

  return query;
};

export default function ResourcesComp({ attrs: attributes_obj_arr }) {
  const auth = useAuth();
  const [resources, setResource] = useState([]);

  const handleFetchRes = async () => {
    const attributes = attributes_obj_arr.map((obj) => obj.attribute_name);
    const d = await fetch(
      GET_RESOURCES(attributes),
      auth.authState.tokenResult.token
    );
    setResource(d.Resources);
    console.log(d.Resources);
  };
  const attrs_names = () => {
    const names_obj = {};
    attributes_obj_arr.forEach((obj) => {
      const key = obj.attribute_name;
      const value = obj.filter_name;
      names_obj[key] = value;
    });
    return names_obj;
  };
  const resComp = resources.map((resource, idx) => {
    return (
      <Grid item key={idx}>
        <ResourceCard resources={resource} attrs={attrs_names()} />
      </Grid>
    );
  });
  return (
    <>
      <Typography>Resources of NavRec</Typography>
      <Button variant="contained" color="primary" onClick={handleFetchRes}>
        Get Resources
      </Button>
      <Grid container spacing={3}>
        {resComp}
      </Grid>
    </>
  );
}
